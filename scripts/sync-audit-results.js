#!/usr/bin/env node

/**
 * Sync Audit Results Between Bases
 *
 * Bidirectional sync:
 * 1. Reads completed audits from detailed base (appXQsoTkWGPqwaOx)
 * 2. Updates source base (appB9ECe1uBMCRcmr) with scores and status
 * 3. Updates "4_Marketing Presence" table with AI citation data
 * 4. Links records between bases for traceability
 */

import Airtable from 'airtable';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '..', '.env.local') });

const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
const SOURCE_BASE_ID = 'appA35bf5yxTO2RkR'; // Competitive intelligence base
const AUDIT_BASE_ID = 'appXQsoTkWGPqwaOx'; // Detailed audit base

const MARKETING_TABLE = '4_Marketing Presence';
const AUDIT_RUNS_TABLE = 'Audit_Runs';

if (!AIRTABLE_API_KEY) {
  console.error('❌ AIRTABLE_API_KEY not found in .env.local');
  process.exit(1);
}

const airtable = new Airtable({ apiKey: AIRTABLE_API_KEY });
const sourceBase = airtable.base(SOURCE_BASE_ID);
const auditBase = airtable.base(AUDIT_BASE_ID);

/**
 * Sync a single audit result back to source base
 */
async function syncAuditResult(brandName) {
  console.log(`\n🔄 Syncing audit results for: ${brandName}`);

  try {
    // 1. Find audit run in detailed base
    console.log('   📊 Fetching audit data from detailed base...');
    const auditRecords = await auditBase(AUDIT_RUNS_TABLE)
      .select({
        filterByFormula: `{brand_name} = '${brandName}'`,
        sort: [{ field: 'audit_date', direction: 'desc' }],
        maxRecords: 1
      })
      .all();

    if (auditRecords.length === 0) {
      console.log(`   ⚠️  No audit found for ${brandName}`);
      return { success: false, reason: 'Audit not found' };
    }

    const auditData = auditRecords[0].fields;
    const auditRecordId = auditRecords[0].id;

    console.log(`   ✓ Found audit from ${auditData.audit_date}`);
    console.log(`     Overall Score: ${auditData.overall_score || 'N/A'}`);
    console.log(`     Trust Nodes: ${auditData.trust_node_coverage || 'N/A'}/29`);
    console.log(`     Citation Quality: ${auditData.citation_quality || 'N/A'}/10`);

    // 2. Find matching competitor in source base (Marketing Presence table)
    console.log('   🔍 Finding competitor in source base...');
    const sourceRecords = await sourceBase(MARKETING_TABLE)
      .select({
        filterByFormula: `{Competitor} = '${brandName}'`,
        maxRecords: 1
      })
      .all();

    if (sourceRecords.length === 0) {
      console.log(`   ⚠️  Competitor "${brandName}" not found in Marketing Presence table`);
      return { success: false, reason: 'Competitor not found in source base' };
    }

    const sourceRecordId = sourceRecords[0].id;
    console.log(`   ✓ Found competitor record: ${sourceRecordId}`);

    // 3. Prepare update fields
    const updateFields = {
      // Update AI citation checkboxes
      'ChatGPT Cited?': auditData.chatgpt_cited || false,

      // Detailed audit scores
      'Overall AI Score': auditData.overall_score || null,
      'Trust Node Coverage': auditData.trust_node_coverage || null,
      'Citation Quality Score': auditData.citation_quality || null,
      'Last Audited': auditData.audit_date || null,
      'Audit Record Link': auditRecordId,
      'Perplexity Rank': auditData.perplexity_rank || null,
      'ChatGPT Rank': auditData.chatgpt_rank || null,
      'Gemini Rank': auditData.gemini_rank || null,
      'Audit Status': 'Complete',
    };

    // Calculate next audit date (+60 days from last audit)
    if (auditData.audit_date) {
      const lastAudit = new Date(auditData.audit_date);
      const nextAudit = new Date(lastAudit);
      nextAudit.setDate(nextAudit.getDate() + 60);
      updateFields['Next Audit Due'] = nextAudit.toISOString().split('T')[0];
    }

    // Handle Perplexity field (currently multilineText in source base)
    if (auditData.perplexity_cited !== undefined) {
      updateFields['Perplexity Cited?'] = auditData.perplexity_cited ? 'Yes' : 'No';
    }

    // Handle Gemini field (currently multilineText in source base)
    if (auditData.gemini_cited !== undefined) {
      updateFields['Gemini Cited?'] = auditData.gemini_cited ? 'Yes' : 'No';
    }

    // 4. Update source base
    console.log('   💾 Updating source base with audit results...');
    await sourceBase(MARKETING_TABLE).update([
      {
        id: sourceRecordId,
        fields: updateFields
      }
    ]);

    console.log(`   ✅ Successfully synced ${brandName}`);
    console.log(`      - Overall Score: ${updateFields['Overall AI Score'] || 'N/A'}`);
    console.log(`      - Trust Nodes: ${updateFields['Trust Node Coverage'] || 'N/A'}/29`);
    console.log(`      - Citation Quality: ${updateFields['Citation Quality Score'] || 'N/A'}/10`);
    console.log(`      - ChatGPT: ${updateFields['ChatGPT Cited?'] ? 'Yes' : 'No'}${updateFields['ChatGPT Rank'] ? ` (#${updateFields['ChatGPT Rank']})` : ''}`);
    console.log(`      - Perplexity: ${updateFields['Perplexity Cited?'] || 'N/A'}${updateFields['Perplexity Rank'] ? ` (#${updateFields['Perplexity Rank']})` : ''}`);
    console.log(`      - Gemini: ${updateFields['Gemini Cited?'] || 'N/A'}${updateFields['Gemini Rank'] ? ` (#${updateFields['Gemini Rank']})` : ''}`);
    console.log(`      - Next Audit: ${updateFields['Next Audit Due'] || 'N/A'}`);

    return {
      success: true,
      brandName,
      sourceRecordId,
      auditRecordId,
      scores: {
        overall: auditData.overall_score,
        trustNodes: auditData.trust_node_coverage,
        citationQuality: auditData.citation_quality
      }
    };

  } catch (error) {
    console.error(`   ❌ Error syncing ${brandName}:`, error.message);
    return { success: false, reason: error.message };
  }
}

/**
 * Sync all completed audits
 */
async function syncAllAudits() {
  console.log('🔄 Syncing All Audit Results\n');
  console.log(`Source Base: ${SOURCE_BASE_ID} (Competitive Intelligence)`);
  console.log(`Audit Base: ${AUDIT_BASE_ID} (Detailed Audits)\n`);

  // Read audit queue to get list of brands
  const queuePath = join(__dirname, '..', 'output', 'audit-queue.json');

  if (!fs.existsSync(queuePath)) {
    console.error('❌ Audit queue not found. Run: node scripts/read-audit-queue.js');
    process.exit(1);
  }

  const auditQueue = JSON.parse(fs.readFileSync(queuePath, 'utf8'));
  console.log(`📋 Found ${auditQueue.length} brands in queue\n`);

  const results = {
    synced: [],
    failed: [],
    skipped: []
  };

  for (const item of auditQueue) {
    const result = await syncAuditResult(item.brandName);

    if (result.success) {
      results.synced.push(result);
    } else if (result.reason === 'Audit not found') {
      results.skipped.push({ brandName: item.brandName, reason: result.reason });
    } else {
      results.failed.push({ brandName: item.brandName, reason: result.reason });
    }

    // Rate limiting - wait 200ms between requests
    await new Promise(resolve => setTimeout(resolve, 200));
  }

  // Summary
  console.log('\n' + '═'.repeat(60));
  console.log('📊 SYNC SUMMARY\n');
  console.log(`✅ Successfully synced: ${results.synced.length}`);
  console.log(`⚠️  Skipped (no audit): ${results.skipped.length}`);
  console.log(`❌ Failed: ${results.failed.length}\n`);

  if (results.synced.length > 0) {
    console.log('Synced brands:');
    results.synced.forEach(r => {
      console.log(`  - ${r.brandName} (Score: ${r.scores.overall || 'N/A'})`);
    });
  }

  if (results.skipped.length > 0) {
    console.log('\nSkipped (need audits):');
    results.skipped.forEach(r => {
      console.log(`  - ${r.brandName}`);
    });
  }

  if (results.failed.length > 0) {
    console.log('\nFailed:');
    results.failed.forEach(r => {
      console.log(`  - ${r.brandName}: ${r.reason}`);
    });
  }

  console.log('\n' + '═'.repeat(60));
  console.log('\n💡 Next Steps:');
  console.log('1. Add audit tracking fields to "4_Marketing Presence" table:');
  console.log('   - Overall AI Score (number)');
  console.log('   - Trust Node Coverage (number)');
  console.log('   - Citation Quality Score (number)');
  console.log('   - Last Audited (date)');
  console.log('   - Perplexity Rank (number)');
  console.log('   - ChatGPT Rank (number)');
  console.log('   - Gemini Rank (number)');
  console.log('   - Audit Record ID (single line text)\n');
  console.log('2. Uncomment field mappings in sync script');
  console.log('3. Re-run sync to populate all fields\n');
}

// Run sync
syncAllAudits();
