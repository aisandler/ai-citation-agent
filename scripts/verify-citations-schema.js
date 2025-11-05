#!/usr/bin/env node

/**
 * Verify Citations Table Schema
 * Checks if all required fields exist in the Citations table
 * Optionally adds missing fields
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
const BASE_ID = envVars.AIRTABLE_BASE_ID;

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

async function verifyCitationsSchema() {
  console.log('🔍 Verifying Citations table schema...\n');

  try {
    // Get base metadata
    const baseMeta = await makeRequest('GET', `/v0/meta/bases/${BASE_ID}/tables`);

    const citationsTable = baseMeta.tables.find(t => t.name === 'Citations');

    if (!citationsTable) {
      console.error('❌ Citations table not found in base');
      process.exit(1);
    }

    console.log(`✓ Found Citations table (ID: ${citationsTable.id})\n`);

    // Expected fields
    const expectedFields = {
      'source_url': 'url',
      'source_domain': 'singleLineText',
      'source_title': 'singleLineText',
      'source_type': 'singleSelect',  // This is the one that might be missing
      'authority_score': 'number',
      'data_structure_score': 'number',
      'brand_alignment_score': 'number',
      'freshness_score': 'number',
      'cross_link_score': 'number',
      'overall_quality': 'number',
      'publication_date': 'date',
      'cited_by_perplexity': 'checkbox',
      'cited_by_chatgpt': 'checkbox',
      'cited_by_gemini': 'checkbox',
      'notes': 'multilineText'
    };

    // Check existing fields
    const existingFieldNames = citationsTable.fields.map(f => f.name);
    const missingFields = [];

    console.log('📋 Field Check:\n');

    for (const [fieldName, fieldType] of Object.entries(expectedFields)) {
      const exists = existingFieldNames.includes(fieldName);
      console.log(`${exists ? '✓' : '✗'} ${fieldName} (${fieldType})`);

      if (!exists) {
        missingFields.push({ name: fieldName, type: fieldType });
      }
    }

    if (missingFields.length === 0) {
      console.log('\n✅ All required fields exist!\n');
      return;
    }

    // Report missing fields
    console.log(`\n⚠️  Missing ${missingFields.length} field(s):\n`);
    missingFields.forEach(field => {
      console.log(`   - ${field.name} (${field.type})`);
    });

    console.log('\n📝 To add missing fields:');
    console.log('\nOption 1: Add manually in Airtable UI');
    console.log('   1. Open Citations table');
    console.log('   2. Click "+" to add field');
    console.log('   3. Configure each missing field\n');

    console.log('Option 2: Recreate schema (deletes all data!)');
    console.log('   node scripts/delete-airtable-tables.js');
    console.log('   node scripts/setup-airtable-schema.js\n');

    // For source_type specifically, provide the configuration
    if (missingFields.some(f => f.name === 'source_type')) {
      console.log('⚙️  source_type field configuration:');
      console.log('   Type: Single select');
      console.log('   Options: Review Platform, Directory, Company Profile,');
      console.log('            News & PR, Seed Site, Brand Website, Other\n');
    }

  } catch (error) {
    console.error('❌ Verification failed:', error.message);
    process.exit(1);
  }
}

verifyCitationsSchema();
