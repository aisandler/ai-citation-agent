#!/usr/bin/env node

/**
 * Delete Airtable Tables
 * Use this to clean up and start fresh if needed
 * WARNING: This will permanently delete all data in the tables!
 */

import fs from 'fs';
import path from 'path';
import https from 'https';
import readline from 'readline';
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
          resolve(body ? JSON.parse(body) : {});
        } else {
          reject(new Error(`API Error ${res.statusCode}: ${body}`));
        }
      });
    });

    req.on('error', reject);
    req.end();
  });
}

async function deleteTables() {
  console.log('⚠️  AIRTABLE TABLE DELETION TOOL\n');

  // Get current tables
  const response = await makeRequest('GET', `/v0/meta/bases/${BASE_ID}/tables`);
  const tables = response.tables;

  if (tables.length === 0) {
    console.log('No tables found in base.');
    return;
  }

  console.log('Current tables:');
  tables.forEach((table, idx) => {
    console.log(`  ${idx + 1}. ${table.name} (${table.fields?.length || 0} fields)`);
  });

  // Confirm deletion
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  const answer = await new Promise(resolve => {
    rl.question('\nDelete ALL tables? This cannot be undone! (type "DELETE" to confirm): ', resolve);
  });
  rl.close();

  if (answer !== 'DELETE') {
    console.log('Cancelled.');
    return;
  }

  console.log('\n🗑️  Deleting tables...\n');

  for (const table of tables) {
    try {
      await makeRequest('DELETE', `/v0/meta/bases/${BASE_ID}/tables/${table.id}`);
      console.log(`  ✓ Deleted: ${table.name}`);
    } catch (error) {
      console.error(`  ✗ Failed to delete ${table.name}:`, error.message);
    }
  }

  console.log('\n✅ Deletion complete. You can now run setup-airtable-schema.js to recreate the schema.');
}

deleteTables().catch(error => {
  console.error('Error:', error.message);
  process.exit(1);
});
