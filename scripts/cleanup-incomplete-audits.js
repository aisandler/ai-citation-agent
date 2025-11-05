#!/usr/bin/env node

/**
 * Cleanup Incomplete Audits
 * Removes orphaned Audit_Runs records that have no linked Citations
 * This cleans up failed export attempts that left partial data
 */

import Airtable from 'airtable';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '..', '.env.local') });

const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID || 'appXQsoTkWGPqwaOx';

if (!AIRTABLE_API_KEY) {
  console.error('❌ AIRTABLE_API_KEY not found in .env.local');
  process.exit(1);
}

const base = new Airtable({ apiKey: AIRTABLE_API_KEY }).base(AIRTABLE_BASE_ID);

async function cleanupIncompleteAudits() {
  console.log('🔍 Finding incomplete audit records...\n');

  try {
    // Find all Audit_Runs records
    const auditRuns = await base('Audit_Runs').select().all();

    console.log(`Found ${auditRuns.length} total audit records\n`);

    // Identify incomplete audits (no citations linked)
    const incompleteAudits = [];

    for (const audit of auditRuns) {
      const citations = audit.fields.Citations || [];
      const llmResponses = audit.fields.LLM_Responses || [];
      const priorities = audit.fields.Priorities || [];

      const isIncomplete = citations.length === 0 || llmResponses.length === 0 || priorities.length === 0;

      if (isIncomplete) {
        incompleteAudits.push({
          id: audit.id,
          brand: audit.fields.brand_name,
          date: audit.fields.audit_date,
          trustNodes: (audit.fields.Trust_Nodes || []).length,
          citations: citations.length,
          llmResponses: llmResponses.length,
          priorities: priorities.length
        });
      }
    }

    if (incompleteAudits.length === 0) {
      console.log('✅ No incomplete audits found! All records are complete.\n');
      return;
    }

    // Display incomplete audits
    console.log(`⚠️  Found ${incompleteAudits.length} incomplete audit(s):\n`);

    incompleteAudits.forEach((audit, index) => {
      console.log(`${index + 1}. ${audit.brand} (${audit.date})`);
      console.log(`   Record ID: ${audit.id}`);
      console.log(`   Trust Nodes: ${audit.trustNodes}`);
      console.log(`   Citations: ${audit.citations} ${audit.citations === 0 ? '❌' : '✓'}`);
      console.log(`   LLM Responses: ${audit.llmResponses} ${audit.llmResponses === 0 ? '❌' : '✓'}`);
      console.log(`   Priorities: ${audit.priorities} ${audit.priorities === 0 ? '❌' : '✓'}`);
      console.log('');
    });

    // Confirm deletion
    console.log('❗ These incomplete records will be deleted.');
    console.log('   Airtable will cascade delete linked Trust_Nodes.');
    console.log('');
    console.log('⏳ Proceeding with cleanup in 3 seconds... (Ctrl+C to cancel)\n');

    await new Promise(resolve => setTimeout(resolve, 3000));

    // Delete incomplete audits
    console.log('🗑️  Deleting incomplete audits...\n');

    const recordIds = incompleteAudits.map(a => a.id);

    // Airtable batch delete limit is 10 records
    for (let i = 0; i < recordIds.length; i += 10) {
      const batch = recordIds.slice(i, i + 10);
      await base('Audit_Runs').destroy(batch);
      console.log(`✓ Deleted batch ${Math.floor(i / 10) + 1} (${batch.length} records)`);
    }

    console.log('');
    console.log('✅ CLEANUP COMPLETE\n');
    console.log(`Removed ${incompleteAudits.length} incomplete audit(s)`);
    console.log('Orphaned Trust_Nodes were cascade deleted by Airtable\n');

    // Show remaining complete audits
    const remainingAudits = auditRuns.length - incompleteAudits.length;
    console.log(`📊 Remaining complete audits: ${remainingAudits}\n`);

  } catch (error) {
    console.error('❌ Cleanup failed:', error.message);
    process.exit(1);
  }
}

cleanupIncompleteAudits();
