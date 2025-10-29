#!/usr/bin/env node

/**
 * Test Airtable Connection
 * Validates API key and base access before running schema setup
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

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

console.log('🔍 Testing Airtable Connection\n');

// Validate credentials exist
if (!AIRTABLE_API_KEY) {
  console.error('❌ AIRTABLE_API_KEY not found in .env.local');
  process.exit(1);
}

if (!BASE_ID) {
  console.error('❌ AIRTABLE_BASE_ID not found in .env.local');
  process.exit(1);
}

console.log('✓ Credentials found in .env.local');
console.log(`  API Key: ${AIRTABLE_API_KEY.substring(0, 10)}...${AIRTABLE_API_KEY.substring(AIRTABLE_API_KEY.length - 10)}`);
console.log(`  Base ID: ${BASE_ID}\n`);

// Test API connection
const options = {
  hostname: 'api.airtable.com',
  port: 443,
  path: `/v0/meta/bases/${BASE_ID}/tables`,
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
    'Content-Type': 'application/json'
  }
};

console.log('📡 Testing API connection...');

const req = https.request(options, (res) => {
  let body = '';
  res.on('data', chunk => body += chunk);
  res.on('end', () => {
    if (res.statusCode === 200) {
      const data = JSON.parse(body);
      console.log('✅ Connection successful!\n');
      console.log(`Current tables in base (${data.tables.length}):`);

      if (data.tables.length === 0) {
        console.log('  (No tables yet - ready for schema setup)');
      } else {
        data.tables.forEach((table, idx) => {
          console.log(`  ${idx + 1}. ${table.name} (${table.fields?.length || 0} fields)`);
        });
      }

      console.log('\n✓ Ready to run setup-airtable-schema.js');
    } else {
      console.error(`❌ API Error ${res.statusCode}:`);
      console.error(body);
      process.exit(1);
    }
  });
});

req.on('error', (error) => {
  console.error('❌ Connection failed:', error.message);
  process.exit(1);
});

req.end();
