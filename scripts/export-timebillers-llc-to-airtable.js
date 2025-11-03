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

// Complete audit data inline
const auditData = {
  "audit_run": {
    "brand_name": "TimeBillers, LLC",
    "category": "Legal Billing/LEDES Billing",
    "audit_date": "2025-11-02",
    "overall_score": 1.4,
    "trust_node_coverage": 1,
    "trust_node_percentage": 0.017,
    "citation_quality": 5.7,
    "ai_citation_rate": 0.0,
    "perplexity_rank": null,
    "chatgpt_rank": null,
    "gemini_rank": null,
    "perplexity_cited": false,
    "chatgpt_cited": false,
    "gemini_cited": false,
    "status": "Complete",
    "executive_summary": "TimeBillers, LLC is virtually invisible in AI-powered search systems despite 35+ years in business. Only 1.7% trust node coverage (0.5/29 nodes), 5.7/10 citation quality with zero structured data on website, and 0% AI citation rate in category queries. The brand appears only in direct name searches with Perplexity warning users about 'lack of independently verified reviews.' Competitor TimeSolv owns the 'LEDES billing' positioning that should belong to TimeBillers. This is a foundational infrastructure crisis requiring immediate action: establish review platform presence (G2, Capterra), implement Schema.org markup, create LinkedIn company page, and get listed on legal tech aggregators.",
    "top_priority_1": "Establish Review Platform Presence - Create G2 profile under 'Legal Services' category and collect 5-10 verified client reviews. ChatGPT cited G2 for all top competitors; TimeBillers has zero review presence. This addresses Perplexity's damaging 'lack of independently verified reviews' warning.",
    "top_priority_2": "Add Structured Data to Company Website - Implement Schema.org Organization markup with full entity definition. Website has ZERO markup, blocking entity recognition. LLMs cannot extract company data; Perplexity returned 69% irrelevant citations due to entity disambiguation failure.",
    "top_priority_3": "Create LinkedIn Company Page - Only personal founder profile exists. Missing Tier 1 professional network visibility. Competitors cited via LinkedIn company data. Low effort, high visibility return.",
    "next_audit_date": "2026-01-01"
  },
  "trust_nodes": [
    {
      "category": "Knowledge Graph",
      "node_name": "Wikipedia",
      "present": false,
      "quality_score": null,
      "last_updated": null,
      "url": null,
      "notes": "No Wikipedia article found. Company does not meet Wikipedia's notability requirements. Blocking knowledge graph presence."
    },
    {
      "category": "Knowledge Graph",
      "node_name": "Wikidata",
      "present": false,
      "quality_score": null,
      "last_updated": null,
      "url": null,
      "notes": "No Wikidata entity found. Without Wikipedia article, unlikely to have Wikidata presence."
    },
    {
      "category": "Knowledge Graph",
      "node_name": "Google Knowledge Panel",
      "present": false,
      "quality_score": null,
      "last_updated": null,
      "url": null,
      "notes": "No knowledge panel found. Requires Wikipedia article or significant structured data presence to trigger panel."
    },
    {
      "category": "Review Platform",
      "node_name": "G2",
      "present": false,
      "quality_score": null,
      "last_updated": null,
      "url": null,
      "notes": "No G2 profile found. Critical gap for B2B service visibility. ChatGPT cited G2 for all top competitors."
    },
    {
      "category": "Review Platform",
      "node_name": "Capterra",
      "present": false,
      "quality_score": null,
      "last_updated": null,
      "url": null,
      "notes": "No Capterra listing found. Missing from major software/services directory."
    },
    {
      "category": "Review Platform",
      "node_name": "Trustpilot",
      "present": false,
      "quality_score": null,
      "last_updated": null,
      "url": null,
      "notes": "No Trustpilot presence found. No consumer review validation."
    },
    {
      "category": "Review Platform",
      "node_name": "Software Advice",
      "present": false,
      "quality_score": null,
      "last_updated": null,
      "url": null,
      "notes": "No Software Advice profile found."
    },
    {
      "category": "Review Platform",
      "node_name": "GetApp",
      "present": false,
      "quality_score": null,
      "last_updated": null,
      "url": null,
      "notes": "No GetApp listing found."
    },
    {
      "category": "Directory",
      "node_name": "Crunchbase",
      "present": false,
      "quality_score": null,
      "last_updated": null,
      "url": null,
      "notes": "No Crunchbase profile found. Missing from business intelligence databases."
    },
    {
      "category": "Directory",
      "node_name": "Product Hunt",
      "present": false,
      "quality_score": null,
      "last_updated": null,
      "url": null,
      "notes": "No Product Hunt presence. Service business unlikely to launch on Product Hunt."
    },
    {
      "category": "Directory",
      "node_name": "AngelList/Wellfound",
      "present": false,
      "quality_score": null,
      "last_updated": null,
      "url": null,
      "notes": "No AngelList/Wellfound profile found. Not a startup/venture-backed company."
    },
    {
      "category": "Directory",
      "node_name": "Built With",
      "present": false,
      "quality_score": null,
      "last_updated": null,
      "url": null,
      "notes": "No Built With listing found. BuiltWith.com request blocked (403), no search results found."
    },
    {
      "category": "Company Profile",
      "node_name": "LinkedIn Company",
      "present": false,
      "quality_score": null,
      "last_updated": null,
      "url": null,
      "notes": "No official LinkedIn company page found. Only personal profile for founder exists. Competitors cited via their company pages."
    },
    {
      "category": "Company Profile",
      "node_name": "LinkedIn Personal (Founder)",
      "present": true,
      "quality_score": 4.0,
      "last_updated": null,
      "url": "https://www.linkedin.com/in/timebillers",
      "notes": "Personal profile for Jeanine O'Connell (founder) exists but details not accessible due to LinkedIn blocking. Not a company page. Counts as 0.5 toward company profile coverage."
    },
    {
      "category": "Company Profile",
      "node_name": "Bloomberg/Pitchbook",
      "present": false,
      "quality_score": null,
      "last_updated": null,
      "url": null,
      "notes": "No Bloomberg or Pitchbook coverage. Company is private service business, not publicly traded or venture-funded."
    },
    {
      "category": "News & PR",
      "node_name": "Google News (Last 6 Months)",
      "present": false,
      "quality_score": null,
      "last_updated": null,
      "url": null,
      "notes": "No news articles found in last 6 months. Zero press coverage."
    },
    {
      "category": "News & PR",
      "node_name": "Legal Industry Publications",
      "present": false,
      "quality_score": null,
      "last_updated": null,
      "url": null,
      "notes": "No coverage found in ABA Journal, Law Technology Today, or other legal publications."
    },
    {
      "category": "News & PR",
      "node_name": "Washington State Bar News (2016)",
      "present": true,
      "quality_score": 5.0,
      "last_updated": "2016-09",
      "url": "https://wabarnews.org/wp-content/uploads/2021/10/NWLawyer-Sept.-2016.pdf",
      "notes": "September 2016 bar publication mentioned TimeBillers' 30+ years experience. Only independent third-party verification found. 9 years old - critically stale."
    },
    {
      "category": "News & PR",
      "node_name": "Press Releases",
      "present": false,
      "quality_score": null,
      "last_updated": null,
      "url": null,
      "notes": "No press releases indexed by search engines."
    },
    {
      "category": "Seed Site",
      "node_name": "TechCrunch",
      "present": false,
      "quality_score": null,
      "last_updated": null,
      "url": null,
      "notes": "No TechCrunch coverage found."
    },
    {
      "category": "Seed Site",
      "node_name": "VentureBeat",
      "present": false,
      "quality_score": null,
      "last_updated": null,
      "url": null,
      "notes": "No VentureBeat coverage found."
    },
    {
      "category": "Seed Site",
      "node_name": "Forbes",
      "present": false,
      "quality_score": null,
      "last_updated": null,
      "url": null,
      "notes": "No Forbes coverage found."
    },
    {
      "category": "Seed Site",
      "node_name": "Inc.com",
      "present": false,
      "quality_score": null,
      "last_updated": null,
      "url": null,
      "notes": "No Inc.com coverage found."
    },
    {
      "category": "Seed Site",
      "node_name": "Fast Company",
      "present": false,
      "quality_score": null,
      "last_updated": null,
      "url": null,
      "notes": "No Fast Company coverage found."
    },
    {
      "category": "Company Profile",
      "node_name": "Company Website",
      "present": true,
      "quality_score": 6.5,
      "last_updated": "2025",
      "url": "https://www.timebillers.com/",
      "notes": "Company website exists with service information. 35+ years in business. Offers legal billing outsource services, LEDES billing, training. CRITICAL: Limited schema markup for structured data - zero Schema.org Organization markup."
    },
    {
      "category": "Directory",
      "node_name": "Superpages Business Listing",
      "present": true,
      "quality_score": 3.0,
      "last_updated": null,
      "url": "https://www.superpages.com/bp/gig-harbor-wa/timebillers-llc-L2409786643.htm",
      "notes": "Basic business directory listing showing Gig Harbor, WA address. Minimal information. Access blocked (403 error) during citation quality analysis."
    },
    {
      "category": "Seed Site",
      "node_name": "Amazon Author Page",
      "present": true,
      "quality_score": 5.0,
      "last_updated": "2012",
      "url": "https://www.amazon.com/Time-Billing-Toolbox-Legal-Profession/dp/1481237217",
      "notes": "Founder Jeanine M. O'Connell authored 'Time and Billing Toolbox for the Legal Profession' (2012). 13 years old - severely stale. Provides subject matter authority but needs update."
    }
  ],
  "citations": [
    {
      "source_url": "https://www.timebillers.com/",
      "source_domain": "timebillers.com",
      "source_title": "TimeBillers, LLC - Legal Billing Outsource Services",
      "authority_score": 6.0,
      "data_structure_score": 2.0,
      "brand_alignment_score": 9.0,
      "freshness_score": 3.0,
      "cross_link_score": 4.0,
      "overall_quality": 4.8,
      "publication_date": null,
      "cited_by_perplexity": true,
      "cited_by_chatgpt": false,
      "cited_by_gemini": false,
      "notes": "Company website. CRITICAL: Zero Schema.org markup - blocking entity recognition. Outdated web standards (early 2000s HTML/CSS). Stale content with no visible updates. Strong brand alignment but technically deficient."
    },
    {
      "source_url": "https://www.linkedin.com/in/timebillers",
      "source_domain": "linkedin.com",
      "source_title": "Jeanine O'Connell - TimeBillers Founder - LinkedIn",
      "authority_score": 6.0,
      "data_structure_score": 8.5,
      "brand_alignment_score": 7.0,
      "freshness_score": 5.0,
      "cross_link_score": 5.0,
      "overall_quality": 6.3,
      "publication_date": null,
      "cited_by_perplexity": false,
      "cited_by_chatgpt": false,
      "cited_by_gemini": false,
      "notes": "Personal LinkedIn profile (not company page). Tier 1 platform authority with excellent data structure. Access restricted (403/999 errors) - may block LLM crawlers. Personal profile dilutes brand value vs. company page."
    },
    {
      "source_url": "https://www.superpages.com/bp/gig-harbor-wa/timebillers-llc-L2409786643.htm",
      "source_domain": "superpages.com",
      "source_title": "TimeBillers LLC - Gig Harbor, WA - Superpages",
      "authority_score": 4.0,
      "data_structure_score": 7.0,
      "brand_alignment_score": 8.0,
      "freshness_score": 2.0,
      "cross_link_score": 5.0,
      "overall_quality": 5.2,
      "publication_date": null,
      "cited_by_perplexity": false,
      "cited_by_chatgpt": false,
      "cited_by_gemini": false,
      "notes": "Tier 3 directory with minimal editorial oversight. Strong NAP consistency validates business entity. Access restricted (403 error) - may block LLM crawlers. Likely stale without owner claiming/updates."
    },
    {
      "source_url": "https://www.amazon.com/Time-Billing-Toolbox-Legal-Profession/dp/1481237217",
      "source_domain": "amazon.com",
      "source_title": "Time and Billing Toolbox for the Legal Profession by Jeanine M. O'Connell",
      "authority_score": 8.0,
      "data_structure_score": 9.0,
      "brand_alignment_score": 6.0,
      "freshness_score": 2.5,
      "cross_link_score": 5.5,
      "overall_quality": 6.2,
      "publication_date": "2012",
      "cited_by_perplexity": false,
      "cited_by_chatgpt": false,
      "cited_by_gemini": false,
      "notes": "Tier 1 platform with perfect structured data. Establishes founder thought leadership. 13 years old (published 2012) - severely stale. Indirect brand connection (author → company not explicit). Needs 3rd edition or new publication."
    },
    {
      "source_url": "https://wabarnews.org/wp-content/uploads/2021/10/NWLawyer-Sept.-2016.pdf",
      "source_domain": "wabarnews.org",
      "source_title": "Washington State Bar News - September 2016",
      "authority_score": 8.0,
      "data_structure_score": 3.0,
      "brand_alignment_score": 7.0,
      "freshness_score": 1.0,
      "cross_link_score": 4.0,
      "overall_quality": 4.6,
      "publication_date": "2016-09",
      "cited_by_perplexity": true,
      "cited_by_chatgpt": false,
      "cited_by_gemini": false,
      "notes": "Tier 1 authority - state bar publication. Only independent third-party verification found. 9 years old - critically stale. Perplexity cited this as the only independent source, highlighting lack of recent coverage."
    }
  ],
  "llm_responses": [
    {
      "platform": "Perplexity",
      "query_type": "Evaluative",
      "query_text": "What are the top legal billing software and services for solo practitioners in 2025?",
      "brand_cited": false,
      "brand_rank": null,
      "brand_context": null,
      "citations_found": 12,
      "competitor_1": "Clio",
      "competitor_1_rank": 1,
      "competitor_2": "MyCase",
      "competitor_2_rank": 2,
      "competitor_3": "Smokeball",
      "competitor_3_rank": 3,
      "response_summary": "Brand absent from solo practitioner software rankings. Perplexity returned 12 software products, citing G2, legal tech blogs, and vendor educational content. Category mismatch: TimeBillers is a service provider, not software. Top rankings driven by review platforms (G2), current year content (2025 titles), and vendor authority (Clio, LeanLaw blogs)."
    },
    {
      "platform": "Perplexity",
      "query_type": "Comparative",
      "query_text": "Best LEDES billing providers for law firms",
      "brand_cited": false,
      "brand_rank": null,
      "brand_context": null,
      "citations_found": 11,
      "competitor_1": "LeanLaw",
      "competitor_1_rank": 1,
      "competitor_2": "Clio",
      "competitor_2_rank": 2,
      "competitor_3": "TimeSolv",
      "competitor_3_rank": 3,
      "response_summary": "Brand absent from LEDES-specific query. Perplexity emphasized software providers with LEDES compliance features. Rankings driven by LEDES-focused educational content (TimeSolv, LeanLaw blogs), 2025 recency, and technical guides. TimeBillers lacks LEDES keyword presence and educational content despite offering LEDES processing services. TimeSolv owns the LEDES positioning."
    },
    {
      "platform": "Perplexity",
      "query_type": "Brand-Specific",
      "query_text": "TimeBillers LLC reviews and credentials",
      "brand_cited": true,
      "brand_rank": 1,
      "brand_context": "Primary subject with description of services (legal billing outsourcing, Timeslips expertise, 30+ years experience), but Perplexity explicitly noted 'notable lack of independently verified public reviews or third-party assessments.' Response warned about absence of BBB accreditation, certifications, and formal endorsements. Only independent verification was 2016 bar publication mention.",
      "citations_found": 13,
      "competitor_1": null,
      "competitor_1_rank": null,
      "competitor_2": null,
      "competitor_2_rank": null,
      "competitor_3": null,
      "competitor_3_rank": null,
      "response_summary": "Brand-specific query returned limited results with credibility warnings. 4 of 13 citations relevant (3x company website, 1x 2016 bar publication). 9 citations were irrelevant (wrong companies, wrong industries, generic BBB lookups), indicating weak entity disambiguation. Perplexity's explicit warning about 'lack of reviews' is damaging. No review platform presence, no recent third-party mentions, minimal knowledge graph."
    },
    {
      "platform": "ChatGPT",
      "query_type": "Comparative",
      "query_text": "What are the top legal billing software and services for solo practitioners in 2025?",
      "brand_cited": false,
      "brand_rank": null,
      "brand_context": null,
      "citations_found": 7,
      "competitor_1": "Clio Manage",
      "competitor_1_rank": 1,
      "competitor_2": "MyCase",
      "competitor_2_rank": 2,
      "competitor_3": "Bill4Time",
      "competitor_3_rank": 3,
      "response_summary": "Brand completely absent from comparative solo practitioner query. ChatGPT relied on 6 legal tech aggregator sites (Grow Law, LawRank, LeanLaw, MyLegalSoftware, On The Map Marketing, TimeSolv) that did not include TimeBillers in their 2025 rankings. Competitors with 2+ citations ranked highest. LEDES specialization not surfaced because no sources positioned TimeBillers in that niche. Critical gap: missing from all major legal tech review roundups that ChatGPT used as primary sources."
    },
    {
      "platform": "Gemini",
      "query_type": "Evaluative",
      "query_text": "What are the top legal billing software and services for solo practitioners in 2025?",
      "brand_cited": false,
      "brand_rank": null,
      "brand_context": null,
      "citations_found": 1,
      "competitor_1": "Clio Manage",
      "competitor_1_rank": 1,
      "competitor_2": "MyCase",
      "competitor_2_rank": 2,
      "competitor_3": "PracticePanther",
      "competitor_3_rank": 3,
      "response_summary": "Brand absent from evaluative query. Clio dominated as 'industry leader'. TimeSolv cited for LEDES billing (TimeBillers' core offering). Only 1 external citation used (Counsel CPAs blog). Gemini relied primarily on general knowledge rather than real-time sources. Category positioning critical - TimeBillers needs to establish 'software' identity vs. 'service' to compete in this query type."
    }
  ],
  "priorities": [
    {
      "priority_level": "Immediate",
      "title": "Establish Review Platform Presence",
      "description": "Create G2 profile under 'Legal Services' category (not software) and collect 5-10 verified client reviews with focus on LEDES billing expertise. Claim Capterra listing. Set up Trustpilot business profile. Target: 3/5 review platforms active with minimum 5 reviews each = 50% review node coverage.",
      "impact": "High",
      "effort": "Medium",
      "timeline": "2-4 weeks",
      "status": "Not Started",
      "assigned_to": null,
      "due_date": "2025-11-30",
      "completed_date": null,
      "notes": "G2 was cited in 4 of 5 LLM queries tested - single highest-impact source. Perplexity explicitly warned users about 'lack of independently verified reviews'; ChatGPT cited G2 for all top competitors. This addresses the most damaging finding."
    },
    {
      "priority_level": "Immediate",
      "title": "Add Structured Data to Company Website",
      "description": "Implement Schema.org Organization markup with full entity definition: Organization name, description, founder, founding date (35+ years), Services (LegalService schema for legal billing, LEDES billing), ContactPoint (business address, phone, email), Person schema for founder linking to Amazon book, AggregateRating schema (once reviews collected).",
      "impact": "High",
      "effort": "Medium",
      "timeline": "1-2 weeks",
      "status": "Not Started",
      "assigned_to": null,
      "due_date": "2025-11-16",
      "completed_date": null,
      "notes": "Website has ZERO Schema.org markup - blocking entity recognition. LLMs cannot extract company data; Perplexity returned 69% irrelevant citations due to entity disambiguation failure. Moves data structure score from 2.0/10 → 8.5/10; enables knowledge graph eligibility."
    },
    {
      "priority_level": "Immediate",
      "title": "Create LinkedIn Company Page",
      "description": "Create official TimeBillers, LLC company page. Complete all profile fields with LEDES billing focus. Add 35+ years in business milestone. Post announcement linking to website and services. Request employees/founder connect page to personal profiles.",
      "impact": "Medium",
      "effort": "Low",
      "timeline": "1 week",
      "status": "Not Started",
      "assigned_to": null,
      "due_date": "2025-11-09",
      "completed_date": null,
      "notes": "Only personal founder profile exists (0.5/2 company profile nodes). Missing Tier 1 professional network visibility. Competitors cited via LinkedIn company data. LinkedIn is Tier 1 authority; low effort, high visibility return."
    },
    {
      "priority_level": "Immediate",
      "title": "Get Listed on Legal Tech Aggregators",
      "description": "Contact Grow Law (growlaw.co) - request listing in 'Best Legal Billing Software' roundup. Contact LawRank (lawrank.com) - submit for inclusion in 2025/2026 rankings. Contact MyLegalSoftware - request review/profile. Reach out to LeanLaw blog - pitch guest article on 'LEDES Billing for Solo Practitioners'.",
      "impact": "High",
      "effort": "Medium",
      "timeline": "2-4 weeks",
      "status": "Not Started",
      "assigned_to": null,
      "due_date": "2025-11-30",
      "completed_date": null,
      "notes": "Absent from all sites ChatGPT/Perplexity cited. ChatGPT used Grow Law, LawRank, MyLegalSoftware as primary sources - TimeBillers mentioned zero times. These exact sites drove 60%+ of LLM citations; getting listed = immediate visibility."
    },
    {
      "priority_level": "Strategic",
      "title": "Launch LEDES Educational Content to Reclaim Category Ownership",
      "description": "Publish definitive LEDES content: 'The Complete Guide to LEDES Billing Standards (2025 Edition)' (3,000+ word blog post), 'LEDES 2.0 vs. LEDES 1998B: What Solo Practitioners Need to Know', 'How to Implement LEDES Billing in [Popular Billing Software]', Video series: 'LEDES Billing Explained' on YouTube. Target LEDES-specific keywords and earn thought leadership citations.",
      "impact": "High",
      "effort": "High",
      "timeline": "90 days",
      "status": "Not Started",
      "assigned_to": null,
      "due_date": "2026-02-01",
      "completed_date": null,
      "notes": "TimeSolv currently owns 'LEDES billing' positioning in LLM responses. Gemini: 'TimeSolv: ...includes LEDES billing feature'. Perplexity: TimeSolv ranked #3 in 'Best LEDES billing providers'. This is TimeBillers' core differentiator being owned by a competitor. Must reclaim via educational content and thought leadership."
    },
    {
      "priority_level": "Strategic",
      "title": "Build Knowledge Graph Presence",
      "description": "Create Wikidata entry with company entity (legal billing service provider), founded date, location, services, founder, links to official website and LinkedIn company page. Research Wikipedia eligibility (35+ years in business, founder's published book, bar publication). Implement structured data to enable Google Knowledge Panel.",
      "impact": "Medium",
      "effort": "Medium",
      "timeline": "90 days",
      "status": "Not Started",
      "assigned_to": null,
      "due_date": "2026-02-01",
      "completed_date": null,
      "notes": "0/3 knowledge graph coverage - no entity recognition in LLM training data. Perplexity couldn't provide structured company information beyond website scraping. Moves from 0% to 33% knowledge graph coverage; enables entity recognition."
    },
    {
      "priority_level": "Long-term",
      "title": "Establish Annual LEDES Billing Thought Leadership Report",
      "description": "Publish yearly 'State of LEDES Billing' report with industry data. Become citable source for LEDES statistics and trends. Partner with legal tech publications to distribute. Develop 'LEDES Billing Best Practices' white paper. Get endorsed by bar associations or legal tech groups.",
      "impact": "High",
      "effort": "High",
      "timeline": "6-12 months",
      "status": "Not Started",
      "assigned_to": null,
      "due_date": "2026-05-01",
      "completed_date": null,
      "notes": "Goal: Be cited by all 3 platforms for LEDES billing service queries. Recurring citation opportunity and thought leadership positioning. Distinguishes from general billing software competitors."
    }
  ]
};

console.log('Starting TimeBillers, LLC audit export to Airtable...\n');

async function exportToAirtable() {
  let auditId;
  let trustNodeCount = 0;
  let citationCount = 0;
  let llmResponseCount = 0;
  let priorityCount = 0;

  try {
    // Step 1: Create Audit_Runs record
    console.log('Step 1: Creating Audit_Runs record...');
    const auditRecord = await base('Audit_Runs').create([{
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

    auditId = auditRecord[0].id;
    console.log(`✓ Audit record created (ID: ${auditId})\n`);

    // Step 2: Create Trust_Nodes records (batch of 10)
    console.log('Step 2: Creating Trust_Nodes records...');
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
      console.log(`  Created batch ${Math.floor(i / 10) + 1}: ${batch.length} trust nodes`);
    }
    console.log(`✓ ${trustNodeCount} trust node records created\n`);

    // Step 3: Create Citations records
    console.log('Step 3: Creating Citations records...');
    const citationRecords = auditData.citations.map(citation => ({
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

    await base('Citations').create(citationRecords);
    citationCount = citationRecords.length;
    console.log(`✓ ${citationCount} citation records created\n`);

    // Step 4: Create LLM_Responses records
    console.log('Step 4: Creating LLM_Responses records...');
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
    llmResponseCount = llmRecords.length;
    console.log(`✓ ${llmResponseCount} LLM response records created\n`);

    // Step 5: Create Priorities records
    console.log('Step 5: Creating Priorities records...');
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
    priorityCount = priorityRecords.length;
    console.log(`✓ ${priorityCount} priority records created\n`);

    // Success summary
    console.log('═══════════════════════════════════════════════════════════');
    console.log('✅ AUDIT DATA SAVED TO AIRTABLE');
    console.log('═══════════════════════════════════════════════════════════\n');
    console.log('Summary:');
    console.log(`- Brand: ${auditData.audit_run.brand_name}`);
    console.log(`- Audit Date: ${auditData.audit_run.audit_date}`);
    console.log(`- Overall Score: ${auditData.audit_run.overall_score}/10`);
    console.log(`- Trust Node Coverage: ${auditData.audit_run.trust_node_percentage * 100}%`);
    console.log(`- Citation Quality: ${auditData.audit_run.citation_quality}/10`);
    console.log(`- AI Citation Rate: ${auditData.audit_run.ai_citation_rate * 100}%\n`);

    console.log('Records Created:');
    console.log(`✓ 1 audit run (ID: ${auditId})`);
    console.log(`✓ ${trustNodeCount} trust nodes`);
    console.log(`✓ ${citationCount} citations`);
    console.log(`✓ ${llmResponseCount} LLM responses (3 Perplexity, 1 ChatGPT, 1 Gemini)`);
    console.log(`✓ ${priorityCount} priorities\n`);

    console.log('View in Airtable:');
    console.log(`https://airtable.com/${AIRTABLE_BASE_ID}\n`);

    console.log('Next Steps:');
    console.log('- Review priorities in Airtable');
    console.log('- Assign owners to action items');
    console.log(`- Schedule next audit for ${auditData.audit_run.next_audit_date}`);

  } catch (error) {
    console.error('\n❌ ERROR DURING AIRTABLE EXPORT:\n');
    console.error(error);

    // Report partial success if any records were created
    if (auditId) {
      console.log('\n⚠️  PARTIAL SUCCESS:');
      console.log(`✓ Audit record created (ID: ${auditId})`);
      if (trustNodeCount > 0) console.log(`✓ ${trustNodeCount} trust nodes created`);
      if (citationCount > 0) console.log(`✓ ${citationCount} citations created`);
      if (llmResponseCount > 0) console.log(`✓ ${llmResponseCount} LLM responses created`);
      if (priorityCount > 0) console.log(`✓ ${priorityCount} priorities created`);
      console.log('\nRecommendation: Check Airtable schema and retry failed steps.');
    }

    process.exit(1);
  }
}

exportToAirtable();
