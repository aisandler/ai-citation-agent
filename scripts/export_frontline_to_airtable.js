#!/usr/bin/env node

/**
 * Export Frontline Managed Services Audit to Airtable
 * Writes audit data across 5 tables with proper linking
 */

import Airtable from 'airtable';

// Configuration
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
    brand_name: "Frontline Managed Services",
    category: "Legal firm support services (Managed IT & Revenue Cycle Management)",
    audit_date: "2025-10-31",
    overall_score: 4.8,
    trust_node_coverage: 14,
    trust_node_percentage: 48,
    citation_quality: 6.2,
    ai_citation_rate: 40,
    perplexity_rank: 1,
    chatgpt_rank: null,
    gemini_rank: null,
    perplexity_cited: true,
    chatgpt_cited: false,
    gemini_cited: null,
    status: "Complete",
    executive_summary: "Frontline Managed Services has strong market credentials (800+ clients, 50% of AmLaw 200, #38 MSP ranking) but weak AI visibility. LLMs cite competitors with inferior market share but superior trust node coverage and content optimization. This is a content strategy problem, not a capability problem.",
    top_priority_1: "Create Wikipedia Article - Draft article citing Broad Sky investment, MSP rankings, client metrics. Timeline: 2-4 weeks",
    top_priority_2: "Launch G2 Profile with Reviews - Create profile, collect 10+ client reviews from AmLaw 200 firms. Timeline: 1 month",
    top_priority_3: "Create /law-firms SEO Landing Page - Build frontlinems.com/managed-it-services-for-law-firms/ with keyword optimization. Timeline: 2 weeks",
    next_audit_date: "2025-12-31"
  },
  trust_nodes: [
    {category: "Knowledge Graph", node_name: "Wikipedia", present: false, quality_score: null, last_updated: null, url: null, notes: "CRITICAL GAP - Blocks LLM entity recognition"},
    {category: "Knowledge Graph", node_name: "Wikidata", present: false, quality_score: null, last_updated: null, url: null, notes: "Missing structured entity relationships"},
    {category: "Knowledge Graph", node_name: "Google Knowledge Panel", present: false, quality_score: null, last_updated: null, url: null, notes: "No Google-verified facts"},
    {category: "Review Platform", node_name: "G2", present: false, quality_score: null, last_updated: null, url: null, notes: "CRITICAL GAP - All ChatGPT-cited competitors have G2 profiles"},
    {category: "Review Platform", node_name: "Capterra", present: true, quality_score: 3.0, last_updated: null, url: "https://www.capterra.com/services/sp/65464/frontline-llc-managed-it-services/", notes: "Listed but 0 reviews - dead listing"},
    {category: "Review Platform", node_name: "Trustpilot", present: false, quality_score: null, last_updated: null, url: null, notes: "Not found"},
    {category: "Review Platform", node_name: "Software Advice", present: false, quality_score: null, last_updated: null, url: null, notes: "Not found for managed services"},
    {category: "Review Platform", node_name: "GetApp", present: false, quality_score: null, last_updated: null, url: null, notes: "Not found for managed services"},
    {category: "Directory", node_name: "Crunchbase", present: true, quality_score: 6.0, last_updated: "2024-12-11", url: "https://www.crunchbase.com/organization/frontline-managed-services", notes: "Updated with Broad Sky investment"},
    {category: "Directory", node_name: "Product Hunt", present: false, quality_score: null, last_updated: null, url: null, notes: "Not found - opportunity to showcase FMS Helix-AI platform"},
    {category: "Directory", node_name: "AngelList", present: false, quality_score: null, last_updated: null, url: null, notes: "Not found"},
    {category: "Directory", node_name: "BuiltWith", present: false, quality_score: null, last_updated: null, url: null, notes: "Not verified"},
    {category: "Company Profile", node_name: "LinkedIn", present: true, quality_score: 8.2, last_updated: "2025-10-31", url: "https://www.linkedin.com/company/frontlinems", notes: "19,397 followers, active content, recent executive hires announced"},
    {category: "Company Profile", node_name: "Bloomberg/Pitchbook", present: true, quality_score: 6.0, last_updated: "2024-12-11", url: "https://www.bloomberg.com/profile/company/0409425D:US", notes: "Behind paywall but exists - updated with investment"},
    {category: "News & PR", node_name: "Business Wire", present: true, quality_score: 7.3, last_updated: "2024-12-11", url: "https://www.businesswire.com/news/home/20241211540302/en/Frontline-Managed-Services-a-Global-Leader-in-Managed-IT-for-the-Legal-Industry-Secures-Investment-from-Broad-Sky-Partners-to-Fuel-Strategic-Growth-and-Expansion", notes: "Broad Sky Partners investment announcement"},
    {category: "News & PR", node_name: "PR Newswire", present: true, quality_score: 6.8, last_updated: "2024-12-11", url: "https://www.prnewswire.com/news-releases/bv-investment-partners-announces-sale-of-frontline-managed-services-to-broad-sky-partners-302329142.html", notes: "BV Investment Partners sale announcement"},
    {category: "News & PR", node_name: "Law.com", present: true, quality_score: 4.5, last_updated: "2024-12-11", url: "https://www.law.com/legaltechnews/2024/12/11/bv-investment-partners-sells-frontline-managed-services-to-new-private-equity-owner-/", notes: "Behind paywall - LLMs can't access"},
    {category: "News & PR", node_name: "LegalTechTalk", present: true, quality_score: 6.2, last_updated: "2024-12-16", url: "https://www.legaltech-talk.com/frontline-managed-services-secures-investment-from-broad-sky-partners/", notes: "Republished press release, minimal independent reporting"},
    {category: "News & PR", node_name: "Channel Futures MSP 501", present: true, quality_score: 7.0, last_updated: "2024-01-01", url: "https://frontlinems.com/press/frontline-managed-services-and-broad-sky-partners/", notes: "#38 ranking in 2024"},
    {category: "News & PR", node_name: "Complete Legal Acquisition", present: true, quality_score: 5.8, last_updated: "2024-01-23", url: "https://completelegal.us/2024/01/23/complete-legal-purchases-frontline/", notes: "eDiscovery unit sale - 10 months old"},
    {category: "News & PR", node_name: "ALA Directory", present: true, quality_score: 7.0, last_updated: null, url: "https://www.alanet.org/legal-management-software-products-services/frontline-managed-services", notes: "Association of Legal Administrators listing with awards"},
    {category: "News & PR", node_name: "Company Press Page", present: true, quality_score: 7.1, last_updated: "2025-04-06", url: "https://frontlinems.com/press/", notes: "Active press releases, last modified April 2025"},
    {category: "News & PR", node_name: "Industry Coverage (Recent)", present: false, quality_score: null, last_updated: null, url: null, notes: "No major industry analysis or thought leadership articles"},
    {category: "News & PR", node_name: "Thought Leadership", present: false, quality_score: null, last_updated: null, url: null, notes: "Missing CEO/exec bylines in major publications"},
    {category: "Seed Site", node_name: "TechCrunch", present: false, quality_score: null, last_updated: null, url: null, notes: "CRITICAL GAP - Tier-1 tech media coverage missing"},
    {category: "Seed Site", node_name: "VentureBeat", present: false, quality_score: null, last_updated: null, url: null, notes: "No coverage found"},
    {category: "Seed Site", node_name: "Forbes", present: false, quality_score: null, last_updated: null, url: null, notes: "CRITICAL GAP - Broad Sky investment is Forbes-worthy"},
    {category: "Seed Site", node_name: "Inc.com", present: false, quality_score: null, last_updated: null, url: null, notes: "No coverage found"},
    {category: "Seed Site", node_name: "Fast Company", present: false, quality_score: null, last_updated: null, url: null, notes: "No coverage found"}
  ],
  citations: [
    {source_url: "https://www.linkedin.com/company/frontlinems", source_domain: "linkedin.com", source_title: "Frontline Managed Services | LinkedIn", authority_score: 8, data_structure_score: 9, brand_alignment_score: 9, freshness_score: 9, cross_link_score: 6, overall_quality: 8.2, publication_date: null, cited_by_perplexity: true, cited_by_chatgpt: false, cited_by_gemini: null, notes: "19,397 followers, verified profile, active content"},
    {source_url: "https://frontlinems.com/", source_domain: "frontlinems.com", source_title: "Managed Services Provider for Legal | Frontline Managed Services", authority_score: 7, data_structure_score: 9, brand_alignment_score: 10, freshness_score: 9, cross_link_score: 6, overall_quality: 8.1, publication_date: "2025-10-27", cited_by_perplexity: true, cited_by_chatgpt: false, cited_by_gemini: null, notes: "Company website, comprehensive schema, updated Oct 2025"},
    {source_url: "https://www.businesswire.com/news/home/20241211540302/en/", source_domain: "businesswire.com", source_title: "Frontline Managed Services Secures Investment from Broad Sky Partners", authority_score: 8, data_structure_score: 8, brand_alignment_score: 8, freshness_score: 8, cross_link_score: 5, overall_quality: 7.3, publication_date: "2024-12-11", cited_by_perplexity: false, cited_by_chatgpt: false, cited_by_gemini: null, notes: "Major press distribution, Dec 2024 investment news"},
    {source_url: "https://frontlinems.com/press/frontline-managed-services-and-broad-sky-partners/", source_domain: "frontlinems.com", source_title: "Frontline Managed Services and Broad Sky Partners", authority_score: 6, data_structure_score: 9, brand_alignment_score: 9, freshness_score: 8, cross_link_score: 4, overall_quality: 7.1, publication_date: "2024-12-11", cited_by_perplexity: false, cited_by_chatgpt: false, cited_by_gemini: null, notes: "Company press page, modified April 2025"},
    {source_url: "https://www.alanet.org/legal-management-software-products-services/frontline-managed-services", source_domain: "alanet.org", source_title: "Frontline Managed Services - ALA", authority_score: 7, data_structure_score: 8, brand_alignment_score: 8, freshness_score: 6, cross_link_score: 6, overall_quality: 7.0, publication_date: null, cited_by_perplexity: true, cited_by_chatgpt: false, cited_by_gemini: null, notes: "Association of Legal Administrators directory, awards mentioned"},
    {source_url: "https://www.legaltech-talk.com/frontline-managed-services-secures-investment-from-broad-sky-partners/", source_domain: "legaltech-talk.com", source_title: "Frontline Managed Services Investment - LegalTechTalk", authority_score: 6, data_structure_score: 7, brand_alignment_score: 7, freshness_score: 7, cross_link_score: 4, overall_quality: 6.2, publication_date: "2024-12-16", cited_by_perplexity: false, cited_by_chatgpt: false, cited_by_gemini: null, notes: "Republished press release, minimal independent analysis"},
    {source_url: "https://www.crunchbase.com/organization/frontline-managed-services", source_domain: "crunchbase.com", source_title: "Frontline Managed Services - Crunchbase", authority_score: 7, data_structure_score: 7, brand_alignment_score: 7, freshness_score: 6, cross_link_score: 3, overall_quality: 6.0, publication_date: null, cited_by_perplexity: false, cited_by_chatgpt: false, cited_by_gemini: null, notes: "Startup database, paywall limits visibility"},
    {source_url: "https://pitchbook.com/profiles/company/11716-84", source_domain: "pitchbook.com", source_title: "Frontline Managed Services - PitchBook", authority_score: 7, data_structure_score: 7, brand_alignment_score: 7, freshness_score: 6, cross_link_score: 3, overall_quality: 6.0, publication_date: null, cited_by_perplexity: false, cited_by_chatgpt: false, cited_by_gemini: null, notes: "Financial data platform, behind paywall"},
    {source_url: "https://www.bloomberg.com/profile/company/0409425D:US", source_domain: "bloomberg.com", source_title: "Frontline Managed Services Inc - Bloomberg", authority_score: 9, data_structure_score: 7, brand_alignment_score: 7, freshness_score: 6, cross_link_score: 1, overall_quality: 6.0, publication_date: null, cited_by_perplexity: false, cited_by_chatgpt: false, cited_by_gemini: null, notes: "Top-tier financial news, behind Bloomberg terminal paywall"},
    {source_url: "https://www.prnewswire.com/news-releases/bv-investment-partners-announces-sale-of-frontline-managed-services-to-broad-sky-partners-302329142.html", source_domain: "prnewswire.com", source_title: "BV Investment Partners Announces Sale", authority_score: 8, data_structure_score: 7, brand_alignment_score: 8, freshness_score: 8, cross_link_score: 3, overall_quality: 6.8, publication_date: "2024-12-11", cited_by_perplexity: false, cited_by_chatgpt: false, cited_by_gemini: null, notes: "Press distribution, December 2024"},
    {source_url: "https://completelegal.us/2024/01/23/complete-legal-purchases-frontline/", source_domain: "completelegal.us", source_title: "Complete Legal Acquires Frontline eDiscovery Unit", authority_score: 6, data_structure_score: 6, brand_alignment_score: 7, freshness_score: 4, cross_link_score: 6, overall_quality: 5.8, publication_date: "2024-01-23", cited_by_perplexity: false, cited_by_chatgpt: false, cited_by_gemini: null, notes: "Company blog, 10 months old, mentions Frontline"},
    {source_url: "https://www.law.com/legaltechnews/2024/12/11/bv-investment-partners-sells-frontline-managed-services-to-new-private-equity-owner-/", source_domain: "law.com", source_title: "BV Investment Partners Sells Frontline - Law.com", authority_score: 8, data_structure_score: 6, brand_alignment_score: 6, freshness_score: 7, cross_link_score: 0, overall_quality: 4.5, publication_date: "2024-12-11", cited_by_perplexity: false, cited_by_chatgpt: false, cited_by_gemini: null, notes: "Behind paywall - LLMs cannot access, 302 redirect to login"},
    {source_url: "https://www.capterra.com/services/sp/65464/frontline-llc-managed-it-services/", source_domain: "capterra.com", source_title: "Frontline, LLC - Capterra", authority_score: 7, data_structure_score: 7, brand_alignment_score: 5, freshness_score: 3, cross_link_score: 0, overall_quality: 3.0, publication_date: null, cited_by_perplexity: false, cited_by_chatgpt: false, cited_by_gemini: null, notes: "Listed with 0 reviews - No Reviews—Be the first to review!"}
  ],
  llm_responses: [
    {platform: "Perplexity", query_type: "Evaluative", query_text: "What are the top managed IT services providers for law firms in 2025?", brand_cited: false, brand_rank: null, brand_context: "Not mentioned", citations_found: 12, competitor_1: "MoreMax", competitor_1_rank: 1, competitor_2: "Integris", competitor_2_rank: 2, competitor_3: "IT Mindshare", competitor_3_rank: 3, response_summary: "Generic IT query - Frontline invisible despite 800+ clients. Perplexity cited 15 competitors with better SEO and review platforms."},
    {platform: "Perplexity", query_type: "Comparative", query_text: "Best managed services providers for law firms for financial operations and revenue cycle management", brand_cited: true, brand_rank: 1, brand_context: "Frontline Managed Services is regarded as one of the best managed services providers specializing in financial operations and revenue cycle management for law firms", citations_found: 15, competitor_1: "PwC Revenue Cycle", competitor_1_rank: 2, competitor_2: "Athenahealth", competitor_2_rank: 3, competitor_3: null, competitor_3_rank: null, response_summary: "Niche positioning works! #1 when query includes 'financial operations' or 'revenue cycle management'. Cited 6 Frontline sources including ALA, company website, Thomson Reuters partnership."},
    {platform: "Perplexity", query_type: "Brand-Specific", query_text: "Frontline Managed Services reviews and credentials", brand_cited: true, brand_rank: null, brand_context: "Employee reviews 3.1/5 stars (Indeed, Glassdoor), 67% Great Place to Work, 600+ legal/accounting clients", citations_found: 9, competitor_1: null, competitor_1_rank: null, competitor_2: null, competitor_2_rank: null, competitor_3: null, competitor_3_rank: null, response_summary: "Negative signal: Perplexity surfaces employee reviews (mixed/moderate) before client credentials. Missing G2 reviews means no positive client social proof."},
    {platform: "ChatGPT", query_type: "Evaluative", query_text: "What are the top managed IT services providers for law firms in 2025?", brand_cited: false, brand_rank: null, brand_context: "Not mentioned in top 5 or additional 24 sources", citations_found: 29, competitor_1: "eSudo Technology Solutions", competitor_1_rank: 1, competitor_2: "IT Solutions, Inc.", competitor_2_rank: 2, competitor_3: "Omega Systems Corp.", competitor_3_rank: 3, response_summary: "Complete invisibility despite 800+ clients. All cited competitors have /law-firms SEO pages and G2 profiles. Frontline lacks both."}
  ],
  priorities: [
    {priority_level: "Immediate", title: "Create Wikipedia Article", description: "Draft Wikipedia article citing December 2024 Broad Sky investment (notable transaction), #38 MSP 501 ranking, 800+ clients, 50% AmLaw 200 penetration. Reference third-party sources: Business Wire, PR Newswire, Law.com, Channel Futures. Submit through Wikipedia editor familiar with company article guidelines.", impact: "High", effort: "Medium", timeline: "2-4 weeks (draft + Wikipedia review process)", status: "Not Started", assigned_to: null, due_date: null, completed_date: null, notes: "Blocks LLM entity recognition. Perplexity will start recognizing Frontline as established entity for generic queries once live."},
    {priority_level: "Immediate", title: "Launch G2 Profile with Client Reviews", description: "Create G2 company profile (free listing) in categories 'Managed Service Providers (MSP)' and 'IT Services for Legal'. Request reviews from 10 satisfied clients targeting AmLaw 200 firms for credibility. Incentivize with $50 Amazon gift cards (common B2B practice, G2-compliant). Respond to all reviews within 48 hours. Add G2 badge to company website footer.", impact: "High", effort: "Medium", timeline: "1 month (setup + client outreach + review collection)", status: "Not Started", assigned_to: null, due_date: null, completed_date: null, notes: "ChatGPT cited 5 competitors, all with G2 profiles. Zero competitors without G2. This is table stakes for AI visibility."},
    {priority_level: "Immediate", title: "Create /law-firms SEO Landing Page", description: "Create frontlinems.com/managed-it-services-for-law-firms/ with keyword-optimized content structure: H1 'Managed IT Services for Law Firms | Frontline Managed Services', H2 'Trusted by 800+ Law Firms Including 50% of AmLaw 200', H2 'Revenue Cycle Management for Legal Practices', H2 'Why Law Firms Choose Frontline (2025 Guide)'. Include 2-3 AmLaw 200 client case studies and stats (10X ROI, 30-40% cost reduction, sub-20-second help desk response). Add Service, Organization, AggregateRating schema markup.", impact: "High", effort: "Low", timeline: "2 weeks (content creation + SEO optimization)", status: "Not Started", assigned_to: null, due_date: null, completed_date: null, notes: "All ChatGPT-cited competitors have /law-firms or /legal-services URLs. ChatGPT web search will find this page for generic queries."}
  ]
};

// Main export function
async function exportToAirtable() {
  console.log('🚀 Starting Airtable export for Frontline Managed Services audit...\n');

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
    console.log(`✓ ${results.llm_responses} LLM responses (${auditData.llm_responses.filter(r => r.platform === 'Perplexity').length} Perplexity, ${auditData.llm_responses.filter(r => r.platform === 'ChatGPT').length} ChatGPT)`);
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
