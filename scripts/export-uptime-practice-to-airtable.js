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
  brand_name: "Uptime Practice",
  category: "Cloud Hosting/IT Managed Services for Law Firms",
  audit_date: "2025-11-02",
  overall_score: 7.2,
  trust_node_coverage: 5,
  trust_node_percentage: 0.172,
  citation_quality: 6.5,
  ai_citation_rate: 1.0,
  perplexity_rank: 1,
  chatgpt_rank: 2,
  gemini_rank: 1,
  perplexity_cited: true,
  chatgpt_cited: true,
  gemini_cited: true,
  status: "Complete",
  executive_summary: "Strong AI visibility despite weak trust node coverage - Ranked #1 on Perplexity and Gemini, #2 on ChatGPT, yet only 17.2% trust node coverage (5/29 nodes). Critical gap: Zero review platform presence blocks user review citations. Fresh content strategy working with May 2025 content driving ChatGPT position.",
  top_priority_1: "Update Crunchbase Profile - Brand Name Alignment",
  top_priority_2: "Add Schema.org Markup to uptimepractice.com",
  top_priority_3: "Claim G2 Profile - Establish Review Platform Presence",
  next_audit_date: "2026-01-02"
};

const trustNodes = [
  {
    category: "Knowledge Graph",
    node_name: "Wikipedia",
    present: false,
    quality_score: null,
    last_updated: null,
    url: null,
    notes: "No Wikipedia article found - critical gap blocking knowledge graph authority"
  },
  {
    category: "Knowledge Graph",
    node_name: "Wikidata",
    present: false,
    quality_score: null,
    last_updated: null,
    url: null,
    notes: "No Wikidata entity - missing structured data connections"
  },
  {
    category: "Knowledge Graph",
    node_name: "Google Knowledge Panel",
    present: false,
    quality_score: null,
    last_updated: null,
    url: null,
    notes: "No knowledge panel found - requires Wikipedia article first"
  },
  {
    category: "Review Platform",
    node_name: "G2",
    present: false,
    quality_score: null,
    last_updated: null,
    url: null,
    notes: "No G2 profile - critical gap for software category"
  },
  {
    category: "Review Platform",
    node_name: "Capterra",
    present: false,
    quality_score: null,
    last_updated: null,
    url: null,
    notes: "No Capterra profile - missing key legal software review platform"
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
    notes: "No Software Advice profile - missing Gartner network citation opportunity"
  },
  {
    category: "Review Platform",
    node_name: "GetApp",
    present: false,
    quality_score: null,
    last_updated: null,
    url: null,
    notes: "No GetApp profile - missing Gartner network citation opportunity"
  },
  {
    category: "Directory",
    node_name: "Crunchbase",
    present: true,
    quality_score: 6.0,
    last_updated: "2024-01-01",
    url: "https://www.crunchbase.com/organization/uptime-systems",
    notes: "Basic profile exists but incomplete - missing funding details, limited acquisition data, uses wrong name 'Uptime Systems'"
  },
  {
    category: "Directory",
    node_name: "Product Hunt",
    present: false,
    quality_score: null,
    last_updated: null,
    url: null,
    notes: "No Product Hunt launch - missed opportunity for LexWorkplace as 'first Mac-compatible legal DMS'"
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
    present: false,
    quality_score: null,
    last_updated: null,
    url: null,
    notes: "Unable to verify BuiltWith technology tracking"
  },
  {
    category: "Company Profile",
    node_name: "LinkedIn Company",
    present: true,
    quality_score: 7.5,
    last_updated: "2025-10-01",
    url: "https://www.linkedin.com/company/uptime-systems",
    notes: "1,381 followers, 39 employees listed, posts 1-2x/week - moderate engagement for 20-year company"
  },
  {
    category: "Company Profile",
    node_name: "Bloomberg",
    present: true,
    quality_score: 5.0,
    last_updated: "2024-01-01",
    url: "https://www.bloomberg.com/profile/company/2506147D:US",
    notes: "Basic Bloomberg Markets profile - limited financial data available"
  },
  {
    category: "News & PR",
    node_name: "Google News",
    present: true,
    quality_score: 3.0,
    last_updated: "2025-04-07",
    url: null,
    notes: "Limited recent coverage: LexCloud acquisition (Oct 2024), LexWorkplace Canada expansion (Apr 2025), Clio award (Oct 2024) - mostly press releases"
  },
  {
    category: "News & PR",
    node_name: "Legal Tech Publications",
    present: true,
    quality_score: 4.0,
    last_updated: "2025-01-01",
    url: "https://buyersguide.americanbar.org/sites/uptime-legal-systems/5139/Cloud+Based+Software",
    notes: "Listed in ABA Legal Technology Buyers Guide - directory listing, not editorial coverage"
  },
  {
    category: "News & PR",
    node_name: "Press Releases",
    present: true,
    quality_score: 5.0,
    last_updated: "2025-04-07",
    url: "https://www.uptimelegal.com/category/press/",
    notes: "Active press page with company announcements - self-published, not earned media"
  },
  {
    category: "Seed Site",
    node_name: "TechCrunch",
    present: false,
    quality_score: null,
    last_updated: null,
    url: null,
    notes: "No TechCrunch coverage found"
  },
  {
    category: "Seed Site",
    node_name: "VentureBeat",
    present: false,
    quality_score: null,
    last_updated: null,
    url: null,
    notes: "No VentureBeat coverage found"
  },
  {
    category: "Seed Site",
    node_name: "Forbes",
    present: false,
    quality_score: null,
    last_updated: null,
    url: null,
    notes: "No Forbes coverage despite growth trajectory"
  },
  {
    category: "Seed Site",
    node_name: "Inc.com",
    present: false,
    quality_score: null,
    last_updated: null,
    url: null,
    notes: "Listed on Inc. 5000 for 8 consecutive years but no feature articles found - missed opportunity"
  }
];

const citations = [
  {
    source_url: "https://www.crunchbase.com/organization/uptime-systems",
    source_domain: "crunchbase.com",
    source_title: "Crunchbase - Uptime Systems",
    authority_score: 8.0,
    data_structure_score: 7.0,
    brand_alignment_score: 4.0,
    freshness_score: 3.0,
    cross_link_score: 6.0,
    overall_quality: 6.7,
    publication_date: null,
    cited_by_perplexity: false,
    cited_by_chatgpt: false,
    cited_by_gemini: false,
    notes: "High domain authority, industry-standard directory, good structured data. Weaknesses: Uses legacy name 'Uptime Systems', missing recent acquisitions, stale content. Recommendations: Update company name to 'Uptime Legal Systems', add 2024 LexCloud acquisition, complete acquisition history."
  },
  {
    source_url: "https://www.linkedin.com/company/uptime-systems",
    source_domain: "linkedin.com",
    source_title: "LinkedIn - Uptime Systems",
    authority_score: 9.0,
    data_structure_score: 10.0,
    brand_alignment_score: 9.0,
    freshness_score: 9.0,
    cross_link_score: 7.0,
    overall_quality: 8.7,
    publication_date: null,
    cited_by_perplexity: false,
    cited_by_chatgpt: false,
    cited_by_gemini: false,
    notes: "Complete Schema.org markup, recent activity (Oct 2025), accurate branding, includes 2024 acquisitions. Weaknesses: Moderate follower count for company age. Recommendations: Increase posting frequency, grow follower base, add more employee advocates."
  },
  {
    source_url: "https://www.bloomberg.com/profile/company/2506147D:US",
    source_domain: "bloomberg.com",
    source_title: "Bloomberg Markets - Uptime Systems",
    authority_score: 10.0,
    data_structure_score: 8.0,
    brand_alignment_score: 7.0,
    freshness_score: 4.0,
    cross_link_score: 5.0,
    overall_quality: 7.1,
    publication_date: null,
    cited_by_perplexity: false,
    cited_by_chatgpt: false,
    cited_by_gemini: false,
    notes: "Tier 1 authority, financial data credibility. Weaknesses: Limited information depth, stale data. Recommendations: Work with Bloomberg to update profile, add more company details."
  },
  {
    source_url: "https://buyersguide.americanbar.org/sites/uptime-legal-systems/5139/Cloud+Based+Software",
    source_domain: "americanbar.org",
    source_title: "ABA Legal Technology Buyers Guide - Uptime Legal Systems",
    authority_score: 8.0,
    data_structure_score: 6.0,
    brand_alignment_score: 8.0,
    freshness_score: 6.0,
    cross_link_score: 5.0,
    overall_quality: 6.8,
    publication_date: null,
    cited_by_perplexity: true,
    cited_by_chatgpt: false,
    cited_by_gemini: false,
    notes: "ABA authority, legal industry-specific, correct brand name. Weaknesses: Directory listing format, not editorial content. Recommendations: Expand profile details, add customer testimonials."
  },
  {
    source_url: "https://www.uptimelegal.com/category/press/",
    source_domain: "uptimelegal.com",
    source_title: "Uptime Legal Press Releases",
    authority_score: 5.0,
    data_structure_score: 6.0,
    brand_alignment_score: 10.0,
    freshness_score: 7.0,
    cross_link_score: 3.0,
    overall_quality: 6.2,
    publication_date: null,
    cited_by_perplexity: false,
    cited_by_chatgpt: false,
    cited_by_gemini: false,
    notes: "Recent updates, accurate brand information. Weaknesses: Self-published, not earned media, limited external validation. Recommendations: Distribute via PR wires, pitch to journalists, add Schema.org NewsArticle markup."
  },
  {
    source_url: "https://uptimepractice.com/",
    source_domain: "uptimepractice.com",
    source_title: "Uptime Practice Website",
    authority_score: 6.0,
    data_structure_score: 2.0,
    brand_alignment_score: 10.0,
    freshness_score: 2.0,
    cross_link_score: 3.0,
    overall_quality: 3.9,
    publication_date: null,
    cited_by_perplexity: true,
    cited_by_chatgpt: true,
    cited_by_gemini: true,
    notes: "Accurate brand information, detailed service descriptions. Weaknesses: No Schema.org markup, no publication dates, missing temporal metadata. Recommendations: Add comprehensive Schema.org markup, implement Organization and Service schemas, add FAQ schema, include publication dates on all pages."
  }
];

const llmResponses = [
  {
    platform: "Perplexity",
    query_type: "Evaluative",
    query_text: "What are the top cloud hosting and IT managed services providers for law firms in 2025?",
    brand_cited: true,
    brand_rank: 1,
    brand_context: "Listed as #1 in 'Leading Legal IT Managed Services Providers' section with description emphasizing private cloud hosting specialization, full IT infrastructure management, and multiple sub-brands (Uptime Practice, Uptime Litigation)",
    citations_found: 16,
    competitor_1: "MoreMax",
    competitor_1_rank: 2,
    competitor_2: "Gallop Technology Group",
    competitor_2_rank: 3,
    competitor_3: "Afinety",
    competitor_3_rank: 4,
    response_summary: "Ranked #1 in evaluative query. Third-party ranking from MoreMax industry analysis plus citations from Cortavo guide and brand's own site drove top placement. Strong positioning ahead of 7 other named competitors."
  },
  {
    platform: "Perplexity",
    query_type: "Comparative",
    query_text: "Best legal practice management software with cloud hosting for small law firms",
    brand_cited: true,
    brand_rank: null,
    brand_context: "Mentioned in specialized use case section for firms needing dedicated cloud hosting for existing software, positioned alongside Cloudvara as migration/hosting specialist rather than all-in-one practice management software",
    citations_found: 11,
    competitor_1: "Clio",
    competitor_1_rank: 1,
    competitor_2: "MyCase",
    competitor_2_rank: 2,
    competitor_3: "Rocket Matter",
    competitor_3_rank: 3,
    response_summary: "Not numerically ranked but strategically positioned for different use case (migration/hosting vs. all-in-one software). Clear differentiation from practice management software category."
  },
  {
    platform: "Perplexity",
    query_type: "Brand-Specific",
    query_text: "Uptime Practice reviews and credentials for legal cloud hosting",
    brand_cited: true,
    brand_rank: 1,
    brand_context: "Primary subject with comprehensive balanced overview including LexisNexis Authorized Hosting Provider credential, security features, service tiers, customer strengths (seamless migrations, responsive support) and criticisms (performance issues, contract exit difficulties)",
    citations_found: 15,
    competitor_1: null,
    competitor_1_rank: null,
    competitor_2: null,
    competitor_2_rank: null,
    competitor_3: null,
    competitor_3_rank: null,
    response_summary: "Brand-specific query returned highly comprehensive results. LexisNexis partnership established premier credential, CloudTango reviews provided balanced customer feedback, ALA listing added professional association validation."
  },
  {
    platform: "ChatGPT",
    query_type: "Evaluative",
    query_text: "What are the top cloud hosting and IT managed services providers for law firms in 2025?",
    brand_cited: true,
    brand_rank: 2,
    brand_context: "A managed IT + cloud services suite exclusively for law firms. Offers unlimited IT & legal software support, legal-centric cloud storage, cloudify your app program, and full private-cloud hosting.",
    citations_found: 24,
    competitor_1: "Ace Cloud Hosting",
    competitor_1_rank: 1,
    competitor_2: "WAMS Inc.",
    competitor_2_rank: 3,
    competitor_3: "Omega Systems",
    competitor_3_rank: 4,
    response_summary: "Ranked #2 with freshest content (May 2025) and strong 'exclusively for law firms' positioning. Cited 4 times across primary and secondary sources."
  },
  {
    platform: "Gemini",
    query_type: "Evaluative",
    query_text: "What are the top cloud hosting and IT managed services providers for law firms in 2025?",
    brand_cited: true,
    brand_rank: 1,
    brand_context: "Listed as #1 in 'Specialized Legal IT Managed Service Providers' category. Described as 'Known for its Private Cloud solutions (Uptime Practice Foundation) tailored exclusively for law firms' with 'comprehensive managed IT suite (Uptime Practice Next)' and 'Deep expertise in legal software and compliance (e.g., IOLTA/Trust Accounting)'",
    citations_found: 7,
    competitor_1: "Afinety",
    competitor_1_rank: 2,
    competitor_2: "Cortavo",
    competitor_2_rank: 3,
    competitor_3: "Total Networks / Juris Fabrilis / Cyber-Counsel IT",
    competitor_3_rank: 4,
    response_summary: "Ranked #1 in evaluative query for specialized legal IT MSPs. Cited with 2 references to official website (managed IT services page + financial case for cloud article). Strong differentiation on legal-specific expertise."
  }
];

const priorities = [
  {
    priority_level: "Immediate",
    title: "Update Crunchbase Profile - Brand Name Alignment",
    description: "Change company name from 'Uptime Systems' to 'Uptime Legal Systems', add 2024 LexCloud acquisition details, add 2025 Canada expansion milestone, complete funding/acquisition history (JurisPage, Inbound Law Marketing, Flywire Technology, LexCloud)",
    impact: "High",
    effort: "Low",
    timeline: "1 week",
    status: "Not Started",
    assigned_to: null,
    due_date: null,
    completed_date: null,
    notes: "Crunchbase quality score will improve from 6.7 to 9.0; prevents LLMs from citing incorrect brand name"
  },
  {
    priority_level: "Immediate",
    title: "Add Schema.org Markup to uptimepractice.com",
    description: "Implement Organization schema (name, address, founding date, parent organization), add SoftwareApplication schema for Practice Foundation and Practice Next, add Service schema for managed IT offerings, include AggregateRating schema (when reviews exist), add meta descriptions and canonical tags to all service pages",
    impact: "High",
    effort: "Medium",
    timeline: "2 weeks",
    status: "Not Started",
    assigned_to: null,
    due_date: null,
    completed_date: null,
    notes: "Website citation probability increases from 15% to 72%; website quality score improves from 3.9 to 9.0; structured data is #2 LLM citation factor after freshness"
  },
  {
    priority_level: "Immediate",
    title: "Claim G2 Profile - Establish Review Platform Presence",
    description: "Claim G2 listing in 'Legal Practice Management Software' category, import existing CloudTango testimonials, solicit 25+ customer reviews via email campaign, respond to reviews (demonstrates active engagement)",
    impact: "High",
    effort: "Medium",
    timeline: "1 month",
    status: "Not Started",
    assigned_to: null,
    due_date: null,
    completed_date: null,
    notes: "Unlocks user review citations across all LLM platforms; closes competitive gap; review platforms are Tier 1 LLM citations; G2 appeared in ChatGPT and Perplexity queries; target 25+ reviews with 4.5+ star average within 60 days"
  }
];

async function exportToAirtable() {
  console.log('🚀 Starting Airtable export for Uptime Practice audit...\n');

  let auditId;
  let trustNodesCreated = 0;
  let citationsCreated = 0;
  let llmResponsesCreated = 0;
  let prioritiesCreated = 0;

  try {
    // Step 1: Create Audit_Runs record
    console.log('📊 Creating Audit_Runs record...');
    const auditRecords = await base('Audit_Runs').create([{
      fields: auditData
    }]);

    auditId = auditRecords[0].id;
    console.log(`✓ Audit record created (ID: ${auditId})\n`);

    // Step 2: Create Trust_Nodes records in batches
    console.log('🔍 Creating Trust_Nodes records...');
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
      trustNodesCreated += batch.length;
      console.log(`  ✓ Created ${batch.length} trust nodes (${trustNodesCreated}/${trustNodes.length})`);
    }
    console.log(`✓ ${trustNodesCreated} trust nodes created\n`);

    // Step 3: Create Citations records in batches
    console.log('📎 Creating Citations records...');
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
      citationsCreated += batch.length;
      console.log(`  ✓ Created ${batch.length} citations (${citationsCreated}/${citations.length})`);
    }
    console.log(`✓ ${citationsCreated} citations created\n`);

    // Step 4: Create LLM_Responses records
    console.log('🤖 Creating LLM_Responses records...');
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
    llmResponsesCreated = llmRecords.length;
    console.log(`✓ ${llmResponsesCreated} LLM responses created\n`);

    // Step 5: Create Priorities records
    console.log('⚡ Creating Priorities records...');
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
    prioritiesCreated = priorityRecords.length;
    console.log(`✓ ${prioritiesCreated} priorities created\n`);

    // Success summary
    console.log('✅ AUDIT DATA SAVED TO AIRTABLE\n');
    console.log('Summary:');
    console.log(`- Brand: ${auditData.brand_name}`);
    console.log(`- Audit Date: ${auditData.audit_date}`);
    console.log(`- Overall Score: ${auditData.overall_score}/10`);
    console.log(`- Trust Node Coverage: ${auditData.trust_node_coverage}/29 (${(auditData.trust_node_percentage * 100).toFixed(1)}%)`);
    console.log(`- Citation Quality: ${auditData.citation_quality}/10`);
    console.log(`- AI Citation Rate: ${(auditData.ai_citation_rate * 100).toFixed(0)}%\n`);

    console.log('Records Created:');
    console.log(`✓ 1 audit run (ID: ${auditId})`);
    console.log(`✓ ${trustNodesCreated} trust nodes`);
    console.log(`✓ ${citationsCreated} citations`);
    console.log(`✓ ${llmResponsesCreated} LLM responses (3 Perplexity, 1 ChatGPT, 1 Gemini)`);
    console.log(`✓ ${prioritiesCreated} priorities\n`);

    console.log('View in Airtable:');
    console.log(`https://airtable.com/${AIRTABLE_BASE_ID}/tblAuditRuns/${auditId}\n`);

    console.log('Next Steps:');
    console.log('- Review priorities in Airtable');
    console.log('- Assign owners to action items');
    console.log(`- Schedule next audit for ${auditData.next_audit_date}`);

  } catch (error) {
    console.error('\n❌ ERROR during Airtable export:');
    console.error(error.message);

    if (auditId) {
      console.error('\nPartial Success:');
      console.error(`✓ Audit record created (ID: ${auditId})`);
      if (trustNodesCreated > 0) console.error(`✓ ${trustNodesCreated} trust nodes created`);
      if (citationsCreated > 0) console.error(`✓ ${citationsCreated} citations created`);
      if (llmResponsesCreated > 0) console.error(`✓ ${llmResponsesCreated} LLM responses created`);
      if (prioritiesCreated > 0) console.error(`✓ ${prioritiesCreated} priorities created`);
      console.error('\nRecommendation: Check Airtable schema and re-run export for missing records');
    } else {
      console.error('\nNo records were created. Please check:');
      console.error('1. AIRTABLE_API_KEY is valid');
      console.error('2. AIRTABLE_BASE_ID is correct');
      console.error('3. Table names match schema (Audit_Runs, Trust_Nodes, Citations, LLM_Responses, Priorities)');
      console.error('4. Field names match schema exactly');
    }

    process.exit(1);
  }
}

// Run the export
exportToAirtable();
