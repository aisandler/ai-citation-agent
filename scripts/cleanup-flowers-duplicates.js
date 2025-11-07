#!/usr/bin/env node

import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';
import Airtable from 'airtable';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from .env.local
dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

// Configuration
const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID || 'appTRd1caFiD7G40P';

if (!AIRTABLE_API_KEY) {
  console.error('❌ AIRTABLE_API_KEY not set in .env.local');
  process.exit(1);
}

const base = new Airtable({ apiKey: AIRTABLE_API_KEY }).base(AIRTABLE_BASE_ID);

async function cleanupDuplicates() {
  try {
    console.log('🔍 Checking for duplicate trust nodes for flowers.com audit...\n');

    // Find the flowers.com audit run
    const auditRecords = await base('Audit_Runs')
      .select({
        filterByFormula: `{brand_name} = 'flowers.com'`,
        sort: [{field: 'audit_date', direction: 'desc'}]
      })
      .firstPage();

    if (auditRecords.length === 0) {
      console.log('No flowers.com audit found.');
      return;
    }

    const auditId = auditRecords[0].id;
    const auditDate = auditRecords[0].fields.audit_date;
    console.log(`Found audit: ${auditId} (${auditDate})`);

    // Get all trust nodes for this audit
    const trustNodes = await base('Trust_Nodes')
      .select({
        filterByFormula: `FIND('${auditId}', ARRAYJOIN({audit}))`
      })
      .all();

    console.log(`\nFound ${trustNodes.length} trust node records\n`);

    // Group by node_name to find duplicates
    const nodesByName = {};
    trustNodes.forEach(node => {
      const name = node.fields.node_name;
      if (!nodesByName[name]) {
        nodesByName[name] = [];
      }
      nodesByName[name].push(node);
    });

    // Find duplicates
    const duplicates = Object.entries(nodesByName).filter(([name, nodes]) => nodes.length > 1);

    if (duplicates.length === 0) {
      console.log('✓ No duplicates found!');
      return;
    }

    console.log(`Found ${duplicates.length} duplicate node names:\n`);

    let totalToDelete = 0;
    duplicates.forEach(([name, nodes]) => {
      console.log(`  ${name}: ${nodes.length} copies`);
      console.log(`    Keeping: ${nodes[0].id} (created first)`);
      nodes.slice(1).forEach(node => {
        console.log(`    DELETE: ${node.id}`);
        totalToDelete++;
      });
      console.log('');
    });

    console.log(`\nTotal records to delete: ${totalToDelete}`);
    console.log('\nDo you want to proceed with deletion? (yes/no)');
    console.log('Run with --confirm flag to auto-delete');

    const shouldDelete = process.argv.includes('--confirm');

    if (shouldDelete) {
      console.log('\n🗑️  Deleting duplicate records...\n');

      let deleted = 0;
      for (const [name, nodes] of duplicates) {
        const toDelete = nodes.slice(1).map(n => n.id);

        // Delete in batches of 10
        for (let i = 0; i < toDelete.length; i += 10) {
          const batch = toDelete.slice(i, i + 10);
          await base('Trust_Nodes').destroy(batch);
          deleted += batch.length;
          console.log(`  Deleted ${deleted}/${totalToDelete} duplicates`);
        }
      }

      console.log(`\n✅ Cleanup complete! Deleted ${deleted} duplicate records.`);
    } else {
      console.log('\n⏸️  Dry run complete. Add --confirm flag to execute deletion.');
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
    throw error;
  }
}

cleanupDuplicates().catch(error => {
  console.error('\nFatal error:', error);
  process.exit(1);
});
