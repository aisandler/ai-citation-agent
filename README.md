# AI Citation Agent

> **AI Citation Intelligence:** 4-step methodology for auditing brand visibility across LLM platforms (Perplexity, ChatGPT, Gemini). Tracks trust nodes, citation quality, and competitive positioning.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

📖 **[Setup Guide](SETUP.md)** | 🏗️ **[Architecture](CLAUDE.md)** | 📊 **[Example Audit](output/jasper-audit-report-2025-10-29.md)**

## Overview

The AI Citation Agent implements a comprehensive methodology for understanding how AI platforms (like Perplexity, ChatGPT, and Gemini) cite and rank brands. Based on the AI SEO Optimization Framework from [aiclicks.io](http://aiclicks.io), this system provides actionable intelligence for improving brand visibility in AI-powered search.

## ⚡ First Time Setup

**New to this project?** Start with the [Setup Guide](SETUP.md) for complete installation instructions including:
- Environment configuration (`.env.local`)
- Airtable schema setup
- MCP server configuration
- Running your first audit

## 🎯 What It Does

- **Source & Citation Discovery** - Map brand presence across 29 trust nodes (Wikipedia, G2, TechCrunch, etc.)
- **Citation Quality Scoring** - Evaluate citations on Authority, Data Structure, Brand Alignment, Freshness, and Cross-Links
- **LLM Response Evaluation** - Query AI platforms with structured taxonomy, track rankings, map citation influence
- **Dashboard Synthesis** - Transform scattered data into strategic priorities

## 🚀 Quick Start

### Run a Complete Audit

```bash
/agents:audit-citations
```

You'll be prompted for:
1. Brand name (e.g., "Jasper", "Clio", "Salesforce")
2. Category context (e.g., "AI marketing tools", "legal billing software")
3. Content URLs (optional)

The audit takes ~8-10 minutes and generates a comprehensive report with strategic recommendations.

### Batch Audits from Airtable

**NEW:** Automate competitive intelligence by queuing audits from an Airtable base:

```bash
# 1. Read competitors from source Airtable
node scripts/read-audit-queue.js

# 2. Run audit for each competitor
/agents:audit-citations  # Use inputs from queue

# 3. Sync results back to source base
node scripts/sync-audit-results.js
```

**What this enables:**
- Queue multiple competitors in Airtable "1_Basic Info" table
- Run audits in batch mode
- Auto-sync scores to "4_Marketing Presence" table
- Track audit history, rankings, and next audit dates
- Compare competitors side-by-side

See [docs/AIRTABLE_INTEGRATION.md](docs/AIRTABLE_INTEGRATION.md) for complete guide.

## 📊 Example Output

See [jasper-citation-quality-scorecard.md](jasper-citation-quality-scorecard.md) for a complete example audit of Jasper AI in the "AI marketing tools" category.

**Key Findings:**
- Overall AI Visibility Score: 8.2/10
- Trust Node Coverage: 22/29 (76%)
- Citation Quality: 7.1/10
- AI Citation Rate: 100% (2/2 platforms tested)
- Rankings: #1 on Perplexity, #1 on ChatGPT

## 🛠️ Architecture

### Orchestrators

- **`/agents:audit-citations`** - Main command that coordinates the full 4-step methodology for single brand audits
- **`/agents:batch-audit`** - Batch processing orchestrator for running multiple audits from Airtable queue

### Specialized Agents

1. **`source-discovery`** - Audits presence across 29 trust nodes in 6 categories
2. **`citation-quality-analyzer`** - Scores citations on 5 dimensions (0-10 scale)
3. **`perplexity-citation-checker`** - Queries Perplexity API with structured taxonomy
4. **`chatgpt-citation-checker`** - Browser automation for ChatGPT citation tracking
5. **`gemini-citation-checker`** - Browser automation for Gemini citation tracking
6. **`airtable-writer`** - Persists audit data to Airtable across 5 related tables

### Skills

#### `playwright-cleanup`
Prevents and resolves the "endless browser tabs" issue that occurs with Playwright automation.

**What it does:**
- Detects zombie mcp-chrome processes
- Kills them safely with error handling
- Automatically invoked by browser agents before starting
- Can be manually triggered by user

**Usage:**
```bash
@playwright-cleanup
```

#### `skill-creator`
Toolkit for creating new skills following best practices.

## 🏗️ Project Structure

```
ai-citation-agent/
├── .claude/
│   ├── agents/                      # Specialized agents
│   │   ├── source-discovery.md
│   │   ├── citation-quality-analyzer.md
│   │   ├── perplexity-citation-checker.md
│   │   ├── chatgpt-citation-checker.md
│   │   ├── gemini-citation-checker.md
│   │   └── airtable-writer.md       # Data persistence agent
│   ├── commands/
│   │   └── agents/
│   │       ├── audit-citations.md   # Main orchestrator
│   │       └── setup-airtable.md    # Airtable schema setup
│   └── skills/
│       ├── playwright-cleanup/      # Browser process management
│       │   ├── SKILL.md
│       │   └── scripts/cleanup_browser.sh
│       └── skill-creator/           # Skill development toolkit
├── context/
│   ├── frameworks/                  # AI SEO framework documentation
│   ├── queries/                     # Query taxonomy
│   └── standards/                   # Output quality standards
├── scripts/
│   ├── setup-airtable-schema.js     # Create Airtable tables
│   ├── test-airtable-connection.js  # Validate Airtable credentials
│   └── delete-airtable-tables.js    # Clean up Airtable (with confirmation)
└── .env.local                       # Airtable credentials (gitignored)
```

## 🔧 Requirements

- **Claude Code** - This project is designed to run in Claude Code environment
- **Playwright MCP** - For browser automation (ChatGPT, Gemini agents)
- **Perplexity MCP** - For Perplexity API access
- **Airtable MCP** - For data persistence and tracking
- **Node.js** - For Airtable schema setup scripts
- **GitHub CLI** (optional) - For repository management

## 📖 Methodology Details

### Step 1: Source & Citation Discovery

Evaluates presence across 29 trust nodes in 6 categories:

| Category | Trust Nodes |
|----------|-------------|
| Knowledge Graphs | Wikipedia, Wikidata, Google Knowledge Panel |
| Review Platforms | G2, Capterra, Trustpilot, Software Advice, GetApp |
| Directories | Crunchbase, Product Hunt, AngelList, BuiltWith |
| Company Profiles | LinkedIn, Bloomberg/Pitchbook |
| News & PR | TechCrunch, VentureBeat, Forbes, Inc, Fast Company, etc. |
| Seed Sites | 5 major tech/business publications |

**Output:** Trust node coverage map with critical gap analysis

### Step 2: Citation Quality Scoring

Scores each citation on 5 dimensions (0-10 scale):

- **Authority** - Domain authority, publication reputation, editorial standards
- **Data Structure** - Schema.org markup, structured data, machine-readable format
- **Brand Alignment** - Accurate representation, positive sentiment, brand control
- **Freshness** - Publication date, last updated, content recency
- **Cross-Link Signals** - Citations to/from other trust nodes, reference depth

**Output:** Citation quality scorecard with dimension breakdown

### Step 3: LLM Response Evaluation

Tests multiple query types across platforms:

1. **Evaluative:** "What are the top [category] in 2025?"
2. **Comparative:** "Best [category] for [use case]"
3. **Brand-Specific:** "[Brand] reviews and credentials"

For each platform:
- Tracks if brand appears
- Records position/ranking
- Maps citation sources
- Notes competitors cited

**Output:** Cross-platform visibility analysis with competitive intelligence

### Step 4: Dashboard Synthesis

Combines all data into:

- Overall AI Visibility Score
- Trust Node → Citation Quality → LLM Visibility chain analysis
- Immediate priorities (this month)
- Strategic initiatives (this quarter)
- Long-term vision (6-12 months)

**Output:** Actionable roadmap with specific metrics and timelines

## 📊 Airtable Integration

### Overview

After each audit completes, you can export results to Airtable for:
- **Persistence** - Historical tracking of audits over time
- **Trend Analysis** - See how trust node coverage and citation quality evolve
- **Dashboard Visualization** - Build custom views for executives, marketing teams, SEO analysts
- **Team Collaboration** - Assign priorities, track status, add notes

### Schema

The integration uses 5 related tables (70 fields total):

#### 1. Audit_Runs (20 fields)
Main audit execution records with composite scores, platform rankings, and executive summary.

**Key fields:** `brand_name`, `category`, `overall_score`, `trust_node_coverage`, `citation_quality`, `ai_citation_rate`, `perplexity_rank`, `chatgpt_rank`, `gemini_rank`, `top_priority_1`, `top_priority_2`, `top_priority_3`

#### 2. Trust_Nodes (8 fields)
Individual trust node presence tracking across 29 nodes in 6 categories.

**Key fields:** `category`, `node_name`, `present`, `quality_score`, `url`, `last_updated`

#### 3. Citations (15 fields)
Citation quality scores across 5 dimensions per source.

**Key fields:** `source_url`, `source_domain`, `authority_score`, `data_structure_score`, `brand_alignment_score`, `freshness_score`, `cross_link_score`, `overall_quality`, `cited_by_perplexity`, `cited_by_chatgpt`, `cited_by_gemini`

#### 4. LLM_Responses (15 fields)
Platform query results with rankings and competitive intelligence.

**Key fields:** `platform`, `query_type`, `query_text`, `brand_cited`, `brand_rank`, `citations_found`, `competitor_1`, `competitor_1_rank`, `competitor_2`, `competitor_2_rank`

#### 5. Priorities (12 fields)
Action items with impact/effort assessment and status tracking.

**Key fields:** `priority_level`, `title`, `description`, `impact`, `effort`, `timeline`, `status`, `assigned_to`, `due_date`

**Relationships:** All tables link to `Audit_Runs` via `audit` field (many-to-one).

### Setup

#### 1. Configure Credentials

Create `.env.local` in the project root:

```bash
AIRTABLE_API_KEY=your_api_key_here
AIRTABLE_BASE_ID=appXXXXXXXXXXXXXX
```

**Get your credentials:**
- API Key: https://airtable.com/create/tokens (grant schema and data scopes)
- Base ID: From your base URL (https://airtable.com/appXXX...)

#### 2. Create Airtable Schema

**Recommended: Use the agent (automatic credential checking)**

```bash
/agents:setup-airtable
```

The agent will:
- ✅ Automatically check for credentials in `.env.local`
- ✅ Only prompt you if credentials are missing
- ✅ Create all 5 tables with proper field types and relationships
- ✅ Provide detailed setup instructions if credentials aren't configured

**Alternative: Run script manually**

```bash
node scripts/setup-airtable-schema.js
```

#### 3. Verify Connection (Optional)

Test your Airtable credentials:

```bash
node scripts/test-airtable-connection.js
```

### Usage

#### During Audit

After the audit completes, the orchestrator will prompt:

```
Would you like to export this audit to Airtable now?
```

**If you answer YES:**
1. Orchestrator collects structured JSON from all agent responses
2. Constructs complete payload with audit metadata
3. Invokes `@airtable-writer` agent
4. Writer creates records across all 5 tables
5. Returns summary with record counts and Airtable view URL

**If you answer NO:**
- Audit data remains in the session
- You can manually invoke `@airtable-writer` later with saved data

#### Manual Write

If you want to re-export or update an existing audit:

```bash
@airtable-writer
```

Provide the complete JSON payload from the audit session.

### Data Flow

```
Audit Agents → JSON Output → Orchestrator Collection → User Approval → Airtable Writer → 5 Tables
```

Each specialized agent returns **hybrid output:**
- **Markdown** - Human-readable report for user review
- **JSON** - Structured data block for Airtable export

The orchestrator:
1. Collects JSON from Steps 1-4
2. Calculates composite metrics (overall_score, ai_citation_rate, etc.)
3. Extracts top 3 priorities from recommendations
4. Constructs complete payload matching Airtable schema
5. Writes atomically (all tables or none)

### Partial Data Handling

If any audit step fails (e.g., ChatGPT timeout):
- Writer creates records with whatever data exists
- Sets `status` field to "In Progress"
- Flags missing sections in `notes` fields
- Example: "Partial audit - ChatGPT step timed out (browser lock). Re-run to complete."

### Helper Scripts

**`scripts/setup-airtable-schema.js`** - Creates all 5 tables with 70 fields

**`scripts/test-airtable-connection.js`** - Validates API key and lists tables

**`scripts/delete-airtable-tables.js`** - Safely deletes all tables (requires "DELETE" confirmation)

## 🐛 Known Issues & Solutions

### Endless Browser Tabs

**Problem:** Browser automation agents (ChatGPT, Gemini) sometimes create endless tab loops.

**Root Cause:** Zombie Playwright processes hold locks on browser profile.

**Solution:** The `playwright-cleanup` skill automatically runs before browser agents start. If you encounter issues:

```bash
@playwright-cleanup
```

Or manually:
```bash
ps aux | grep -i "mcp-chrome" | grep -v grep
kill -9 [PID numbers]
```

## 🤝 Contributing

This project is actively developed. To contribute:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

**Areas for contribution:**
- Additional LLM platform integrations
- Enhanced citation quality scoring
- Expanded trust node categories
- Performance optimizations

## 📝 License

MIT License - see LICENSE file for details

## 🙏 Credits

**Methodology:** Based on the AI SEO Optimization Framework from [aiclicks.io](http://aiclicks.io)

**Built with:** [Claude Code](https://claude.com/claude-code)

---

**⚠️ Note:** This README is actively maintained. Last updated: November 5, 2025

**TODO:**
- [ ] Add installation instructions
- [ ] Create detailed agent usage guides
- [ ] Add more example audit reports
- [ ] Document query taxonomy in detail
- [ ] Add troubleshooting guide
- [ ] Create video walkthrough
