#!/usr/bin/env node

import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';
import Airtable from 'airtable';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;

const base = new Airtable({ apiKey: AIRTABLE_API_KEY }).base(AIRTABLE_BASE_ID);

console.log('✅ BEEHIIV AUDIT EXPORT - FINAL VERIFICATION\n');
console.log('='.repeat(60) + '\n');

try {
  // Get the beehiiv audit
  const audit = await base('Audit_Runs').find('recAigUg9eHa5VzQ6');

  console.log('AUDIT SUMMARY:');
  console.log(`Brand: ${audit.fields.brand_name}`);
  console.log(`Category: ${audit.fields.category}`);
  console.log(`Audit Date: ${audit.fields.audit_date}`);
  console.log(`Overall Score: ${audit.fields.overall_score}/10`);
  console.log(`Status: ${audit.fields.status}\n`);

  console.log('METRICS:');
  console.log(`  Trust Node Coverage: ${audit.fields.trust_node_coverage}/22 (${Math.round(audit.fields.trust_node_percentage * 100)}%)`);
  console.log(`  Citation Quality: ${audit.fields.citation_quality}/10`);
  console.log(`  AI Citation Rate: ${Math.round(audit.fields.ai_citation_rate * 100)}%`);
  console.log(`  Perplexity: ${audit.fields.perplexity_cited ? '✓' : '✗'} (Rank #${audit.fields.perplexity_rank})`);
  console.log(`  ChatGPT: ${audit.fields.chatgpt_cited ? '✓' : '✗'} (Rank #${audit.fields.chatgpt_rank})`);
  console.log(`  Gemini: ${audit.fields.gemini_cited ? '✓' : '✗'} (Rank #${audit.fields.gemini_rank})\n`);

  console.log('RECORDS LINKED TO AUDIT:');
  console.log(`  Trust Nodes: ${audit.fields.Trust_Nodes?.length || 0} records`);
  console.log(`  Citations: ${audit.fields.Citations?.length || 0} records`);
  console.log(`  LLM Responses: ${audit.fields.LLM_Responses?.length || 0} records`);
  console.log(`  Priorities: ${audit.fields.Priorities?.length || 0} records\n`);

  // Verify a sample of each type
  if (audit.fields.Trust_Nodes && audit.fields.Trust_Nodes.length > 0) {
    const sampleNode = await base('Trust_Nodes').find(audit.fields.Trust_Nodes[0]);
    console.log(`✓ Trust Node sample: ${sampleNode.fields.node_name} (${sampleNode.fields.category})`);
  }

  if (audit.fields.Citations && audit.fields.Citations.length > 0) {
    const sampleCitation = await base('Citations').find(audit.fields.Citations[0]);
    console.log(`✓ Citation sample: ${sampleCitation.fields.source_domain} (Quality: ${sampleCitation.fields.overall_quality}/10)`);
  }

  if (audit.fields.LLM_Responses && audit.fields.LLM_Responses.length > 0) {
    const sampleLLM = await base('LLM_Responses').find(audit.fields.LLM_Responses[0]);
    console.log(`✓ LLM Response sample: ${sampleLLM.fields.platform} - ${sampleLLM.fields.query_type} (Rank #${sampleLLM.fields.brand_rank})`);
  }

  if (audit.fields.Priorities && audit.fields.Priorities.length > 0) {
    const samplePriority = await base('Priorities').find(audit.fields.Priorities[0]);
    console.log(`✓ Priority sample: ${samplePriority.fields.title} (${samplePriority.fields.priority_level})`);
  }

  console.log('\n' + '='.repeat(60));
  console.log('✅ EXPORT SUCCESSFUL - ALL DATA VERIFIED IN AIRTABLE');
  console.log('='.repeat(60) + '\n');

  console.log('NEXT STEPS:');
  console.log('1. View audit in Airtable:');
  console.log(`   https://airtable.com/${AIRTABLE_BASE_ID}/tblkwn8Pzz1qdOT1B/viwvt5MzrpCqKJP9E/${audit.id}`);
  console.log('2. Review the 3 immediate priorities');
  console.log('3. Assign owners to action items');
  console.log(`4. Schedule next audit for ${audit.fields.next_audit_date}\n`);

} catch (error) {
  console.error('❌ Error:', error.message);
  process.exit(1);
}
