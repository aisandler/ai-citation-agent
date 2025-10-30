#!/usr/bin/env node

/**
 * Export Viable Edge Audit to Airtable
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
// VIABLE EDGE AUDIT DATA
// ============================================================================

const auditData = {
  "brand_name": "Viable Edge",
  "category": "Marketing with AI, marketing consulting",
  "audit_date": "2025-10-29",
  "overall_score": 2.1,
  "trust_node_coverage": 1,
  "trust_node_percentage": 0.048,
  "citation_quality": 5.8,
  "ai_citation_rate": 0.33,
  "perplexity_rank": null,
  "chatgpt_rank": null,
  "gemini_rank": null,
  "perplexity_cited": true,
  "chatgpt_cited": false,
  "gemini_cited": false,
  "status": "Complete",
  "executive_summary": "Viable Edge is effectively invisible to AI systems. Despite a technically excellent website (9.0/10 data structure), the brand lacks the third-party trust signals that LLMs require to recommend it. Only 1 of 21 trust nodes present (4.8% coverage). Missing all foundational nodes: Wikipedia, LinkedIn company page, G2, Crunchbase. Zero third-party validation. Appeared in 0 of 3 evaluative queries across all platforms. Only mentioned in Perplexity's brand-specific query with explicit warning about lack of validation.",
  "top_priority_1": "Create G2 profile and request 10 reviews from existing clients to establish baseline third-party validation",
  "top_priority_2": "Fix LinkedIn Company Page (currently returns 404) - create/verify correct URL, complete profile, post 2-3x/week",
  "top_priority_3": "Publish 'Top AI Marketing Agencies 2025' thought leadership article ranking 10-15 agencies (include Viable Edge at position 5-7)",
  "next_audit_date": "2025-12-28"
};

const trustNodes = [
  {
    category: "Knowledge Graph",
    node_name: "Wikipedia",
    present: false,
    quality_score: null,
    last_updated: null,
    url: null,
    notes: "No Wikipedia article found - critical blocker for knowledge graph presence"
  },
  {
    category: "Knowledge Graph",
    node_name: "Wikidata",
    present: false,
    quality_score: null,
    last_updated: null,
    url: null,
    notes: "No Wikidata entity - missing structured data ecosystem connections"
  },
  {
    category: "Knowledge Graph",
    node_name: "Google Knowledge Panel",
    present: false,
    quality_score: null,
    last_updated: null,
    url: null,
    notes: "No knowledge panel - typically requires Wikipedia article as foundation"
  },
  {
    category: "Review Platform",
    node_name: "G2",
    present: false,
    quality_score: null,
    last_updated: null,
    url: null,
    notes: "No G2 profile - missing critical B2B software buyer validation channel. Perplexity explicitly noted absence."
  },
  {
    category: "Review Platform",
    node_name: "Capterra",
    present: false,
    quality_score: null,
    last_updated: null,
    url: null,
    notes: "No Capterra profile found"
  },
  {
    category: "Review Platform",
    node_name: "Trustpilot",
    present: false,
    quality_score: null,
    last_updated: null,
    url: null,
    notes: "No Trustpilot profile found"
  },
  {
    category: "Review Platform",
    node_name: "Software Advice",
    present: false,
    quality_score: null,
    last_updated: null,
    url: null,
    notes: "No Software Advice profile found"
  },
  {
    category: "Review Platform",
    node_name: "GetApp",
    present: false,
    quality_score: null,
    last_updated: null,
    url: null,
    notes: "No GetApp profile found"
  },
  {
    category: "Directory",
    node_name: "Crunchbase",
    present: false,
    quality_score: null,
    last_updated: null,
    url: null,
    notes: "No Crunchbase profile - missing company/funding data aggregation"
  },
  {
    category: "Directory",
    node_name: "Product Hunt",
    present: false,
    quality_score: null,
    last_updated: null,
    url: null,
    notes: "No Product Hunt launch - missing tech product discovery channel"
  },
  {
    category: "Directory",
    node_name: "AngelList",
    present: false,
    quality_score: null,
    last_updated: null,
    url: null,
    notes: "No AngelList profile found"
  },
  {
    category: "Directory",
    node_name: "Built With",
    present: true,
    quality_score: 2.0,
    last_updated: "2025-10-29",
    url: "https://builtwith.com/viableedge.com",
    notes: "Basic technology detection only (Bootstrap 4, responsive design) - not a claimed/managed profile"
  },
  {
    category: "Company Profile",
    node_name: "LinkedIn Company",
    present: false,
    quality_score: null,
    last_updated: null,
    url: null,
    notes: "Website claims linkedin.com/company/theviableedge exists but page returns 404 - not verified. Founder personal profile exists but no company page confirmed."
  },
  {
    category: "Company Profile",
    node_name: "Bloomberg",
    present: false,
    quality_score: null,
    last_updated: null,
    url: null,
    notes: "No Bloomberg coverage (expected for early-stage company)"
  },
  {
    category: "News & PR",
    node_name: "TechCrunch",
    present: false,
    quality_score: null,
    last_updated: null,
    url: null,
    notes: "No TechCrunch coverage - missing high-authority tech publication citation source"
  },
  {
    category: "News & PR",
    node_name: "VentureBeat",
    present: false,
    quality_score: null,
    last_updated: null,
    url: null,
    notes: "No VentureBeat coverage found"
  },
  {
    category: "News & PR",
    node_name: "Forbes",
    present: false,
    quality_score: null,
    last_updated: null,
    url: null,
    notes: "No Forbes coverage found"
  },
  {
    category: "News & PR",
    node_name: "Inc.com",
    present: false,
    quality_score: null,
    last_updated: null,
    url: null,
    notes: "No Inc.com coverage found"
  },
  {
    category: "News & PR",
    node_name: "Fast Company",
    present: false,
    quality_score: null,
    last_updated: null,
    url: null,
    notes: "No Fast Company coverage found"
  },
  {
    category: "Seed Site",
    node_name: "Industry News (General)",
    present: false,
    quality_score: null,
    last_updated: null,
    url: null,
    notes: "Zero news articles found in last 6 months - no press coverage indexed"
  },
  {
    category: "Company Profile",
    node_name: "Pitchbook",
    present: false,
    quality_score: null,
    last_updated: null,
    url: null,
    notes: "No Pitchbook profile found"
  }
];

const citations = [
  {
    source_url: "https://www.viableedge.com",
    source_domain: "viableedge.com",
    source_title: "The Viable Edge - AI-Driven Strategic Brand Architecture Solutions",
    authority_score: 3.0,
    data_structure_score: 9.0,
    brand_alignment_score: 10.0,
    freshness_score: 5.0,
    cross_link_score: 2.0,
    overall_quality: 5.8,
    publication_date: null,
    cited_by_perplexity: true,
    cited_by_chatgpt: false,
    cited_by_gemini: false,
    notes: "Owned website property with excellent structured data but no third-party validation. Critical gaps: no knowledge graph integration, no inbound backlinks, no review platform presence, missing date metadata. Data structure is the only strength (9.0/10 with comprehensive Schema.org markup). Founded 2024, legal entity: Sandler Digital Advisory LLC. Only cited by Perplexity in brand-specific query with explicit warning about lack of validation."
  }
];

const llmResponses = [
  {
    platform: "Perplexity",
    query_type: "Evaluative",
    query_text: "What are the top AI marketing agencies in 2025?",
    brand_cited: false,
    brand_rank: null,
    brand_context: null,
    citations_found: 11,
    competitor_1: "Single Grain",
    competitor_1_rank: 1,
    competitor_2: "Tinuiti",
    competitor_2_rank: 2,
    competitor_3: "Cognitiv",
    competitor_3_rank: 3,
    response_summary: "Brand not mentioned in evaluative query. 15 agencies ranked with detailed capabilities. Single Grain and Superside blogs dominated citations. Zero Viable Edge presence in industry rankings."
  },
  {
    platform: "Perplexity",
    query_type: "Comparative",
    query_text: "Best AI marketing consultants for B2B companies",
    brand_cited: false,
    brand_rank: null,
    brand_context: null,
    citations_found: 13,
    competitor_1: "MarketerHire",
    competitor_1_rank: 1,
    competitor_2: "BCG X",
    competitor_2_rank: 2,
    competitor_3: "Matrix Marketing Group",
    competitor_3_rank: 3,
    response_summary: "Brand not mentioned in B2B comparative query. B2B-specific sources cited (XcelaCore, Chief Outsiders). Pricing transparency and consultant framing differentiated top results. Viable Edge absent from B2B-focused content."
  },
  {
    platform: "Perplexity",
    query_type: "Brand-Specific",
    query_text: "Viable Edge reviews and credentials",
    brand_cited: true,
    brand_rank: 1,
    brand_context: "Primary subject described as 'Autonomous AI Marketing Agent' with $250K savings claim. Perplexity accurately extracted value proposition from official website but explicitly noted: 'No third-party reviews (e.g., G2, Capterra, Trustpilot) or employee reviews (e.g., Indeed, Glassdoor) specifically for Viable Edge in the search results.' Concluded with due diligence warning about lack of independent validation.",
    citations_found: 12,
    competitor_1: null,
    competitor_1_rank: null,
    competitor_2: null,
    competitor_2_rank: null,
    competitor_3: null,
    competitor_3_rank: null,
    response_summary: "Brand-specific query returned results, but ONLY from official website. Perplexity cited 11 irrelevant sources (wrong entities with similar names: Visual Edge IT, Vital Edge Solutions, 'Viable' on G2) demonstrating name confusion pattern. Zero third-party validation present. Perplexity transparently acknowledged absence of reviews and issued risk advisory to users."
  },
  {
    platform: "ChatGPT",
    query_type: "Evaluative",
    query_text: "What are the top AI marketing agencies in 2025?",
    brand_cited: false,
    brand_rank: null,
    brand_context: "Not mentioned in response",
    citations_found: 18,
    competitor_1: "Single Grain",
    competitor_1_rank: 1,
    competitor_2: "Omneky",
    competitor_2_rank: 2,
    competitor_3: "NoGood",
    competitor_3_rank: 3,
    response_summary: "Brand absent from evaluative query. ChatGPT ranked 5 agencies based on recent listicle sources (April-Oct 2025). 40% of sources were agency self-published blogs. Missing: any third-party coverage, directory listings, thought leadership positioning Viable Edge as AI leader."
  },
  {
    platform: "Gemini",
    query_type: "Evaluative",
    query_text: "What are the top AI marketing agencies in 2025?",
    brand_cited: false,
    brand_rank: null,
    brand_context: "Not mentioned in response",
    citations_found: 0,
    competitor_1: "Single Grain",
    competitor_1_rank: 1,
    competitor_2: "NoGood",
    competitor_2_rank: 2,
    competitor_3: "Major Tom",
    competitor_3_rank: 3,
    response_summary: "Viable Edge not mentioned in Gemini's top 10 AI marketing agencies. Zero citations provided (Gemini 2.5 Flash does not show sources). Top competitors have specialized AI platforms, clear vertical focus, and market recognition. Absence suggests limited Google knowledge graph presence and insufficient third-party validation (reviews, press, directories)."
  }
];

const priorities = [
  {
    priority_level: "Immediate",
    title: "Create G2 profile and collect 10 client reviews",
    description: "Current status: Missing (Perplexity explicitly noted absence). Impact: Blocks buyer validation in B2B category. LLMs aggressively seek G2 data—Perplexity attempted to cite G2 even for wrong entity. Action: (1) Create free G2 listing in 'AI Marketing Software' category, (2) Request 5-10 reviews from existing clients (minimum threshold for visibility), (3) Respond to all reviews to demonstrate engagement, (4) Add G2 review schema markup to website. Success metric: G2 profile indexed by Google within 30 days, 10+ reviews within 60 days.",
    impact: "High",
    effort: "Medium",
    timeline: "2-4 weeks",
    status: "Not Started",
    assigned_to: null,
    due_date: null,
    completed_date: null,
    notes: "Top priority - LLMs heavily favor G2 for validation. ChatGPT cited multiple G2 profiles, Perplexity explicitly noted absence."
  },
  {
    priority_level: "Immediate",
    title: "Fix LinkedIn Company Page (currently 404 error)",
    description: "Current status: Website claims linkedin.com/company/theviableedge exists but returns 404. Impact: Missing B2B professional network visibility. LinkedIn Company pages frequently cited by LLMs for company data. Action: (1) Create or verify correct LinkedIn Company Page URL, (2) Complete profile with detailed services, keywords ('AI marketing,' 'autonomous agent,' 'strategic brand architecture'), (3) Add company logo, cover image, employee profiles, (4) Post 2-3 updates/week (client wins, thought leadership, AI marketing insights). Success metric: LinkedIn Company Page indexed by Google, 50+ followers, cited in Perplexity brand-specific queries.",
    impact: "High",
    effort: "Low",
    timeline: "1 week setup + ongoing content",
    status: "Not Started",
    assigned_to: null,
    due_date: null,
    completed_date: null,
    notes: "Quick win - takes 1 week to set up, free, high B2B visibility impact."
  },
  {
    priority_level: "Immediate",
    title: "Publish 'Top AI Marketing Agencies 2025' thought leadership article",
    description: "Current gap: Competitors (Single Grain, Matrix Marketing Group, Fifty Five and Five) ranked themselves in self-published listicles. ChatGPT cited these as primary sources. Impact: Creates citable content that LLMs reference. Self-promotion works when formatted as educational content. Action: (1) Research and rank 10-15 AI marketing agencies (including Viable Edge at position 5-7), (2) Include case studies, pricing ranges, specializations, (3) Format as 'Top 15 AI Marketing Agencies in 2025: Expert Analysis', (4) Publish on viableedge.com/blog with 2025 date prominent, (5) Promote via LinkedIn, Twitter to generate backlinks. Success metric: Article indexed by Google within 7 days, cited by LLMs within 90 days.",
    impact: "High",
    effort: "Medium",
    timeline: "2-3 weeks",
    status: "Not Started",
    assigned_to: null,
    due_date: null,
    completed_date: null,
    notes: "Strategic - mimics successful competitor strategy. 3 of top 5 ranked agencies used this approach."
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
  console.log('\n📊 VIABLE EDGE AUDIT EXPORT TO AIRTABLE');
  console.log('==========================================\n');

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
    console.log(`✓ ${llmResponseCount} LLM responses (3 Perplexity, 1 ChatGPT, 1 Gemini)`);
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
