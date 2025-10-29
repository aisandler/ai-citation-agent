#!/usr/bin/env node

/**
 * Add Audit Linkage to AI Citation Intelligence Schema
 *
 * Adds "audit" linked record field to Trust_Nodes, Citations,
 * LLM_Responses, and Priorities tables to enable filtering,
 * rollups, and trend analysis across multiple audits.
 */

const AIRTABLE_TOKEN = process.env.AIRTABLE_TOKEN;
const BASE_ID = 'appXQsoTkWGPqwaOx';

const TABLES = {
  AUDIT_RUNS: 'tblivk21gAddOYi68',
  TRUST_NODES: 'tblIf7eL5mRfpe36I',
  CITATIONS: 'tbl2fHQKECfclN9BT',
  LLM_RESPONSES: 'tbly9CZSgJ7wVaz0F',
  PRIORITIES: 'tblkte75aevKDmr5Q'
};

if (!AIRTABLE_TOKEN) {
  console.error('❌ Error: AIRTABLE_TOKEN environment variable not set');
  console.error('   Set it with: export AIRTABLE_TOKEN=your_token_here');
  process.exit(1);
}

async function addLinkedRecordField(tableId, tableName) {
  const url = `https://api.airtable.com/v0/meta/bases/${BASE_ID}/tables/${tableId}/fields`;

  const fieldConfig = {
    name: 'audit',
    type: 'multipleRecordLinks',
    options: {
      linkedTableId: TABLES.AUDIT_RUNS
    }
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${AIRTABLE_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(fieldConfig)
    });

    const data = await response.json();

    if (response.ok) {
      console.log(`✓ Added "audit" field to ${tableName}`);
      return { success: true, fieldId: data.id };
    } else {
      // Check if field already exists
      if (data.error?.type === 'INVALID_REQUEST_BODY' &&
          data.error?.message?.includes('already exists')) {
        console.log(`⚠️  "audit" field already exists in ${tableName}`);
        return { success: true, alreadyExists: true };
      }
      console.error(`❌ Failed to add field to ${tableName}:`, data.error);
      return { success: false, error: data.error };
    }
  } catch (error) {
    console.error(`❌ Error adding field to ${tableName}:`, error.message);
    return { success: false, error };
  }
}

async function main() {
  console.log('🔗 Adding audit linkage to AI Citation Intelligence schema...\n');

  const tablesToUpdate = [
    { id: TABLES.TRUST_NODES, name: 'Trust_Nodes' },
    { id: TABLES.CITATIONS, name: 'Citations' },
    { id: TABLES.LLM_RESPONSES, name: 'LLM_Responses' },
    { id: TABLES.PRIORITIES, name: 'Priorities' }
  ];

  let successCount = 0;
  let errorCount = 0;

  for (const table of tablesToUpdate) {
    const result = await addLinkedRecordField(table.id, table.name);
    if (result.success) {
      successCount++;
    } else {
      errorCount++;
    }

    // Rate limit: Wait 200ms between requests
    await new Promise(resolve => setTimeout(resolve, 200));
  }

  console.log('\n' + '='.repeat(50));
  console.log(`✓ Successfully updated: ${successCount} tables`);
  if (errorCount > 0) {
    console.log(`❌ Errors: ${errorCount} tables`);
  }
  console.log('='.repeat(50));

  console.log('\n📊 Next Steps:\n');
  console.log('1. Open your Airtable base: https://airtable.com/appXQsoTkWGPqwaOx');
  console.log('2. Verify the "audit" field appears in each table');
  console.log('3. Run future audits - records will now link to their parent audit');
  console.log('4. Create rollup fields on Audit_Runs:');
  console.log('   - Average Citation Quality (from Citations)');
  console.log('   - Trust Node Count (from Trust_Nodes)');
  console.log('   - Priority Count (from Priorities)\n');
  console.log('5. Update airtable-writer agent to populate audit field when creating records');
}

main().catch(console.error);
