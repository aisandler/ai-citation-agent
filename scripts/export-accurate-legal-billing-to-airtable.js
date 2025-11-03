#!/usr/bin/env node

import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';
import Airtable from 'airtable';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from .env.local
dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

// Configuration - loaded from .env.local
const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID || 'appXQsoTkWGPqwaOx';

if (!AIRTABLE_API_KEY) {
  console.error('❌ AIRTABLE_API_KEY not set in .env.local');
  console.error('Create a .env.local file with: AIRTABLE_API_KEY=your_key_here');
  process.exit(1);
}

const base = new Airtable({ apiKey: AIRTABLE_API_KEY }).base(AIRTABLE_BASE_ID);

// Audit data
const auditData = {
  brand_name: "Accurate Legal Billing",
  category: "Legal Billing/eBilling/AI Software",
  audit_date: "2025-11-02",
  overall_score: 4.2,
  trust_node_coverage: 11,
  trust_node_percentage: 0.38,
  citation_quality: 7.6,
  ai_citation_rate: 0.33,
  perplexity_rank: null,
  chatgpt_rank: null,
  gemini_rank: null,
  perplexity_cited: true,
  chatgpt_cited: false,
  gemini_cited: false,
  status: "Complete",
  executive_summary: "Accurate Legal Billing has strong foundational citations (LinkedIn, Crunchbase, official website) but is invisible to AI systems in competitive contexts. The brand only appears when explicitly searched by name (Perplexity brand-specific query). Critical gap: missing from legal industry comparison articles (LawRank, The Legal Practice, Grow Law) and review platforms (G2 editorial, SelectHub) that drive all 3 LLM platforms' competitive rankings.",
  top_priority_1: "Activate G2 Profile with Customer Reviews - G2 was ChatGPT's #1 citation source (3 references driving LawPay to #1 position). Target 15+ reviews within 30 days.",
  top_priority_2: "Secure Placement in LawRank 2025 Comparison - LawRank cited by all 3 LLM platforms. This single source drives multi-platform visibility.",
  top_priority_3: "Fix Crunchbase Location Error & Add Review Platform Coverage - Crunchbase shows London, UK (should be Glen Cove, NY); add GetApp, Trustpilot, SelectHub profiles.",
  next_audit_date: "2025-01-01"
};

const trustNodes = [
  // Knowledge Graphs (0/3)
  { category: "Knowledge Graph", node_name: "Wikipedia", present: false, quality_score: null, last_updated: null, url: null, notes: "Absent" },
  { category: "Knowledge Graph", node_name: "Wikidata", present: false, quality_score: null, last_updated: null, url: null, notes: "Absent" },
  { category: "Knowledge Graph", node_name: "Google Knowledge Panel", present: false, quality_score: null, last_updated: null, url: null, notes: "Absent" },

  // Review Platforms (3/5)
  { category: "Review Platform", node_name: "G2", present: true, quality_score: 2.0, last_updated: null, url: "https://www.g2.com/products/accurate-legal-billing/reviews", notes: "0 reviews, unclaimed 12+ months" },
  { category: "Review Platform", node_name: "Capterra", present: true, quality_score: 2.0, last_updated: null, url: "https://www.capterra.com/p/182933/Accurate-Legal-Billing/", notes: "0 reviews" },
  { category: "Review Platform", node_name: "Software Advice", present: true, quality_score: 3.0, last_updated: null, url: "https://www.softwareadvice.com/legal/accurate-legal-billing-profile/", notes: "0 reviews" },
  { category: "Review Platform", node_name: "Trustpilot", present: false, quality_score: null, last_updated: null, url: null, notes: "Absent" },
  { category: "Review Platform", node_name: "GetApp", present: false, quality_score: null, last_updated: null, url: null, notes: "Absent" },

  // Directories (2/4)
  { category: "Directory", node_name: "Crunchbase", present: true, quality_score: 6.0, last_updated: null, url: "https://www.crunchbase.com/organization/accurate-legal-billing", notes: "London HQ error (should be Glen Cove, NY)" },
  { category: "Directory", node_name: "Product Hunt", present: true, quality_score: 4.0, last_updated: null, url: "https://www.producthunt.com/products/accurate-legal-billing/launches", notes: "Minimal engagement" },
  { category: "Directory", node_name: "AngelList", present: false, quality_score: null, last_updated: null, url: null, notes: "Absent" },
  { category: "Directory", node_name: "BuiltWith", present: false, quality_score: null, last_updated: null, url: null, notes: "Absent" },

  // Company Profiles (2/2)
  { category: "Company Profile", node_name: "LinkedIn", present: true, quality_score: 7.0, last_updated: null, url: "https://www.linkedin.com/company/accurate-legal-billing", notes: "Active profile, 107 employees" },
  { category: "Company Profile", node_name: "Pitchbook", present: true, quality_score: 6.5, last_updated: null, url: "https://pitchbook.com/profiles/company/436496-23", notes: "Basic profile" },
  { category: "Company Profile", node_name: "Bloomberg", present: false, quality_score: null, last_updated: null, url: null, notes: "Absent (expected for private companies)" },

  // News/PR (1/10)
  { category: "News & PR", node_name: "Google News", present: true, quality_score: 3.0, last_updated: null, url: null, notes: "5 articles last 6 months" },

  // Seed Sites (1/5)
  { category: "Seed Site", node_name: "Inc.com", present: true, quality_score: 3.0, last_updated: null, url: "https://www.inc.com/profile/Accurate-Legal-Billing", notes: "Basic listing" },
  { category: "Seed Site", node_name: "TechCrunch", present: false, quality_score: null, last_updated: null, url: null, notes: "Absent" },
  { category: "Seed Site", node_name: "VentureBeat", present: false, quality_score: null, last_updated: null, url: null, notes: "Absent" },
  { category: "Seed Site", node_name: "Forbes", present: false, quality_score: null, last_updated: null, url: null, notes: "Absent" },
  { category: "Seed Site", node_name: "Fast Company", present: false, quality_score: null, last_updated: null, url: null, notes: "Absent" }
];

const citations = [
  {
    source_url: "https://accuratelegalbilling.com",
    source_domain: "accuratelegalbilling.com",
    source_title: "Accurate Legal Billing - Official Website",
    authority_score: 6.0,
    data_structure_score: 9.0,
    brand_alignment_score: 10.0,
    freshness_score: 7.5,
    cross_link_score: 8.0,
    overall_quality: 8.1,
    publication_date: null,
    cited_by_perplexity: true,
    cited_by_chatgpt: false,
    cited_by_gemini: false,
    notes: "Appeared in Perplexity brand-specific query citations"
  },
  {
    source_url: "https://www.g2.com/products/accurate-legal-billing/reviews",
    source_domain: "g2.com",
    source_title: "Accurate Legal Billing Reviews on G2",
    authority_score: 9.0,
    data_structure_score: 8.5,
    brand_alignment_score: 9.0,
    freshness_score: 5.0,
    cross_link_score: 7.0,
    overall_quality: 7.7,
    publication_date: null,
    cited_by_perplexity: true,
    cited_by_chatgpt: false,
    cited_by_gemini: false,
    notes: "Cited in Perplexity brand-specific query; G2 editorial cited by ChatGPT but not ALB profile"
  },
  {
    source_url: "https://www.capterra.com/p/182933/Accurate-Legal-Billing/",
    source_domain: "capterra.com",
    source_title: "Accurate Legal Billing Software on Capterra",
    authority_score: 8.5,
    data_structure_score: 8.0,
    brand_alignment_score: 9.0,
    freshness_score: 4.5,
    cross_link_score: 6.5,
    overall_quality: 7.3,
    publication_date: null,
    cited_by_perplexity: true,
    cited_by_chatgpt: false,
    cited_by_gemini: false,
    notes: "Cited in Perplexity brand-specific query"
  },
  {
    source_url: "https://www.softwareadvice.com/legal/accurate-legal-billing-profile/",
    source_domain: "softwareadvice.com",
    source_title: "Accurate Legal Billing Profile on Software Advice",
    authority_score: 8.0,
    data_structure_score: 7.5,
    brand_alignment_score: 8.5,
    freshness_score: 4.0,
    cross_link_score: 6.0,
    overall_quality: 6.8,
    publication_date: null,
    cited_by_perplexity: true,
    cited_by_chatgpt: false,
    cited_by_gemini: false,
    notes: "Cited in Perplexity brand-specific query; Software Advice comparison page cited by ChatGPT but not ALB profile"
  },
  {
    source_url: "https://www.crunchbase.com/organization/accurate-legal-billing",
    source_domain: "crunchbase.com",
    source_title: "Accurate Legal Billing on Crunchbase",
    authority_score: 9.0,
    data_structure_score: 9.5,
    brand_alignment_score: 7.0,
    freshness_score: 6.5,
    cross_link_score: 8.5,
    overall_quality: 8.1,
    publication_date: null,
    cited_by_perplexity: false,
    cited_by_chatgpt: false,
    cited_by_gemini: false,
    notes: "Location error: shows London, UK instead of Glen Cove, NY"
  },
  {
    source_url: "https://www.linkedin.com/company/accurate-legal-billing",
    source_domain: "linkedin.com",
    source_title: "Accurate Legal Billing on LinkedIn",
    authority_score: 8.5,
    data_structure_score: 9.0,
    brand_alignment_score: 10.0,
    freshness_score: 10.0,
    cross_link_score: 7.5,
    overall_quality: 9.0,
    publication_date: null,
    cited_by_perplexity: false,
    cited_by_chatgpt: false,
    cited_by_gemini: false,
    notes: "Active profile with 107 employees"
  },
  {
    source_url: "https://pitchbook.com/profiles/company/436496-23",
    source_domain: "pitchbook.com",
    source_title: "Accurate Legal Billing on Pitchbook",
    authority_score: 9.5,
    data_structure_score: 8.0,
    brand_alignment_score: 8.0,
    freshness_score: 7.0,
    cross_link_score: 6.5,
    overall_quality: 7.8,
    publication_date: null,
    cited_by_perplexity: false,
    cited_by_chatgpt: false,
    cited_by_gemini: false,
    notes: "Basic profile"
  },
  {
    source_url: "https://www.inc.com/profile/Accurate-Legal-Billing",
    source_domain: "inc.com",
    source_title: "Accurate Legal Billing on Inc.com",
    authority_score: 8.5,
    data_structure_score: 7.0,
    brand_alignment_score: 8.0,
    freshness_score: 3.5,
    cross_link_score: 5.5,
    overall_quality: 6.5,
    publication_date: null,
    cited_by_perplexity: false,
    cited_by_chatgpt: false,
    cited_by_gemini: false,
    notes: "Basic listing"
  },
  {
    source_url: "https://www.producthunt.com/products/accurate-legal-billing/launches",
    source_domain: "producthunt.com",
    source_title: "Accurate Legal Billing on Product Hunt",
    authority_score: 7.5,
    data_structure_score: 8.0,
    brand_alignment_score: 9.0,
    freshness_score: 4.0,
    cross_link_score: 6.5,
    overall_quality: 7.0,
    publication_date: null,
    cited_by_perplexity: false,
    cited_by_chatgpt: false,
    cited_by_gemini: false,
    notes: "Minimal engagement"
  }
];

const llmResponses = [
  {
    platform: "Perplexity",
    query_type: "Evaluative",
    query_text: "What are the top legal billing software in 2025?",
    brand_cited: false,
    brand_rank: null,
    brand_context: "",
    citations_found: 12,
    competitor_1: "Clio",
    competitor_1_rank: 1,
    competitor_2: "LawPay",
    competitor_2_rank: 2,
    competitor_3: "TimeSolv",
    competitor_3_rank: 3,
    response_summary: "Perplexity ranked 12 legal billing solutions with Clio, LawPay, and TimeSolv in top 3. Accurate Legal Billing not mentioned."
  },
  {
    platform: "Perplexity",
    query_type: "Comparative",
    query_text: "Best legal billing software for law firms",
    brand_cited: false,
    brand_rank: null,
    brand_context: "",
    citations_found: 14,
    competitor_1: "Clio",
    competitor_1_rank: 1,
    competitor_2: "LawPay",
    competitor_2_rank: 2,
    competitor_3: "TimeSolv",
    competitor_3_rank: 3,
    response_summary: "Similar ranking to evaluative query. 14 sources cited including LawRank, The Legal Practice, Software Advice. Accurate Legal Billing absent."
  },
  {
    platform: "Perplexity",
    query_type: "Brand-Specific",
    query_text: "Accurate Legal Billing reviews and credentials",
    brand_cited: true,
    brand_rank: 1,
    brand_context: "AI-enabled compliance specialist, founded 2018, focus on billing guidelines adherence. Crozdesk 62/100, SoftwareFinder 3/5, BBB A+ not accredited",
    citations_found: 10,
    competitor_1: null,
    competitor_1_rank: null,
    competitor_2: null,
    competitor_2_rank: null,
    competitor_3: null,
    competitor_3_rank: null,
    response_summary: "Perplexity successfully retrieved brand information when explicitly searched. Cited official website, G2, Capterra, Software Advice, Crozdesk, BBB, SoftwareFinder."
  },
  {
    platform: "ChatGPT",
    query_type: "Evaluative",
    query_text: "What are the top legal billing software in 2025?",
    brand_cited: false,
    brand_rank: null,
    brand_context: "",
    citations_found: 5,
    competitor_1: "LawPay",
    competitor_1_rank: 1,
    competitor_2: "Clio",
    competitor_2_rank: 2,
    competitor_3: "MyCase",
    competitor_3_rank: 3,
    response_summary: "ChatGPT cited 5 sources: G2 editorial (3x), SelectHub, Software Advice comparison. LawPay #1 driven by G2 reviews. Accurate Legal Billing not mentioned."
  },
  {
    platform: "Gemini",
    query_type: "Evaluative",
    query_text: "What are the top legal billing software in 2025?",
    brand_cited: false,
    brand_rank: null,
    brand_context: "",
    citations_found: 10,
    competitor_1: "Clio Manage",
    competitor_1_rank: 1,
    competitor_2: "MyCase",
    competitor_2_rank: 2,
    competitor_3: "Smokeball",
    competitor_3_rank: 3,
    response_summary: "Gemini cited 10 sources including LawRank, Grow Law Firm, The Legal Practice. Clio Manage #1. Accurate Legal Billing not mentioned."
  }
];

const priorities = [
  {
    priority_level: "Immediate",
    title: "Activate G2 Profile with Customer Reviews",
    description: "G2 was ChatGPT's #1 citation source (3 references driving LawPay to #1 position). Zero activation = zero competitive visibility. Claim G2 profile, launch customer review campaign targeting 15+ reviews within 30 days, update profile with features/screenshots/pricing.",
    impact: "High",
    effort: "Medium",
    timeline: "30 days",
    status: "Not Started",
    assigned_to: null,
    due_date: "2025-12-02",
    completed_date: null,
    notes: "Critical for ChatGPT visibility"
  },
  {
    priority_level: "Immediate",
    title: "Secure Placement in LawRank 2025 Comparison",
    description: "LawRank cited by all 3 LLM platforms (Perplexity 2x, ChatGPT 1x, Gemini 1x). This single source drives multi-platform visibility. Contact LawRank editorial to request inclusion in next ranking update, provide demo and differentiation.",
    impact: "High",
    effort: "Medium",
    timeline: "60-90 days",
    status: "Not Started",
    assigned_to: null,
    due_date: "2026-02-01",
    completed_date: null,
    notes: "Multi-platform visibility driver"
  },
  {
    priority_level: "Immediate",
    title: "Fix Crunchbase Location Error & Add Review Platform Coverage",
    description: "Crunchbase shows London, UK (should be Glen Cove, NY). Incomplete review platform coverage reduces citation surface area. Correct Crunchbase HQ, create GetApp/Trustpilot/SelectHub profiles, ensure NAP consistency.",
    impact: "Medium",
    effort: "Low",
    timeline: "30 days",
    status: "Not Started",
    assigned_to: null,
    due_date: "2025-12-02",
    completed_date: null,
    notes: "Data accuracy and coverage expansion"
  }
];

async function exportToAirtable() {
  console.log('🚀 Starting Airtable export for Accurate Legal Billing audit...\n');

  try {
    // Step 1: Create Audit_Runs record
    console.log('Step 1: Creating Audit_Runs record...');
    const auditRecords = await base('Audit_Runs').create([{
      fields: auditData
    }]);
    const auditId = auditRecords[0].id;
    console.log(`✓ Audit record created (ID: ${auditId})\n`);

    // Step 2: Create Trust_Nodes records (batch by 10)
    console.log('Step 2: Creating Trust_Nodes records...');
    let trustNodeCount = 0;
    for (let i = 0; i < trustNodes.length; i += 10) {
      const batch = trustNodes.slice(i, i + 10).map(node => ({
        fields: {
          category: node.category,
          node_name: node.node_name,
          present: node.present,
          quality_score: node.quality_score,
          last_updated: node.last_updated,
          url: node.url,
          notes: node.notes,
          audit: [auditId]
        }
      }));
      await base('Trust_Nodes').create(batch);
      trustNodeCount += batch.length;
      console.log(`  ✓ Created ${batch.length} trust nodes (${trustNodeCount}/${trustNodes.length})`);
    }
    console.log(`✓ ${trustNodeCount} trust nodes created\n`);

    // Step 3: Create Citations records (batch by 10)
    console.log('Step 3: Creating Citations records...');
    let citationCount = 0;
    for (let i = 0; i < citations.length; i += 10) {
      const batch = citations.slice(i, i + 10).map(citation => ({
        fields: {
          source_url: citation.source_url,
          source_domain: citation.source_domain,
          source_title: citation.source_title,
          authority_score: citation.authority_score,
          data_structure_score: citation.data_structure_score,
          brand_alignment_score: citation.brand_alignment_score,
          freshness_score: citation.freshness_score,
          cross_link_score: citation.cross_link_score,
          overall_quality: citation.overall_quality,
          publication_date: citation.publication_date,
          cited_by_perplexity: citation.cited_by_perplexity,
          cited_by_chatgpt: citation.cited_by_chatgpt,
          cited_by_gemini: citation.cited_by_gemini,
          notes: citation.notes,
          audit: [auditId]
        }
      }));
      await base('Citations').create(batch);
      citationCount += batch.length;
      console.log(`  ✓ Created ${batch.length} citations (${citationCount}/${citations.length})`);
    }
    console.log(`✓ ${citationCount} citations created\n`);

    // Step 4: Create LLM_Responses records
    console.log('Step 4: Creating LLM_Responses records...');
    const llmRecords = llmResponses.map(response => ({
      fields: {
        platform: response.platform,
        query_type: response.query_type,
        query_text: response.query_text,
        brand_cited: response.brand_cited,
        brand_rank: response.brand_rank,
        brand_context: response.brand_context,
        citations_found: response.citations_found,
        competitor_1: response.competitor_1,
        competitor_1_rank: response.competitor_1_rank,
        competitor_2: response.competitor_2,
        competitor_2_rank: response.competitor_2_rank,
        competitor_3: response.competitor_3,
        competitor_3_rank: response.competitor_3_rank,
        response_summary: response.response_summary,
        audit: [auditId]
      }
    }));
    await base('LLM_Responses').create(llmRecords);
    console.log(`✓ ${llmResponses.length} LLM responses created\n`);

    // Step 5: Create Priorities records
    console.log('Step 5: Creating Priorities records...');
    const priorityRecords = priorities.map(priority => ({
      fields: {
        priority_level: priority.priority_level,
        title: priority.title,
        description: priority.description,
        impact: priority.impact,
        effort: priority.effort,
        timeline: priority.timeline,
        status: priority.status,
        assigned_to: priority.assigned_to,
        due_date: priority.due_date,
        completed_date: priority.completed_date,
        notes: priority.notes,
        audit: [auditId]
      }
    }));
    await base('Priorities').create(priorityRecords);
    console.log(`✓ ${priorities.length} priorities created\n`);

    // Success summary
    console.log('✅ AUDIT DATA SAVED TO AIRTABLE\n');
    console.log('Summary:');
    console.log(`- Brand: ${auditData.brand_name}`);
    console.log(`- Audit Date: ${auditData.audit_date}`);
    console.log(`- Overall Score: ${auditData.overall_score}/10\n`);
    console.log('Records Created:');
    console.log(`✓ 1 audit run (ID: ${auditId})`);
    console.log(`✓ ${trustNodeCount} trust nodes`);
    console.log(`✓ ${citationCount} citations`);
    console.log(`✓ ${llmResponses.length} LLM responses (3 Perplexity, 1 ChatGPT, 1 Gemini)`);
    console.log(`✓ ${priorities.length} priorities\n`);
    console.log('View in Airtable:');
    console.log(`https://airtable.com/${AIRTABLE_BASE_ID}/tblAuditRuns/viwAllAudits?blocks=hide\n`);
    console.log('Next Steps:');
    console.log('- Review priorities in Airtable');
    console.log('- Assign owners to action items');
    console.log(`- Schedule next audit for ${auditData.next_audit_date}`);

  } catch (error) {
    console.error('❌ Error during Airtable export:');
    console.error(error.message);
    if (error.statusCode) {
      console.error(`Status Code: ${error.statusCode}`);
    }
    if (error.error) {
      console.error('Details:', JSON.stringify(error.error, null, 2));
    }
    process.exit(1);
  }
}

// Execute export
exportToAirtable();
