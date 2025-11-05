#!/usr/bin/env node

/**
 * Airtable Schema Setup Script
 * Creates 5 tables for AI Citation Intelligence system
 */

import fs from 'fs';
import path from 'path';
import https from 'https';
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

if (!AIRTABLE_API_KEY || !BASE_ID) {
  console.error('❌ Missing AIRTABLE_API_KEY or AIRTABLE_BASE_ID in .env.local');
  process.exit(1);
}

// Airtable API request helper
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

// Sleep helper
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

async function createTable(tableName, description, fields) {
  console.log(`\n📋 Creating table: ${tableName}`);

  try {
    const response = await makeRequest(
      'POST',
      `/v0/meta/bases/${BASE_ID}/tables`,
      {
        name: tableName,
        description: description,
        fields: fields
      }
    );

    console.log(`   ✓ ${tableName} created with ${fields.length} fields`);
    console.log(`   Table ID: ${response.id}`);
    return response;
  } catch (error) {
    console.error(`   ✗ Failed to create ${tableName}:`, error.message);
    throw error;
  }
}

async function createLinkedField(tableId, tableName, linkedTableId, linkedTableName) {
  console.log(`   🔗 Linking ${tableName} to ${linkedTableName}`);

  // Wait a bit for table creation to complete
  await sleep(1000);

  try {
    const response = await makeRequest(
      'POST',
      `/v0/meta/bases/${BASE_ID}/tables/${tableId}/fields`,
      {
        name: 'audit',
        description: 'Link to audit run',
        type: 'multipleRecordLinks',
        options: {
          linkedTableId: linkedTableId
        }
      }
    );

    console.log(`   ✓ Linked field created`);
    return response;
  } catch (error) {
    console.error(`   ✗ Failed to create linked field:`, error.message);
    throw error;
  }
}

async function setupSchema() {
  console.log('🚀 AI Citation Intelligence - Airtable Schema Setup\n');
  console.log(`Base ID: ${BASE_ID}`);

  const tableIds = {};

  try {
    // TABLE 1: Audit_Runs (main table - no links needed)
    const auditRuns = await createTable(
      'Audit_Runs',
      'Main audit execution records tracking brand visibility over time',
      [
        { name: 'brand_name', type: 'singleLineText', description: 'Brand being audited' },
        { name: 'category', type: 'singleLineText', description: 'Industry or category (e.g., AI writing tools)' },
        { name: 'audit_date', type: 'date', options: { dateFormat: { name: 'us', format: 'M/D/YYYY' } }, description: 'When audit was executed' },
        { name: 'overall_score', type: 'number', options: { precision: 1 }, description: 'Composite AI visibility score (0-10)' },
        { name: 'trust_node_coverage', type: 'number', options: { precision: 0 }, description: 'Number of trust nodes present (out of 29)' },
        { name: 'trust_node_percentage', type: 'percent', options: { precision: 0 }, description: 'Percentage of trust nodes covered' },
        { name: 'citation_quality', type: 'number', options: { precision: 1 }, description: 'Average citation quality score (0-10)' },
        { name: 'ai_citation_rate', type: 'percent', options: { precision: 0 }, description: 'Percentage of AI platforms citing the brand' },
        { name: 'perplexity_rank', type: 'number', options: { precision: 0 }, description: 'Position on Perplexity (null if not ranked)' },
        { name: 'chatgpt_rank', type: 'number', options: { precision: 0 }, description: 'Position on ChatGPT (null if not ranked)' },
        { name: 'gemini_rank', type: 'number', options: { precision: 0 }, description: 'Position on Gemini (null if not ranked)' },
        { name: 'perplexity_cited', type: 'checkbox', options: { icon: 'check', color: 'greenBright' }, description: 'Brand cited by Perplexity' },
        { name: 'chatgpt_cited', type: 'checkbox', options: { icon: 'check', color: 'greenBright' }, description: 'Brand cited by ChatGPT' },
        { name: 'gemini_cited', type: 'checkbox', options: { icon: 'check', color: 'greenBright' }, description: 'Brand cited by Gemini' },
        { name: 'status', type: 'singleSelect', options: { choices: [{ name: 'Complete', color: 'greenBright' }, { name: 'In Progress', color: 'yellowBright' }, { name: 'Failed', color: 'redBright' }] }, description: 'Audit execution status' },
        { name: 'executive_summary', type: 'multilineText', description: 'High-level findings and key insights' },
        { name: 'top_priority_1', type: 'multilineText', description: 'First critical action item' },
        { name: 'top_priority_2', type: 'multilineText', description: 'Second critical action item' },
        { name: 'top_priority_3', type: 'multilineText', description: 'Third critical action item' },
        { name: 'next_audit_date', type: 'date', options: { dateFormat: { name: 'us', format: 'M/D/YYYY' } }, description: 'Recommended date for next audit (typically +60 days)' }
      ]
    );
    tableIds.auditRuns = auditRuns.id;

    await sleep(2000); // Wait before creating next table

    // TABLE 2: Trust_Nodes
    const trustNodes = await createTable(
      'Trust_Nodes',
      'Tracks presence and quality of individual trust nodes over time',
      [
        { name: 'node_name', type: 'singleLineText', description: 'Specific trust node (e.g., Wikipedia, G2, TechCrunch)' },
        { name: 'category', type: 'singleSelect', options: { choices: [{ name: 'Knowledge Graph' }, { name: 'Review Platform' }, { name: 'Directory' }, { name: 'Company Profile' }, { name: 'News & PR' }, { name: 'Seed Site' }] }, description: 'Trust node category' },
        { name: 'present', type: 'checkbox', options: { icon: 'check', color: 'greenBright' }, description: 'Trust node exists for brand' },
        { name: 'quality_score', type: 'number', options: { precision: 1 }, description: 'Quality assessment if present (0-10)' },
        { name: 'last_updated', type: 'date', options: { dateFormat: { name: 'us', format: 'M/D/YYYY' } }, description: 'When trust node was last updated' },
        { name: 'url', type: 'url', description: 'Link to the trust node' },
        { name: 'notes', type: 'multilineText', description: 'Additional details about status' }
      ]
    );
    tableIds.trustNodes = trustNodes.id;

    await sleep(2000);

    // TABLE 3: Citations
    const citations = await createTable(
      'Citations',
      'Individual citations found and their quality scores across 5 dimensions',
      [
        { name: 'source_url', type: 'url', description: 'URL of the citation' },
        { name: 'source_domain', type: 'singleLineText', description: 'Domain extracted from URL' },
        { name: 'source_title', type: 'singleLineText', description: 'Page or article title' },
        { name: 'authority_score', type: 'number', options: { precision: 1 }, description: 'Authority dimension (0-10)' },
        { name: 'data_structure_score', type: 'number', options: { precision: 1 }, description: 'Data structure dimension (0-10)' },
        { name: 'brand_alignment_score', type: 'number', options: { precision: 1 }, description: 'Brand alignment dimension (0-10)' },
        { name: 'freshness_score', type: 'number', options: { precision: 1 }, description: 'Freshness dimension (0-10)' },
        { name: 'cross_link_score', type: 'number', options: { precision: 1 }, description: 'Cross-link signals dimension (0-10)' },
        { name: 'overall_quality', type: 'number', options: { precision: 1 }, description: 'Average of 5 dimensions' },
        { name: 'publication_date', type: 'date', options: { dateFormat: { name: 'us', format: 'M/D/YYYY' } }, description: 'When content was published' },
        { name: 'cited_by_perplexity', type: 'checkbox', options: { icon: 'check', color: 'greenBright' }, description: 'Cited by Perplexity' },
        { name: 'cited_by_chatgpt', type: 'checkbox', options: { icon: 'check', color: 'greenBright' }, description: 'Cited by ChatGPT' },
        { name: 'cited_by_gemini', type: 'checkbox', options: { icon: 'check', color: 'greenBright' }, description: 'Cited by Gemini' },
        { name: 'notes', type: 'multilineText', description: 'Additional context' }
      ]
    );
    tableIds.citations = citations.id;

    await sleep(2000);

    // TABLE 4: LLM_Responses
    const llmResponses = await createTable(
      'LLM_Responses',
      'Detailed LLM response data for trend analysis and competitive intelligence',
      [
        { name: 'query_id', type: 'singleLineText', description: 'Unique query identifier (auto-generated)' },
        { name: 'platform', type: 'singleSelect', options: { choices: [{ name: 'Perplexity', color: 'greenBright' }, { name: 'ChatGPT', color: 'blueBright' }, { name: 'Gemini', color: 'purpleBright' }] }, description: 'AI platform' },
        { name: 'query_type', type: 'singleSelect', options: { choices: [{ name: 'Evaluative' }, { name: 'Comparative' }, { name: 'Brand-Specific' }, { name: 'Localized' }] }, description: 'Type of query executed' },
        { name: 'query_text', type: 'multilineText', description: 'Actual query submitted' },
        { name: 'brand_cited', type: 'checkbox', options: { icon: 'check', color: 'greenBright' }, description: 'Brand was mentioned' },
        { name: 'brand_rank', type: 'number', options: { precision: 0 }, description: 'Position in response (null if not ranked)' },
        { name: 'brand_context', type: 'multilineText', description: 'How brand was described' },
        { name: 'citations_found', type: 'number', options: { precision: 0 }, description: 'Total citations in response' },
        { name: 'competitor_1', type: 'singleLineText', description: 'Top competitor cited' },
        { name: 'competitor_1_rank', type: 'number', options: { precision: 0 }, description: 'Their position' },
        { name: 'competitor_2', type: 'singleLineText', description: 'Second competitor cited' },
        { name: 'competitor_2_rank', type: 'number', options: { precision: 0 }, description: 'Their position' },
        { name: 'competitor_3', type: 'singleLineText', description: 'Third competitor cited' },
        { name: 'competitor_3_rank', type: 'number', options: { precision: 0 }, description: 'Their position' },
        { name: 'response_summary', type: 'multilineText', description: 'Key findings from response' }
      ]
    );
    tableIds.llmResponses = llmResponses.id;

    await sleep(2000);

    // TABLE 5: Priorities
    const priorities = await createTable(
      'Priorities',
      'Action items identified from audits with status tracking',
      [
        { name: 'title', type: 'singleLineText', description: 'Action title' },
        { name: 'priority_level', type: 'singleSelect', options: { choices: [{ name: 'Immediate', color: 'redBright' }, { name: 'Strategic', color: 'yellowBright' }, { name: 'Long-term', color: 'greenBright' }] }, description: 'Urgency level' },
        { name: 'description', type: 'multilineText', description: 'Full description of action needed' },
        { name: 'impact', type: 'singleSelect', options: { choices: [{ name: 'High', color: 'redBright' }, { name: 'Medium', color: 'yellowBright' }, { name: 'Low', color: 'greenBright' }] }, description: 'Expected impact' },
        { name: 'effort', type: 'singleSelect', options: { choices: [{ name: 'High', color: 'redBright' }, { name: 'Medium', color: 'yellowBright' }, { name: 'Low', color: 'greenBright' }] }, description: 'Estimated effort' },
        { name: 'timeline', type: 'singleLineText', description: 'Estimated time to complete' },
        { name: 'status', type: 'singleSelect', options: { choices: [{ name: 'Not Started', color: 'grayBright' }, { name: 'In Progress', color: 'yellowBright' }, { name: 'Complete', color: 'greenBright' }, { name: 'Blocked', color: 'redBright' }] }, description: 'Current status' },
        { name: 'assigned_to', type: 'singleLineText', description: 'Who owns this action' },
        { name: 'due_date', type: 'date', options: { dateFormat: { name: 'us', format: 'M/D/YYYY' } }, description: 'Target completion date' },
        { name: 'completed_date', type: 'date', options: { dateFormat: { name: 'us', format: 'M/D/YYYY' } }, description: 'When completed' },
        { name: 'notes', type: 'multilineText', description: 'Progress updates' }
      ]
    );
    tableIds.priorities = priorities.id;

    await sleep(2000);

    // Create linked fields to connect all tables to Audit_Runs
    console.log('\n🔗 Creating table relationships...');

    await createLinkedField(trustNodes.id, 'Trust_Nodes', auditRuns.id, 'Audit_Runs');
    await sleep(1000);

    await createLinkedField(citations.id, 'Citations', auditRuns.id, 'Audit_Runs');
    await sleep(1000);

    await createLinkedField(llmResponses.id, 'LLM_Responses', auditRuns.id, 'Audit_Runs');
    await sleep(1000);

    await createLinkedField(priorities.id, 'Priorities', auditRuns.id, 'Audit_Runs');

    // Final report
    console.log('\n✅ AIRTABLE SCHEMA SETUP COMPLETE\n');
    console.log('Tables Created:');
    console.log('1. ✓ Audit_Runs (20 fields) - Main audit records');
    console.log('2. ✓ Trust_Nodes (7 fields) - Trust node tracking');
    console.log('3. ✓ Citations (15 fields) - Citation quality');
    console.log('4. ✓ LLM_Responses (16 fields) - Platform responses');
    console.log('5. ✓ Priorities (11 fields) - Action items\n');
    console.log('Total Fields: 69');
    console.log('Relationships: All tables linked to Audit_Runs\n');
    console.log('Schema ready for:');
    console.log('- Data persistence from audit agent');
    console.log('- Dashboard visualization');
    console.log('- Trend tracking over time\n');
    console.log('Table IDs:');
    console.log(JSON.stringify(tableIds, null, 2));

  } catch (error) {
    console.error('\n❌ Setup failed:', error.message);
    process.exit(1);
  }
}

setupSchema();
