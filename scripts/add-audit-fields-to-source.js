#!/usr/bin/env node

/**
 * Add Audit Tracking Fields to Source Base
 * Adds detailed audit score fields to "4_Marketing Presence" table
 */

import https from 'https';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
const envPath = path.join(__dirname, '..', '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
const envVars = {};

envContent.split('\n').forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) {
    envVars[match[1]] = match[2];
  }
});

const AIRTABLE_API_KEY = envVars.AIRTABLE_API_KEY;
const SOURCE_BASE_ID = 'appB9ECe1uBMCRcmr';
const MARKETING_TABLE_ID = 'tbl54tXqSbVbHfffp'; // "4_Marketing Presence"

function makeRequest(method, path, data = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.airtable.com',
      port: 443,
      path: path,
      method: method,
      headers: {
        'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
        'Content-Type': 'application/json'
      }
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(JSON.parse(body));
        } else {
          reject(new Error(`API Error ${res.statusCode}: ${body}`));
        }
      });
    });

    req.on('error', reject);

    if (data) {
      req.write(JSON.stringify(data));
    }

    req.end();
  });
}

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

async function addField(fieldConfig) {
  console.log(`   Adding field: ${fieldConfig.name}...`);

  try {
    await makeRequest(
      'POST',
      `/v0/meta/bases/${SOURCE_BASE_ID}/tables/${MARKETING_TABLE_ID}/fields`,
      fieldConfig
    );

    console.log(`   ✓ ${fieldConfig.name} added`);
    return true;
  } catch (error) {
    if (error.message.includes('DUPLICATE_FIELD_NAME')) {
      console.log(`   ⚠️  Field already exists: ${fieldConfig.name}`);
      return true;
    } else {
      console.error(`   ✗ Failed to add ${fieldConfig.name}:`, error.message);
      return false;
    }
  }
}

async function addAuditFields() {
  console.log('🔧 Adding Audit Tracking Fields to "4_Marketing Presence"\n');
  console.log(`Base: ${SOURCE_BASE_ID}`);
  console.log(`Table: ${MARKETING_TABLE_ID}\n`);

  const fieldsToAdd = [
    {
      name: 'Overall AI Score',
      type: 'number',
      description: 'Composite AI visibility score from audit (0-10)',
      options: { precision: 1 }
    },
    {
      name: 'Trust Node Coverage',
      type: 'number',
      description: 'Number of trust nodes present (out of 29)',
      options: { precision: 0 }
    },
    {
      name: 'Citation Quality Score',
      type: 'number',
      description: 'Average citation quality score (0-10)',
      options: { precision: 1 }
    },
    {
      name: 'Last Audited',
      type: 'date',
      description: 'Date of most recent audit',
      options: { dateFormat: { name: 'us', format: 'M/D/YYYY' } }
    },
    {
      name: 'Next Audit Due',
      type: 'date',
      description: 'Recommended date for next audit (+60 days)',
      options: { dateFormat: { name: 'us', format: 'M/D/YYYY' } }
    },
    {
      name: 'Perplexity Rank',
      type: 'number',
      description: 'Position on Perplexity (null if not ranked)',
      options: { precision: 0 }
    },
    {
      name: 'ChatGPT Rank',
      type: 'number',
      description: 'Position on ChatGPT (null if not ranked)',
      options: { precision: 0 }
    },
    {
      name: 'Gemini Rank',
      type: 'number',
      description: 'Position on Gemini (null if not ranked)',
      options: { precision: 0 }
    },
    {
      name: 'Audit Record Link',
      type: 'singleLineText',
      description: 'Record ID in detailed audit base for reference'
    },
    {
      name: 'Audit Status',
      type: 'singleSelect',
      description: 'Current audit status',
      options: {
        choices: [
          { name: 'Not Started', color: 'grayBright' },
          { name: 'Pending', color: 'yellowBright' },
          { name: 'Complete', color: 'greenBright' },
          { name: 'Needs Re-audit', color: 'orangeBright' }
        ]
      }
    }
  ];

  console.log(`Adding ${fieldsToAdd.length} new fields...\n`);

  let successCount = 0;
  let skipCount = 0;

  for (const field of fieldsToAdd) {
    const success = await addField(field);
    if (success) {
      if (field.name.includes('already exists')) {
        skipCount++;
      } else {
        successCount++;
      }
    }
    await sleep(500); // Rate limiting
  }

  console.log('\n' + '═'.repeat(60));
  console.log('📊 SUMMARY\n');
  console.log(`✅ Fields added: ${successCount}`);
  console.log(`⚠️  Fields skipped (already exist): ${skipCount}`);
  console.log(`📋 Total fields in table: ${fieldsToAdd.length + 8}`); // 8 original fields

  console.log('\n💡 Next Steps:');
  console.log('1. Edit scripts/sync-audit-results.js');
  console.log('2. Uncomment the field mappings in updateFields object');
  console.log('3. Re-run: node scripts/sync-audit-results.js');
  console.log('4. All audit scores will populate in "4_Marketing Presence"\n');
}

addAuditFields();
