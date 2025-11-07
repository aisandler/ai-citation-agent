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
  console.error('❌ AIRTABLE_API_KEY not set');
  process.exit(1);
}

const base = new Airtable({ apiKey: AIRTABLE_API_KEY }).base(AIRTABLE_BASE_ID);

async function inspectData() {
  try {
    console.log('📊 Inspecting Airtable data...\n');
    console.log(`Base ID: ${AIRTABLE_BASE_ID}\n`);

    // Check audit runs
    console.log('1. AUDIT RUNS:');
    const audits = await base('Audit_Runs').select({ maxRecords: 5, sort: [{field: 'audit_date', direction: 'desc'}] }).all();
    console.log(`   Found ${audits.length} recent audits:`);
    audits.forEach(audit => {
      console.log(`   - ${audit.fields.brand_name} (${audit.fields.audit_date}) ID: ${audit.id}`);
    });

    // Check trust nodes (ALL of them, not filtered)
    console.log('\n2. TRUST NODES (all):');
    const allTrustNodes = await base('Trust_Nodes').select({ maxRecords: 50 }).all();
    console.log(`   Found ${allTrustNodes.length} total trust nodes`);

    // Group by brand/audit if possible
    const nodesByAudit = {};
    allTrustNodes.forEach(node => {
      const auditLinks = node.fields.audit || [];
      auditLinks.forEach(auditId => {
        if (!nodesByAudit[auditId]) nodesByAudit[auditId] = [];
        nodesByAudit[auditId].push(node.fields.node_name);
      });
    });

    console.log('\n   Grouped by audit:');
    Object.entries(nodesByAudit).forEach(([auditId, nodes]) => {
      console.log(`   Audit ${auditId}: ${nodes.length} nodes`);
      // Show first few
      console.log(`     ${nodes.slice(0, 5).join(', ')}${nodes.length > 5 ? '...' : ''}`);
    });

    // Check for flowers.com specifically
    console.log('\n3. FLOWERS.COM SPECIFIC:');
    const flowersAudit = audits.find(a => a.fields.brand_name === 'flowers.com');
    if (flowersAudit) {
      console.log(`   Audit ID: ${flowersAudit.id}`);
      const flowersTrustNodes = allTrustNodes.filter(node => {
        return node.fields.audit && node.fields.audit.includes(flowersAudit.id);
      });
      console.log(`   Trust nodes linked: ${flowersTrustNodes.length}`);

      // Check for duplicates
      const nodeNames = flowersTrustNodes.map(n => n.fields.node_name);
      const uniqueNames = new Set(nodeNames);
      console.log(`   Unique node names: ${uniqueNames.size}`);

      if (nodeNames.length !== uniqueNames.size) {
        console.log(`   ⚠️  DUPLICATES DETECTED: ${nodeNames.length - uniqueNames.size} duplicate(s)`);

        // Find which ones are duplicated
        const nameCounts = {};
        nodeNames.forEach(name => {
          nameCounts[name] = (nameCounts[name] || 0) + 1;
        });
        const duplicatedNames = Object.entries(nameCounts).filter(([name, count]) => count > 1);
        console.log('\n   Duplicated nodes:');
        duplicatedNames.forEach(([name, count]) => {
          console.log(`     - ${name}: ${count} copies`);
        });
      }
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.statusCode === 404) {
      console.error('\nTable not found. Available base IDs in environment:');
      console.error(`  AIRTABLE_BASE_ID: ${process.env.AIRTABLE_BASE_ID}`);
    }
    throw error;
  }
}

inspectData().catch(error => {
  console.error('\nFatal error:', error);
  process.exit(1);
});
