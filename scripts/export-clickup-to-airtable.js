#!/usr/bin/env node

/**
 * Export ClickUp Audit to Airtable
 * Complete 5-table export with proper audit linkage
 *
 * Tables: Audit_Runs, Trust_Nodes, Citations, LLM_Responses, Priorities
 */

import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;

if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID) {
  console.error('❌ Missing required environment variables:');
  console.error('   AIRTABLE_API_KEY:', AIRTABLE_API_KEY ? '✓' : '✗');
  console.error('   AIRTABLE_BASE_ID:', AIRTABLE_BASE_ID ? '✓' : '✗');
  process.exit(1);
}

// ClickUp audit payload
const auditData = {
  "audit_run": {
    "brand_name": "ClickUp",
    "category": "Project management and team collaboration platforms",
    "audit_date": "2025-10-29",
    "overall_score": 9.1,
    "trust_node_coverage": 27,
    "trust_node_percentage": 93,
    "citation_quality": 8.8,
    "ai_citation_rate": 100,
    "perplexity_rank": 3,
    "chatgpt_rank": 1,
    "gemini_rank": 4,
    "perplexity_cited": true,
    "chatgpt_cited": true,
    "gemini_cited": true,
    "status": "Complete",
    "executive_summary": "ClickUp demonstrates exceptional AI visibility with 93% trust node coverage (27/29), 8.8/10 citation quality (top 5% of SaaS brands), and 100% visibility across all 3 major AI platforms. Achieved #1 ranking on ChatGPT, averaging #2.7 across all platforms. Primary opportunities: expand Forbes/Inc.com coverage, publish thought leadership content to compete for #1 on Perplexity and Gemini.",
    "top_priority_1": "Publish authoritative thought leadership content - Create 'The Complete Project Management Software Guide 2025' on ClickUp blog comparing 20+ tools objectively to compete with Hive's self-published content that drove their #1 Perplexity ranking",
    "top_priority_2": "Secure Forbes coverage - Pitch Forbes Cloud 100, Forbes AI 50, or CEO profile emphasizing $0 to $4B growth story, AI narrative, and product-led growth playbook",
    "top_priority_3": "Amplify 2025 AI features narrative - Create multi-channel AI capability campaign with press releases, Product Hunt launch, and enterprise customer case studies to improve AI feature mentions in LLM citations from 30% to 50%+",
    "next_audit_date": "2025-12-28"
  },
  "trust_nodes": [
    {"category": "Knowledge Graph", "node_name": "Wikipedia", "present": true, "quality_score": 8.5, "last_updated": "2024", "url": "https://en.wikipedia.org/wiki/ClickUp", "notes": "Start-class article covering founding, funding through Series C, acquisitions, product evolution. Well-referenced with authoritative sources."},
    {"category": "Knowledge Graph", "node_name": "Wikidata", "present": true, "quality_score": 9.0, "last_updated": "2024", "url": "https://www.wikidata.org/wiki/Q123524232", "notes": "Comprehensive entity (Q123524232) with 15+ properties, strong cross-platform identifiers"},
    {"category": "Knowledge Graph", "node_name": "Google Knowledge Panel", "present": true, "quality_score": 8.5, "last_updated": "2025", "url": null, "notes": "Has knowledge panel inferred from rich entity data in search results"},
    {"category": "Review Platform", "node_name": "G2", "present": true, "quality_score": 9.5, "last_updated": "2025", "url": "https://www.g2.com/products/clickup/reviews", "notes": "10,574+ reviews, 4.7/5 stars, #1 in 18 categories in G2 2024 Winter Report"},
    {"category": "Review Platform", "node_name": "Capterra", "present": true, "quality_score": 8.5, "last_updated": "2025", "url": "https://www.capterra.com/p/158833/ClickUp/", "notes": "Multiple pages of reviews, claimed profile, comprehensive feature descriptions"},
    {"category": "Review Platform", "node_name": "Trustpilot", "present": true, "quality_score": 6.5, "last_updated": "2025", "url": "https://www.trustpilot.com/review/clickup.com", "notes": "356+ reviews, MIXED sentiment - customer support complaints noted"},
    {"category": "Review Platform", "node_name": "Software Advice", "present": true, "quality_score": 8.5, "last_updated": "2025", "url": "https://www.softwareadvice.com/project-management/clickup-profile/", "notes": "Comprehensive profile with reviews, comparisons, active management"},
    {"category": "Review Platform", "node_name": "GetApp", "present": true, "quality_score": 8.5, "last_updated": "2025-01", "url": "https://www.getapp.com/project-management-planning-software/a/clickup/reviews/", "notes": "664+ verified reviews (July 2021-Jan 2025), detailed feature analysis"},
    {"category": "Directory", "node_name": "Crunchbase", "present": true, "quality_score": 9.5, "last_updated": "2025", "url": "https://www.crunchbase.com/organization/clickup", "notes": "Comprehensive: $535M funding, 900 employees, $4B valuation, complete investor list"},
    {"category": "Directory", "node_name": "Product Hunt", "present": true, "quality_score": 9.0, "last_updated": "2025", "url": "https://www.producthunt.com/products/clickup", "notes": "Multiple launches (ClickUp, ClickUp 3.0, Brain MAX), active community"},
    {"category": "Directory", "node_name": "AngelList/Wellfound", "present": true, "quality_score": 9.0, "last_updated": "2025", "url": "https://wellfound.com/company/clickup", "notes": "Strong profile: 800K+ teams, $1B unicorn in <3 years, $0 initial marketing spend"},
    {"category": "Directory", "node_name": "BuiltWith", "present": true, "quality_score": 7.5, "last_updated": "2025", "url": "https://trends.builtwith.com/analytics/ClickUp", "notes": "Usage statistics, website adoption tracking, trend data"},
    {"category": "Company Profile", "node_name": "LinkedIn Company", "present": true, "quality_score": 9.0, "last_updated": "2025", "url": "https://www.linkedin.com/company/clickup-app", "notes": "10M+ users, 2M+ teams mentioned, 900 employees, active posting"},
    {"category": "Company Profile", "node_name": "Bloomberg", "present": true, "quality_score": 8.0, "last_updated": "2024-12", "url": "https://www.bloomberg.com/news/articles/2020-12-15/software-maker-clickup-reaches-1-billion-value-in-funding-round", "notes": "Multiple articles on funding rounds, December 2024 Tech Disruptors podcast with CEO"},
    {"category": "Company Profile", "node_name": "PitchBook", "present": true, "quality_score": 9.0, "last_updated": "2025", "url": "https://pitchbook.com/profiles/company/157707-28", "notes": "Comprehensive: $535M funding, 900 employees, $4B valuation, complete investor list"},
    {"category": "News & PR", "node_name": "General News Coverage", "present": true, "quality_score": 9.0, "last_updated": "2025-10", "url": null, "notes": "25+ articles in last 6 months, tier-1 publications, positive sentiment. Recent: $278.5M revenue, 12M users"},
    {"category": "Seed Site", "node_name": "TechCrunch", "present": true, "quality_score": 9.5, "last_updated": "2025-03", "url": "https://techcrunch.com/2025/03/13/clickup-is-launching-a-revamped-calendar-tool-for-task-and-meeting-management/", "notes": "10+ articles covering all major funding rounds and product launches through March 2025"},
    {"category": "Seed Site", "node_name": "VentureBeat", "present": true, "quality_score": 9.0, "last_updated": "2025-10", "url": "https://venturebeat.com/virtual/clickup-takes-on-slack-and-teams-with-its-own-ai-powered-everything-chat", "notes": "6+ articles, most recent October 2025 (OpenAI integration), strong AI/technical coverage"},
    {"category": "Seed Site", "node_name": "Forbes", "present": false, "quality_score": null, "last_updated": null, "url": null, "notes": "CRITICAL GAP: No Forbes coverage found. Should target Forbes Cloud 100, Forbes AI 50"},
    {"category": "Seed Site", "node_name": "Inc.com", "present": true, "quality_score": 4.0, "last_updated": "2025-09", "url": "https://www.inc.com/rob-kischuk/3-ways-ai-can-streamline-small-businesses/91243944", "notes": "LIMITED: Only 1 passing mention. Missing founder stories, Inc. 5000 profile"},
    {"category": "Seed Site", "node_name": "Fast Company", "present": true, "quality_score": 9.0, "last_updated": "2025-01", "url": "https://www.fastcompany.com/91258582/clickup-ceo-zeb-evans-interview", "notes": "5+ articles, CEO interview (Jan 2025), Most Innovative Companies 2024"}
  ],
  "citations": [
    {"url": "https://www.g2.com/products/clickup/reviews", "domain": "G2", "title": "ClickUp Reviews 2025", "authority_score": 9.5, "data_structure_score": 9.5, "brand_alignment_score": 10.0, "freshness_score": 9.5, "cross_link_score": 9.0, "overall_score": 9.5, "notes": "Leading B2B review platform. 10,574 reviews, 4.7/5 stars, rich Schema.org markup"},
    {"url": "https://www.capterra.com/p/158833/ClickUp/", "domain": "Capterra", "title": "ClickUp Software Reviews", "authority_score": 9.0, "data_structure_score": 9.0, "brand_alignment_score": 9.5, "freshness_score": 9.0, "cross_link_score": 8.5, "overall_score": 9.0, "notes": "Gartner-owned review platform. Comprehensive profile with pricing and features"},
    {"url": "https://www.trustpilot.com/review/clickup.com", "domain": "Trustpilot", "title": "ClickUp Reviews", "authority_score": 8.5, "data_structure_score": 8.5, "brand_alignment_score": 7.0, "freshness_score": 9.0, "cross_link_score": 7.5, "overall_score": 8.1, "notes": "356 reviews with mixed sentiment. Customer support complaints noted"},
    {"url": "https://techcrunch.com/2025/03/13/clickup-is-launching-a-revamped-calendar-tool-for-task-and-meeting-management/", "domain": "TechCrunch", "title": "ClickUp calendar tool launch", "authority_score": 10.0, "data_structure_score": 8.5, "brand_alignment_score": 10.0, "freshness_score": 9.5, "cross_link_score": 8.0, "overall_score": 9.2, "notes": "Tier 1 tech news. Recent March 2025 product launch coverage"},
    {"url": "https://techcrunch.com/2021/10/27/clickup-raises-400m-at-a-4b-valuation-to-expand-its-all-in-one-workplace-productivity-platform-to-europe/", "domain": "TechCrunch", "title": "ClickUp $400M Series C", "authority_score": 10.0, "data_structure_score": 8.5, "brand_alignment_score": 10.0, "freshness_score": 6.0, "cross_link_score": 8.5, "overall_score": 8.6, "notes": "Tier 1 tech news. Major funding announcement, older but authoritative"},
    {"url": "https://venturebeat.com/virtual/clickup-takes-on-slack-and-teams-with-its-own-ai-powered-everything-chat", "domain": "VentureBeat", "title": "ClickUp Chat launch", "authority_score": 9.5, "data_structure_score": 8.5, "brand_alignment_score": 10.0, "freshness_score": 9.5, "cross_link_score": 8.0, "overall_score": 9.1, "notes": "Tier 1 tech news. AI-powered chat feature coverage"},
    {"url": "https://www.fastcompany.com/91258582/clickup-ceo-zeb-evans-interview", "domain": "Fast Company", "title": "ClickUp CEO interview", "authority_score": 9.5, "data_structure_score": 8.0, "brand_alignment_score": 10.0, "freshness_score": 9.0, "cross_link_score": 8.0, "overall_score": 8.9, "notes": "Tier 1 business publication. Thought leadership and CEO profile"},
    {"url": "https://thedigitalprojectmanager.com/tools/clickup-review/", "domain": "The Digital Project Manager", "title": "ClickUp Review 2025", "authority_score": 8.5, "data_structure_score": 9.0, "brand_alignment_score": 9.5, "freshness_score": 9.0, "cross_link_score": 8.0, "overall_score": 8.8, "notes": "Industry-leading PM review site. Expert analysis and detailed features"},
    {"url": "https://tech.co/project-management-software/clickup-review", "domain": "Tech.co", "title": "ClickUp Review 2025", "authority_score": 8.5, "data_structure_score": 9.0, "brand_alignment_score": 9.5, "freshness_score": 9.5, "cross_link_score": 7.5, "overall_score": 8.8, "notes": "Major tech comparison platform. 4.5/5 rating, #3 ranking among 10 providers"},
    {"url": "https://www.cloudwards.net/clickup-review/", "domain": "Cloudwards", "title": "ClickUp Review 2025", "authority_score": 8.0, "data_structure_score": 8.5, "brand_alignment_score": 9.5, "freshness_score": 9.0, "cross_link_score": 7.0, "overall_score": 8.4, "notes": "Cloud software review specialist. Detailed feature analysis"},
    {"url": "https://www.getapp.com/project-management-planning-software/a/clickup/reviews/", "domain": "GetApp", "title": "ClickUp Reviews 2025", "authority_score": 9.0, "data_structure_score": 9.0, "brand_alignment_score": 9.5, "freshness_score": 9.5, "cross_link_score": 8.0, "overall_score": 9.0, "notes": "Gartner-owned review platform. 664+ verified reviews through Jan 2025"},
    {"url": "https://www.crunchbase.com/organization/clickup", "domain": "Crunchbase", "title": "ClickUp - Crunchbase Profile", "authority_score": 9.5, "data_structure_score": 10.0, "brand_alignment_score": 10.0, "freshness_score": 9.0, "cross_link_score": 9.0, "overall_score": 9.5, "notes": "Premium business intelligence. Complete funding, investor, employee data"},
    {"url": "https://en.wikipedia.org/wiki/ClickUp", "domain": "Wikipedia", "title": "ClickUp", "authority_score": 10.0, "data_structure_score": 10.0, "brand_alignment_score": 9.5, "freshness_score": 7.0, "cross_link_score": 10.0, "overall_score": 9.3, "notes": "Critical knowledge graph entity with Wikidata ID Q123524232. Well-referenced"},
    {"url": "https://www.linkedin.com/company/clickup-app", "domain": "LinkedIn", "title": "ClickUp Company Profile", "authority_score": 9.0, "data_structure_score": 9.5, "brand_alignment_score": 10.0, "freshness_score": 10.0, "cross_link_score": 8.5, "overall_score": 9.4, "notes": "Real-time freshness with daily updates. 10M+ users, active posting"},
    {"url": "https://www.producthunt.com/products/clickup", "domain": "Product Hunt", "title": "ClickUp - Product Hunt", "authority_score": 8.5, "data_structure_score": 8.5, "brand_alignment_score": 10.0, "freshness_score": 8.5, "cross_link_score": 8.0, "overall_score": 8.7, "notes": "Multiple successful launches. Active community engagement"}
  ],
  "llm_responses": [
    {"platform": "Perplexity", "query_type": "Evaluative", "query_text": "What are the top project management tools in 2025?", "brand_cited": true, "brand_rank": 6, "brand_context": "Listed as #6 of 9 tools. Highlighted for customizable task views, automation, goal tracking, Agile support", "citations_found": 13, "competitor_1": "Hive", "competitor_1_rank": 1, "competitor_2": "Asana", "competitor_2_rank": 2, "competitor_3": "Monday.com", "competitor_3_rank": 3, "response_summary": "Ranked #6 in evaluative query. Hive dominated with self-published thought leadership. Strong Tier 1 comparison site coverage but needs Wikipedia citations and 2025 AI narrative."},
    {"platform": "Perplexity", "query_type": "Comparative", "query_text": "Best project management software for remote teams", "brand_cited": true, "brand_rank": 2, "brand_context": "Ranked #2 of 7 with detailed remote team positioning. Emphasized comprehensive features: tasks, docs, chat, goals, screen recording", "citations_found": 14, "competitor_1": "Monday.com", "competitor_1_rank": 1, "competitor_2": "Asana", "competitor_2_rank": 3, "competitor_3": "Trello", "competitor_3_rank": 4, "response_summary": "Strong #2 position in remote team context. Screen recording and collaboration features differentiated ClickUp for remote use cases."},
    {"platform": "Perplexity", "query_type": "Brand-Specific", "query_text": "ClickUp reviews and credentials", "brand_cited": true, "brand_rank": 1, "brand_context": "Primary subject with comprehensive overview. Mixed-to-positive ratings, security credentials (SOC2, ISO 27001, GDPR, HIPAA)", "citations_found": 11, "competitor_1": "Monday.com", "competitor_1_rank": null, "competitor_2": "Teamwork", "competitor_2_rank": null, "competitor_3": null, "competitor_3_rank": null, "response_summary": "Brand-specific query returned detailed results. Multiple review platforms cited. No Wikipedia cited - lacks structured knowledge graph."},
    {"platform": "ChatGPT", "query_type": "Evaluative", "query_text": "What are the top project management tools in 2025?", "brand_cited": true, "brand_rank": 1, "brand_context": "Ranked #1 with detailed feature description emphasizing flexibility, customization, AI automation, and all-in-one capabilities", "citations_found": 14, "competitor_1": "Asana", "competitor_1_rank": 2, "competitor_2": "Monday.com", "competitor_2_rank": 3, "competitor_3": "Trello", "competitor_3_rank": 4, "response_summary": "ClickUp achieved #1 ranking. Primary sources: ONES.com, Include Work, Jaro Education. All primary sources from 2025 with fresh publication dates."},
    {"platform": "Gemini", "query_type": "Evaluative", "query_text": "What are the top project management tools in 2025?", "brand_cited": true, "brand_rank": 4, "brand_context": "Listed as #4 in table of 8 tools. Described as 'Feature-Rich & All-in-One' platform with high customization on a budget", "citations_found": 1, "competitor_1": "monday.com", "competitor_1_rank": 1, "competitor_2": "Asana", "competitor_2_rank": 2, "competitor_3": "Wrike", "competitor_3_rank": 3, "response_summary": "Ranked #4 of 8 tools. Single citation from Wrike.com comparison article (competitor source). Opportunity to create competing authoritative comparison content."}
  ],
  "priorities": [
    {"priority_level": "Immediate", "title": "Publish authoritative thought leadership content", "description": "Create 'The Complete Project Management Software Guide 2025' on ClickUp blog comparing 20+ tools objectively (including competitors). Emphasize AI trends, remote team features, integration ecosystem. Target 5,000+ words with visual charts/tables. This content will compete with Hive's self-published blog that drove their #1 Perplexity ranking.", "impact": "High", "effort": "Medium", "timeline": "2-3 weeks", "status": "Not Started", "assigned_to": null, "due_date": null, "completed_date": null, "notes": "Success metric: ClickUp blog cited in Perplexity responses within 60 days. Could improve Perplexity ranking from #6 to top 3 in evaluative queries."},
    {"priority_level": "Immediate", "title": "Secure Forbes coverage", "description": "Pitch Forbes Cloud 100, Forbes AI 50, or CEO profile story. Angles: (1) $0 to $4B valuation with zero initial marketing spend, (2) AI-powered productivity replacing 7+ tools per customer, (3) 12M users in 8 years: product-led growth playbook.", "impact": "High", "effort": "Medium", "timeline": "4-6 weeks", "status": "Not Started", "assigned_to": null, "due_date": null, "completed_date": null, "notes": "Blocks financial/business authority citations that Tier 1 news outlets provide. Success metric: Forbes article published mentioning ClickUp within competitive context."},
    {"priority_level": "Immediate", "title": "Amplify 2025 AI features narrative", "description": "Create multi-channel AI capability campaign: (1) Press release with customer data showing hours saved per week, (2) Product Hunt launch for ClickUp Brain MAX as standalone AI features showcase, (3) Enterprise customer case studies with name-drops (similar to Asana's Palo Alto Networks reference).", "impact": "High", "effort": "Medium", "timeline": "3-4 weeks", "status": "Not Started", "assigned_to": null, "due_date": null, "completed_date": null, "notes": "AI features drove ChatGPT #1 ranking. Success metric: ClickUp's AI features mentioned in 50%+ of LLM citations (currently ~30%)."},
    {"priority_level": "Strategic", "title": "Complete seed site coverage - Forbes and Inc.com", "description": "Forbes: Prepare company data package for Forbes Cloud 100 2026 submission (deadline typically Q1). Inc.com: Submit Inc. 5000 application if revenue criteria met, pitch 'From Craigslist Alternative to $4B Unicorn' founder narrative.", "impact": "Medium", "effort": "Medium", "timeline": "8-12 weeks", "status": "Not Started", "assigned_to": null, "due_date": null, "completed_date": null, "notes": "Complete seed site coverage from 3/5 to 5/5 (60% to 100%). Increases citation authority by 15-20%."},
    {"priority_level": "Strategic", "title": "Improve cross-link signals (8.2/10 to 9.0/10)", "description": "Outreach to 20 comparison sites requesting Wikipedia and Crunchbase links in ClickUp mentions. Update ClickUp Wikipedia page with 2025 milestones (Chat launch, Brain MAX, $278.5M revenue, 12M users). Add 'As featured in' badge section on clickup.com linking to G2, Capterra, Crunchbase, Wikipedia.", "impact": "Medium", "effort": "Low", "timeline": "6-8 weeks", "status": "Not Started", "assigned_to": null, "due_date": null, "completed_date": null, "notes": "Denser trust node network improves citation quality score by 0.5-0.8 points. Creates stronger knowledge graph signals for LLMs."},
    {"priority_level": "Strategic", "title": "Address Trustpilot sentiment", "description": "Implement dedicated Trustpilot response team (respond to 100% of reviews within 48 hours). Create public FAQ addressing recurring complaints (bugs, billing, support response times). Launch customer success improvement initiative targeting Trustpilot reviewers for follow-up.", "impact": "Medium", "effort": "High", "timeline": "10-12 weeks", "status": "Not Started", "assigned_to": null, "due_date": null, "completed_date": null, "notes": "356 reviews with mixed sentiment. Improved sentiment leads to better citation quality perception in future audits. Ongoing initiative."}
  ]
};

console.log('📊 ClickUp AI Visibility Audit → Airtable Export');
console.log('================================================\n');
console.log(`Brand: ${auditData.audit_run.brand_name}`);
console.log(`Date: ${auditData.audit_run.audit_date}`);
console.log(`Overall Score: ${auditData.audit_run.overall_score}/10\n`);

/**
 * Step 0: Pre-flight check - Search for existing audit
 */
async function checkExistingAudit() {
  console.log('🔍 Pre-flight check: Searching for existing ClickUp audit on 2025-10-29...\n');

  const url = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/Audit_Runs`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${AIRTABLE_API_KEY}`
    }
  });

  if (!response.ok) {
    console.warn('⚠️  Could not search existing audits (will proceed with creation)');
    return null;
  }

  const data = await response.json();
  const existingAudit = data.records.find(record =>
    record.fields.brand_name === 'ClickUp' &&
    record.fields.audit_date === '2025-10-29'
  );

  if (existingAudit) {
    console.log(`⚠️  FOUND EXISTING AUDIT: ${existingAudit.id}`);
    console.log(`   Brand: ${existingAudit.fields.brand_name}`);
    console.log(`   Date: ${existingAudit.fields.audit_date}`);
    console.log(`   Score: ${existingAudit.fields.overall_score}\n`);
    console.log('⚠️  This script will CREATE A NEW audit record.');
    console.log('   To update the existing record instead, modify the script to use PATCH.\n');
    return existingAudit.id;
  }

  console.log('✓ No existing audit found. Proceeding with creation.\n');
  return null;
}

/**
 * Step 1: Create main audit record
 */
async function createAuditRun() {
  const url = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/Audit_Runs`;

  const record = {
    fields: {
      'brand_name': auditData.audit_run.brand_name,
      'category': auditData.audit_run.category,
      'audit_date': auditData.audit_run.audit_date,
      'overall_score': auditData.audit_run.overall_score,
      'trust_node_coverage': auditData.audit_run.trust_node_coverage,
      'trust_node_percentage': auditData.audit_run.trust_node_percentage,
      'citation_quality': auditData.audit_run.citation_quality,
      'ai_citation_rate': auditData.audit_run.ai_citation_rate,
      'perplexity_rank': auditData.audit_run.perplexity_rank,
      'chatgpt_rank': auditData.audit_run.chatgpt_rank,
      'gemini_rank': auditData.audit_run.gemini_rank,
      'perplexity_cited': auditData.audit_run.perplexity_cited,
      'chatgpt_cited': auditData.audit_run.chatgpt_cited,
      'gemini_cited': auditData.audit_run.gemini_cited,
      'status': auditData.audit_run.status,
      'executive_summary': auditData.audit_run.executive_summary,
      'top_priority_1': auditData.audit_run.top_priority_1,
      'top_priority_2': auditData.audit_run.top_priority_2,
      'top_priority_3': auditData.audit_run.top_priority_3,
      'next_audit_date': auditData.audit_run.next_audit_date
    }
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
  console.log(`✓ Created audit record: ${data.id}\n`);
  return data.id;
}

/**
 * Step 2: Create trust node records (batch)
 */
async function createTrustNodes(auditId) {
  const url = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/Trust_Nodes`;

  const records = auditData.trust_nodes.map(node => ({
    fields: {
      'category': node.category,
      'node_name': node.node_name,
      'present': node.present,
      'quality_score': node.quality_score,
      'last_updated': node.last_updated,
      'url': node.url,
      'notes': node.notes,
      'audit': [auditId]  // Link to audit
    }
  }));

  let totalCreated = 0;

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
    totalCreated += data.records.length;
    console.log(`✓ Created ${data.records.length} trust node records (batch ${Math.floor(i/10) + 1})`);
  }

  console.log(`✓ Total trust nodes: ${totalCreated}/${auditData.trust_nodes.length}\n`);
  return totalCreated;
}

/**
 * Step 3: Create citation records (batch)
 */
async function createCitations(auditId) {
  const url = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/Citations`;

  const records = auditData.citations.map(citation => ({
    fields: {
      'source_url': citation.url,
      'source_domain': citation.domain,
      'source_title': citation.title,
      'authority_score': citation.authority_score,
      'data_structure_score': citation.data_structure_score,
      'brand_alignment_score': citation.brand_alignment_score,
      'freshness_score': citation.freshness_score,
      'cross_link_score': citation.cross_link_score,
      'overall_quality': citation.overall_score,
      'notes': citation.notes,
      'audit': [auditId]  // Link to audit
    }
  }));

  let totalCreated = 0;

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
    totalCreated += data.records.length;
    console.log(`✓ Created ${data.records.length} citation records (batch ${Math.floor(i/10) + 1})`);
  }

  console.log(`✓ Total citations: ${totalCreated}/${auditData.citations.length}\n`);
  return totalCreated;
}

/**
 * Step 4: Create LLM response records
 */
async function createLLMResponses(auditId) {
  const url = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/LLM_Responses`;

  const records = auditData.llm_responses.map(response => ({
    fields: {
      'platform': response.platform,
      'query_type': response.query_type,
      'query_text': response.query_text,
      'brand_cited': response.brand_cited,
      'brand_rank': response.brand_rank,
      'brand_context': response.brand_context,
      'citations_found': response.citations_found,
      'competitor_1': response.competitor_1,
      'competitor_1_rank': response.competitor_1_rank,
      'competitor_2': response.competitor_2,
      'competitor_2_rank': response.competitor_2_rank,
      'competitor_3': response.competitor_3,
      'competitor_3_rank': response.competitor_3_rank,
      'response_summary': response.response_summary,
      'audit': [auditId]  // Link to audit
    }
  }));

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ records })
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to create LLM response records: ${error}`);
  }

  const data = await response.json();
  console.log(`✓ Created ${data.records.length} LLM response records\n`);
  return data.records.length;
}

/**
 * Step 5: Create priority records
 */
async function createPriorities(auditId) {
  const url = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/Priorities`;

  const records = auditData.priorities.map(priority => ({
    fields: {
      'priority_level': priority.priority_level,
      'title': priority.title,
      'description': priority.description,
      'impact': priority.impact,
      'effort': priority.effort,
      'timeline': priority.timeline,
      'status': priority.status,
      'assigned_to': priority.assigned_to,
      'due_date': priority.due_date,
      'completed_date': priority.completed_date,
      'notes': priority.notes,
      'audit': [auditId]  // Link to audit
    }
  }));

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ records })
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to create priority records: ${error}`);
  }

  const data = await response.json();
  console.log(`✓ Created ${data.records.length} priority records\n`);
  return data.records.length;
}

/**
 * Main execution
 */
async function main() {
  try {
    // Pre-flight check
    await checkExistingAudit();

    console.log('📤 Starting export to Airtable...\n');

    // Step 1: Create audit record
    console.log('1️⃣  Creating audit record...');
    const auditId = await createAuditRun();

    // Step 2: Create trust nodes
    console.log('2️⃣  Creating trust node records...');
    const trustNodesCreated = await createTrustNodes(auditId);

    // Step 3: Create citations
    console.log('3️⃣  Creating citation records...');
    const citationsCreated = await createCitations(auditId);

    // Step 4: Create LLM responses
    console.log('4️⃣  Creating LLM response records...');
    const llmResponsesCreated = await createLLMResponses(auditId);

    // Step 5: Create priorities
    console.log('5️⃣  Creating priority records...');
    const prioritiesCreated = await createPriorities(auditId);

    // Success summary
    console.log('================================================');
    console.log('✅ AUDIT DATA SAVED TO AIRTABLE\n');
    console.log('Summary:');
    console.log(`- Brand: ${auditData.audit_run.brand_name}`);
    console.log(`- Audit Date: ${auditData.audit_run.audit_date}`);
    console.log(`- Overall Score: ${auditData.audit_run.overall_score}/10\n`);
    console.log('Records Created:');
    console.log(`✓ 1 audit run (ID: ${auditId})`);
    console.log(`✓ ${trustNodesCreated} trust nodes`);
    console.log(`✓ ${citationsCreated} citations`);
    console.log(`✓ ${llmResponsesCreated} LLM responses (${auditData.llm_responses.filter(r => r.platform === 'Perplexity').length} Perplexity, ${auditData.llm_responses.filter(r => r.platform === 'ChatGPT').length} ChatGPT, ${auditData.llm_responses.filter(r => r.platform === 'Gemini').length} Gemini)`);
    console.log(`✓ ${prioritiesCreated} priorities\n`);
    console.log('View in Airtable:');
    console.log(`https://airtable.com/${AIRTABLE_BASE_ID}\n`);
    console.log('Next Steps:');
    console.log('- Review priorities in Airtable');
    console.log('- Assign owners to action items');
    console.log(`- Schedule next audit for ${auditData.audit_run.next_audit_date}`);

  } catch (error) {
    console.error('\n❌ Export failed:', error.message);
    process.exit(1);
  }
}

main();
