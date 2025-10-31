#!/usr/bin/env node

/**
 * Export Legal Billing Group Audit to Airtable
 * Writes audit data across 5 tables with proper linking
 */

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
  console.error('❌ AIRTABLE_API_KEY environment variable not set');
  process.exit(1);
}

const base = new Airtable({ apiKey: AIRTABLE_API_KEY }).base(AIRTABLE_BASE_ID);

// Audit data payload
const auditData = {
  audit_run: {
    brand_name: "Legal Billing Group",
    category: "Billing/E-billing/PM Consulting",
    audit_date: "2025-10-31",
    overall_score: 2.1,
    trust_node_coverage: 2,
    trust_node_percentage: 0.12,
    citation_quality: 6.6,
    ai_citation_rate: 0,
    perplexity_rank: null,
    chatgpt_rank: null,
    gemini_rank: null,
    perplexity_cited: false,
    chatgpt_cited: false,
    gemini_cited: false,
    status: "Complete",
    executive_summary: "Legal Billing Group is essentially invisible to AI systems with an overall score of 2.1/10. Zero visibility in ChatGPT and Gemini for category queries. Only 5 of 29 trust nodes present (1.7%). Website data structure crisis (2.0/10) blocking LLM crawlability. Perplexity added credibility warning about lack of third-party verification even for brand-specific queries.",
    top_priority_1: "Fix Website Data Structure (2.0/10 → 8.0/10) - Migrate from Wix, add Schema.org markup",
    top_priority_2: "Publish Client Case Study with quantified outcomes (replicate Epiq's Am Law 100 success)",
    top_priority_3: "Establish G2 Profile with 5+ reviews to eliminate Perplexity's credibility warning",
    next_audit_date: "2025-12-30"
  },
  trust_nodes: [
    {category: "Knowledge Graph", node_name: "Wikipedia", present: false, quality_score: null, last_updated: null, url: null, notes: "No Wikipedia article found - blocks knowledge graph recognition and entity establishment"},
    {category: "Knowledge Graph", node_name: "Wikidata", present: false, quality_score: null, last_updated: null, url: null, notes: "No Wikidata entity - missing structured data connections"},
    {category: "Knowledge Graph", node_name: "Google Knowledge Panel", present: false, quality_score: null, last_updated: null, url: null, notes: "No knowledge panel - requires Wikipedia article or significant external citations"},
    {category: "Review Platform", node_name: "G2", present: false, quality_score: null, last_updated: null, url: null, notes: "No G2 profile - critical gap for B2B legal tech buyers. Searched by Perplexity and ChatGPT but not found."},
    {category: "Review Platform", node_name: "Capterra", present: false, quality_score: null, last_updated: null, url: null, notes: "No Capterra profile - missing from major software/services review platform"},
    {category: "Review Platform", node_name: "Trustpilot", present: false, quality_score: null, last_updated: null, url: null, notes: "No Trustpilot profile - no consumer/business review presence"},
    {category: "Review Platform", node_name: "Software Advice", present: false, quality_score: null, last_updated: null, url: null, notes: "No Software Advice profile - absent from Gartner-owned review site"},
    {category: "Review Platform", node_name: "GetApp", present: false, quality_score: null, last_updated: null, url: null, notes: "No GetApp profile - missing from Gartner's SMB software marketplace"},
    {category: "Directory", node_name: "Crunchbase", present: false, quality_score: null, last_updated: null, url: null, notes: "No Crunchbase profile - missing from primary startup/company database"},
    {category: "Directory", node_name: "Product Hunt", present: false, quality_score: null, last_updated: null, url: null, notes: "No Product Hunt presence - not applicable for consulting services"},
    {category: "Directory", node_name: "AngelList", present: false, quality_score: null, last_updated: null, url: null, notes: "No AngelList profile - missing from startup/talent directory"},
    {category: "Directory", node_name: "Built With", present: false, quality_score: null, last_updated: null, url: null, notes: "No BuiltWith listing - not applicable for services business"},
    {category: "Company Profile", node_name: "LinkedIn Company", present: true, quality_score: 9.0, last_updated: "2025-10-31", url: "https://www.linkedin.com/company/thelegalbillinggroupllc", notes: "Active company page with 161 followers, regular posting (October 2025). Excellent Schema.org markup. Highest quality citation (8.8/10 overall)."},
    {category: "Company Profile", node_name: "Bloomberg", present: false, quality_score: null, last_updated: null, url: null, notes: "No Bloomberg coverage - expected for private small/mid-size consulting firm"},
    {category: "News & PR", node_name: "Google News", present: false, quality_score: null, last_updated: null, url: null, notes: "No coverage in American Lawyer, Law.com, Legal Tech News, ABA Journal in last 6 months"},
    {category: "Seed Site", node_name: "TechCrunch", present: false, quality_score: null, last_updated: null, url: null, notes: "No TechCrunch coverage"},
    {category: "Seed Site", node_name: "VentureBeat", present: false, quality_score: null, last_updated: null, url: null, notes: "No VentureBeat coverage"},
    {category: "Seed Site", node_name: "Forbes", present: false, quality_score: null, last_updated: null, url: null, notes: "No Forbes coverage"},
    {category: "Seed Site", node_name: "Inc.com", present: false, quality_score: null, last_updated: null, url: null, notes: "No Inc.com coverage"},
    {category: "Seed Site", node_name: "Fast Company", present: false, quality_score: null, last_updated: null, url: null, notes: "No Fast Company coverage"}
  ],
  citations: [
    {source_url: "https://www.thelegalbillinggroup.com/", source_domain: "thelegalbillinggroup.com", source_title: "Home | Managed Legal Billing & Financial Services | Expert Law Firm Billing & Collections | The Legal Billing Group", authority_score: 4.0, data_structure_score: 2.0, brand_alignment_score: 7.0, freshness_score: 3.0, cross_link_score: 5.0, overall_quality: 4.2, publication_date: null, cited_by_perplexity: true, cited_by_chatgpt: false, cited_by_gemini: false, notes: "CRITICAL: Wix-hosted site with severe data structure issues (2.0/10) - no Schema.org markup, content obscured by JavaScript. Cited only by Perplexity for brand-specific query."},
    {source_url: "https://www.linkedin.com/company/thelegalbillinggroupllc", source_domain: "linkedin.com", source_title: "The Legal Billing Group, LLC | LinkedIn", authority_score: 8.5, data_structure_score: 9.0, brand_alignment_score: 9.5, freshness_score: 9.0, cross_link_score: 8.0, overall_quality: 8.8, publication_date: "2025-10-31", cited_by_perplexity: false, cited_by_chatgpt: false, cited_by_gemini: false, notes: "Highest quality citation. Excellent Schema.org markup, active posting through Oct 2025, 161 followers. Premier trust signal but not cited by LLMs for category queries."},
    {source_url: "https://theorg.com/org/the-legal-billing-group", source_domain: "theorg.com", source_title: "The Legal Billing Group | The Org", authority_score: 6.0, data_structure_score: 8.0, brand_alignment_score: 9.0, freshness_score: 4.0, cross_link_score: 6.0, overall_quality: 6.6, publication_date: null, cited_by_perplexity: false, cited_by_chatgpt: false, cited_by_gemini: false, notes: "Well-structured directory profile but stale (0 followers, empty employee directory). Employee count discrepancy with LinkedIn (11-50 vs 2-10)."}
  ],
  llm_responses: [
    {platform: "Perplexity", query_type: "Evaluative", query_text: "What are the top legal billing consulting firms in 2025?", brand_cited: false, brand_rank: null, brand_context: null, citations_found: 11, competitor_1: "Clio", competitor_1_rank: 1, competitor_2: "Aderant", competitor_2_rank: 2, competitor_3: "PracticePanther", competitor_3_rank: 3, response_summary: "Brand completely absent from evaluative query. Perplexity categorized legal billing consulting into software providers (Clio, Aderant, PracticePanther) and LPO firms (UnitedLex, Integreon). Managed services consulting model not represented."},
    {platform: "Perplexity", query_type: "Comparative", query_text: "Best legal billing and e-billing services for mid-size law firms", brand_cited: false, brand_rank: null, brand_context: null, citations_found: 13, competitor_1: "LeanLaw", competitor_1_rank: 1, competitor_2: "Clio", competitor_2_rank: 2, competitor_3: "Centerbase", competitor_3_rank: 3, response_summary: "Brand absent from comparative query targeting mid-size firms (a stated target market). LeanLaw dominated with LEDES + QuickBooks narrative. Perplexity interpreted query as software selection, ignoring outsourced/managed services model."},
    {platform: "Perplexity", query_type: "Brand-Specific", query_text: "Legal Billing Group reviews and credentials", brand_cited: true, brand_rank: 1, brand_context: "Primary subject with description as 'managed legal financial services provider.' CRITICAL: Perplexity added 'Critical Analysis' section stating: 'All available reviews and credentials originate from the company's own website and should be viewed as promotional rather than independently verified. There are no results from third-party review sites, independent accreditors like the Better Business Bureau, or legal industry organizations.'", citations_found: 11, competitor_1: null, competitor_1_rank: null, competitor_2: null, competitor_2_rank: null, competitor_3: null, competitor_3_rank: null, response_summary: "Brand-specific query returned company information exclusively from official website. Perplexity detected absence of third-party validation and inserted critical analysis warning users about lack of independent verification. G2 and BBB were searched but no brand profile found."},
    {platform: "ChatGPT", query_type: "Evaluative", query_text: "What are the top legal billing consulting firms in 2025?", brand_cited: false, brand_rank: null, brand_context: "Not mentioned in response", citations_found: 41, competitor_1: "LegalBillReview.com", competitor_1_rank: 1, competitor_2: "LegalFee Consultants", competitor_2_rank: 2, competitor_3: "Lether Consulting", competitor_3_rank: 3, response_summary: "Legal Billing Group completely absent from evaluative query. ChatGPT ranked 5 competitors with strong web presence, quantifiable claims ('75% AmLaw 200'), and clear niche positioning. Brand lacks crawlable content and authority markers."},
    {platform: "Gemini", query_type: "Evaluative", query_text: "What are the top legal billing consulting firms in 2025?", brand_cited: false, brand_rank: null, brand_context: null, citations_found: 5, competitor_1: "Epiq", competitor_1_rank: 1, competitor_2: "Deloitte", competitor_2_rank: 2, competitor_3: "Aderant", competitor_3_rank: 3, response_summary: "Brand absent from all three categories (Global/Specialized/Boutique). Epiq dominated with 4 citations from single Am Law 100 case study. Deloitte cited for value-based pricing thought leadership. Legal Billing Group has no discoverable content, case studies, or category positioning."}
  ],
  priorities: [
    {priority_level: "Immediate", title: "Fix Website Data Structure", description: "Migrate from Wix to semantic-friendly CMS (WordPress with Yoast/RankMath, Webflow, or custom build) OR implement Wix Studio advanced SEO features. Add Schema.org Organization markup (JSON-LD) with organization name, founders (Alex Newberry, Marla Weems), services array, sameAs links. Implement semantic HTML with proper heading hierarchy, article structure, Open Graph tags. Add publication dates to all content pages.", impact: "High", effort: "High", timeline: "2-3 weeks", status: "Not Started", assigned_to: null, due_date: null, completed_date: null, notes: "CRITICAL: Without machine-readable structure, Legal Billing Group is invisible to AI systems even when brand name is searched. This blocks all LLM crawlability."},
    {priority_level: "Immediate", title: "Publish Client Case Study", description: "Create 1-2 detailed client transformation case studies featuring: specific client tier (e.g., 'Top 200 law firm,' '50-attorney litigation boutique'), quantified outcomes (e.g., '86% cost reduction, 51% revenue increase'), process-level detail (streamlined time entry, implemented LEDES compliance, accelerated collections), timeline (3-month transformation, 6-month results). Publish on company website with publication date, submit to legal industry publications (Law.com, ABA Journal, Legal Tech News), add to LinkedIn Company Page as article.", impact: "High", effort: "Medium", timeline: "2 weeks", status: "Not Started", assigned_to: null, due_date: null, completed_date: null, notes: "Epiq's single Am Law 100 case study was cited 4 times by Gemini, outperforming all generic service descriptions. ChatGPT and Gemini both heavily weighted competitors with specific client examples."},
    {priority_level: "Immediate", title: "Establish G2 Profile with 5+ Reviews", description: "Create G2 profile under 'Legal Billing Services' or 'Legal Consulting' category. Request reviews from 5-10 satisfied law firm clients with review template focusing on: cost savings, process improvement, responsiveness, expertise. Target 4.5+ star average rating. Respond to all reviews (demonstrates engagement).", impact: "High", effort: "Medium", timeline: "3-4 weeks", status: "Not Started", assigned_to: null, due_date: null, completed_date: null, notes: "Perplexity's 'Critical Analysis' section explicitly stated 'no third-party review sites' as credibility gap. G2 was cited by ChatGPT and searched by Perplexity (found nothing). This directly addresses AI-generated warning."},
    {priority_level: "Strategic", title: "Build Knowledge Graph Presence (Google Business Profile + Wikidata)", description: "Claim/create Google Business Profile for West Hollywood location with comprehensive business information: services, hours, photos, founder info. Once sufficient external citations exist, create Wikidata entity. Work toward Wikipedia notability prerequisites through news coverage and industry recognition.", impact: "High", effort: "Medium", timeline: "45-60 days", status: "Not Started", assigned_to: null, due_date: null, completed_date: null, notes: "Knowledge graphs establish entity recognition in LLM systems. Google Knowledge Panel provides structured data that ChatGPT and Perplexity reference."},
    {priority_level: "Strategic", title: "Expand Review Platform Presence (Capterra + Trustpilot)", description: "Create Capterra listing under 'Legal Consulting Services' category. Set up Trustpilot business profile. Develop systematic client testimonial collection process (post-engagement surveys, incentivized reviews). Monitor and respond to all reviews within 48 hours.", impact: "High", effort: "Medium", timeline: "60-90 days", status: "Not Started", assigned_to: null, due_date: null, completed_date: null, notes: "Review platforms are frequently cited by LLMs as trust signals. Presence on 3+ platforms creates cross-validation."},
    {priority_level: "Strategic", title: "Establish Industry Directory Presence", description: "Create Crunchbase profile with company overview, team bios, competitors. Apply for directory.lawnext.com listing in 'Time & Billing' category (cited by ChatGPT). Submit to lexworkplace.com 'Legal Billing Software/Services' section (cited 2x by ChatGPT). Apply to DesignRush 'Legal Consulting Firms' rankings. Update TheOrg profile: verify company, populate employee directory.", impact: "Medium", effort: "Low", timeline: "60 days", status: "Not Started", assigned_to: null, due_date: null, completed_date: null, notes: "ChatGPT referenced these specific directories when ranking competitors. Directories provide cross-validation and category positioning."},
    {priority_level: "Strategic", title: "Generate News/PR Coverage", description: "Pitch byline article to Legal Tech News, ABA Journal, or Law.com on 'Legal Billing Software vs. Managed Services' or 'E-billing Compliance in 2025.' Issue press release for client milestone via PR Newswire or BusinessWire. Respond to journalist queries via HARO, Qwoted. Target legal operations podcasts (CLOC, LawNext, Modern Law Library).", impact: "High", effort: "High", timeline: "90 days", status: "Not Started", assigned_to: null, due_date: null, completed_date: null, notes: "News coverage creates authoritative third-party citations that LLMs heavily weight. Deloitte's thought leadership article was cited by Gemini. Long lead time for pitching/publishing."},
    {priority_level: "Long-term", title: "Trust Node Saturation Strategy", description: "Establish presence across 22+ trust nodes (currently 5). Prioritize: Wikipedia article (once notability criteria met), G2/Capterra/Trustpilot (5+ reviews each), Crunchbase, 10+ directory listings, 5+ news articles/mentions. Build 'citation web' where each trust node references others.", impact: "High", effort: "High", timeline: "6-12 months", status: "Not Started", assigned_to: null, due_date: null, completed_date: null, notes: "Long-term goal: Be cited by all 3 platforms (Perplexity, ChatGPT, Gemini) for evaluative queries about legal billing consulting."},
    {priority_level: "Long-term", title: "Content Authority at Scale", description: "Publish 3-5 articles/month on company blog covering legal billing best practices, e-billing compliance guides (LEDES, UTBMS), law firm financial operations, case studies with quantified outcomes, industry trend analysis. Guest post on 10+ authoritative legal sites. Repurpose content across LinkedIn articles, SlideShare, podcasts, webinars.", impact: "High", effort: "High", timeline: "6-12 months", status: "Not Started", assigned_to: null, due_date: null, completed_date: null, notes: "Content marketing creates citeable assets that LLMs reference. Competitors with prolific content outranked those with superior services but limited content."},
    {priority_level: "Long-term", title: "Thought Leadership Recognition", description: "Position Alex Newberry as industry expert: speaking engagements at CLOC, ALA, ILTA conferences. Submit for industry awards (Legalweek Innovation Awards, ABA TechShow). Publish annual 'State of Legal Billing' research report with original data (survey 100+ law firms). Get quoted in industry publications as subject matter expert.", impact: "Medium", effort: "High", timeline: "6-12 months", status: "Not Started", assigned_to: null, due_date: null, completed_date: null, notes: "Establishes category authority and generates news coverage. Creates authoritative citations that LLMs reference."}
  ]
};

// Main export function
async function exportToAirtable() {
  console.log('🚀 Starting Airtable export for Legal Billing Group audit...\n');

  let auditRecordId;
  const results = {
    audit_run: 0,
    trust_nodes: 0,
    citations: 0,
    llm_responses: 0,
    priorities: 0
  };

  try {
    // Step 1: Create Audit Run record
    console.log('📝 Step 1: Creating Audit_Runs record...');
    const auditRecord = await base('Audit_Runs').create([{
      fields: auditData.audit_run
    }]);
    auditRecordId = auditRecord[0].id;
    results.audit_run = 1;
    console.log(`✓ Audit run created (ID: ${auditRecordId})\n`);

    // Step 2: Create Trust Nodes records (batch of 10)
    console.log('📝 Step 2: Creating Trust_Nodes records...');
    for (let i = 0; i < auditData.trust_nodes.length; i += 10) {
      const batch = auditData.trust_nodes.slice(i, i + 10).map(node => ({
        fields: { ...node, audit: [auditRecordId] }
      }));
      await base('Trust_Nodes').create(batch);
      results.trust_nodes += batch.length;
      console.log(`✓ Created ${batch.length} trust nodes (${results.trust_nodes}/${auditData.trust_nodes.length})`);
    }
    console.log();

    // Step 3: Create Citations records (batch of 10)
    console.log('📝 Step 3: Creating Citations records...');
    for (let i = 0; i < auditData.citations.length; i += 10) {
      const batch = auditData.citations.slice(i, i + 10).map(citation => ({
        fields: { ...citation, audit: [auditRecordId] }
      }));
      await base('Citations').create(batch);
      results.citations += batch.length;
      console.log(`✓ Created ${batch.length} citations (${results.citations}/${auditData.citations.length})`);
    }
    console.log();

    // Step 4: Create LLM Responses records
    console.log('📝 Step 4: Creating LLM_Responses records...');
    const llmRecords = auditData.llm_responses.map(response => ({
      fields: { ...response, audit: [auditRecordId] }
    }));
    await base('LLM_Responses').create(llmRecords);
    results.llm_responses = llmRecords.length;
    console.log(`✓ Created ${results.llm_responses} LLM responses\n`);

    // Step 5: Create Priorities records
    console.log('📝 Step 5: Creating Priorities records...');
    const priorityRecords = auditData.priorities.map(priority => ({
      fields: { ...priority, audit: [auditRecordId] }
    }));
    await base('Priorities').create(priorityRecords);
    results.priorities = priorityRecords.length;
    console.log(`✓ Created ${results.priorities} priorities\n`);

    // Success summary
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✅ AUDIT DATA SAVED TO AIRTABLE');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    console.log('Summary:');
    console.log(`- Brand: ${auditData.audit_run.brand_name}`);
    console.log(`- Audit Date: ${auditData.audit_run.audit_date}`);
    console.log(`- Overall Score: ${auditData.audit_run.overall_score}/10\n`);

    console.log('Records Created:');
    console.log(`✓ ${results.audit_run} audit run (ID: ${auditRecordId})`);
    console.log(`✓ ${results.trust_nodes} trust nodes`);
    console.log(`✓ ${results.citations} citations`);
    console.log(`✓ ${results.llm_responses} LLM responses (${auditData.llm_responses.filter(r => r.platform === 'Perplexity').length} Perplexity, ${auditData.llm_responses.filter(r => r.platform === 'ChatGPT').length} ChatGPT, ${auditData.llm_responses.filter(r => r.platform === 'Gemini').length} Gemini)`);
    console.log(`✓ ${results.priorities} priorities\n`);

    console.log('View in Airtable:');
    console.log(`https://airtable.com/${AIRTABLE_BASE_ID}\n`);

    console.log('Next Steps:');
    console.log('- Review priorities in Airtable');
    console.log('- Assign owners to action items');
    console.log(`- Schedule next audit for ${auditData.audit_run.next_audit_date}`);

  } catch (error) {
    console.error('\n❌ Export failed:', error.message);
    if (error.statusCode) {
      console.error(`Status: ${error.statusCode}`);
    }
    if (error.error) {
      console.error('Details:', JSON.stringify(error.error, null, 2));
    }
    process.exit(1);
  }
}

// Run export
exportToAirtable();
