#!/usr/bin/env node
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;
const AUDIT_ID = 'rec32pmt8f5KF1z80';

console.log('🔗 Verifying Linked Records for ClickUp Audit\n');
console.log(`Audit ID: ${AUDIT_ID}\n`);

async function countRecords(tableName) {
  const url = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${tableName}`;
  
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${AIRTABLE_API_KEY}`
    }
  });

  const data = await response.json();
  
  if (data.error) {
    console.error(`❌ ${tableName}: Error - ${data.error.message}`);
    return 0;
  }

  // Filter records linked to this audit
  const linkedRecords = data.records.filter(record => {
    const auditField = record.fields.audit;
    return auditField && auditField.includes(AUDIT_ID);
  });

  console.log(`✓ ${tableName}: ${linkedRecords.length} records linked`);
  
  // Show sample
  if (linkedRecords.length > 0 && linkedRecords.length <= 5) {
    linkedRecords.forEach(record => {
      const name = record.fields.node_name || record.fields.title || record.fields.platform || record.fields.source_domain || 'Record';
      console.log(`  - ${name}`);
    });
  } else if (linkedRecords.length > 5) {
    console.log(`  (${linkedRecords.length} records total - showing first 3)`);
    linkedRecords.slice(0, 3).forEach(record => {
      const name = record.fields.node_name || record.fields.title || record.fields.platform || record.fields.source_domain || 'Record';
      console.log(`  - ${name}`);
    });
  }
  
  return linkedRecords.length;
}

// Check all tables
const trustNodes = await countRecords('Trust_Nodes');
const citations = await countRecords('Citations');
const llmResponses = await countRecords('LLM_Responses');
const priorities = await countRecords('Priorities');

console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('SUMMARY');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log(`✓ 1 audit run`);
console.log(`✓ ${trustNodes} trust nodes`);
console.log(`✓ ${citations} citations`);
console.log(`✓ ${llmResponses} LLM responses`);
console.log(`✓ ${priorities} priorities`);
console.log(`\n✅ Total: ${1 + trustNodes + citations + llmResponses + priorities} records`);
