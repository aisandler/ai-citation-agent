#!/usr/bin/env node

/**
 * Export Mad Mutz Audit to Airtable
 * Simple script to upload audit data to existing Airtable schema
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

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

// Read audit data
const auditFilePath = path.join(__dirname, '../exports/mad-mutz-audit-export.json');
const auditData = JSON.parse(fs.readFileSync(auditFilePath, 'utf8'));

// Airtable API helper
function makeRequest(method, tableName, data = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.airtable.com',
      port: 443,
      path: `/v0/${BASE_ID}/${encodeURIComponent(tableName)}`,
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
        try {
          const response = JSON.parse(body);
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve(response);
          } else {
            reject(new Error(`HTTP ${res.statusCode}: ${JSON.stringify(response)}`));
          }
        } catch (e) {
          reject(new Error(`Failed to parse response: ${body}`));
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

async function exportAudit() {
  console.log('📊 Mad Mutz AI Visibility Audit - Export to Airtable');
  console.log('=====================================================\n');

  try {
    // Create main audit record
    console.log('1️⃣ Creating audit record...');

    const auditRecord = {
      fields: {
        'brand_name': 'Mad Mutz',
        'category': 'CPG/FMCG - Frozen Snack Foods',
        'audit_date': '2025-10-28',
        'overall_score': 2.3,
        'trust_node_coverage': 8,
        'trust_node_percentage': 0.533,
        'citation_quality': 6.9,
        'ai_citation_rate': 0,
        'perplexity_cited': false,
        'chatgpt_cited': false,
        'gemini_cited': false,
        'status': 'Complete',
        'executive_summary': 'Zero AI visibility despite Shark Tank success. Missing foundational trust nodes (Wikipedia, Wikidata, reviews). Indexed but invisible - Perplexity found website but did not cite due to lack of third-party validation.',
        'top_priority_1': 'Send samples to Allrecipes, Sporked, Cheapism for taste test inclusion (~$500, 60-90 days)',
        'top_priority_2': 'Launch Amazon with rich product data + reviews ($1-2K, 30-60 days)',
        'top_priority_3': 'Create Wikidata entity + Organization schema + Google Business Profile ($0, 7-14 days)',
        'next_audit_date': '2025-12-27'
      }
    };

    const audit = await makeRequest('POST', 'Audit_Runs', auditRecord);
    console.log(`✅ Created audit record: ${audit.id}\n`);

    const auditRecordId = audit.id;

    // Create trust node records
    console.log('2️⃣ Creating trust node records...');

    const trustNodes = [
      { category: 'Knowledge Graph', node_name: 'Wikipedia', present: false, notes: 'Missing - blocks LLM knowledge graph presence' },
      { category: 'Knowledge Graph', node_name: 'Wikidata', present: false, notes: 'Missing - need to create entity immediately' },
      { category: 'Knowledge Graph', node_name: 'Google Knowledge Panel', present: false, notes: 'Missing - will auto-generate after Wikipedia + reviews' },
      { category: 'Company Profile', node_name: 'LinkedIn Company', present: false, notes: 'Missing - only founder profile exists' },
      { category: 'Seed Site', node_name: 'TechCrunch', present: false, notes: 'Need food authority coverage (Food52, Serious Eats, Bon Appétit)' },
      { category: 'News & PR', node_name: 'Google News', present: true, quality_score: 8.0, url: 'https://www.inquirer.com/life/mad-mutz-mozzarella-sticks-shark-tank-atlantic-city-20250421.html', notes: 'Philadelphia Inquirer + NJ Biz + regional coverage' }
    ];

    const trustNodeRecords = trustNodes.map(node => ({
      fields: {
        audit: [auditRecordId],
        ...node
      }
    }));

    for (const record of trustNodeRecords) {
      await makeRequest('POST', 'Trust_Nodes', record);
    }

    console.log(`✅ Created ${trustNodes.length} trust node records\n`);

    // Create citation records
    console.log('3️⃣ Creating citation records...');

    const citations = [
      {
        source_url: 'https://www.inquirer.com/life/mad-mutz-mozzarella-sticks-shark-tank-atlantic-city-20250421.html',
        source_domain: 'inquirer.com',
        source_title: 'Atlantic City mozzarella stick brand Mad Mutz lands Shark Tank deal',
        authority_score: 8,
        data_structure_score: 6,
        brand_alignment_score: 9,
        freshness_score: 10,
        cross_link_score: 7,
        overall_quality: 8.0,
        publication_date: '2025-04-21',
        cited_by_perplexity: true
      },
      {
        source_url: 'https://njbiz.com/shark-tank-seals-deal-with-ac-mozzarella-sticks-brand/',
        source_domain: 'njbiz.com',
        source_title: 'Shark Tank seals deal with AC mozzarella sticks brand',
        authority_score: 7,
        data_structure_score: 5,
        brand_alignment_score: 9,
        freshness_score: 10,
        cross_link_score: 6,
        overall_quality: 7.4,
        publication_date: '2025-04'
      }
    ];

    const citationRecords = citations.map(cit => ({
      fields: {
        audit: [auditRecordId],
        ...cit
      }
    }));

    for (const record of citationRecords) {
      await makeRequest('POST', 'Citations', record);
    }

    console.log(`✅ Created ${citations.length} citation records\n`);

    // Create LLM query records
    console.log('4️⃣ Creating LLM query records...');

    const queries = [
      {
        platform: 'Perplexity',
        query_text: 'What are the top frozen snack foods in 2025?',
        query_type: 'Evaluative - Category',
        brand_mentioned: false,
        brand_position: null,
        citations_count: 12,
        top_competitor: 'General Mills',
        key_finding: 'Not mentioned - need industry trade coverage'
      },
      {
        platform: 'Perplexity',
        query_text: 'Best gourmet mozzarella sticks for home cooking',
        query_type: 'Comparative',
        brand_mentioned: false,
        brand_position: null,
        citations_count: 15,
        top_competitor: 'Big Mozz Sticks',
        key_finding: 'INDEXED BUT INVISIBLE - found website but did not cite, needs third-party validation'
      },
      {
        platform: 'Perplexity',
        query_text: 'Mad Mutz mozzarella sticks reviews and credentials',
        query_type: 'Brand-Specific',
        brand_mentioned: true,
        brand_position: 1,
        citations_count: 6,
        key_finding: 'Comprehensive brand profile - Philadelphia Inquirer anchors credibility'
      },
      {
        platform: 'ChatGPT',
        query_text: 'What are the best gourmet mozzarella sticks for home cooking in 2025?',
        query_type: 'Evaluative',
        brand_mentioned: false,
        brand_position: null,
        citations_count: 3,
        top_competitor: 'Feel Good Foods',
        key_finding: 'Not mentioned - Allrecipes taste test was THE defining citation'
      },
      {
        platform: 'Gemini',
        query_text: 'What are the best gourmet mozzarella sticks for home cooking in 2025?',
        query_type: 'Evaluative',
        brand_mentioned: false,
        brand_position: null,
        citations_count: 0,
        top_competitor: 'Big Mozz Sticks',
        key_finding: 'Not mentioned - based on 2023-2024 training data, not real-time search'
      }
    ];

    const queryRecords = queries.map(q => ({
      fields: {
        audit: [auditRecordId],
        ...q
      }
    }));

    for (const record of queryRecords) {
      await makeRequest('POST', 'LLM_Queries', record);
    }

    console.log(`✅ Created ${queries.length} LLM query records\n`);

    // Create action item records
    console.log('5️⃣ Creating action item records...');

    const actions = [
      {
        priority: 'Immediate',
        action_item: 'Send product samples to Allrecipes, Sporked, Cheapism for taste test inclusion',
        status: 'Not Started',
        timeline: '60-90 days',
        estimated_cost: '$500',
        impact: 'Unlock ChatGPT + Perplexity visibility (highest leverage intervention)',
        responsible: 'Marketing/PR team'
      },
      {
        priority: 'Immediate',
        action_item: 'Launch Amazon Seller account with product listings, reviews enabled',
        status: 'Not Started',
        timeline: '30-60 days',
        estimated_cost: '$1,000-$2,000',
        impact: 'ChatGPT product catalog citations + retail validation',
        responsible: 'E-commerce team'
      },
      {
        priority: 'Immediate',
        action_item: 'Create Wikidata entity + Organization schema + Google Business Profile',
        status: 'Not Started',
        timeline: '7-14 days',
        estimated_cost: '$0',
        impact: 'Machine-readable brand foundation for all LLMs',
        responsible: 'Marketing/Tech team'
      },
      {
        priority: 'Strategic',
        action_item: 'Pitch Food52 "Meet the Maker" series (replicate Big Mozz success)',
        status: 'Not Started',
        timeline: '90-180 days',
        estimated_cost: '$500-$1,000',
        impact: 'Editorial narrative that LLMs cite for brand credibility',
        responsible: 'PR team'
      },
      {
        priority: 'Strategic',
        action_item: 'Send Recipe Development Kits to 10-15 food bloggers',
        status: 'Not Started',
        timeline: '60-90 days',
        estimated_cost: '$500-$1,000',
        impact: 'Recipe integration citations (Perplexity cited Lil\' Luna, Pioneer Woman)',
        responsible: 'Marketing/Influencer team'
      }
    ];

    const actionRecords = actions.map(a => ({
      fields: {
        audit: [auditRecordId],
        ...a
      }
    }));

    for (const record of actionRecords) {
      await makeRequest('POST', 'Action_Items', record);
    }

    console.log(`✅ Created ${actions.length} action item records\n`);

    console.log('✅ Export complete!');
    console.log(`\n📊 View your audit in Airtable:`);
    console.log(`   https://airtable.com/${BASE_ID}\n`);

  } catch (error) {
    console.error('\n❌ Export failed:', error.message);
    process.exit(1);
  }
}

exportAudit();
