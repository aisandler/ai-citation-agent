#!/usr/bin/env node

import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';
import Airtable from 'airtable';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;

if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID) {
  console.error('❌ Missing credentials in .env.local');
  process.exit(1);
}

const base = new Airtable({ apiKey: AIRTABLE_API_KEY }).base(AIRTABLE_BASE_ID);

console.log(`📊 Listing all audits in base ${AIRTABLE_BASE_ID}...\n`);

try {
  const audits = await base('Audit_Runs')
    .select({
      maxRecords: 20,
      sort: [{ field: 'audit_date', direction: 'desc' }]
    })
    .all();

  console.log(`Found ${audits.length} audits:\n`);

  audits.forEach((audit, i) => {
    console.log(`${i+1}. ${audit.fields.brand_name || 'Unknown'} (${audit.fields.audit_date || 'No date'})`);
    console.log(`   ID: ${audit.id}`);
    console.log(`   Status: ${audit.fields.status || 'Unknown'}`);
    console.log(`   Score: ${audit.fields.overall_score || 'N/A'}/10\n`);
  });

} catch (error) {
  console.error('❌ Error:', error.message);
  process.exit(1);
}
