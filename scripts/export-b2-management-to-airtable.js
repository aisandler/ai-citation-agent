#!/usr/bin/env node

/**
 * Export B2 Management & Consulting audit data to Airtable
 *
 * This script exports the complete audit findings including:
 * - Audit run metadata with overall scores
 * - Trust nodes (29 tracked, 3 present, 26 gaps)
 * - Citations (11 citations with quality scores)
 * - LLM responses (5 queries across 3 platforms)
 * - Strategic priorities (15 action items)
 */

import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';
import Airtable from 'airtable';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from .env.local
dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

// Configure Airtable
const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
const BASE_ID = process.env.AIRTABLE_BASE_ID || 'appv02hfLoza42r5h';

const base = new Airtable({ apiKey: AIRTABLE_API_KEY }).base(BASE_ID);

// Audit metadata
const AUDIT_DATA = {
  brand_name: 'B2 Management & Consulting',
  category: 'Legal Billing/E-billing/PM Consulting/HR/Recruiting',
  audit_date: '2025-11-02',
  overall_score: 2.8,
  trust_node_coverage: 3,
  trust_node_percentage: 10.3,
  citation_quality: 7.9,
  ai_citation_rate: 33,
  perplexity_cited: true,
  perplexity_rank: null, // Not ranked in category queries
  chatgpt_cited: false,
  chatgpt_rank: null,
  gemini_cited: false,
  gemini_rank: null,
  status: 'Complete',
  executive_summary: 'B2 Management & Consulting is invisible to AI systems when users search for legal billing consulting services. Despite high-quality citations (7.9/10), the brand lacks critical trust node presence (Wikipedia, G2, industry directories) and category-specific content that LLMs prioritize. All three platforms failed to surface the brand in category queries, instead ranking direct competitors.',
  top_priority_1: 'Establish G2 Profile → Collect 5 verified client reviews',
  top_priority_2: 'Build Legal Billing Service Pages → /legal-billing-consulting + /e-billing-services',
  top_priority_3: 'Activate Capterra Profile → Claim + collect 3-5 reviews',
  next_audit_date: '2026-01-02'
};

// Trust nodes (29 total)
const TRUST_NODES = [
  // Knowledge Graphs (0/3)
  { category: 'Knowledge Graph', node_name: 'Wikipedia', present: false, quality_score: null, url: null, notes: 'No Wikipedia article found - blocking knowledge graph presence' },
  { category: 'Knowledge Graph', node_name: 'Wikidata', present: false, quality_score: null, url: null, notes: 'No Wikidata entity - missing structured data in knowledge graph' },
  { category: 'Knowledge Graph', node_name: 'Google Knowledge Panel', present: false, quality_score: null, url: null, notes: 'No knowledge panel - requires Wikipedia article as foundation' },

  // Review Platforms (1/5)
  { category: 'Review Platform', node_name: 'G2', present: false, quality_score: null, url: null, notes: 'No G2 profile - critical gap for B2B legal services visibility' },
  { category: 'Review Platform', node_name: 'Capterra', present: true, quality_score: 8.1, url: 'https://www.capterra.com/services/sp/58290/b2-management-consulting/', notes: 'Profile exists but dormant - 0 reviews, needs activation' },
  { category: 'Review Platform', node_name: 'Trustpilot', present: false, quality_score: null, url: null, notes: 'No Trustpilot profile found' },
  { category: 'Review Platform', node_name: 'Software Advice', present: false, quality_score: null, url: null, notes: 'No Software Advice profile found' },
  { category: 'Review Platform', node_name: 'GetApp', present: false, quality_score: null, url: null, notes: 'No GetApp profile found' },

  // Directories (1/4)
  { category: 'Directory', node_name: 'Crunchbase', present: true, quality_score: 8.2, url: 'https://www.crunchbase.com/organization/b2-management', notes: 'Basic profile exists (~40% complete) - accounting firm focused on financial services, consulting, HR, recruiting' },
  { category: 'Directory', node_name: 'Product Hunt', present: false, quality_score: null, url: null, notes: 'No Product Hunt presence - expected for service firm vs. software product' },
  { category: 'Directory', node_name: 'AngelList', present: false, quality_score: null, url: null, notes: 'No AngelList profile found' },
  { category: 'Directory', node_name: 'Built With', present: false, quality_score: null, url: null, notes: 'No Built With tracking - expected for non-SaaS business' },

  // Company Profiles (1/2)
  { category: 'Company Profile', node_name: 'LinkedIn Company', present: true, quality_score: 9.3, url: 'https://www.linkedin.com/company/b2-legal-management-llc', notes: 'Active profile with recent hiring posts (June 2025, Dec 2024, Sept 2024), engagement metrics not visible' },
  { category: 'Company Profile', node_name: 'Bloomberg', present: false, quality_score: null, url: null, notes: 'No Bloomberg coverage - expected for private consulting firm' },

  // News & PR (2/10 - simplified representation)
  { category: 'News & PR', node_name: 'Google News', present: false, quality_score: 2.0, url: null, notes: '0 articles in last 6 months, most recent coverage: Texas Lawyer Best of Austin Award 2019' },
  { category: 'News & PR', node_name: 'Industry Awards', present: true, quality_score: 6.0, url: null, notes: 'Texas Lawyer Best of Austin Award for Back Office Outsourcing 4 years in a row (through ~2019-2022)' },
  { category: 'News & PR', node_name: 'Industry Publications', present: true, quality_score: 3.0, url: 'https://www.alanet.org/legal-management-software-products-services/b2-management-consulting', notes: 'ALA directory listing, company blog content, but no external editorial coverage' },
  { category: 'News & PR', node_name: 'TechCrunch', present: false, quality_score: null, url: null, notes: 'No TechCrunch coverage' },
  { category: 'News & PR', node_name: 'VentureBeat', present: false, quality_score: null, url: null, notes: 'No VentureBeat coverage' },
  { category: 'News & PR', node_name: 'Forbes', present: false, quality_score: null, url: null, notes: 'No Forbes coverage' },
  { category: 'News & PR', node_name: 'Inc.com', present: false, quality_score: null, url: null, notes: 'No Inc.com coverage' },
  { category: 'News & PR', node_name: 'Fast Company', present: false, quality_score: null, url: null, notes: 'No Fast Company coverage' },
  { category: 'News & PR', node_name: 'Law360', present: false, quality_score: null, url: null, notes: 'No Law360 coverage - priority target for thought leadership' },
  { category: 'News & PR', node_name: 'American Lawyer', present: false, quality_score: null, url: null, notes: 'No American Lawyer coverage - priority target' },

  // Seed Sites (0/5)
  { category: 'Seed Site', node_name: 'Legal Intelligencer', present: false, quality_score: null, url: null, notes: 'No Legal Intelligencer coverage' },
  { category: 'Seed Site', node_name: 'Above the Law', present: false, quality_score: null, url: null, notes: 'No Above the Law coverage' },
  { category: 'Seed Site', node_name: 'ABA Journal', present: false, quality_score: null, url: null, notes: 'No ABA Journal coverage' },
  { category: 'Seed Site', node_name: 'Legal Tech News', present: false, quality_score: null, url: null, notes: 'No Legal Tech News coverage' },
  { category: 'Seed Site', node_name: 'LawNext Directory', present: false, quality_score: null, url: null, notes: 'Not listed in LawNext.com spend management directory - immediate action item' }
];

// Citations (11 total)
const CITATIONS = [
  {
    source_title: 'LinkedIn Company Page',
    source_url: 'https://www.linkedin.com/company/b2-legal-management-llc',
    source_domain: 'linkedin.com',
    authority_score: 9.0,
    data_structure_score: 10.0,
    brand_alignment_score: 9.0,
    freshness_score: 9.0,
    cross_link_score: 10.0,
    overall_quality: 9.3,
    publication_date: '2025-06-01',
    cited_by_perplexity: true,
    cited_by_chatgpt: false,
    cited_by_gemini: false,
    notes: 'Active profile with recent hiring posts (June 2025, Dec 2024, Sept 2024). Strong Schema.org markup. Cited by Perplexity in brand-specific query.'
  },
  {
    source_title: 'Crunchbase',
    source_url: 'https://www.crunchbase.com/organization/b2-management',
    source_domain: 'crunchbase.com',
    authority_score: 9.0,
    data_structure_score: 9.0,
    brand_alignment_score: 7.0,
    freshness_score: 7.0,
    cross_link_score: 9.0,
    overall_quality: 8.2,
    publication_date: null,
    cited_by_perplexity: false,
    cited_by_chatgpt: false,
    cited_by_gemini: false,
    notes: 'Basic profile (~40% complete). Good structured data but needs completion. Not cited by any LLM platform yet.'
  },
  {
    source_title: 'Capterra',
    source_url: 'https://www.capterra.com/services/sp/58290/b2-management-consulting/',
    source_domain: 'capterra.com',
    authority_score: 8.0,
    data_structure_score: 9.0,
    brand_alignment_score: 8.0,
    freshness_score: 7.0,
    cross_link_score: 9.0,
    overall_quality: 8.1,
    publication_date: '2025-01-01',
    cited_by_perplexity: false,
    cited_by_chatgpt: false,
    cited_by_gemini: false,
    notes: 'Profile exists but dormant - 0 reviews, unclaimed. High-quality platform but wasted opportunity. Immediate action: claim and activate.'
  },
  {
    source_title: 'Dun & Bradstreet',
    source_url: 'https://www.dnb.com/business-directory/company-profiles.b2_management__consulting_llc.7f98546d1ed2048cef76467327652eab.html',
    source_domain: 'dnb.com',
    authority_score: 8.0,
    data_structure_score: 9.0,
    brand_alignment_score: 8.0,
    freshness_score: 7.0,
    cross_link_score: 8.0,
    overall_quality: 8.1,
    publication_date: null,
    cited_by_perplexity: false,
    cited_by_chatgpt: false,
    cited_by_gemini: false,
    notes: 'Business directory profile with structured company data. Static but authoritative.'
  },
  {
    source_title: 'Glassdoor',
    source_url: 'https://www.glassdoor.com/Reviews/B2-Legal-Management-Reviews-E703688.htm',
    source_domain: 'glassdoor.com',
    authority_score: 8.0,
    data_structure_score: 9.0,
    brand_alignment_score: 6.0,
    freshness_score: 7.0,
    cross_link_score: 8.0,
    overall_quality: 7.6,
    publication_date: null,
    cited_by_perplexity: false,
    cited_by_chatgpt: false,
    cited_by_gemini: false,
    notes: '5 employee reviews (NOT client reviews). Mixed feedback. Lower brand alignment due to employee vs. client perspective.'
  },
  {
    source_title: 'ZoomInfo',
    source_url: 'https://www.zoominfo.com/c/b2-management--consulting-llc/346296034',
    source_domain: 'zoominfo.com',
    authority_score: 7.0,
    data_structure_score: 8.0,
    brand_alignment_score: 8.0,
    freshness_score: 7.0,
    cross_link_score: 8.0,
    overall_quality: 7.6,
    publication_date: null,
    cited_by_perplexity: true,
    cited_by_chatgpt: false,
    cited_by_gemini: false,
    notes: 'Company data aggregator listing. Cited by Perplexity in brand-specific query.'
  },
  {
    source_title: 'Datanyze',
    source_url: 'https://www.datanyze.com/companies/b2-management-consulting/346296034',
    source_domain: 'datanyze.com',
    authority_score: 7.0,
    data_structure_score: 8.0,
    brand_alignment_score: 7.0,
    freshness_score: 7.0,
    cross_link_score: 7.0,
    overall_quality: 7.2,
    publication_date: null,
    cited_by_perplexity: false,
    cited_by_chatgpt: false,
    cited_by_gemini: false,
    notes: 'Company profile with employee list. Static data.'
  },
  {
    source_title: 'ALA Directory',
    source_url: 'https://www.alanet.org/legal-management-software-products-services/b2-management-consulting',
    source_domain: 'alanet.org',
    authority_score: 7.0,
    data_structure_score: 6.0,
    brand_alignment_score: 8.0,
    freshness_score: 7.0,
    cross_link_score: 7.0,
    overall_quality: 7.2,
    publication_date: null,
    cited_by_perplexity: true,
    cited_by_chatgpt: false,
    cited_by_gemini: false,
    notes: 'Association of Legal Administrators listing. Basic profile, needs enhancement. Cited by Perplexity in brand-specific query.'
  },
  {
    source_title: 'Better Business Bureau',
    source_url: 'https://www.bbb.org/us/il/mendon/profile/business-consultant/b2-management-consulting-0734-1000042127',
    source_domain: 'bbb.org',
    authority_score: 7.0,
    data_structure_score: 6.0,
    brand_alignment_score: 7.0,
    freshness_score: 7.0,
    cross_link_score: 6.0,
    overall_quality: 6.6,
    publication_date: null,
    cited_by_perplexity: true,
    cited_by_chatgpt: false,
    cited_by_gemini: false,
    notes: 'A rating but NOT BBB Accredited, 0 customer reviews. Cited by Perplexity in brand-specific query for credibility check.'
  },
  {
    source_title: 'Facebook Company Page',
    source_url: 'https://www.facebook.com/B2ManagementandConsulting/',
    source_domain: 'facebook.com',
    authority_score: 6.0,
    data_structure_score: 7.0,
    brand_alignment_score: 7.0,
    freshness_score: 6.0,
    cross_link_score: 6.0,
    overall_quality: 6.4,
    publication_date: null,
    cited_by_perplexity: false,
    cited_by_chatgpt: false,
    cited_by_gemini: false,
    notes: 'Company page exists - 0 reviews, "Not yet rated". Inactive.'
  },
  {
    source_title: 'Founder Book (Amazon)',
    source_url: 'https://www.amazon.co.uk/RESPECT-Insight-Attorney-Compensation-Plans/dp/B0DKKLL4PC',
    source_domain: 'amazon.com',
    authority_score: 6.0,
    data_structure_score: 7.0,
    brand_alignment_score: 8.0,
    freshness_score: 8.0,
    cross_link_score: 5.0,
    overall_quality: 6.8,
    publication_date: '2024-01-01',
    cited_by_perplexity: false,
    cited_by_chatgpt: false,
    cited_by_gemini: false,
    notes: 'Brenda Barnes authored "RESPECT - An Insight to Attorney Compensation Plans". Thought leadership asset but not yet leveraged for citations.'
  }
];

// LLM Responses (5 queries across 3 platforms)
const LLM_RESPONSES = [
  {
    platform: 'Perplexity',
    query_type: 'Evaluative',
    query_text: 'What are the top legal billing and e-billing consulting firms in 2025?',
    brand_cited: false,
    brand_rank: null,
    brand_context: null,
    citations_found: 14,
    competitor_1: 'Clio Consulting Partners',
    competitor_1_rank: 1,
    competitor_2: 'LawPay Consulting Affiliates',
    competitor_2_rank: 2,
    competitor_3: 'Berry Dunn',
    competitor_3_rank: 3,
    response_summary: 'Brand completely absent from evaluative query. Perplexity prioritized software-tied consulting (Clio, LawPay) and firms listed in Clutch directory (Berry Dunn, Perkins & Co). Citations favored software vendor content (35%) and aggregator lists (28%). B2 invisible due to lack of presence in legal consulting directories and 2025 aggregator rankings.'
  },
  {
    platform: 'Perplexity',
    query_type: 'Comparative',
    query_text: 'Best legal billing consulting services for mid-size law firms',
    brand_cited: false,
    brand_rank: null,
    brand_context: null,
    citations_found: 14,
    competitor_1: 'TimeSolv',
    competitor_1_rank: 1,
    competitor_2: 'LeanLaw',
    competitor_2_rank: 2,
    competitor_3: 'Accurate Legal Billing',
    competitor_3_rank: 3,
    response_summary: 'Brand absent despite query targeting B2\'s core market (mid-size law firms). TimeSolv dominated with explicit "mid-size law firm" targeting in vendor content. Accurate Legal Billing and The Legal Billing Group (direct service competitors) ranked ahead of B2. Citations favored vendors with use-case-specific content and managed service providers with clear service descriptions. B2 lacks "best for mid-size firms" optimized content.'
  },
  {
    platform: 'Perplexity',
    query_type: 'Brand-Specific',
    query_text: 'B2 Management & Consulting reviews and credentials',
    brand_cited: true,
    brand_rank: 1,
    brand_context: 'Primary subject with comprehensive overview synthesizing client testimonials (highly positive - "responsive", "seamless transitions"), BBB status (A rating but not accredited), employee feedback (mixed - remote work concerns), and service offerings (bookkeeping, billing, HR, recruiting for law firms). Perplexity balanced positive client feedback with transparency about non-accreditation and internal culture issues.',
    citations_found: 8,
    competitor_1: null,
    competitor_1_rank: null,
    competitor_2: null,
    competitor_2_rank: null,
    competitor_3: null,
    competitor_3_rank: null,
    response_summary: 'Strong brand-specific performance. Perplexity aggregated from 8 sources including own website (testimonials, homepage), BBB (credibility check), Indeed (employee perspective), ALA directory (industry credential), and Clutch (B2B profile). No knowledge graph present but comprehensive synthesis achieved. Citations emphasized client satisfaction while noting BBB non-accreditation and employee concerns about remote work/training. Demonstrates Perplexity can find brand when directly queried, but content doesn\'t surface in category queries.'
  },
  {
    platform: 'ChatGPT',
    query_type: 'Evaluative',
    query_text: 'What are the top legal billing and e-billing consulting firms in 2025?',
    brand_cited: false,
    brand_rank: null,
    brand_context: 'Not mentioned in response',
    citations_found: 66,
    competitor_1: 'LegalBillReview.com',
    competitor_1_rank: 1,
    competitor_2: 'The Legal Billing Group',
    competitor_2_rank: 2,
    competitor_3: 'Accurate Legal Billing (ALB)',
    competitor_3_rank: 3,
    response_summary: 'Brand absent from evaluative query. ChatGPT ranked 4 specialized firms based on first-party service pages with explicit e-billing focus. Gap: B2 lacks dedicated legal billing service pages, industry directory presence, and recent 2024-25 content indexed by search.'
  },
  {
    platform: 'Gemini',
    query_type: 'Evaluative',
    query_text: 'What are the top legal billing and e-billing consulting firms in 2025?',
    brand_cited: false,
    brand_rank: null,
    brand_context: null,
    citations_found: 2,
    competitor_1: 'PwC',
    competitor_1_rank: null,
    competitor_2: 'KPMG',
    competitor_2_rank: null,
    competitor_3: 'Deloitte',
    competitor_3_rank: null,
    response_summary: 'Brand NOT mentioned. Gemini categorized response into Big Four consulting firms (Deloitte, PwC, KPMG, EY, Accenture, FTI) and legal billing software platforms (Elite 3E, Clio, Aderant). No specialized legal billing consulting firms included. Only 2 general management consulting ranking sources cited. Zero legal-billing-specific sources. Knowledge gap: Gemini lacks awareness of boutique legal billing consulting services category.'
  }
];

// Strategic Priorities (15 total - 5 immediate, 6 strategic, 4 long-term)
const PRIORITIES = [
  // Immediate (30 days)
  {
    priority_level: 'Immediate',
    title: 'Establish G2 Profile',
    description: 'Claim G2 profile under "Legal Consulting Services", complete company profile, request verified reviews from 5-10 law firm clients, add screenshots/videos, optimize for "legal billing consulting" keywords. Target: 5+ verified reviews (4.5+ stars average) within 2-3 weeks.',
    impact: 'High',
    effort: 'Medium',
    timeline: '2-3 weeks',
    status: 'Not Started',
    notes: 'Blocks citations in B2B software/services discovery queries. G2 cited by both Perplexity and ChatGPT as authoritative source. Expected 20-30% visibility improvement within 60 days.'
  },
  {
    priority_level: 'Immediate',
    title: 'Create Legal Billing-Specific Service Pages',
    description: 'Build /legal-billing-consulting, /e-billing-services, and /managed-billing-services landing pages with explicit "mid-size law firms" targeting, client outcomes, Schema.org Service markup, and 2025-dated announcement blog post. Target: 3 new pages indexed by Google within 7 days.',
    impact: 'High',
    effort: 'Medium',
    timeline: '1-2 weeks',
    status: 'Not Started',
    notes: 'ChatGPT web search cannot index legal billing services without dedicated pages. Current website emphasizes PM/HR/Recruiting broadly, diluting legal billing specialization signals.'
  },
  {
    priority_level: 'Immediate',
    title: 'Activate Capterra Profile',
    description: 'Claim Capterra company profile, complete enhancement (detailed description, screenshots, video testimonial, link to new service pages), request client reviews from 3-5 law firms, respond to Q&A section. Target: Profile claimed with 3+ verified reviews (4.0+ stars) within 3 weeks.',
    impact: 'Medium',
    effort: 'Low',
    timeline: '1 week setup, 2 weeks reviews',
    status: 'Not Started',
    notes: 'Profile exists (8.1/10 quality) but dormant (0 reviews, unclaimed). High-quality citation wasted due to inactivity. Competitors cite Capterra.'
  },
  {
    priority_level: 'Immediate',
    title: 'Complete Crunchbase Profile',
    description: 'Claim Crunchbase profile, complete all fields (founding date, HQ, employees, detailed description emphasizing legal billing, categories, link to LinkedIn/website/socials, add founder Brenda Barnes, add recent news/milestones). Target: 90%+ profile completion, linked to LinkedIn.',
    impact: 'Medium',
    effort: 'Low',
    timeline: '1 week',
    status: 'Not Started',
    notes: 'Current profile ~40% complete (4.0/10 quality). Missing company data reduces cross-citation opportunities.'
  },
  {
    priority_level: 'Immediate',
    title: 'Submit to Legal Tech Directories',
    description: 'Submit to LawNext.com "Spend Management and E-Billing" directory, ILTA Knowledge Hub (requires membership), Legal Tech Hub, enhance ALA Buyers Guide listing. Target: Listed in 3+ directories within 30 days.',
    impact: 'High',
    effort: 'Low',
    timeline: '2-3 weeks',
    status: 'Not Started',
    notes: 'ChatGPT and Perplexity cite these directories for consultant/vendor listings. Missing from all major legal tech directories.'
  },

  // Strategic (90 days)
  {
    priority_level: 'Strategic',
    title: 'Expand Review Platform Presence',
    description: 'Create Trustpilot profile (5-10 reviews), claim Software Advice (5+ reviews), create GetApp (5+ reviews), pursue BBB Accreditation. Target: 4/5 platforms active with 5+ reviews each within 60-90 days.',
    impact: 'High',
    effort: 'Medium',
    timeline: '60-90 days',
    status: 'Not Started',
    notes: 'Review platforms carry high authority with LLMs. Currently only 1/5 platforms (Capterra dormant). Target 4/5 = 80% coverage.'
  },
  {
    priority_level: 'Strategic',
    title: 'Publish Thought Leadership in Legal Industry Publications',
    description: 'Pitch articles to Law360 ("How Mid-Size Law Firms Can Reduce E-Billing Errors by 40%"), American Lawyer ("Outsourced Legal Billing: The Hidden ROI"), Legal Intelligencer ("LEDES Billing Compliance: 5 Common Mistakes"), Above the Law. Target: 2-3 published articles in major legal publications within 90 days.',
    impact: 'High',
    effort: 'High',
    timeline: '60-90 days',
    status: 'Not Started',
    notes: 'Most recent external coverage from 2019 (Texas Lawyer awards). Zero last 6 months. LLMs prioritize fresh 2024-25 content. Legal industry publications cited as authoritative sources.'
  },
  {
    priority_level: 'Strategic',
    title: 'Improve Citation Freshness Dimension',
    description: 'Update Capterra with 2025 service descriptions and reviews (7.0→9.0), update Crunchbase with recent news (7.0→8.5), pursue BBB accreditation (7.0→8.0), publish monthly 2025-dated blog posts, refresh LinkedIn 2-3x/week. Target: Freshness 7.1/10 → 8.5/10.',
    impact: 'Medium',
    effort: 'Medium',
    timeline: 'Ongoing (monthly)',
    status: 'Not Started',
    notes: 'Currently 6 citations ≤7.0 (stale/static). LLMs prioritize fresh content for "top firms in 2025" queries.'
  },
  {
    priority_level: 'Strategic',
    title: 'Standardize Brand Name Across All Citations',
    description: 'Update all 11 citations to "B2 Management & Consulting" (consistent naming), update LinkedIn to clarify DBA "B2 Legal Management", add "Legal Billing Consulting" as primary service descriptor everywhere. Target: Consistent branding across all platforms within 2-3 weeks.',
    impact: 'Medium',
    effort: 'Low',
    timeline: '2-3 weeks',
    status: 'Not Started',
    notes: 'Currently 6 name variations (Brand Alignment 7.4/10). Inconsistent naming reduces entity resolution in LLM knowledge graphs. Target 9.0/10.'
  },
  {
    priority_level: 'Strategic',
    title: 'Complete Industry Directory Build-Out',
    description: 'Complete Crunchbase profile, evaluate Product Hunt launch if applicable, create AngelList profile if seeking talent, explore Legal 500/Chambers consultant directories. Target: 4/4 directories with complete profiles within 30-60 days.',
    impact: 'Medium',
    effort: 'Medium',
    timeline: '30-60 days',
    status: 'Not Started',
    notes: 'Currently 1/4 directories (Crunchbase basic). Directory presence creates cross-citation opportunities.'
  },
  {
    priority_level: 'Strategic',
    title: 'Implement Competitive Positioning Learnings',
    description: 'Adopt TimeSolv\'s "mid-size law firm" explicit targeting, adopt Accurate Legal Billing\'s managed services positioning + Clutch presence, adopt Legal Billing Group\'s back-office outsourcing messaging, adopt LegalBillReview.com\'s quantifiable metrics. Target: Move from "Not ranked" to "Top 5" on 2 of 3 platforms within 90 days.',
    impact: 'High',
    effort: 'High',
    timeline: '90 days',
    status: 'Not Started',
    notes: 'Learn from competitors who rank higher. Implement service page optimization, metrics on About page, technology partnerships.'
  },

  // Long-term (180 days)
  {
    priority_level: 'Long-term',
    title: 'Establish Knowledge Graph Presence',
    description: 'Assess Wikipedia notability criteria (awards, media coverage, industry impact), engage Wikipedia editor if criteria met, create Wikidata entity once Wikipedia exists, build Google Knowledge Panel through structured data. Target: Wikipedia article or Wikidata entry within 12 months.',
    impact: 'High',
    effort: 'High',
    timeline: '12 months',
    status: 'Not Started',
    notes: 'Wikipedia notability takes time to establish. Requires significant third-party media coverage, awards, industry recognition. Alternative: Edit existing "Legal billing" Wikipedia article to include consulting firms category.'
  },
  {
    priority_level: 'Long-term',
    title: 'Build Long-Term Content Authority Strategy',
    description: 'Publish annual "State of Legal Billing for Mid-Size Law Firms" industry report with survey data, pursue Forbes/Inc.com contributor status for founder Brenda Barnes, speaking engagements at ALA/ILTA conferences, webinar series, case study library (10-15 detailed). Target: Citeable authority content within 6-12 months.',
    impact: 'High',
    effort: 'High',
    timeline: '6-12 months',
    status: 'Not Started',
    notes: 'Creates citeable authority content (similar to BTI Consulting cited by Perplexity). Leverage book authorship for thought leadership platform.'
  },
  {
    priority_level: 'Long-term',
    title: 'Software Platform Partnerships',
    description: 'Become certified consultant for Elite 3E, Aderant Expert, Clio, TimeSolv. Create "B2 Partner Network" page listing law firm clients (with permission), legal tech tools, industry associations. Target: 2-3 platform certifications within 6-12 months.',
    impact: 'Medium',
    effort: 'High',
    timeline: '6-12 months',
    status: 'Not Started',
    notes: 'Partner pages on vendor websites create new citations. Association with major brands improves credibility. LLMs cite "Elite 3E certified consultants" in queries (cf. LeanLaw Accounting Pros network model).'
  },
  {
    priority_level: 'Long-term',
    title: 'Awards and Recognition Program',
    description: 'Apply for Inc. 5000, Inc. Best Workplaces, Legal Tech Innovator Awards, ABA Journal Blawg 100, Stevie Awards for Legal Services. Target: 1-2 awards won within 12 months.',
    impact: 'Medium',
    effort: 'Medium',
    timeline: '12 months',
    status: 'Not Started',
    notes: 'Awards create news coverage, citations, credibility signals. Application cycles vary. Most recent award: Texas Lawyer 2019 (6 years stale).'
  }
];

async function createAuditRun() {
  console.log('\n📊 Creating Audit Run record...');

  try {
    const record = await base('Audit_Runs').create([
      {
        fields: {
          brand_name: AUDIT_DATA.brand_name,
          category: AUDIT_DATA.category,
          audit_date: AUDIT_DATA.audit_date,
          overall_score: AUDIT_DATA.overall_score,
          trust_node_coverage: AUDIT_DATA.trust_node_coverage,
          trust_node_percentage: AUDIT_DATA.trust_node_percentage,
          citation_quality: AUDIT_DATA.citation_quality,
          ai_citation_rate: AUDIT_DATA.ai_citation_rate,
          perplexity_cited: AUDIT_DATA.perplexity_cited,
          perplexity_rank: AUDIT_DATA.perplexity_rank,
          chatgpt_cited: AUDIT_DATA.chatgpt_cited,
          chatgpt_rank: AUDIT_DATA.chatgpt_rank,
          gemini_cited: AUDIT_DATA.gemini_cited,
          gemini_rank: AUDIT_DATA.gemini_rank,
          status: AUDIT_DATA.status,
          executive_summary: AUDIT_DATA.executive_summary,
          top_priority_1: AUDIT_DATA.top_priority_1,
          top_priority_2: AUDIT_DATA.top_priority_2,
          top_priority_3: AUDIT_DATA.top_priority_3,
          next_audit_date: AUDIT_DATA.next_audit_date
        }
      }
    ]);

    console.log(`✅ Audit Run created: ${record[0].id}`);
    return record[0].id;
  } catch (error) {
    console.error('❌ Error creating Audit Run:', error);
    throw error;
  }
}

async function createTrustNodes(auditRunId) {
  console.log('\n🔍 Creating Trust Node records...');

  const records = TRUST_NODES.map(node => ({
    fields: {
      audit: [auditRunId],
      category: node.category,
      node_name: node.node_name,
      present: node.present,
      quality_score: node.quality_score,
      url: node.url,
      notes: node.notes
    }
  }));

  // Airtable limits batch creates to 10 records
  const batches = [];
  for (let i = 0; i < records.length; i += 10) {
    batches.push(records.slice(i, i + 10));
  }

  try {
    let totalCreated = 0;
    for (const batch of batches) {
      const created = await base('Trust_Nodes').create(batch);
      totalCreated += created.length;
    }
    console.log(`✅ Created ${totalCreated} Trust Node records`);
  } catch (error) {
    console.error('❌ Error creating Trust Nodes:', error);
    throw error;
  }
}

async function createCitations(auditRunId) {
  console.log('\n📝 Creating Citation records...');

  const records = CITATIONS.map(citation => ({
    fields: {
      audit: [auditRunId],
      source_title: citation.source_title,
      source_url: citation.source_url,
      source_domain: citation.source_domain,
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
      notes: citation.notes
    }
  }));

  // Airtable limits batch creates to 10 records
  const batches = [];
  for (let i = 0; i < records.length; i += 10) {
    batches.push(records.slice(i, i + 10));
  }

  try {
    let totalCreated = 0;
    for (const batch of batches) {
      const created = await base('Citations').create(batch);
      totalCreated += created.length;
    }
    console.log(`✅ Created ${totalCreated} Citation records`);
  } catch (error) {
    console.error('❌ Error creating Citations:', error);
    throw error;
  }
}

async function createLLMResponses(auditRunId) {
  console.log('\n🤖 Creating LLM Response records...');

  const records = LLM_RESPONSES.map(response => ({
    fields: {
      audit: [auditRunId],
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
      response_summary: response.response_summary
    }
  }));

  try {
    const created = await base('LLM_Responses').create(records);
    console.log(`✅ Created ${created.length} LLM Response records`);
  } catch (error) {
    console.error('❌ Error creating LLM Responses:', error);
    throw error;
  }
}

async function createPriorities(auditRunId) {
  console.log('\n🎯 Creating Priority records...');

  const records = PRIORITIES.map(priority => ({
    fields: {
      audit: [auditRunId],
      priority_level: priority.priority_level,
      title: priority.title,
      description: priority.description,
      impact: priority.impact,
      effort: priority.effort,
      timeline: priority.timeline,
      status: priority.status,
      notes: priority.notes
    }
  }));

  // Airtable limits batch creates to 10 records
  const batches = [];
  for (let i = 0; i < records.length; i += 10) {
    batches.push(records.slice(i, i + 10));
  }

  try {
    let totalCreated = 0;
    for (const batch of batches) {
      const created = await base('Priorities').create(batch);
      totalCreated += created.length;
    }
    console.log(`✅ Created ${totalCreated} Priority records`);
  } catch (error) {
    console.error('❌ Error creating Priorities:', error);
    throw error;
  }
}

async function main() {
  console.log('='.repeat(60));
  console.log('B2 MANAGEMENT & CONSULTING - AIRTABLE EXPORT');
  console.log('='.repeat(60));

  try {
    // Create Audit Run first to get ID for linking
    const auditRunId = await createAuditRun();

    // Create linked records
    await createTrustNodes(auditRunId);
    await createCitations(auditRunId);
    await createLLMResponses(auditRunId);
    await createPriorities(auditRunId);

    console.log('\n' + '='.repeat(60));
    console.log('✅ EXPORT COMPLETE');
    console.log('='.repeat(60));
    console.log('\nSummary:');
    console.log(`- Audit Run: ${AUDIT_DATA.brand_name} (${AUDIT_DATA.audit_date})`);
    console.log(`- Overall Score: ${AUDIT_DATA.overall_score}/10`);
    console.log(`- Trust Nodes: ${TRUST_NODES.length} tracked`);
    console.log(`- Citations: ${CITATIONS.length} analyzed`);
    console.log(`- LLM Responses: ${LLM_RESPONSES.length} queries`);
    console.log(`- Priorities: ${PRIORITIES.length} action items`);
    console.log('\nView in Airtable: https://airtable.com/appv02hfLoza42r5h');

  } catch (error) {
    console.error('\n❌ Export failed:', error.message);
    process.exit(1);
  }
}

main();
