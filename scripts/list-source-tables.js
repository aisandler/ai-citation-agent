#!/usr/bin/env node

/**
 * List All Tables in Source Base using Metadata API
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

function makeRequest(method, path) {
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
    req.end();
  });
}

async function listTables() {
  console.log('🔍 Listing Tables in Source Base\n');
  console.log(`Base ID: ${SOURCE_BASE_ID}\n`);

  try {
    const response = await makeRequest(
      'GET',
      `/v0/meta/bases/${SOURCE_BASE_ID}/tables`
    );

    if (response.tables && response.tables.length > 0) {
      console.log(`✅ Found ${response.tables.length} table(s):\n`);

      response.tables.forEach((table, index) => {
        console.log(`${index + 1}. ${table.name} (ID: ${table.id})`);
        console.log(`   Primary Field: ${table.primaryFieldId}`);
        console.log(`   Fields: ${table.fields.length}`);
        console.log(`   Views: ${table.views.length}\n`);

        console.log('   Field Details:');
        table.fields.forEach(field => {
          console.log(`   - ${field.name} (${field.type})`);
        });
        console.log('\n' + '═'.repeat(60) + '\n');
      });

      // Return tables for further processing
      return response.tables;

    } else {
      console.log('⚠️  No tables found in base');
      console.log('This base might be empty or newly created.');
      return [];
    }

  } catch (error) {
    console.error('❌ Error listing tables:', error.message);
    process.exit(1);
  }
}

listTables();
