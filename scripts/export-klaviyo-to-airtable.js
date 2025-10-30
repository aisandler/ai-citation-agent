#!/usr/bin/env node

/**
 * Export Klaviyo Audit to Airtable
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
// KLAVIYO AUDIT DATA
// ============================================================================

const auditData = {
  "brand_name": "Klaviyo",
  "category": "Email CRM and campaign platform",
  "audit_date": "2025-10-29",
  "overall_score": 7.9,
  "trust_node_coverage": 27,
  "trust_node_percentage": 0.93,
  "citation_quality": 7.8,
  "ai_citation_rate": 0.67,
  "perplexity_rank": 2,
  "chatgpt_rank": 5,
  "gemini_rank": null,
  "perplexity_cited": true,
  "chatgpt_cited": true,
  "gemini_cited": false,
  "status": "Complete",
  "executive_summary": "Klaviyo has world-class infrastructure for AI visibility (trust nodes, citations) but is held back by narrow positioning. LLMs see it as 'e-commerce-only' rather than comprehensive platform, resulting in mixed rankings across queries.",
  "top_priority_1": "Break Out of 'E-commerce-Only' Positioning - Update positioning on G2/Capterra, create comparison content for broader use cases",
  "top_priority_2": "Secure Forbes Coverage - Pitch Forbes Cloud 100, IPO success story, or founder profile",
  "top_priority_3": "Launch Trustpilot Reputation Management Campaign - Respond to negative reviews, launch customer success campaign",
  "next_audit_date": "2025-12-28"
};

const trustNodes = [
  { category: 'Knowledge Graph', node_name: 'Wikipedia', present: true, quality_score: 9, last_updated: null, url: 'https://en.wikipedia.org/wiki/Klaviyo', notes: 'Comprehensive article with company history, funding, products' },
  { category: 'Knowledge Graph', node_name: 'Wikidata', present: true, quality_score: 8, last_updated: null, url: null, notes: 'Basic entity record with founding data' },
  { category: 'Knowledge Graph', node_name: 'Google Knowledge Panel', present: false, quality_score: null, last_updated: null, url: null, notes: 'Unverified - may exist but not confirmed in audit' },
  { category: 'Review Platform', node_name: 'G2', present: true, quality_score: 9, last_updated: null, url: 'https://www.g2.com/products/klaviyo/reviews', notes: '4.6/5 rating, 1,200+ reviews, Leader badge' },
  { category: 'Review Platform', node_name: 'Capterra', present: true, quality_score: 9, last_updated: null, url: 'https://www.capterra.com/p/156699/Klaviyo/', notes: '4.6/5 rating, high reviewer count' },
  { category: 'Review Platform', node_name: 'Trustpilot', present: true, quality_score: 5, last_updated: null, url: 'https://www.trustpilot.com/review/klaviyo.com', notes: 'Polarized reviews: 70% positive, 30% negative. Needs reputation management.' },
  { category: 'Review Platform', node_name: 'Software Advice', present: true, quality_score: 8, last_updated: null, url: 'https://www.softwareadvice.com/marketing-automation/klaviyo-profile/', notes: 'Comprehensive profile with ratings' },
  { category: 'Review Platform', node_name: 'GetApp', present: true, quality_score: 7, last_updated: null, url: null, notes: 'Basic profile present' },
  { category: 'Directory', node_name: 'Crunchbase', present: true, quality_score: 10, last_updated: null, url: 'https://www.crunchbase.com/organization/klaviyo', notes: 'Complete funding history, IPO data, structured company info' },
  { category: 'Directory', node_name: 'Product Hunt', present: true, quality_score: 7, last_updated: null, url: 'https://www.producthunt.com/products/klaviyo', notes: 'Basic listing, somewhat outdated' },
  { category: 'Directory', node_name: 'AngelList', present: true, quality_score: 8, last_updated: null, url: null, notes: 'Company profile with jobs/funding info' },
  { category: 'Directory', node_name: 'Built With', present: true, quality_score: 8, last_updated: null, url: null, notes: 'Technology stack tracking' },
  { category: 'Company Profile', node_name: 'LinkedIn Company', present: true, quality_score: 9, last_updated: null, url: 'https://www.linkedin.com/company/klaviyo', notes: 'Active company page, employee profiles, regular updates' },
  { category: 'Company Profile', node_name: 'Bloomberg', present: true, quality_score: 9, last_updated: null, url: null, notes: 'Public company profile with financial data' },
  { category: 'News & PR', node_name: 'Google News', present: true, quality_score: 9, last_updated: null, url: null, notes: 'Recent Q1 2025 earnings coverage' },
  { category: 'News & PR', node_name: 'TechCrunch', present: true, quality_score: 10, last_updated: null, url: 'https://techcrunch.com/2021/04/19/klaviyo-ec1/', notes: 'EC-1 deep dive + IPO analysis + multiple articles' },
  { category: 'News & PR', node_name: 'VentureBeat', present: true, quality_score: 8, last_updated: null, url: null, notes: 'Multiple articles including AI agent launch' },
  { category: 'News & PR', node_name: 'Forbes', present: false, quality_score: null, last_updated: null, url: null, notes: 'CRITICAL GAP - No Forbes coverage despite public company status' },
  { category: 'News & PR', node_name: 'Inc.com', present: true, quality_score: 7, last_updated: null, url: null, notes: 'Occasional mentions in roundups' },
  { category: 'News & PR', node_name: 'Fast Company', present: true, quality_score: 7, last_updated: null, url: null, notes: 'Innovation coverage' },
  { category: 'Seed Site', node_name: 'TechCrunch', present: true, quality_score: 10, last_updated: null, url: 'https://techcrunch.com/2021/04/19/klaviyo-ec1/', notes: 'Flagship EC-1 series coverage' },
  { category: 'Seed Site', node_name: 'VentureBeat', present: true, quality_score: 8, last_updated: null, url: null, notes: 'Regular technology coverage' },
  { category: 'Seed Site', node_name: 'Forbes', present: false, quality_score: null, last_updated: null, url: null, notes: 'ABSENT - top priority to secure' },
  { category: 'Seed Site', node_name: 'Inc.com', present: true, quality_score: 7, last_updated: null, url: null, notes: 'Periodic coverage' },
  { category: 'Seed Site', node_name: 'Fast Company', present: true, quality_score: 7, last_updated: null, url: null, notes: 'Innovation/design coverage' },
  { category: 'News & PR', node_name: 'TechCrunch', present: true, quality_score: 10, last_updated: '2023-09-20', url: 'https://techcrunch.com/2023/09/20/klaviyos-ipo-pricing-analysis/', notes: 'IPO coverage 2023' },
  { category: 'News & PR', node_name: 'TechCrunch', present: true, quality_score: 10, last_updated: '2025-01-01', url: null, notes: 'AI agent launch coverage Q1 2025' }
];

const citations = [
  {
    source_url: 'https://www.g2.com/products/klaviyo/reviews',
    source_domain: 'g2.com',
    source_title: 'Klaviyo Reviews 2025',
    authority_score: 9,
    data_structure_score: 9,
    brand_alignment_score: 9,
    freshness_score: 9,
    cross_link_score: 8,
    overall_quality: 8.8,
    publication_date: null,
    cited_by_perplexity: true,
    cited_by_chatgpt: false,
    cited_by_gemini: false,
    notes: 'Highly cited by Perplexity, rich structured data'
  },
  {
    source_url: 'https://www.capterra.com/p/156699/Klaviyo/',
    source_domain: 'capterra.com',
    source_title: 'Klaviyo Software Reviews & Ratings',
    authority_score: 9,
    data_structure_score: 8,
    brand_alignment_score: 9,
    freshness_score: 9,
    cross_link_score: 8,
    overall_quality: 8.6,
    publication_date: null,
    cited_by_perplexity: true,
    cited_by_chatgpt: false,
    cited_by_gemini: false,
    notes: 'Strong review platform citation'
  },
  {
    source_url: 'https://www.trustpilot.com/review/klaviyo.com',
    source_domain: 'trustpilot.com',
    source_title: 'Klaviyo Reviews - Trustpilot',
    authority_score: 8,
    data_structure_score: 7,
    brand_alignment_score: 4,
    freshness_score: 9,
    cross_link_score: 6,
    overall_quality: 6.8,
    publication_date: null,
    cited_by_perplexity: false,
    cited_by_chatgpt: false,
    cited_by_gemini: false,
    notes: 'Negative brand alignment due to 30% negative reviews'
  },
  {
    source_url: 'https://www.softwareadvice.com/marketing-automation/klaviyo-profile/',
    source_domain: 'softwareadvice.com',
    source_title: 'Klaviyo - Software Advice',
    authority_score: 8,
    data_structure_score: 8,
    brand_alignment_score: 8,
    freshness_score: 8,
    cross_link_score: 7,
    overall_quality: 7.8,
    publication_date: null,
    cited_by_perplexity: false,
    cited_by_chatgpt: false,
    cited_by_gemini: false,
    notes: 'Comprehensive profile'
  },
  {
    source_url: 'https://techcrunch.com/2021/04/19/klaviyo-ec1/',
    source_domain: 'techcrunch.com',
    source_title: 'Klaviyo EC-1: How a Boston startup became a marketing automation powerhouse',
    authority_score: 10,
    data_structure_score: 7,
    brand_alignment_score: 9,
    freshness_score: 7,
    cross_link_score: 9,
    overall_quality: 8.4,
    publication_date: '2021-04-19',
    cited_by_perplexity: false,
    cited_by_chatgpt: false,
    cited_by_gemini: false,
    notes: 'Flagship deep-dive coverage, somewhat dated'
  },
  {
    source_url: 'https://techcrunch.com/2023/09/20/klaviyos-ipo-pricing-analysis/',
    source_domain: 'techcrunch.com',
    source_title: "Klaviyo's IPO: A Pricing Analysis",
    authority_score: 10,
    data_structure_score: 6,
    brand_alignment_score: 9,
    freshness_score: 9,
    cross_link_score: 8,
    overall_quality: 8.4,
    publication_date: '2023-09-20',
    cited_by_perplexity: false,
    cited_by_chatgpt: false,
    cited_by_gemini: false,
    notes: 'Recent IPO analysis'
  },
  {
    source_url: 'https://en.wikipedia.org/wiki/Klaviyo',
    source_domain: 'wikipedia.org',
    source_title: 'Klaviyo - Wikipedia',
    authority_score: 10,
    data_structure_score: 9,
    brand_alignment_score: 8,
    freshness_score: 8,
    cross_link_score: 9,
    overall_quality: 8.8,
    publication_date: null,
    cited_by_perplexity: false,
    cited_by_chatgpt: false,
    cited_by_gemini: false,
    notes: 'Strong knowledge graph foundation, NOT cited by any LLM'
  },
  {
    source_url: 'https://www.crunchbase.com/organization/klaviyo',
    source_domain: 'crunchbase.com',
    source_title: 'Klaviyo - Crunchbase Company Profile',
    authority_score: 9,
    data_structure_score: 10,
    brand_alignment_score: 8,
    freshness_score: 9,
    cross_link_score: 9,
    overall_quality: 9.0,
    publication_date: null,
    cited_by_perplexity: false,
    cited_by_chatgpt: false,
    cited_by_gemini: false,
    notes: 'Best structured data source, perfect for entity recognition'
  },
  {
    source_url: 'https://www.producthunt.com/products/klaviyo',
    source_domain: 'producthunt.com',
    source_title: 'Klaviyo - Product Hunt',
    authority_score: 7,
    data_structure_score: 7,
    brand_alignment_score: 7,
    freshness_score: 6,
    cross_link_score: 6,
    overall_quality: 6.6,
    publication_date: null,
    cited_by_perplexity: false,
    cited_by_chatgpt: false,
    cited_by_gemini: false,
    notes: 'Somewhat outdated listing'
  },
  {
    source_url: 'https://www.linkedin.com/company/klaviyo',
    source_domain: 'linkedin.com',
    source_title: 'Klaviyo | LinkedIn',
    authority_score: 9,
    data_structure_score: 8,
    brand_alignment_score: 8,
    freshness_score: 9,
    cross_link_score: 7,
    overall_quality: 8.2,
    publication_date: null,
    cited_by_perplexity: false,
    cited_by_chatgpt: false,
    cited_by_gemini: false,
    notes: 'Active professional presence'
  }
];

const llmResponses = [
  {
    platform: 'Perplexity',
    query_type: 'Evaluative',
    query_text: 'What are the top email marketing platforms in 2025?',
    brand_cited: true,
    brand_rank: null,
    brand_context: "Mentioned contextually as 'Omnisend and Klaviyo are best for e-commerce' but excluded from main ranking table",
    citations_found: 8,
    competitor_1: 'MailerLite',
    competitor_1_rank: 1,
    competitor_2: 'Brevo',
    competitor_2_rank: 2,
    competitor_3: 'ActiveCampaign',
    competitor_3_rank: 3,
    response_summary: 'Klaviyo mentioned only in e-commerce context, not ranked in main table. Competitors emphasized for free plans and broad use cases.'
  },
  {
    platform: 'Perplexity',
    query_type: 'Comparative',
    query_text: 'Best email CRM for e-commerce businesses',
    brand_cited: true,
    brand_rank: 2,
    brand_context: "Ranked #2 with dedicated paragraph: 'Klaviyo CRM specializes in e-commerce and direct-to-consumer brands. It provides email and SMS marketing capabilities combined with AI-powered product recommendations and advanced segmentation features.'",
    citations_found: 13,
    competitor_1: 'HubSpot CRM',
    competitor_1_rank: 1,
    competitor_2: 'ActiveCampaign',
    competitor_2_rank: 3,
    competitor_3: 'MailerLite',
    competitor_3_rank: 4,
    response_summary: 'Strong #2 positioning in e-commerce CRM context. HubSpot positioned as "most comprehensive" but Klaviyo highlighted for DTC/Shopify specialization.'
  },
  {
    platform: 'Perplexity',
    query_type: 'Brand-Specific',
    query_text: 'Klaviyo reviews and credentials',
    brand_cited: true,
    brand_rank: 1,
    brand_context: "Primary subject with comprehensive coverage: 'Klaviyo is a highly-regarded platform that helps B2C businesses manage customer relationships through email, SMS, web, and reviews. More than 146,000 businesses rely on Klaviyo to grow their revenue.'",
    citations_found: 16,
    competitor_1: null,
    competitor_1_rank: null,
    competitor_2: null,
    competitor_2_rank: null,
    competitor_3: null,
    competitor_3_rank: null,
    response_summary: 'Dominant brand-specific performance. G2, Capterra, credential portal heavily cited. Comprehensive profile including customer base, ratings, features, certifications.'
  },
  {
    platform: 'ChatGPT',
    query_type: 'Evaluative',
    query_text: 'What are the top email CRM platforms in 2025?',
    brand_cited: true,
    brand_rank: 5,
    brand_context: "Listed as #5 in top 10 ranking. Described as 'top choice for e-commerce businesses' with 'sophisticated CRM solution' featuring 'deep integration with e-commerce platforms and data-driven insights ideal for growing online stores.'",
    citations_found: 0,
    competitor_1: 'HubSpot',
    competitor_1_rank: 1,
    competitor_2: 'ActiveCampaign',
    competitor_2_rank: 2,
    competitor_3: 'Salesforce Marketing Cloud',
    competitor_3_rank: 3,
    response_summary: 'Ranked #5 of 10. NO citations displayed despite search mode enabled. Niche e-commerce positioning may have limited rank vs. general-purpose platforms.'
  }
];

const priorities = [
  {
    priority_level: 'Immediate',
    title: 'Break Out of "E-commerce-Only" Positioning',
    description: 'Update positioning on G2/Capterra from "Best for: E-commerce" to "Best for: B2C businesses scaling customer relationships". Create comparison content showing use cases beyond e-commerce: subscription services, membership organizations, B2C SaaS.',
    impact: 'High',
    effort: 'Medium',
    timeline: '2-4 weeks',
    status: 'Not Started',
    assigned_to: null,
    due_date: null,
    completed_date: null,
    notes: ''
  },
  {
    priority_level: 'Immediate',
    title: 'Secure Forbes Coverage',
    description: 'Pitch Forbes Cloud 100 list, IPO success story angle, or founder profile on Andrew Bialecki. Forbes is tier-1 citation source for ChatGPT and Perplexity business queries.',
    impact: 'High',
    effort: 'Medium',
    timeline: '4-6 weeks',
    status: 'Not Started',
    assigned_to: null,
    due_date: null,
    completed_date: null,
    notes: ''
  },
  {
    priority_level: 'Immediate',
    title: 'Launch Trustpilot Reputation Management Campaign',
    description: 'Respond to all negative reviews, launch customer success story campaign targeting happy customers for reviews, create FAQ addressing pricing/support complaints.',
    impact: 'High',
    effort: 'Medium',
    timeline: '2-3 weeks',
    status: 'Not Started',
    assigned_to: null,
    due_date: null,
    completed_date: null,
    notes: ''
  },
  {
    priority_level: 'Strategic',
    title: 'Build Knowledge Graph Presence',
    description: 'Verify Google Knowledge Panel existence. If absent, optimize Wikipedia structured data, add Wikidata properties, add Schema.org Organization markup to homepage.',
    impact: 'Medium',
    effort: 'Low',
    timeline: '6-8 weeks',
    status: 'Not Started',
    assigned_to: null,
    due_date: null,
    completed_date: null,
    notes: ''
  },
  {
    priority_level: 'Strategic',
    title: 'Amplify Free Tier Messaging',
    description: 'Update comparison site profiles to highlight "Free up to 250 profiles", create "Best Free Email Marketing Platforms" landing page, target Zapier and comparison blogs.',
    impact: 'Medium',
    effort: 'Medium',
    timeline: '8-12 weeks',
    status: 'Not Started',
    assigned_to: null,
    due_date: null,
    completed_date: null,
    notes: ''
  },
  {
    priority_level: 'Strategic',
    title: 'Diversify Beyond E-commerce Verticals',
    description: 'Create 4 industry landing pages (Subscription, Membership, B2C SaaS, Retail), publish case studies in each vertical, update G2 category associations.',
    impact: 'High',
    effort: 'High',
    timeline: '12 weeks',
    status: 'Not Started',
    assigned_to: null,
    due_date: null,
    completed_date: null,
    notes: ''
  },
  {
    priority_level: 'Strategic',
    title: 'Increase HubSpot Ecosystem Presence',
    description: 'Pursue guest contribution to blog.hubspot.com, partner with HubSpot ecosystem agencies for integration case studies, highlight Klaviyo-HubSpot integration.',
    impact: 'Medium',
    effort: 'Medium',
    timeline: '12-16 weeks',
    status: 'Not Started',
    assigned_to: null,
    due_date: null,
    completed_date: null,
    notes: ''
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
  console.log('\n📊 KLAVIYO AUDIT EXPORT TO AIRTABLE');
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
    console.log(`✓ ${llmResponseCount} LLM responses`);
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
