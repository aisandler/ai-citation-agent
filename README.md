# AI Citation Agent

> **AI Citation Intelligence:** 4-step methodology for auditing brand visibility across LLM platforms (Perplexity, ChatGPT, Gemini). Tracks trust nodes, citation quality, and competitive positioning.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Overview

The AI Citation Agent implements a comprehensive methodology for understanding how AI platforms (like Perplexity, ChatGPT, and Gemini) cite and rank brands. Based on the AI SEO Optimization Framework from [aiclicks.io](http://aiclicks.io), this system provides actionable intelligence for improving brand visibility in AI-powered search.

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

## 📊 Example Output

See [jasper-citation-quality-scorecard.md](jasper-citation-quality-scorecard.md) for a complete example audit of Jasper AI in the "AI marketing tools" category.

**Key Findings:**
- Overall AI Visibility Score: 8.2/10
- Trust Node Coverage: 22/29 (76%)
- Citation Quality: 7.1/10
- AI Citation Rate: 100% (2/2 platforms tested)
- Rankings: #1 on Perplexity, #1 on ChatGPT

## 🛠️ Architecture

### Orchestrator
- **`/agents:audit-citations`** - Main command that coordinates the full 4-step methodology

### Specialized Agents

1. **`source-discovery`** - Audits presence across 29 trust nodes in 6 categories
2. **`citation-quality-analyzer`** - Scores citations on 5 dimensions (0-10 scale)
3. **`perplexity-citation-checker`** - Queries Perplexity API with structured taxonomy
4. **`chatgpt-citation-checker`** - Browser automation for ChatGPT citation tracking
5. **`gemini-citation-checker`** - Browser automation for Gemini citation tracking

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
│   │   └── gemini-citation-checker.md
│   ├── commands/
│   │   └── agents/
│   │       └── audit-citations.md   # Main orchestrator
│   └── skills/
│       ├── playwright-cleanup/      # Browser process management
│       │   ├── SKILL.md
│       │   └── scripts/cleanup_browser.sh
│       └── skill-creator/           # Skill development toolkit
├── context/
│   ├── frameworks/                  # AI SEO framework documentation
│   ├── queries/                     # Query taxonomy
│   └── standards/                   # Output quality standards
└── skills/
    └── format-citations-report.md   # Report formatting utilities
```

## 🔧 Requirements

- **Claude Code** - This project is designed to run in Claude Code environment
- **Playwright MCP** - For browser automation (ChatGPT, Gemini agents)
- **Perplexity MCP** - For Perplexity API access
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

**⚠️ Note:** This README is actively maintained. Last updated: October 28, 2025

**TODO:**
- [ ] Add installation instructions
- [ ] Create detailed agent usage guides
- [ ] Add more example audit reports
- [ ] Document query taxonomy in detail
- [ ] Add troubleshooting guide
- [ ] Create video walkthrough
