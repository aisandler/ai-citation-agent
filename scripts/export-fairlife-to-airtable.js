#!/usr/bin/env node

/**
 * Export fairlife Audit to Airtable
 * Complete 5-table export with LLM citation mapping
 */

import dotenv from 'dotenv';
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

// ============================================================================
// FAIRLIFE AUDIT DATA
// ============================================================================

const auditData = {
  "brand_name": "fairlife",
  "category": "CPG protein drinks",
  "audit_date": "2025-10-29",
  "overall_score": 7.2,
  "trust_node_coverage": 16,
  "trust_node_percentage": 0.70,
  "citation_quality": 8.1,
  "ai_citation_rate": 1.00,
  "perplexity_rank": null,
  "chatgpt_rank": null,
  "gemini_rank": 2,
  "perplexity_cited": true,
  "chatgpt_cited": true,
  "gemini_cited": true,
  "status": "Complete",
  "executive_summary": "fairlife has strong AI visibility infrastructure (Wikipedia, high-quality citations, Tier 1 media) but inconsistent cross-platform performance reveals strategic gaps in lifestyle media coverage and recovery/performance positioning. Gemini ranked #2 (strong), Perplexity 66% visibility (moderate), ChatGPT mentioned but not ranked (weak).",
  "top_priority_1": "Secure ChatGPT-Optimized Lifestyle Media Coverage - Target Yahoo Health, SELF, Men's/Women's Health 'best protein shakes' lists",
  "top_priority_2": "Neutralize Negative Health Sentiment - Address Consumer Reports plastic chemical concerns and Illuminate Labs sweetener criticism",
  "top_priority_3": "Expand Seed Site Coverage - Target Forbes feature on $3B brand growth story",
  "next_audit_date": "2025-12-28"
};

const trustNodes = [
  { category: 'Knowledge Graph', node_name: 'Wikipedia', present: true, quality_score: 9.0, last_updated: '2025-09-21', url: 'https://en.wikipedia.org/wiki/Fairlife', notes: 'Comprehensive article with 22 citations, updated Sep 2025' },
  { category: 'Knowledge Graph', node_name: 'Wikidata', present: true, quality_score: 7.5, last_updated: null, url: 'https://www.wikidata.org/wiki/Q30314030', notes: 'Entity established, could expand property links' },
  { category: 'Knowledge Graph', node_name: 'Google Knowledge Panel', present: true, quality_score: 8.0, last_updated: null, url: null, notes: 'Inferred present from Wikipedia/Wikidata' },
  { category: 'Company Profile', node_name: 'LinkedIn Company', present: true, quality_score: 8.5, last_updated: null, url: 'https://www.linkedin.com/company/fairlife-llc', notes: 'Active page, 65K followers, recent posts' },
  { category: 'Company Profile', node_name: 'Bloomberg', present: true, quality_score: 9.5, last_updated: null, url: 'https://www.bloomberg.com/news/features/2025-02-10/coke-owned-fairlife-milk-is-soda-giant-s-fastest-growing-brand', notes: 'Feb 2025 feature, extensive coverage' },
  { category: 'Directory', node_name: 'Crunchbase', present: true, quality_score: 8.5, last_updated: null, url: 'https://www.crunchbase.com/organization/fairlife', notes: 'Well-maintained profile with acquisition history' },
  { category: 'Seed Site', node_name: 'Forbes', present: false, quality_score: null, last_updated: null, url: null, notes: 'Critical gap for $3B+ brand' },
  { category: 'Seed Site', node_name: 'Fast Company', present: true, quality_score: 9.0, last_updated: null, url: 'https://www.fastcompany.com/company/fairlife', notes: 'Consistent 2024-2025 coverage' },
  { category: 'Seed Site', node_name: 'Inc.com', present: true, quality_score: 4.0, last_updated: null, url: 'https://www.inc.com/associated-press/cokes-next-big-drink-its-called-milk.html', notes: 'Stale - last updated 2020' },
  { category: 'Seed Site', node_name: 'TechCrunch', present: true, quality_score: 2.0, last_updated: null, url: 'https://techcrunch.com/2019/02/20/companies-including-nestle-epic-and-reportedly-disney-suspend-youtube-ads-over-child-exploitation-concerns/', notes: 'Minimal - single 2019 mention' },
  { category: 'Review Platform', node_name: 'G2', present: false, quality_score: null, last_updated: null, url: null, notes: 'N/A - consumer CPG product' },
  { category: 'Review Platform', node_name: 'Capterra', present: false, quality_score: null, last_updated: null, url: null, notes: 'N/A - consumer CPG product' },
  { category: 'Review Platform', node_name: 'Trustpilot', present: false, quality_score: null, last_updated: null, url: null, notes: 'N/A - consumer CPG product' },
  { category: 'Review Platform', node_name: 'Software Advice', present: false, quality_score: null, last_updated: null, url: null, notes: 'N/A - consumer CPG product' },
  { category: 'Review Platform', node_name: 'GetApp', present: false, quality_score: null, last_updated: null, url: null, notes: 'N/A - consumer CPG product' },
  { category: 'Directory', node_name: 'Product Hunt', present: false, quality_score: null, last_updated: null, url: null, notes: 'N/A - consumer CPG product' }
];

const citations = [
  {
    source_url: 'https://www.bloomberg.com/news/features/2025-02-10/coke-owned-fairlife-milk-is-soda-giant-s-fastest-growing-brand',
    source_domain: 'bloomberg.com',
    source_title: 'Coke-Owned fairlife Milk Is Soda Giant\'s Fastest-Growing Brand',
    authority_score: 9.5,
    data_structure_score: 8.0,
    brand_alignment_score: 9.5,
    freshness_score: 10.0,
    cross_link_score: 8.5,
    overall_quality: 9.1,
    publication_date: '2025-02-10',
    cited_by_perplexity: false,
    cited_by_chatgpt: false,
    cited_by_gemini: false,
    notes: 'Tier 1 financial media, Feb 2025 feature article'
  },
  {
    source_url: 'https://en.wikipedia.org/wiki/Fairlife',
    source_domain: 'wikipedia.org',
    source_title: 'Fairlife',
    authority_score: 10.0,
    data_structure_score: 10.0,
    brand_alignment_score: 9.5,
    freshness_score: 10.0,
    cross_link_score: 10.0,
    overall_quality: 9.9,
    publication_date: '2025-09-21',
    cited_by_perplexity: false,
    cited_by_chatgpt: false,
    cited_by_gemini: false,
    notes: 'Knowledge graph foundation, 22 citations'
  },
  {
    source_url: 'https://www.linkedin.com/company/fairlife-llc',
    source_domain: 'linkedin.com',
    source_title: 'fairlife, LLC - Company Profile',
    authority_score: 8.5,
    data_structure_score: 9.5,
    brand_alignment_score: 10.0,
    freshness_score: 10.0,
    cross_link_score: 9.0,
    overall_quality: 9.4,
    publication_date: '2025-10-10',
    cited_by_perplexity: false,
    cited_by_chatgpt: false,
    cited_by_gemini: false,
    notes: 'Active company page, 65K followers'
  },
  {
    source_url: 'https://www.amazon.com/Fairlife-Nutrition-Protein-Shakes-Lactose-Free/dp/B0BYK9VZL2',
    source_domain: 'amazon.com',
    source_title: 'Fairlife Nutrition Protein Shakes - Pack of 12',
    authority_score: 8.0,
    data_structure_score: 9.5,
    brand_alignment_score: 9.0,
    freshness_score: 9.0,
    cross_link_score: 8.0,
    overall_quality: 8.7,
    publication_date: '2025-10-15',
    cited_by_perplexity: true,
    cited_by_chatgpt: false,
    cited_by_gemini: false,
    notes: 'E-commerce reviews, cited by Perplexity'
  },
  {
    source_url: 'https://www.garagegymreviews.com/fairlife-protein-shake-review',
    source_domain: 'garagegymreviews.com',
    source_title: 'Fairlife Nutrition Plan Shakes Review',
    authority_score: 6.5,
    data_structure_score: 8.5,
    brand_alignment_score: 9.0,
    freshness_score: 9.5,
    cross_link_score: 6.0,
    overall_quality: 7.9,
    publication_date: '2025-06-20',
    cited_by_perplexity: true,
    cited_by_chatgpt: false,
    cited_by_gemini: true,
    notes: 'Niche fitness review site, cited by 2 platforms'
  },
  {
    source_url: 'https://www.foodnetwork.com/healthyeats/fitness-and-wellness/best-protein-shakes',
    source_domain: 'foodnetwork.com',
    source_title: 'Best Ready-to-Drink Protein Shakes',
    authority_score: 9.0,
    data_structure_score: 8.0,
    brand_alignment_score: 10.0,
    freshness_score: 9.0,
    cross_link_score: 8.0,
    overall_quality: 8.8,
    publication_date: '2025-01-01',
    cited_by_perplexity: false,
    cited_by_chatgpt: true,
    cited_by_gemini: true,
    notes: 'Tier 1 lifestyle media, cited by ChatGPT and Gemini'
  },
  {
    source_url: 'https://www.eatingwell.com/article/7964007/best-protein-shakes-protein-powders/',
    source_domain: 'eatingwell.com',
    source_title: 'Best Protein Shakes and Protein Powders',
    authority_score: 8.5,
    data_structure_score: 9.0,
    brand_alignment_score: 9.5,
    freshness_score: 9.0,
    cross_link_score: 8.0,
    overall_quality: 8.8,
    publication_date: '2025-01-01',
    cited_by_perplexity: false,
    cited_by_chatgpt: false,
    cited_by_gemini: true,
    notes: 'Nutrition media authority, cited by Gemini'
  }
];

const llmResponses = [
  {
    platform: 'Perplexity',
    query_type: 'Evaluative',
    query_text: 'What are the top CPG protein drinks in 2025?',
    brand_cited: true,
    brand_rank: null,
    brand_context: 'Listed as \'Best Budget\' alongside Premier Protein, not in primary ranked table',
    citations_found: 8,
    competitor_1: 'Jocko Molk',
    competitor_1_rank: 1,
    competitor_2: 'Core Power Elite',
    competitor_2_rank: 3,
    competitor_3: 'Premier Protein',
    competitor_3_rank: 4,
    response_summary: 'fairlife positioned as budget option but excluded from primary rankings. Needs expert reviews beyond budget category.'
  },
  {
    platform: 'Perplexity',
    query_type: 'Comparative',
    query_text: 'Best protein drinks for post-workout recovery',
    brand_cited: false,
    brand_rank: null,
    brand_context: 'Not mentioned. Recovery query emphasized whey isolate/casein formulations.',
    citations_found: 6,
    competitor_1: 'Transparent Labs Whey Protein Isolate',
    competitor_1_rank: 1,
    competitor_2: 'Legion Casein+',
    competitor_2_rank: 2,
    competitor_3: 'Momentous Essential Grass-Fed Whey',
    competitor_3_rank: 3,
    response_summary: 'fairlife absent from recovery-focused query. Gap: needs recovery-specific positioning and content.'
  },
  {
    platform: 'Perplexity',
    query_type: 'Brand-Specific',
    query_text: 'fairlife reviews and credentials',
    brand_cited: true,
    brand_rank: 1,
    brand_context: 'Comprehensive overview: 4.7/5 rating, certifications, balanced controversy coverage',
    citations_found: 14,
    competitor_1: null,
    competitor_1_rank: null,
    competitor_2: null,
    competitor_2_rank: null,
    competitor_3: null,
    competitor_3_rank: null,
    response_summary: 'Strong brand-specific results with 14 citations. Knowledge graph present. 2020 animal welfare incident still prominent in 4/14 citations.'
  },
  {
    platform: 'ChatGPT',
    query_type: 'Evaluative',
    query_text: 'What are the top CPG protein drinks in 2025?',
    brand_cited: true,
    brand_rank: null,
    brand_context: 'Mentioned only in Reddit consumer quote, not in top 6 rankings',
    citations_found: 8,
    competitor_1: 'Premier Protein',
    competitor_1_rank: 1,
    competitor_2: 'Core Power',
    competitor_2_rank: 2,
    competitor_3: 'Oikos',
    competitor_3_rank: 3,
    response_summary: 'Weakest performance. Not ranked in top 6. Gap: missing Tier 1 lifestyle media citations (foodnetwork, Yahoo Health, SELF) that drove competitor rankings.'
  },
  {
    platform: 'ChatGPT',
    query_type: 'Comparative',
    query_text: 'Best protein drinks for post-workout recovery',
    brand_cited: false,
    brand_rank: null,
    brand_context: 'Not mentioned in recovery-focused query',
    citations_found: 7,
    competitor_1: 'Core Power Elite',
    competitor_1_rank: 1,
    competitor_2: 'Premier Protein',
    competitor_2_rank: 2,
    competitor_3: 'Muscle Milk Pro Series',
    competitor_3_rank: 3,
    response_summary: 'Absent from recovery positioning. Competitors cited based on fitness media and Reddit recovery discussions.'
  },
  {
    platform: 'ChatGPT',
    query_type: 'Brand-Specific',
    query_text: 'fairlife reviews and credentials',
    brand_cited: true,
    brand_rank: 1,
    brand_context: 'Comprehensive brand profile with product details, nutritional info, pricing',
    citations_found: 6,
    competitor_1: null,
    competitor_1_rank: null,
    competitor_2: null,
    competitor_2_rank: null,
    competitor_3: null,
    competitor_3_rank: null,
    response_summary: 'Strong brand-specific query performance. Food Network citation drove positive positioning.'
  },
  {
    platform: 'Gemini',
    query_type: 'Evaluative',
    query_text: 'What are the top CPG protein drinks in 2025?',
    brand_cited: true,
    brand_rank: 2,
    brand_context: 'Ranked #2 with strong description: \'ultra-filtered milk, 26g+ protein, lactose-free\'',
    citations_found: 9,
    competitor_1: 'Premier Protein',
    competitor_1_rank: 1,
    competitor_2: 'OWYN',
    competitor_2_rank: 3,
    competitor_3: 'Orgain',
    competitor_3_rank: 4,
    response_summary: 'Best performance across all platforms. Strong Tier 1 nutrition media support (Food Network \'Best Overall\', EatingWell dietitian review).'
  },
  {
    platform: 'Gemini',
    query_type: 'Comparative',
    query_text: 'Best protein drinks for post-workout recovery',
    brand_cited: true,
    brand_rank: 3,
    brand_context: 'Listed as recovery option with \'fast-absorbing protein\' positioning',
    citations_found: 8,
    competitor_1: 'Core Power Elite',
    competitor_1_rank: 1,
    competitor_2: 'Premier Protein',
    competitor_2_rank: 2,
    competitor_3: null,
    competitor_3_rank: null,
    response_summary: 'Strong recovery positioning. Garage Gym Reviews fitness citation helped secure ranking.'
  },
  {
    platform: 'Gemini',
    query_type: 'Brand-Specific',
    query_text: 'fairlife reviews and credentials',
    brand_cited: true,
    brand_rank: 1,
    brand_context: 'Detailed brand overview with product line, nutrition, certifications',
    citations_found: 12,
    competitor_1: null,
    competitor_1_rank: null,
    competitor_2: null,
    competitor_2_rank: null,
    competitor_3: null,
    competitor_3_rank: null,
    response_summary: 'Comprehensive brand-specific response. Wikipedia, EatingWell, Food Network all cited. 2020 controversy mentioned but balanced with positive credentials.'
  }
];

const priorities = [
  {
    priority_level: 'Immediate',
    title: 'Secure ChatGPT-Optimized Lifestyle Media Coverage',
    description: 'Target Yahoo Health, SELF, Men\'s/Women\'s Health \'best protein shakes\' 2025 lists. ChatGPT ranked competitors #1-6 based on these exact sources; fairlife only appeared in Reddit quote.',
    impact: 'High',
    effort: 'Medium',
    timeline: '4-6 weeks',
    status: 'Not Started',
    assigned_to: null,
    due_date: '2025-12-15',
    completed_date: null,
    notes: 'Pitch for product testing inclusion in Q4 2025/Q1 2026 roundups'
  },
  {
    priority_level: 'Immediate',
    title: 'Neutralize Negative Health Sentiment',
    description: 'Address Consumer Reports plastic chemical concerns (24,928 ng/serving phthalates) and Illuminate Labs 3/10 rating on artificial sweeteners. Commission independent testing, publish transparent response.',
    impact: 'High',
    effort: 'High',
    timeline: '8-12 weeks',
    status: 'Not Started',
    assigned_to: null,
    due_date: '2026-01-31',
    completed_date: null,
    notes: 'Request Consumer Reports follow-up or generate 3+ positive health citations'
  },
  {
    priority_level: 'Immediate',
    title: 'Expand Seed Site Coverage - Target Forbes',
    description: 'Pitch Forbes for feature: \'How Coca-Cola Built a $3B Dairy Brand by Reinventing Milk\'. Missing tier-1 business authority limits B2B credibility signals.',
    impact: 'Medium',
    effort: 'Medium',
    timeline: '6-8 weeks',
    status: 'Not Started',
    assigned_to: null,
    due_date: '2025-12-31',
    completed_date: null,
    notes: 'Target Q4 2025 or Q1 2026 publication with 22% CAGR data'
  }
];

// ============================================================================
// AIRTABLE EXPORT FUNCTIONS
// ============================================================================

async function createAuditRecord() {
  const url = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/Audit_Runs`;

  const record = {
    fields: auditData
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
  console.log('✓ Created Audit_Runs record:', data.id);
  return data.id;
}

async function createTrustNodeRecords(auditId) {
  const url = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/Trust_Nodes`;

  const records = trustNodes.map(node => ({
    fields: {
      ...node,
      audit: [auditId]
    }
  }));

  let created = 0;

  // Batch create (max 10 at a time)
  for (let i = 0; i < records.length; i += 10) {
    const batch = records.slice(i, i + 10);

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
    created += data.records.length;
  }

  console.log(`✓ Created ${created} Trust_Nodes records`);
  return created;
}

async function createCitationRecords(auditId) {
  const url = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/Citations`;

  const records = citations.map(citation => ({
    fields: {
      ...citation,
      audit: [auditId]
    }
  }));

  let created = 0;

  // Batch create (max 10 at a time)
  for (let i = 0; i < records.length; i += 10) {
    const batch = records.slice(i, i + 10);

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
      throw new Error(`Failed to create citation records: ${error}`);
    }

    const data = await response.json();
    created += data.records.length;
  }

  console.log(`✓ Created ${created} Citations records`);
  return created;
}

async function createLLMResponseRecords(auditId) {
  const url = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/LLM_Responses`;

  const records = llmResponses.map(response => ({
    fields: {
      ...response,
      audit: [auditId]
    }
  }));

  let created = 0;

  for (let i = 0; i < records.length; i += 10) {
    const batch = records.slice(i, i + 10);

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
      throw new Error(`Failed to create LLM response records: ${error}`);
    }

    const data = await response.json();
    created += data.records.length;
  }

  console.log(`✓ Created ${created} LLM_Responses records`);
  return created;
}

async function createPriorityRecords(auditId) {
  const url = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/Priorities`;

  const records = priorities.map(priority => ({
    fields: {
      ...priority,
      audit: [auditId]
    }
  }));

  let created = 0;

  for (let i = 0; i < records.length; i += 10) {
    const batch = records.slice(i, i + 10);

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
      throw new Error(`Failed to create priority records: ${error}`);
    }

    const data = await response.json();
    created += data.records.length;
  }

  console.log(`✓ Created ${created} Priorities records`);
  return created;
}

// ============================================================================
// MAIN EXECUTION
// ============================================================================

async function main() {
  console.log('\n📊 FAIRLIFE AUDIT EXPORT TO AIRTABLE');
  console.log('====================================\n');

  try {
    console.log('Step 1: Creating main audit record...');
    const auditId = await createAuditRecord();

    console.log('\nStep 2: Creating trust node records...');
    const trustNodeCount = await createTrustNodeRecords(auditId);

    console.log('\nStep 3: Creating citation records...');
    const citationCount = await createCitationRecords(auditId);

    console.log('\nStep 4: Creating LLM response records...');
    const llmResponseCount = await createLLMResponseRecords(auditId);

    console.log('\nStep 5: Creating priority records...');
    const priorityCount = await createPriorityRecords(auditId);

    console.log('\n✅ AUDIT DATA SAVED TO AIRTABLE\n');
    console.log('Summary:');
    console.log(`- Brand: ${auditData.brand_name}`);
    console.log(`- Audit Date: ${auditData.audit_date}`);
    console.log(`- Overall Score: ${auditData.overall_score}/10`);
    console.log('');
    console.log('Records Created:');
    console.log(`✓ 1 audit run (ID: ${auditId})`);
    console.log(`✓ ${trustNodeCount} trust nodes`);
    console.log(`✓ ${citationCount} citations`);
    console.log(`✓ ${llmResponseCount} LLM responses (3 Perplexity, 3 ChatGPT, 3 Gemini)`);
    console.log(`✓ ${priorityCount} priorities`);
    console.log('');
    console.log('View in Airtable:');
    console.log(`https://airtable.com/${AIRTABLE_BASE_ID}`);
    console.log('');
    console.log('Next Steps:');
    console.log('- Review priorities in Airtable');
    console.log('- Assign owners to action items');
    console.log(`- Schedule next audit for ${auditData.next_audit_date}`);
    console.log('');

  } catch (error) {
    console.error('\n❌ Export failed:', error.message);
    process.exit(1);
  }
}

main();
