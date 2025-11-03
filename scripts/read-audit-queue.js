#!/usr/bin/env node

/**
 * Read Audit Queue from Source Base
 * Fetches competitors from "1_Basic Info" table and prepares them for automated audits
 */

import Airtable from 'airtable';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '..', '.env.local') });

const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
const SOURCE_BASE_ID = 'appB9ECe1uBMCRcmr';
const BASIC_INFO_TABLE = '1_Basic Info';

if (!AIRTABLE_API_KEY) {
  console.error('❌ AIRTABLE_API_KEY not found in .env.local');
  process.exit(1);
}

const airtable = new Airtable({ apiKey: AIRTABLE_API_KEY });
const sourceBase = airtable.base(SOURCE_BASE_ID);

async function readAuditQueue() {
  console.log('📋 Reading Audit Queue from Source Base\n');
  console.log(`Base: ${SOURCE_BASE_ID}`);
  console.log(`Table: ${BASIC_INFO_TABLE}\n`);

  try {
    const records = await sourceBase(BASIC_INFO_TABLE)
      .select({
        // Optional: filter for records that haven't been audited recently
        // filterByFormula: "NOT({Last Audited})",
        sort: [{ field: 'Competitor Name', direction: 'asc' }]
      })
      .all();

    console.log(`✅ Found ${records.length} competitor(s) in queue:\n`);

    const auditQueue = records.map((record, index) => {
      const fields = record.fields;

      // Extract audit inputs
      const brandName = fields['Competitor Name'] || '';
      const websiteUrl = fields['Website URL'] || '';
      const category = fields['Category'] || '';

      // Clean up website URL (extract plain text if rich text)
      let cleanUrl = websiteUrl;
      if (typeof websiteUrl === 'string' && websiteUrl.includes('http')) {
        // Extract URL from markdown or rich text
        const urlMatch = websiteUrl.match(/https?:\/\/[^\s\)]+/);
        cleanUrl = urlMatch ? urlMatch[0] : '';
      }

      const auditInput = {
        recordId: record.id,
        brandName: brandName,
        category: category || 'legal billing services',
        contentUrls: cleanUrl ? [cleanUrl] : [],
        sourceBase: SOURCE_BASE_ID,
        sourceTable: BASIC_INFO_TABLE
      };

      console.log(`${index + 1}. ${brandName}`);
      console.log(`   Category: ${auditInput.category}`);
      console.log(`   URL: ${cleanUrl || '(none)'}`);
      console.log(`   Record ID: ${record.id}\n`);

      return auditInput;
    });

    // Save queue to JSON file for batch processing
    const fs = await import('fs');
    const outputPath = join(__dirname, '..', 'output', 'audit-queue.json');

    fs.writeFileSync(
      outputPath,
      JSON.stringify(auditQueue, null, 2)
    );

    console.log(`\n💾 Audit queue saved to: ${outputPath}`);
    console.log(`\nNext steps:`);
    console.log(`1. Run audits: node scripts/process-audit-queue.js`);
    console.log(`2. Or run single audit: node scripts/run-single-audit.js <recordId>`);

    return auditQueue;

  } catch (error) {
    console.error('❌ Error reading audit queue:', error.message);
    process.exit(1);
  }
}

readAuditQueue();
