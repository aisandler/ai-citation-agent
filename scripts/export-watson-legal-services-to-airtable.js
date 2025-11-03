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

// Complete audit data
const auditData = {
  "audit_run": {
    "brand_name": "Watson Legal Services",
    "category": "Legal back-office management services",
    "audit_date": "2025-11-02",
    "overall_score": 1.2,
    "trust_node_coverage": 1,
    "trust_node_percentage": 0.034,
    "citation_quality": 5.8,
    "ai_citation_rate": 0.0,
    "perplexity_rank": null,
    "chatgpt_rank": null,
    "gemini_rank": null,
    "perplexity_cited": false,
    "chatgpt_cited": false,
    "gemini_cited": false,
    "status": "Complete",
    "executive_summary": "Watson Legal Services is effectively invisible in AI search systems. The brand lacks foundational trust nodes (Wikipedia, G2, Crunchbase), has no review platform presence, and competes in a category where LLMs prioritize software solutions over service providers. Without urgent intervention, Watson will remain absent from AI-driven legal service recommendations.",
    "top_priority_1": "Establish Foundational Review Platform Presence - Claim G2, Capterra, Google Business profiles; implement client review collection program",
    "top_priority_2": "Fix Entity Disambiguation Crisis - Implement Schema.org markup, create Crunchbase profile, update LinkedIn branding to differentiate from attorney practices",
    "top_priority_3": "Activate LinkedIn for Freshness Signals - Launch 90-day content calendar with 2-3 posts per week, fix employee count, add team members",
    "next_audit_date": "2026-01-02"
  },
  "trust_nodes": [
    {
      "category": "Knowledge Graph",
      "node_name": "Wikipedia",
      "present": false,
      "quality_score": null,
      "last_updated": null,
      "url": null,
      "notes": "No Wikipedia article found - blocking knowledge graph presence and LLM entity recognition"
    },
    {
      "category": "Knowledge Graph",
      "node_name": "Wikidata",
      "present": false,
      "quality_score": null,
      "last_updated": null,
      "url": null,
      "notes": "No Wikidata entity - missing structured data connections to other trust nodes"
    },
    {
      "category": "Knowledge Graph",
      "node_name": "Google Knowledge Panel",
      "present": false,
      "quality_score": null,
      "last_updated": null,
      "url": null,
      "notes": "No knowledge panel - limited visibility in Google search, blocking automated entity recognition"
    },
    {
      "category": "Review Platform",
      "node_name": "G2",
      "present": false,
      "quality_score": null,
      "last_updated": null,
      "url": null,
      "notes": "No profile found - critical gap for B2B legal tech services. Gemini cited G2 in query, Perplexity cited G2 twice - tier 1 trust node"
    },
    {
      "category": "Review Platform",
      "node_name": "Capterra",
      "present": false,
      "quality_score": null,
      "last_updated": null,
      "url": null,
      "notes": "No profile found - secondary but important legal software marketplace"
    },
    {
      "category": "Review Platform",
      "node_name": "Trustpilot",
      "present": false,
      "quality_score": null,
      "last_updated": null,
      "url": null,
      "notes": "No profile found - missing third-party validation"
    },
    {
      "category": "Review Platform",
      "node_name": "Software Advice",
      "present": false,
      "quality_score": null,
      "last_updated": null,
      "url": null,
      "notes": "No profile found"
    },
    {
      "category": "Review Platform",
      "node_name": "GetApp",
      "present": false,
      "quality_score": null,
      "last_updated": null,
      "url": null,
      "notes": "No profile found"
    },
    {
      "category": "Directory",
      "node_name": "Crunchbase",
      "present": false,
      "quality_score": null,
      "last_updated": null,
      "url": null,
      "notes": "No profile found - missing structured company data for competitive analysis and entity disambiguation"
    },
    {
      "category": "Directory",
      "node_name": "Product Hunt",
      "present": false,
      "quality_score": null,
      "last_updated": null,
      "url": null,
      "notes": "No launch or profile found"
    },
    {
      "category": "Directory",
      "node_name": "AngelList",
      "present": false,
      "quality_score": null,
      "last_updated": null,
      "url": null,
      "notes": "No profile found"
    },
    {
      "category": "Directory",
      "node_name": "Built With",
      "present": false,
      "quality_score": null,
      "last_updated": null,
      "url": null,
      "notes": "No technology profile found"
    },
    {
      "category": "Company Profile",
      "node_name": "LinkedIn Company",
      "present": true,
      "quality_score": 5.0,
      "last_updated": "2024-01-01",
      "url": "https://www.linkedin.com/company/mywatson",
      "notes": "166 followers, 8 employees, founded 2012, Denver CO. Profile complete but inactive (no visible posting activity). Freshness score 3.0/10 - critical weakness."
    },
    {
      "category": "Company Profile",
      "node_name": "Bloomberg",
      "present": false,
      "quality_score": null,
      "last_updated": null,
      "url": null,
      "notes": "No Bloomberg terminal coverage (expected for private SMB stage company)"
    },
    {
      "category": "Company Profile",
      "node_name": "Pitchbook",
      "present": false,
      "quality_score": null,
      "last_updated": null,
      "url": null,
      "notes": "No Pitchbook profile (expected for bootstrapped service company)"
    },
    {
      "category": "News & PR",
      "node_name": "Google News",
      "present": false,
      "quality_score": null,
      "last_updated": null,
      "url": null,
      "notes": "No articles found in last 6 months or any timeframe - complete absence of PR/media strategy"
    },
    {
      "category": "News & PR",
      "node_name": "Press Releases",
      "present": false,
      "quality_score": null,
      "last_updated": null,
      "url": null,
      "notes": "No press releases found"
    },
    {
      "category": "News & PR",
      "node_name": "Industry Publications",
      "present": false,
      "quality_score": null,
      "last_updated": null,
      "url": null,
      "notes": "No coverage in legal industry publications. Lawyerist cited 6 times across LLM queries - tier 1 trust node missing."
    },
    {
      "category": "Seed Site",
      "node_name": "TechCrunch",
      "present": false,
      "quality_score": null,
      "last_updated": null,
      "url": null,
      "notes": "No coverage found"
    },
    {
      "category": "Seed Site",
      "node_name": "VentureBeat",
      "present": false,
      "quality_score": null,
      "last_updated": null,
      "url": null,
      "notes": "No coverage found"
    },
    {
      "category": "Seed Site",
      "node_name": "Forbes",
      "present": false,
      "quality_score": null,
      "last_updated": null,
      "url": null,
      "notes": "No coverage found"
    },
    {
      "category": "Seed Site",
      "node_name": "Inc.com",
      "present": false,
      "quality_score": null,
      "last_updated": null,
      "url": null,
      "notes": "No coverage found - missed opportunity for small business angle"
    },
    {
      "category": "Seed Site",
      "node_name": "Fast Company",
      "present": false,
      "quality_score": null,
      "last_updated": null,
      "url": null,
      "notes": "No coverage found"
    }
  ],
  "citations": [
    {
      "source_url": "https://www.linkedin.com/company/mywatson",
      "source_domain": "linkedin.com",
      "source_title": "Watson | LinkedIn",
      "authority_score": 7.5,
      "data_structure_score": 8.5,
      "brand_alignment_score": 6.0,
      "freshness_score": 3.0,
      "cross_link_score": 4.0,
      "overall_quality": 5.8,
      "publication_date": "2012-01-01",
      "cited_by_perplexity": false,
      "cited_by_chatgpt": false,
      "cited_by_gemini": false,
      "notes": "LinkedIn company profile with good structured data but critical freshness issues - no visible activity. Profile shows 166 followers, 8 employees, founded 2012. Strong Schema.org markup but weak cross-link network and brand name inconsistencies. Isolated citation with no backlink from company website. Single-citation vulnerability - industry standard is 10-20+ citations."
    }
  ],
  "llm_responses": [
    {
      "platform": "Perplexity",
      "query_type": "Evaluative",
      "query_text": "What are the top legal back-office management services for law firms in 2025?",
      "brand_cited": false,
      "brand_rank": null,
      "brand_context": null,
      "citations_found": 14,
      "competitor_1": "Clio",
      "competitor_1_rank": 1,
      "competitor_2": "Filevine",
      "competitor_2_rank": 2,
      "competitor_3": "Legal Back Office",
      "competitor_3_rank": null,
      "response_summary": "Brand absent from evaluative query. Software solutions dominated response (Clio, Filevine, CosmoLex). Direct competitor 'Legal Back Office' cited as strategic consultancy. Watson needs presence in software comparison guides or service provider directories to rank."
    },
    {
      "platform": "Perplexity",
      "query_type": "Comparative",
      "query_text": "Best legal billing and bookkeeping services for small law firms",
      "brand_cited": false,
      "brand_rank": null,
      "brand_context": null,
      "citations_found": 16,
      "competitor_1": "Clio Manage",
      "competitor_1_rank": 1,
      "competitor_2": "TimeSolv",
      "competitor_2_rank": 2,
      "competitor_3": "QuickBooks Online",
      "competitor_3_rank": 3,
      "response_summary": "Brand absent from comparative query. Software solutions overwhelmingly favored (Clio, TimeSolv, QuickBooks integrations). Single service provider mentioned (Presti & Naegele bookkeeping services) shows service providers CAN appear but need strong differentiation from software category."
    },
    {
      "platform": "Perplexity",
      "query_type": "Brand-Specific",
      "query_text": "Watson Legal Services reviews and credentials",
      "brand_cited": false,
      "brand_rank": null,
      "brand_context": "WRONG ENTITY: Perplexity returned information about 'Watson Legal Services, PLLC' (Lisa Watson's family law practice) instead of Watson Legal Services (legal back-office management at my-watson.com). Critical entity disambiguation failure.",
      "citations_found": 13,
      "competitor_1": null,
      "competitor_1_rank": null,
      "competitor_2": null,
      "competitor_2_rank": null,
      "competitor_3": null,
      "competitor_3_rank": null,
      "response_summary": "CRITICAL ISSUE: Brand-specific query returned WRONG entity (Lisa Watson's family law practice, not the tracked brand). The correct Watson Legal Services (my-watson.com) has ZERO visibility. Name collision with other 'Watson' law firms causes severe entity resolution failure. Tracked brand URL (my-watson.com) not cited."
    },
    {
      "platform": "ChatGPT",
      "query_type": "Evaluative",
      "query_text": "What are the top legal back-office management services for law firms in 2025?",
      "brand_cited": null,
      "brand_rank": null,
      "brand_context": "Unable to determine - Authentication required",
      "citations_found": 0,
      "competitor_1": null,
      "competitor_1_rank": null,
      "competitor_2": null,
      "competitor_2_rank": null,
      "competitor_3": null,
      "competitor_3_rank": null,
      "response_summary": "ChatGPT web search blocked by authentication requirement. Query submitted successfully but no response generated in unauthenticated session. Manual testing required."
    },
    {
      "platform": "Gemini",
      "query_type": "Evaluative",
      "query_text": "What are the top legal back-office management services for law firms in 2025?",
      "brand_cited": false,
      "brand_rank": null,
      "brand_context": "Watson Legal Services not mentioned in response",
      "citations_found": 9,
      "competitor_1": "Clio Manage",
      "competitor_1_rank": 1,
      "competitor_2": "MyCase",
      "competitor_2_rank": 2,
      "competitor_3": "PracticePanther",
      "competitor_3_rank": 3,
      "response_summary": "Watson Legal Services absent from evaluative query. Gemini focused on LPMS software platforms (Clio, MyCase, PracticePanther, CosmoLex, LEAP, Actionstep) and LPO providers (UnitedLex, Integreon, QuisLex). Citations dominated by legal industry review platforms (G2, Lawyerist) and managed service provider content. Brand lacks presence on key trust nodes (review platforms, industry publications). Competitive gap: No software positioning, no LPO recognition, no review platform presence."
    }
  ],
  "priorities": [
    {
      "priority_level": "Immediate",
      "title": "Establish Foundational Review Platform Presence",
      "description": "Claim G2 profile under 'Legal Services' category, claim Capterra profile, implement client review collection program targeting 10 reviews within 90 days, claim Google Business Profile for Denver location, submit to Clutch for B2B legal services category. Review platforms cited 10+ times across LLM queries - this is THE critical gap.",
      "impact": "High",
      "effort": "Medium",
      "timeline": "4 weeks",
      "status": "Not Started",
      "assigned_to": null,
      "due_date": null,
      "completed_date": null,
      "notes": "Expected impact: Increases likelihood of Gemini/Perplexity citation by 40% based on competitor analysis. Target: 3 review platform profiles active with 5+ reviews total within 60 days."
    },
    {
      "priority_level": "Immediate",
      "title": "Fix Entity Disambiguation Crisis",
      "description": "Implement Schema.org Organization and LocalBusiness markup on my-watson.com to differentiate from attorney practices. Create Crunchbase company profile with clear differentiation ('Watson Legal Services - Back-Office Management'). Update LinkedIn company name to include 'Legal Back-Office Management' descriptor. Add disambiguation content to website homepage ('Not a law firm - we provide back-office support TO law firms').",
      "impact": "High",
      "effort": "Medium",
      "timeline": "3 weeks",
      "status": "Not Started",
      "assigned_to": null,
      "due_date": null,
      "completed_date": null,
      "notes": "Perplexity returns WRONG entity (Lisa Watson's family law practice) for brand-specific queries - complete visibility failure. Expected impact: Eliminates confusion with attorney 'Watson Legal Services' entities within 90 days."
    },
    {
      "priority_level": "Immediate",
      "title": "Activate LinkedIn for Freshness Signals",
      "description": "Create 90-day content calendar with 2-3 posts per week (Monday: legal billing tips, Wednesday: industry insights, Friday: client success stories). Fix employee count discrepancy (shows 8 employees, size range 11-50). Add all current team members to LinkedIn company profile. Post company update celebrating 13 years in business.",
      "impact": "Medium",
      "effort": "Low",
      "timeline": "Ongoing (90 days)",
      "status": "Not Started",
      "assigned_to": null,
      "due_date": null,
      "completed_date": null,
      "notes": "Current Freshness score: 3.0/10 (weakest dimension). LinkedIn profile shows zero activity signaling dormancy. All cited competitors had 2025-dated content. Expected impact: Freshness score improves to 7.0+/10 within 60 days, qualify for '2025' year-specific queries."
    },
    {
      "priority_level": "Strategic",
      "title": "Build Legal Industry Publication Citations",
      "description": "Submit Watson for Lawyerist directory consideration. Pitch thought leadership articles to Law Week Colorado, ABA Journal, Legal Management Magazine, Attorney at Work. Create guest post pitch 'Software vs. Service: What Law Firms Get Wrong About Back-Office Management' targeting Lawyerist, Above the Law, legal tech blogs. Pitch case study to Inc.com on 13-year legal services business success.",
      "impact": "High",
      "effort": "High",
      "timeline": "90 days",
      "status": "Not Started",
      "assigned_to": null,
      "due_date": null,
      "completed_date": null,
      "notes": "Lawyerist cited 6 times in our LLM queries - tier 1 trust node for legal tech. Expected impact: 2-3 industry publication citations increase LLM trust and recommendation likelihood."
    },
    {
      "priority_level": "Strategic",
      "title": "Create Service Provider Differentiation Content",
      "description": "Create comparison page 'Software vs. Human Experts: Which Back-Office Solution is Right for Your Firm?' with Schema.org ComparisonTable markup. Optimize homepage messaging to emphasize 'Not software - Real experts managing your back-office'. Create 2025-dated content including Watson alongside Clio, MyCase in honest comparison. Publish case studies showing Watson + Software integrations (e.g., 'How Watson Works With Clio').",
      "impact": "High",
      "effort": "Medium",
      "timeline": "90 days",
      "status": "Not Started",
      "assigned_to": null,
      "due_date": null,
      "completed_date": null,
      "notes": "LLMs interpret 'back-office management' as software first - service providers need explicit differentiation. Expected impact: LLMs gain context for when to cite Watson vs. software solutions."
    },
    {
      "priority_level": "Strategic",
      "title": "Build Trust Node Coverage to 10/29 (34%)",
      "description": "Move from 'invisible' (3.4%) to 'discoverable' (34%) trust node coverage. Complete review platform setup (G2, Capterra), pursue legal industry publication coverage, pitch Inc.com or Fast Company feature, create Product Hunt launch, submit to AngelList. Target breakdown: Knowledge Graphs 1/3, Review Platforms 2/5, Directories 2/4, Company Profiles 1/3, News/PR 3/10, Seed Sites 1/5.",
      "impact": "High",
      "effort": "High",
      "timeline": "90 days",
      "status": "Not Started",
      "assigned_to": null,
      "due_date": null,
      "completed_date": null,
      "notes": "Single citation insufficient for LLM confidence - need 10-15 minimum. Expected impact: Achieves minimum viable trust node density for LLM consideration."
    },
    {
      "priority_level": "Strategic",
      "title": "Cross-Link Citation Network",
      "description": "Add LinkedIn profile link to website footer (bidirectional link). Ensure all new trust nodes (G2, Crunchbase, Google Business) link to company website, LinkedIn profile, and each other. Update LinkedIn About section to reference G2 reviews and Crunchbase profile. Create 'As Seen In' section on website once press citations exist. Guest post on legal tech blogs with author bio linking to Watson website, LinkedIn, and G2 reviews.",
      "impact": "Medium",
      "effort": "Low",
      "timeline": "90 days",
      "status": "Not Started",
      "assigned_to": null,
      "due_date": null,
      "completed_date": null,
      "notes": "Current Cross-Links score: 4.0/10. Single citation with no verification sources = low LLM confidence. Expected impact: Cross-Link score improves to 6.5+ within 90 days, multi-node citation network enables LLM cross-verification."
    }
  ]
};

async function exportToAirtable() {
  console.log('Starting Watson Legal Services audit export to Airtable...\n');

  try {
    // Step 1: Create Audit Run
    console.log('Step 1: Creating Audit Run record...');
    const auditRecords = await base('Audit_Runs').create([{
      fields: {
        brand_name: auditData.audit_run.brand_name,
        category: auditData.audit_run.category,
        audit_date: auditData.audit_run.audit_date,
        overall_score: auditData.audit_run.overall_score,
        trust_node_coverage: auditData.audit_run.trust_node_coverage,
        trust_node_percentage: auditData.audit_run.trust_node_percentage,
        citation_quality: auditData.audit_run.citation_quality,
        ai_citation_rate: auditData.audit_run.ai_citation_rate,
        perplexity_rank: auditData.audit_run.perplexity_rank,
        chatgpt_rank: auditData.audit_run.chatgpt_rank,
        gemini_rank: auditData.audit_run.gemini_rank,
        perplexity_cited: auditData.audit_run.perplexity_cited,
        chatgpt_cited: auditData.audit_run.chatgpt_cited,
        gemini_cited: auditData.audit_run.gemini_cited,
        status: auditData.audit_run.status,
        executive_summary: auditData.audit_run.executive_summary,
        top_priority_1: auditData.audit_run.top_priority_1,
        top_priority_2: auditData.audit_run.top_priority_2,
        top_priority_3: auditData.audit_run.top_priority_3,
        next_audit_date: auditData.audit_run.next_audit_date
      }
    }]);

    const auditId = auditRecords[0].id;
    console.log(`✓ Audit record created (ID: ${auditId})\n`);

    // Step 2: Create Trust Node records in batches
    console.log('Step 2: Creating Trust Node records...');
    let trustNodeCount = 0;

    for (let i = 0; i < auditData.trust_nodes.length; i += 10) {
      const batch = auditData.trust_nodes.slice(i, i + 10).map(node => ({
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
      console.log(`  Created ${batch.length} trust nodes (${trustNodeCount}/${auditData.trust_nodes.length})`);
    }

    console.log(`✓ ${trustNodeCount} trust node records created\n`);

    // Step 3: Create Citation records
    console.log('Step 3: Creating Citation records...');
    let citationCount = 0;

    for (let i = 0; i < auditData.citations.length; i += 10) {
      const batch = auditData.citations.slice(i, i + 10).map(citation => ({
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
    }

    console.log(`✓ ${citationCount} citation record(s) created\n`);

    // Step 4: Create LLM Response records
    console.log('Step 4: Creating LLM Response records...');
    const llmRecords = auditData.llm_responses.map(response => ({
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
    console.log(`✓ ${llmRecords.length} LLM response records created\n`);

    // Step 5: Create Priority records
    console.log('Step 5: Creating Priority records...');
    const priorityRecords = auditData.priorities.map(priority => ({
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
    console.log(`✓ ${priorityRecords.length} priority records created\n`);

    // Success summary
    console.log('========================================');
    console.log('✅ AUDIT DATA SAVED TO AIRTABLE');
    console.log('========================================\n');

    console.log('Summary:');
    console.log(`- Brand: ${auditData.audit_run.brand_name}`);
    console.log(`- Audit Date: ${auditData.audit_run.audit_date}`);
    console.log(`- Overall Score: ${auditData.audit_run.overall_score}/10 (CRITICAL)\n`);

    console.log('Records Created:');
    console.log(`✓ 1 audit run (ID: ${auditId})`);
    console.log(`✓ ${trustNodeCount} trust nodes`);
    console.log(`✓ ${citationCount} citation(s)`);
    console.log(`✓ ${llmRecords.length} LLM responses (${auditData.llm_responses.filter(r => r.platform === 'Perplexity').length} Perplexity, ${auditData.llm_responses.filter(r => r.platform === 'ChatGPT').length} ChatGPT, ${auditData.llm_responses.filter(r => r.platform === 'Gemini').length} Gemini)`);
    console.log(`✓ ${priorityRecords.length} priorities\n`);

    console.log('View in Airtable:');
    console.log(`https://airtable.com/${AIRTABLE_BASE_ID}/tblAuditRuns/viwMain?blocks=hide\n`);

    console.log('Next Steps:');
    console.log('- Review priorities in Airtable');
    console.log('- Assign owners to action items');
    console.log(`- Schedule next audit for ${auditData.audit_run.next_audit_date}`);
    console.log('- URGENT: Address entity disambiguation crisis and establish review platform presence');

  } catch (error) {
    console.error('\n❌ ERROR during Airtable export:');
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

// Run the export
exportToAirtable();
