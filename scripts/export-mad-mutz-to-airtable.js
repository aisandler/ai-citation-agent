#!/usr/bin/env node

/**
 * Export Mad Mutz Audit to Airtable
 * Reads the exported JSON file and uploads audit data to Airtable
 */

import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: '.env.local' });

const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;

if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID) {
  console.error('❌ Missing required environment variables:');
  console.error('   AIRTABLE_API_KEY:', AIRTABLE_API_KEY ? '✓' : '✗');
  console.error('   AIRTABLE_BASE_ID:', AIRTABLE_BASE_ID ? '✓' : '✗');
  process.exit(1);
}

// Read the Mad Mutz audit export
const auditFilePath = path.join(__dirname, '../exports/mad-mutz-audit-export.json');
if (!fs.existsSync(auditFilePath)) {
  console.error('❌ Audit file not found:', auditFilePath);
  process.exit(1);
}

const auditData = JSON.parse(fs.readFileSync(auditFilePath, 'utf8'));

console.log('📊 Mad Mutz Audit Export to Airtable');
console.log('=====================================\n');

async function createAuditRecord() {
  const url = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/Audits`;

  const record = {
    fields: {
      'Brand Name': auditData.audit_metadata.brand,
      'Category': auditData.audit_metadata.category,
      'Audit Date': auditData.audit_metadata.audit_date,
      'Overall Score': auditData.audit_metadata.overall_score,
      'AI Citation Rate': auditData.executive_summary.ai_citation_rate,
      'Trust Node Coverage (%)': auditData.step1_trust_nodes.overall_coverage.cpg_adjusted_percentage,
      'Citation Quality Score': auditData.step2_citation_quality.average_score,
      'Status': 'Completed',
      'Key Findings': JSON.stringify(auditData.executive_summary.key_findings, null, 2)
    }
  };

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(record)
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to create audit record: ${error}`);
  }

  const data = await response.json();
  console.log('✅ Created audit record:', data.id);
  return data.id;
}

async function createTrustNodeRecords(auditId) {
  const url = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/Trust Nodes`;

  // Build trust node records from the audit data
  const trustNodes = [];

  // Knowledge Graphs
  trustNodes.push({
    fields: {
      'Audit ID': [auditId],
      'Node Name': 'Wikipedia',
      'Category': 'Knowledge Graphs',
      'Status': 'Missing',
      'Priority': 'High',
      'Impact': 'Blocks knowledge graph presence in all 3 LLMs'
    }
  });

  trustNodes.push({
    fields: {
      'Audit ID': [auditId],
      'Node Name': 'Wikidata',
      'Category': 'Knowledge Graphs',
      'Status': 'Missing',
      'Priority': 'Immediate',
      'Impact': 'Missing structured data foundation for entity recognition'
    }
  });

  trustNodes.push({
    fields: {
      'Audit ID': [auditId],
      'Node Name': 'Google Knowledge Panel',
      'Category': 'Knowledge Graphs',
      'Status': 'Missing',
      'Priority': 'High',
      'Impact': 'No search entity recognition'
    }
  });

  // Company Profiles
  trustNodes.push({
    fields: {
      'Audit ID': [auditId],
      'Node Name': 'LinkedIn Company Page',
      'Category': 'Company Profiles',
      'Status': 'Missing',
      'Priority': 'Immediate',
      'Impact': 'Missing professional B2B channel'
    }
  });

  // News/PR (present)
  trustNodes.push({
    fields: {
      'Audit ID': [auditId],
      'Node Name': 'Philadelphia Inquirer',
      'Category': 'News & PR',
      'Status': 'Present',
      'Priority': 'N/A',
      'Impact': 'Strong regional editorial coverage (2 articles)'
    }
  });

  // Batch create (max 10 at a time for Airtable)
  for (let i = 0; i < trustNodes.length; i += 10) {
    const batch = trustNodes.slice(i, i + 10);

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ records: batch })
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Failed to create trust node records: ${error}`);
    }

    const data = await response.json();
    console.log(`✅ Created ${data.records.length} trust node records`);
  }
}

async function createLLMQueryRecords(auditId) {
  const url = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/LLM Queries`;

  const queries = [];

  // Perplexity queries
  if (auditData.step3_llm_evaluation.perplexity.queries) {
    Object.entries(auditData.step3_llm_evaluation.perplexity.queries).forEach(([type, data]) => {
      queries.push({
        fields: {
          'Audit ID': [auditId],
          'Platform': 'Perplexity',
          'Query Text': data.query,
          'Query Type': type,
          'Brand Mentioned': data.brand_mentioned ? 'Yes' : 'No',
          'Position': data.position || 'Not ranked',
          'Citations Count': data.citations_count || 0,
          'Key Finding': data.key_insight || data.status || 'N/A'
        }
      });
    });
  }

  // ChatGPT queries
  if (auditData.step3_llm_evaluation.chatgpt.queries) {
    Object.entries(auditData.step3_llm_evaluation.chatgpt.queries).forEach(([type, data]) => {
      queries.push({
        fields: {
          'Audit ID': [auditId],
          'Platform': 'ChatGPT',
          'Query Text': data.query,
          'Query Type': type,
          'Brand Mentioned': data.brand_mentioned ? 'Yes' : 'No',
          'Position': data.position || 'Not mentioned',
          'Citations Count': data.citations_count || 0,
          'Key Finding': data.most_influential_citation || 'N/A'
        }
      });
    });
  }

  // Gemini queries
  if (auditData.step3_llm_evaluation.gemini.queries) {
    Object.entries(auditData.step3_llm_evaluation.gemini.queries).forEach(([type, data]) => {
      queries.push({
        fields: {
          'Audit ID': [auditId],
          'Platform': 'Gemini',
          'Query Text': data.query,
          'Query Type': type,
          'Brand Mentioned': data.brand_mentioned ? 'Yes' : 'No',
          'Position': data.position || 'Not mentioned',
          'Citations Count': data.citations_count || 0,
          'Key Finding': data.citation_format || 'N/A'
        }
      });
    });
  }

  // Batch create
  for (let i = 0; i < queries.length; i += 10) {
    const batch = queries.slice(i, i + 10);

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ records: batch })
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Failed to create LLM query records: ${error}`);
    }

    const data = await response.json();
    console.log(`✅ Created ${data.records.length} LLM query records`);
  }
}

async function createActionItemRecords(auditId) {
  const url = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/Action Items`;

  const actions = [];

  // Immediate priorities
  auditData.recommendations.immediate_priorities_30_60_days.forEach(item => {
    actions.push({
      fields: {
        'Audit ID': [auditId],
        'Priority Level': 'Immediate',
        'Action Item': item.action,
        'Current Status': item.current_status,
        'Timeline': item.timeline_weeks ? `${item.timeline_weeks} weeks` : 'TBD',
        'Estimated Cost': item.estimated_cost,
        'Expected Impact': item.expected_roi,
        'Status': 'Not Started'
      }
    });
  });

  // Strategic initiatives
  if (auditData.recommendations.strategic_initiatives_90_180_days) {
    auditData.recommendations.strategic_initiatives_90_180_days.forEach(item => {
      actions.push({
        fields: {
          'Audit ID': [auditId],
          'Priority Level': 'Strategic',
          'Action Item': item.initiative,
          'Timeline': item.timeline_months ? `${item.timeline_months} months` : 'TBD',
          'Status': 'Not Started'
        }
      });
    });
  }

  // Batch create
  for (let i = 0; i < actions.length; i += 10) {
    const batch = actions.slice(i, i + 10);

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ records: batch })
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Failed to create action item records: ${error}`);
    }

    const data = await response.json();
    console.log(`✅ Created ${data.records.length} action item records`);
  }
}

// Main execution
async function main() {
  try {
    console.log('📤 Starting export to Airtable...\n');

    // Create audit record
    console.log('1️⃣ Creating audit record...');
    const auditId = await createAuditRecord();

    // Create trust node records
    console.log('\n2️⃣ Creating trust node records...');
    await createTrustNodeRecords(auditId);

    // Create LLM query records
    console.log('\n3️⃣ Creating LLM query records...');
    await createLLMQueryRecords(auditId);

    // Create action item records
    console.log('\n4️⃣ Creating action item records...');
    await createActionItemRecords(auditId);

    console.log('\n✅ Export complete!');
    console.log(`\n📊 View your audit in Airtable:`);
    console.log(`   https://airtable.com/${AIRTABLE_BASE_ID}`);

  } catch (error) {
    console.error('\n❌ Export failed:', error.message);
    process.exit(1);
  }
}

main();
