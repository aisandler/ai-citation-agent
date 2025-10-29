const https = require('https');
const fs = require('fs');
const path = require('path');

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
const RECORD_ID = 'recatba6ZtOQ1WTIw';

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
        try {
          const response = JSON.parse(body);
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve(response);
          } else {
            reject(new Error(`HTTP ${res.statusCode}: ${JSON.stringify(response)}`));
          }
        } catch (e) {
          reject(new Error(`Failed to parse response: ${body}`));
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

async function updateAudit() {
  console.log('📊 Updating Mad Mutz audit with Perplexity & Gemini data...\n');

  try {
    const updateData = {
      fields: {
        'perplexity_cited': true,
        'chatgpt_cited': false,
        'gemini_cited': false
      }
    };

    const result = await makeRequest(
      'PATCH',
      `/v0/${BASE_ID}/Audit_Runs/${RECORD_ID}`,
      updateData
    );

    console.log('✅ Updated audit record with LLM citation data');
    console.log('\nPerplexity:');
    console.log('  - Cited: ✓ Yes (brand-specific query only)');
    console.log('  - Rank: Not ranked in category queries');
    console.log('  - Status: Indexed but invisible');
    console.log('\nChatGPT:');
    console.log('  - Cited: ✗ No');
    console.log('  - Rank: Not mentioned');
    console.log('  - Missing: Allrecipes taste test citation');
    console.log('\nGemini:');
    console.log('  - Cited: ✗ No');
    console.log('  - Rank: Not mentioned');
    console.log('  - Issue: Not in 2023-2024 training data\n');
    console.log('📊 View updated audit: https://airtable.com/' + BASE_ID + '\n');

  } catch (error) {
    console.error('❌ Update failed:', error.message);
    process.exit(1);
  }
}

updateAudit();
