#!/usr/bin/env node

/**
 * Export Jasper AI Audit Data to Airtable
 * Audit Date: 2025-10-29
 *
 * Creates records across 5 tables:
 * - Audit_Runs (main audit record)
 * - Trust_Nodes (15 trust nodes)
 * - Citations (19 citations with quality scores)
 * - LLM_Responses (5 LLM query results)
 * - Priorities (3 immediate priorities)
 */

import Airtable from 'airtable';

const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base('appXQsoTkWGPqwaOx');

// Main audit data
const auditData = {
  brand_name: 'Jasper',
  category: 'AI writing and marketing tools',
  audit_date: '2025-10-29',
  overall_score: 8.6,
  trust_node_coverage: 15,
  trust_node_percentage: 0.714,
  citation_quality: 8.8,
  ai_citation_rate: 1.00,
  perplexity_rank: 1,
  chatgpt_rank: 1,
  gemini_rank: 1,
  perplexity_cited: true,
  chatgpt_cited: true,
  gemini_cited: true,
  status: 'Complete',
  executive_summary: 'Jasper demonstrates exceptional AI visibility through commercial trust nodes (reviews, company profiles) and achieves #1 rankings across all LLM platforms. However, the complete absence of knowledge graph presence creates a structural vulnerability that limits authority signals and may impact future AI citation patterns as models evolve to prioritize structured knowledge sources.',
  top_priority_1: 'Create Wikipedia article',
  top_priority_2: 'Refresh TechCrunch & Target Forbes',
  top_priority_3: 'Maintain 2025 Listicle Presence',
  next_audit_date: '2025-12-28'
};

// Trust nodes data (15 nodes)
const trustNodes = [
  // Knowledge Graphs (0/3)
  {
    category: 'Knowledge Graph',
    node_name: 'Wikipedia',
    present: false,
    quality_score: null,
    last_updated: null,
    url: null,
    notes: 'Priority gap - most critical missing node. Blocks knowledge panel and Wikidata creation.'
  },
  {
    category: 'Knowledge Graph',
    node_name: 'Wikidata',
    present: false,
    quality_score: null,
    last_updated: null,
    url: null,
    notes: 'Priority gap - cannot create without Wikipedia article first.'
  },
  {
    category: 'Knowledge Graph',
    node_name: 'Google Knowledge Panel',
    present: false,
    quality_score: null,
    last_updated: null,
    url: null,
    notes: 'Priority gap - missing from brand searches.'
  },
  // Review Platforms (5/5)
  {
    category: 'Review Platform',
    node_name: 'G2',
    present: true,
    quality_score: 9.2,
    last_updated: '2025-10-20',
    url: 'https://www.g2.com/products/jasper-ai/reviews',
    notes: '1,264+ reviews, 4.9/5 rating. Cited by Perplexity as primary source.'
  },
  {
    category: 'Review Platform',
    node_name: 'Capterra',
    present: true,
    quality_score: 8.9,
    last_updated: '2025-09-15',
    url: 'https://www.capterra.com/p/217242/Jasper/reviews/',
    notes: 'Gartner-owned platform with verified reviews.'
  },
  {
    category: 'Review Platform',
    node_name: 'Trustpilot',
    present: true,
    quality_score: 8.9,
    last_updated: '2025-10-20',
    url: 'https://www.trustpilot.com/review/www.jasper.ai',
    notes: '3.6 stars from 4,149 reviews. Excellent JSON-LD implementation.'
  },
  {
    category: 'Review Platform',
    node_name: 'Software Advice',
    present: true,
    quality_score: 8.1,
    last_updated: '2025-08-10',
    url: 'https://www.softwareadvice.com/marketing/jarvis-profile/reviews/',
    notes: 'Gartner platform. URL contains outdated "jarvis" brand name - needs update.'
  },
  {
    category: 'Review Platform',
    node_name: 'GetApp',
    present: true,
    quality_score: 8.8,
    last_updated: '2025-09-20',
    url: 'https://www.getapp.com/marketing-software/a/jasper/reviews/',
    notes: 'Third Gartner Digital Markets property, SMB focus.'
  },
  // Directories (2/4)
  {
    category: 'Directory',
    node_name: 'Crunchbase',
    present: true,
    quality_score: 9.4,
    last_updated: '2022-10-18',
    url: 'https://www.crunchbase.com/organization/jasper-da51',
    notes: 'Definitive source for funding ($125M Series A) and company facts. Dense entity network.'
  },
  {
    category: 'Directory',
    node_name: 'Product Hunt',
    present: true,
    quality_score: 8.2,
    last_updated: '2021-11-15',
    url: 'https://www.producthunt.com/products/jasper-6',
    notes: 'Historical launch artifact with ongoing engagement.'
  },
  {
    category: 'Directory',
    node_name: 'AngelList',
    present: false,
    quality_score: null,
    last_updated: null,
    url: null,
    notes: 'Priority gap - recommended to create profile for startup/investor ecosystem visibility.'
  },
  {
    category: 'Directory',
    node_name: 'BuiltWith',
    present: false,
    quality_score: null,
    last_updated: null,
    url: null,
    notes: 'Priority gap - technology stack visibility opportunity.'
  },
  // Company Profiles (3/3)
  {
    category: 'Company Profile',
    node_name: 'LinkedIn',
    present: true,
    quality_score: 9.5,
    last_updated: '2025-10-29',
    url: 'https://www.linkedin.com/company/heyjasperai',
    notes: 'Extremely current (updated 14 hours ago). 67,887 followers, 963 employees. Perfect brand control.'
  },
  {
    category: 'Company Profile',
    node_name: 'Bloomberg',
    present: true,
    quality_score: 9.5,
    last_updated: null,
    url: 'https://www.bloomberg.com/profile/company/2306416D:US',
    notes: 'Gold standard financial intelligence. Institutional-quality data, regulatory-verified.'
  },
  {
    category: 'Company Profile',
    node_name: 'PitchBook',
    present: true,
    quality_score: 9.4,
    last_updated: null,
    url: 'https://pitchbook.com/profiles/company/471582-64',
    notes: 'Authoritative private market data with investor network connections.'
  }
];

// Citations data (19 citations)
const citations = [
  {
    source_url: 'https://www.g2.com/products/jasper-ai/reviews',
    source_domain: 'g2.com',
    source_title: 'Jasper AI Reviews and Ratings 2025',
    authority_score: 9.0,
    data_structure_score: 9.5,
    brand_alignment_score: 9.5,
    freshness_score: 9.5,
    cross_link_score: 8.5,
    overall_quality: 9.2,
    publication_date: '2025-10-20',
    cited_by_perplexity: true,
    cited_by_chatgpt: false,
    cited_by_gemini: false,
    notes: 'Tier 1 review platform with excellent structured data, continuously updated reviews through October 2025'
  },
  {
    source_url: 'https://www.capterra.com/p/217242/Jasper/reviews/',
    source_domain: 'capterra.com',
    source_title: 'Jasper Reviews and Pricing 2025',
    authority_score: 9.0,
    data_structure_score: 9.0,
    brand_alignment_score: 9.5,
    freshness_score: 9.0,
    cross_link_score: 8.0,
    overall_quality: 8.9,
    publication_date: '2025-09-15',
    cited_by_perplexity: false,
    cited_by_chatgpt: false,
    cited_by_gemini: false,
    notes: 'Gartner-owned platform with verified reviews and professional structured data'
  },
  {
    source_url: 'https://www.trustpilot.com/review/www.jasper.ai',
    source_domain: 'trustpilot.com',
    source_title: 'Jasper Reviews | Read Customer Service Reviews of www.jasper.ai',
    authority_score: 8.5,
    data_structure_score: 9.5,
    brand_alignment_score: 9.0,
    freshness_score: 9.5,
    cross_link_score: 8.0,
    overall_quality: 8.9,
    publication_date: '2025-10-20',
    cited_by_perplexity: false,
    cited_by_chatgpt: false,
    cited_by_gemini: false,
    notes: 'Excellent JSON-LD implementation, 3.6 stars from 4,149 reviews, most recent review from Oct 20, 2025'
  },
  {
    source_url: 'https://www.softwareadvice.com/marketing/jarvis-profile/reviews/',
    source_domain: 'softwareadvice.com',
    source_title: 'Jasper (formerly Jarvis) Reviews and Pricing',
    authority_score: 8.5,
    data_structure_score: 9.0,
    brand_alignment_score: 7.5,
    freshness_score: 8.0,
    cross_link_score: 7.5,
    overall_quality: 8.1,
    publication_date: '2025-08-10',
    cited_by_perplexity: false,
    cited_by_chatgpt: false,
    cited_by_gemini: false,
    notes: 'Gartner platform but URL contains outdated "jarvis" brand name, needs update'
  },
  {
    source_url: 'https://www.getapp.com/marketing-software/a/jasper/reviews/',
    source_domain: 'getapp.com',
    source_title: 'Jasper Reviews and Pricing 2025',
    authority_score: 8.5,
    data_structure_score: 9.0,
    brand_alignment_score: 9.5,
    freshness_score: 9.0,
    cross_link_score: 8.0,
    overall_quality: 8.8,
    publication_date: '2025-09-20',
    cited_by_perplexity: false,
    cited_by_chatgpt: false,
    cited_by_gemini: false,
    notes: 'Third Gartner Digital Markets property, SMB focus, correct current branding'
  },
  {
    source_url: 'https://www.crunchbase.com/organization/jasper-da51',
    source_domain: 'crunchbase.com',
    source_title: 'Jasper - Company Profile and Funding',
    authority_score: 9.5,
    data_structure_score: 9.5,
    brand_alignment_score: 10.0,
    freshness_score: 8.5,
    cross_link_score: 9.5,
    overall_quality: 9.4,
    publication_date: '2022-10-18',
    cited_by_perplexity: false,
    cited_by_chatgpt: false,
    cited_by_gemini: false,
    notes: 'Definitive source for funding ($125M Series A) and company facts, dense entity network'
  },
  {
    source_url: 'https://www.producthunt.com/products/jasper-6',
    source_domain: 'producthunt.com',
    source_title: 'Jasper - AI writing assistant for marketing teams',
    authority_score: 8.0,
    data_structure_score: 8.5,
    brand_alignment_score: 9.0,
    freshness_score: 7.0,
    cross_link_score: 8.5,
    overall_quality: 8.2,
    publication_date: '2021-11-15',
    cited_by_perplexity: false,
    cited_by_chatgpt: false,
    cited_by_gemini: false,
    notes: 'Historical launch artifact with ongoing engagement, product discovery community'
  },
  {
    source_url: 'https://www.linkedin.com/company/heyjasperai',
    source_domain: 'linkedin.com',
    source_title: 'Jasper | LinkedIn',
    authority_score: 9.0,
    data_structure_score: 9.0,
    brand_alignment_score: 10.0,
    freshness_score: 10.0,
    cross_link_score: 9.5,
    overall_quality: 9.5,
    publication_date: '2025-10-29',
    cited_by_perplexity: false,
    cited_by_chatgpt: false,
    cited_by_gemini: false,
    notes: 'Extremely current (updated 14 hours ago), 67,887 followers, 963 employees, perfect brand control'
  },
  {
    source_url: 'https://www.bloomberg.com/profile/company/2306416D:US',
    source_domain: 'bloomberg.com',
    source_title: 'Jasper Technologies Inc - Company Profile',
    authority_score: 10.0,
    data_structure_score: 9.5,
    brand_alignment_score: 10.0,
    freshness_score: 9.0,
    cross_link_score: 9.0,
    overall_quality: 9.5,
    publication_date: null,
    cited_by_perplexity: false,
    cited_by_chatgpt: false,
    cited_by_gemini: false,
    notes: 'Gold standard financial intelligence, institutional-quality data, regulatory-verified'
  },
  {
    source_url: 'https://pitchbook.com/profiles/company/471582-64',
    source_domain: 'pitchbook.com',
    source_title: 'Jasper Company Profile - Private Market Intelligence',
    authority_score: 9.5,
    data_structure_score: 9.0,
    brand_alignment_score: 10.0,
    freshness_score: 9.0,
    cross_link_score: 9.5,
    overall_quality: 9.4,
    publication_date: null,
    cited_by_perplexity: false,
    cited_by_chatgpt: false,
    cited_by_gemini: false,
    notes: 'Authoritative private market data, investor network connections, PE/VC ecosystem'
  },
  {
    source_url: 'https://techcrunch.com/2022/10/18/ai-content-platform-jasper-raises-125m-at-a-1-7b-valuation/',
    source_domain: 'techcrunch.com',
    source_title: 'AI content platform Jasper raises $125M at a $1.5B valuation',
    authority_score: 9.5,
    data_structure_score: 9.5,
    brand_alignment_score: 9.5,
    freshness_score: 4.0,
    cross_link_score: 8.5,
    overall_quality: 8.2,
    publication_date: '2022-10-18',
    cited_by_perplexity: false,
    cited_by_chatgpt: false,
    cited_by_gemini: false,
    notes: 'Premier tech journalism with excellent schema, 3 years old (freshness impact), correction notice shows editorial standards'
  },
  {
    source_url: 'https://venturebeat.com/ai/jasper-launches-new-marketing-ai-copilot-no-one-should-have-to-work-alone-again/',
    source_domain: 'venturebeat.com',
    source_title: 'Jasper launches new Marketing AI Copilot',
    authority_score: 8.5,
    data_structure_score: 8.5,
    brand_alignment_score: 9.5,
    freshness_score: 8.5,
    cross_link_score: 8.0,
    overall_quality: 8.6,
    publication_date: '2024-11-20',
    cited_by_perplexity: false,
    cited_by_chatgpt: false,
    cited_by_gemini: false,
    notes: 'Recent product launch coverage, AI and enterprise tech focus'
  },
  {
    source_url: 'https://venturebeat.com/ai/jasper-looks-to-expand-generative-ai-beyond-generic-ai',
    source_domain: 'venturebeat.com',
    source_title: 'Jasper looks to expand generative AI beyond generic AI',
    authority_score: 8.5,
    data_structure_score: 8.5,
    brand_alignment_score: 9.0,
    freshness_score: 8.0,
    cross_link_score: 8.0,
    overall_quality: 8.4,
    publication_date: '2024-09-15',
    cited_by_perplexity: false,
    cited_by_chatgpt: false,
    cited_by_gemini: false,
    notes: 'Strategic positioning coverage, generative AI landscape analysis'
  },
  {
    source_url: 'https://venturebeat.com/ai/jasper-acquires-stability-ais-clipdrop-to-strengthen-marketing-copilot',
    source_domain: 'venturebeat.com',
    source_title: 'Jasper acquires Stability AI\'s Clipdrop',
    authority_score: 8.5,
    data_structure_score: 8.5,
    brand_alignment_score: 9.5,
    freshness_score: 8.0,
    cross_link_score: 9.0,
    overall_quality: 8.7,
    publication_date: '2024-08-10',
    cited_by_perplexity: false,
    cited_by_chatgpt: false,
    cited_by_gemini: false,
    notes: 'M&A coverage creates entity connections across AI ecosystem (Stability AI, Clipdrop)'
  },
  {
    source_url: 'https://www.inc.com/profile/jasper-ai',
    source_domain: 'inc.com',
    source_title: 'Jasper AI - Company Profile',
    authority_score: 8.5,
    data_structure_score: 8.0,
    brand_alignment_score: 9.5,
    freshness_score: 8.0,
    cross_link_score: 8.0,
    overall_quality: 8.4,
    publication_date: null,
    cited_by_perplexity: false,
    cited_by_chatgpt: false,
    cited_by_gemini: false,
    notes: 'Growth company directory profile, Inc. 5000 ecosystem connections'
  },
  {
    source_url: 'https://www.fastcompany.com/91141075/a-new-era-of-ai-tools-for-the-enterprise-is-here-which-is-better-for-your-team',
    source_domain: 'fastcompany.com',
    source_title: 'A new era of AI tools for the enterprise is here',
    authority_score: 8.5,
    data_structure_score: 8.0,
    brand_alignment_score: 8.5,
    freshness_score: 9.0,
    cross_link_score: 7.5,
    overall_quality: 8.3,
    publication_date: '2024-10-15',
    cited_by_perplexity: false,
    cited_by_chatgpt: false,
    cited_by_gemini: false,
    notes: 'Comparative enterprise AI coverage, Jasper positioned among multiple platforms'
  },
  {
    source_url: 'https://www.prnewswire.com/news-releases/jasper-ushers-in-the-agentic-era-of-marketing-with-the-launch-of-intelligent-workspaces-purpose-built-agents-and-bold-rebrand-302477677.html',
    source_domain: 'prnewswire.com',
    source_title: 'Jasper Ushers in the Agentic Era of Marketing',
    authority_score: 7.5,
    data_structure_score: 9.0,
    brand_alignment_score: 10.0,
    freshness_score: 9.5,
    cross_link_score: 7.5,
    overall_quality: 8.7,
    publication_date: '2025-06-10',
    cited_by_perplexity: false,
    cited_by_chatgpt: false,
    cited_by_gemini: false,
    notes: 'Official rebrand announcement (June 2025), connects to Fortune 500 customers, company-authored content'
  },
  {
    source_url: 'https://www.jasper.ai',
    source_domain: 'jasper.ai',
    source_title: 'AI built for marketing | Jasper',
    authority_score: 8.0,
    data_structure_score: 9.5,
    brand_alignment_score: 10.0,
    freshness_score: 9.0,
    cross_link_score: 9.5,
    overall_quality: 9.2,
    publication_date: null,
    cited_by_perplexity: false,
    cited_by_chatgpt: false,
    cited_by_gemini: false,
    notes: 'Official website with Organization schema (4.8/5 rating from 1,200 reviews), hub for all social profiles'
  },
  {
    source_url: 'https://www.jasper.ai/press',
    source_domain: 'jasper.ai',
    source_title: 'Jasper Press Room',
    authority_score: 7.0,
    data_structure_score: 8.5,
    brand_alignment_score: 10.0,
    freshness_score: 8.5,
    cross_link_score: 8.0,
    overall_quality: 8.4,
    publication_date: null,
    cited_by_perplexity: false,
    cited_by_chatgpt: false,
    cited_by_gemini: false,
    notes: 'Official press materials and media resources, company-controlled content'
  }
];

// LLM responses data (5 queries across 3 platforms)
const llmResponses = [
  {
    platform: 'Perplexity',
    query_type: 'Evaluative',
    query_text: 'What are the top AI writing and marketing tools in 2025?',
    brand_cited: true,
    brand_rank: null,
    brand_context: 'Listed among top tools',
    citations_found: 9,
    competitor_1: 'Reword',
    competitor_1_rank: null,
    competitor_2: 'CopyAI',
    competitor_2_rank: null,
    competitor_3: null,
    competitor_3_rank: null,
    response_summary: 'Jasper positioned as powerful for marketing copy, sales content, and ads. Emphasized team collaboration and brand voice features.'
  },
  {
    platform: 'Perplexity',
    query_type: 'Comparative',
    query_text: 'Best AI writing tools for content marketing teams',
    brand_cited: true,
    brand_rank: 1,
    brand_context: 'Most versatile tool for content marketing teams',
    citations_found: 11,
    competitor_1: 'Writesonic',
    competitor_1_rank: 2,
    competitor_2: null,
    competitor_2_rank: null,
    competitor_3: null,
    competitor_3_rank: null,
    response_summary: 'Jasper ranked #1 with emphasis on multi-format support, enterprise workflows, and brand voice customization. Differentiated on team collaboration vs competitors.'
  },
  {
    platform: 'Perplexity',
    query_type: 'Brand-Specific',
    query_text: 'Jasper AI reviews and credentials',
    brand_cited: true,
    brand_rank: null,
    brand_context: '100,000+ business users, SOC 2 certification',
    citations_found: 8,
    competitor_1: null,
    competitor_1_rank: null,
    competitor_2: null,
    competitor_2_rank: null,
    competitor_3: null,
    competitor_3_rank: null,
    response_summary: 'Primary subject of query. Response included customer count, security credentials (SOC 2), pricing tiers, and G2 rating of 4.9/5.'
  },
  {
    platform: 'ChatGPT',
    query_type: 'Evaluative',
    query_text: 'What are the top AI writing and marketing tools in 2025?',
    brand_cited: true,
    brand_rank: 1,
    brand_context: 'Long-standing favorite for marketing & copywriting, 50+ templates',
    citations_found: 13,
    competitor_1: 'Writesonic',
    competitor_1_rank: 2,
    competitor_2: 'Copy.ai',
    competitor_2_rank: 3,
    competitor_3: null,
    competitor_3_rank: null,
    response_summary: 'Jasper ranked #1 in "Top Writing & Content Creation Tools" category. Positioned as having brand voice + scale + speed, with 50+ templates for various content types.'
  },
  {
    platform: 'Gemini',
    query_type: 'Evaluative',
    query_text: 'What are the top AI writing and marketing tools in 2025?',
    brand_cited: true,
    brand_rank: 1,
    brand_context: 'Versatile Content & Team Collaboration, brand voice consistency',
    citations_found: 0,
    competitor_1: 'Copy.ai',
    competitor_1_rank: 2,
    competitor_2: 'Writesonic',
    competitor_2_rank: 3,
    competitor_3: null,
    competitor_3_rank: null,
    response_summary: 'Jasper ranked #1 in "Top AI Writing & Content Creation Tools" category. No visible citations (Gemini 2.5 Flash does not expose sources). Positioned for long-form blog posts, ad copy, team workflows, and brand voice consistency.'
  }
];

// Priorities data (3 immediate priorities)
const priorities = [
  {
    priority_level: 'Immediate',
    title: 'Create Wikipedia Article',
    description: 'Establish knowledge graph foundation with Wikipedia article citing Inc. 5000, $1.5B valuation, $143M funding. Blocks knowledge panel eligibility and Wikidata creation.',
    impact: 'High',
    effort: 'Medium',
    timeline: '4-6 weeks',
    status: 'Not Started',
    assigned_to: null,
    due_date: null,
    completed_date: null,
    notes: 'Hire experienced Wikipedia editor familiar with notability guidelines. Draft article with secondary sources (TechCrunch, VentureBeat). Most critical gap blocking knowledge graph presence.'
  },
  {
    priority_level: 'Immediate',
    title: 'Refresh TechCrunch & Target Forbes',
    description: 'Pitch 2025 developments to TechCrunch (Jasper Agents, Canvas agentic era positioning). Target Forbes "Best AI Tools" lists via contributors.',
    impact: 'High',
    effort: 'Medium',
    timeline: '6-8 weeks',
    status: 'Not Started',
    assigned_to: null,
    due_date: null,
    completed_date: null,
    notes: 'TechCrunch coverage dated (Oct 2022). No Forbes presence. Tier-1 seed sites that LLMs may prioritize as models evolve toward authoritative sources.'
  },
  {
    priority_level: 'Immediate',
    title: 'Maintain 2025 Listicle Presence',
    description: 'Monitor Q4 2025/Q1 2026 roundups. Proactively reach out to authors with updated product info. Ensure G2/Capterra profiles current with Q4 2025 features.',
    impact: 'High',
    effort: 'Low',
    timeline: 'Ongoing',
    status: 'Not Started',
    assigned_to: null,
    due_date: null,
    completed_date: null,
    notes: 'ChatGPT prioritized 2025 listicles (Dxb News Network, Rankingeek, margeserrano.com). Must maintain presence through Q4 2025 and into 2026 to protect #1 rankings.'
  }
];

// Export function
async function exportToAirtable() {
  console.log('Starting Jasper AI audit export to Airtable...\n');

  let auditRecordId;
  let successCounts = {
    trustNodes: 0,
    citations: 0,
    llmResponses: 0,
    priorities: 0
  };
  let errors = [];

  try {
    // Step 1: Create main audit record
    console.log('Step 1: Creating Audit_Runs record...');
    const auditRecord = await base('Audit_Runs').create(auditData);
    auditRecordId = auditRecord.id;
    console.log(`✓ Audit record created (ID: ${auditRecordId})\n`);

    // Step 2: Create trust node records
    console.log('Step 2: Creating Trust_Nodes records...');
    for (const node of trustNodes) {
      try {
        await base('Trust_Nodes').create({
          ...node,
          audit: [auditRecordId]
        });
        successCounts.trustNodes++;
      } catch (err) {
        errors.push(`Trust Node "${node.node_name}": ${err.message}`);
      }
    }
    console.log(`✓ ${successCounts.trustNodes}/${trustNodes.length} trust nodes created\n`);

    // Step 3: Create citation records
    console.log('Step 3: Creating Citations records...');
    for (const citation of citations) {
      try {
        await base('Citations').create({
          ...citation,
          audit: [auditRecordId]
        });
        successCounts.citations++;
      } catch (err) {
        errors.push(`Citation "${citation.source_domain}": ${err.message}`);
      }
    }
    console.log(`✓ ${successCounts.citations}/${citations.length} citations created\n`);

    // Step 4: Create LLM response records
    console.log('Step 4: Creating LLM_Responses records...');
    for (const response of llmResponses) {
      try {
        await base('LLM_Responses').create({
          ...response,
          audit: [auditRecordId]
        });
        successCounts.llmResponses++;
      } catch (err) {
        errors.push(`LLM Response "${response.platform} - ${response.query_type}": ${err.message}`);
      }
    }
    console.log(`✓ ${successCounts.llmResponses}/${llmResponses.length} LLM responses created\n`);

    // Step 5: Create priority records
    console.log('Step 5: Creating Priorities records...');
    for (const priority of priorities) {
      try {
        await base('Priorities').create({
          ...priority,
          audit: [auditRecordId]
        });
        successCounts.priorities++;
      } catch (err) {
        errors.push(`Priority "${priority.title}": ${err.message}`);
      }
    }
    console.log(`✓ ${successCounts.priorities}/${priorities.length} priorities created\n`);

    // Final summary
    console.log('='.repeat(70));
    console.log('✅ AUDIT DATA SAVED TO AIRTABLE\n');
    console.log('Summary:');
    console.log(`- Brand: ${auditData.brand_name}`);
    console.log(`- Audit Date: ${auditData.audit_date}`);
    console.log(`- Overall Score: ${auditData.overall_score}/10\n`);

    console.log('Records Created:');
    console.log(`✓ 1 audit run (ID: ${auditRecordId})`);
    console.log(`✓ ${successCounts.trustNodes}/${trustNodes.length} trust nodes`);
    console.log(`✓ ${successCounts.citations}/${citations.length} citations`);
    console.log(`✓ ${successCounts.llmResponses}/${llmResponses.length} LLM responses`);
    console.log(`✓ ${successCounts.priorities}/${priorities.length} priorities\n`);

    if (errors.length > 0) {
      console.log('⚠️  Errors encountered:');
      errors.forEach(err => console.log(`  - ${err}`));
      console.log('');
    }

    console.log('View in Airtable:');
    console.log(`https://airtable.com/appXQsoTkWGPqwaOx/tblAudit_Runs/viwAll?blocks=hide\n`);

    console.log('Next Steps:');
    console.log('- Review priorities in Airtable');
    console.log('- Assign owners to action items');
    console.log('- Schedule next audit for 2025-12-28');
    console.log('='.repeat(70));

  } catch (err) {
    console.error('❌ EXPORT FAILED');
    console.error('Error:', err.message);
    if (err.statusCode) {
      console.error('Status Code:', err.statusCode);
    }
    if (err.error) {
      console.error('Details:', JSON.stringify(err.error, null, 2));
    }
    process.exit(1);
  }
}

// Run the export
exportToAirtable();
