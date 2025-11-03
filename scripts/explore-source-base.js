#!/usr/bin/env node

/**
 * Explore Source Airtable Base
 * Discovers tables and fields in the source base for audit automation
 */

import Airtable from 'airtable';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '..', '.env.local') });

const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
const SOURCE_BASE_ID = 'appB9ECe1uBMCRcmr'; // Source base for audit queue

if (!AIRTABLE_API_KEY) {
  console.error('❌ AIRTABLE_API_KEY not found in .env.local');
  process.exit(1);
}

console.log('🔍 Exploring Source Airtable Base\n');
console.log(`Base ID: ${SOURCE_BASE_ID}\n`);

const airtable = new Airtable({ apiKey: AIRTABLE_API_KEY });
const base = airtable.base(SOURCE_BASE_ID);

async function exploreBase() {
  try {
    // Airtable doesn't provide a direct API to list tables,
    // so we'll try common table names and report what we find

    const commonTableNames = [
      'Companies',
      'Clients',
      'Prospects',
      'Brands',
      'Audit Queue',
      'Table 1',
      'Contacts',
      'Leads'
    ];

    console.log('🔎 Attempting to discover tables...\n');

    for (const tableName of commonTableNames) {
      try {
        console.log(`Trying: "${tableName}"...`);

        const records = await base(tableName)
          .select({ maxRecords: 1 })
          .firstPage();

        if (records.length > 0) {
          console.log(`✅ Found table: "${tableName}"\n`);
          console.log('Sample record fields:');

          const fields = records[0].fields;
          const fieldNames = Object.keys(fields);

          fieldNames.forEach(fieldName => {
            const value = fields[fieldName];
            const valueType = Array.isArray(value) ? 'array' : typeof value;
            console.log(`  - ${fieldName} (${valueType}): ${JSON.stringify(value).substring(0, 50)}...`);
          });

          console.log(`\nTotal fields: ${fieldNames.length}`);
          console.log('═══════════════════════════════════════════════════\n');

          // Get total record count
          const allRecords = await base(tableName).select({ fields: [] }).all();
          console.log(`Total records in "${tableName}": ${allRecords.length}\n`);

        }
      } catch (error) {
        // Table doesn't exist, continue
        console.log(`   (not found)\n`);
      }
    }

    console.log('✅ Exploration complete!\n');
    console.log('Next steps:');
    console.log('1. Identify which table contains your audit queue');
    console.log('2. Map field names to audit inputs (brand_name, category, content_urls)');
    console.log('3. Update integration scripts with correct table/field names');

  } catch (error) {
    console.error('❌ Error exploring base:', error.message);
    process.exit(1);
  }
}

exploreBase();
