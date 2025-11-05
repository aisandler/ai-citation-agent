#!/usr/bin/env node
import dotenv from 'dotenv';
import Airtable from 'airtable';

dotenv.config({ path: '.env.local' });

const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(process.env.AIRTABLE_BASE_ID);

async function cleanupDuplicates() {
  console.log('Finding Jasper audit runs...\n');

  // Get all Jasper audits
  const audits = await base('Audit_Runs')
    .select({
      filterByFormula: "{brand_name} = 'Jasper'",
      sort: [{field: 'audit_date', direction: 'desc'}]
    })
    .all();

  console.log(`Found ${audits.length} Jasper audit runs.\n`);

  if (audits.length <= 1) {
    console.log('No duplicates to clean up.');
    return;
  }

  // Keep the LAST one (most recent/complete), delete others
  const toKeep = audits[0];
  const toDelete = audits.slice(1);

  console.log(`Keeping audit: ${toKeep.id} (most recent)`);
  console.log(`Deleting ${toDelete.length} duplicate audit(s)...\n`);

  for (const audit of toDelete) {
    console.log(`Deleting audit: ${audit.id}`);
    await base('Audit_Runs').destroy([audit.id]);
    console.log('  ✓ Deleted (linked records cascade-deleted automatically)\n');
  }

  console.log('✅ Cleanup complete!');
  console.log(`\nRemaining audit: ${toKeep.id}`);
  console.log(`- Brand: ${toKeep.fields.brand_name}`);
  console.log(`- Date: ${toKeep.fields.audit_date}`);
  console.log(`- Score: ${toKeep.fields.overall_score}/10`);
}

cleanupDuplicates().catch(error => {
  console.error('❌ Cleanup failed:', error.message);
  process.exit(1);
});
