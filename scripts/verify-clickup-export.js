#!/usr/bin/env node
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;

console.log('🔍 Verifying ClickUp Export in Airtable...\n');

// Get ClickUp audits
const url = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/Audit_Runs?filterByFormula={brand_name}='ClickUp'`;

const response = await fetch(url, {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${AIRTABLE_API_KEY}`
  }
});

const data = await response.json();

if (data.error) {
  console.error('❌ Error:', data.error);
  process.exit(1);
}

console.log(`✓ Found ${data.records.length} ClickUp audit(s)\n`);

for (const record of data.records) {
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`Audit ID: ${record.id}`);
  console.log(`Brand: ${record.fields.brand_name}`);
  console.log(`Date: ${record.fields.audit_date}`);
  console.log(`Overall Score: ${record.fields.overall_score}/10`);
  console.log(`Status: ${record.fields.status}`);
  console.log(`Trust Node Coverage: ${record.fields.trust_node_coverage}/29 (${record.fields.trust_node_percentage}%)`);
  console.log(`Citation Quality: ${record.fields.citation_quality}/10`);
  console.log(`AI Citation Rate: ${record.fields.ai_citation_rate}%`);
  console.log(`\nLLM Rankings:`);
  console.log(`  - Perplexity: #${record.fields.perplexity_rank} ${record.fields.perplexity_cited ? '✓' : '✗'}`);
  console.log(`  - ChatGPT: #${record.fields.chatgpt_rank} ${record.fields.chatgpt_cited ? '✓' : '✗'}`);
  console.log(`  - Gemini: #${record.fields.gemini_rank} ${record.fields.gemini_cited ? '✓' : '✗'}`);
  console.log(`\nNext Audit: ${record.fields.next_audit_date}`);
}

console.log('\n✓ Verification complete!');
