#!/usr/bin/env node

import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';
import Airtable from 'airtable';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID || 'appTRd1caFiD7G40P';

if (!AIRTABLE_API_KEY) {
  console.error('❌ AIRTABLE_API_KEY not set in .env.local');
  process.exit(1);
}

const base = new Airtable({ apiKey: AIRTABLE_API_KEY }).base(AIRTABLE_BASE_ID);

async function cleanupOrphanedNodes() {
  try {
    console.log('🔍 Finding orphaned trust node records (no audit link)...\n');

    // Find all trust nodes with NO audit link
    const orphanedNodes = await base('Trust_Nodes')
      .select({
        filterByFormula: `{audit} = BLANK()`
      })
      .all();

    console.log(`Found ${orphanedNodes.length} orphaned trust node records\n`);

    if (orphanedNodes.length === 0) {
      console.log('✅ No orphaned records found!');
      return;
    }

    // Show details
    console.log('Orphaned records:');
    orphanedNodes.forEach((node, i) => {
      console.log(`  ${i + 1}. ${node.fields.node_name} (${node.fields.category}) - ID: ${node.id}`);
    });

    const shouldDelete = process.argv.includes('--confirm');

    if (!shouldDelete) {
      console.log('\n⏸️  DRY RUN: No records deleted.');
      console.log('Run with --confirm flag to delete these orphaned records.');
      console.log('\nCommand: node scripts/cleanup-orphaned-trust-nodes.js --confirm');
      return;
    }

    console.log('\n🗑️  DELETING orphaned records...\n');

    // Delete in batches of 10
    let deleted = 0;
    const recordIds = orphanedNodes.map(n => n.id);

    for (let i = 0; i < recordIds.length; i += 10) {
      const batch = recordIds.slice(i, i + 10);
      await base('Trust_Nodes').destroy(batch);
      deleted += batch.length;
      console.log(`  Deleted ${deleted}/${recordIds.length} records`);
    }

    console.log(`\n✅ Cleanup complete! Deleted ${deleted} orphaned trust node records.`);

  } catch (error) {
    console.error('❌ Error:', error.message);
    throw error;
  }
}

cleanupOrphanedNodes().catch(error => {
  console.error('\nFatal error:', error);
  process.exit(1);
});
