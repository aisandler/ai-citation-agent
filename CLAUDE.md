# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Purpose

AI Citation Agent: Audits brand visibility across LLM platforms (Perplexity, ChatGPT, Gemini) using a 4-step methodology from [aiclicks.io](http://aiclicks.io). Maps trust nodes, evaluates citation quality, tracks competitive positioning, and generates strategic recommendations.

## Running Audits

### Complete 4-Step Audit
```bash
/agents:audit-citations
```

Prompts for: brand name, category context, optional content URLs. Takes ~8-10 minutes, generates comprehensive report with AI visibility score, trust node coverage, citation quality metrics, and strategic roadmap.

### Manual Cleanup (Browser Issues)
If browser agents encounter endless tabs:
```bash
@playwright-cleanup
```

Or manually:
```bash
bash .claude/skills/playwright-cleanup/scripts/cleanup_browser.sh
```

## Architecture Overview

### Agent Orchestration Pattern

The project uses a hierarchical agent system:

1. **Orchestrator** (`/agents:audit-citations`) coordinates the 4-step workflow
2. **Specialized Agents** execute specific analysis tasks:
   - `source-discovery` - Web search + verification across 29 trust nodes
   - `citation-quality-analyzer` - Scores citations on 5 dimensions (0-10)
   - `perplexity-citation-checker` - API-based query taxonomy
   - `chatgpt-citation-checker` - Browser automation with Playwright
   - `gemini-citation-checker` - Browser automation with Playwright

3. **Skills** provide reusable utilities:
   - `playwright-cleanup` - Browser process management (prevents tab loops)
   - `skill-creator` - Skill development toolkit

### Critical Design Patterns

**Browser Agent Safety:**
All browser-based agents (`chatgpt-citation-checker`, `gemini-citation-checker`) MUST:
- Invoke `@playwright-cleanup` as Step 0 before any browser automation
- Include 90-second timeout failsafe
- Close browser properly after extraction
- Never retry on tab multiplication - report and exit

**Agent Communication Flow:**
```
Orchestrator → Sets brand/category context
           ↓
Step 1 Agent → Returns trust node coverage (22/29)
           ↓
Step 2 Agent → Receives citations from Step 1, returns quality scores (7.1/10)
           ↓
Step 3 Agents → Query LLMs with taxonomy, return rankings/citations
           ↓
Orchestrator → Synthesizes into strategic roadmap
```

**Trust Node → Citation Quality → LLM Visibility Chain:**
The methodology connects three data layers:
- Missing Wikipedia (Step 1) → No knowledge graph citations (Step 2) → Lower ChatGPT visibility (Step 3)
- Strong G2 reviews (Step 1) → High authority score (Step 2) → #1 Perplexity ranking (Step 3)

Synthesis must explain these causal chains, not just report scores.

**LLM Citation Mapping (Automated):**
After Step 3 completes, the orchestrator automatically maps which LLM platforms cited each source:
1. Each LLM checker agent returns `citation_mapping.{platform}_cited_urls` array
2. Orchestrator compares citation URLs from Step 2 against LLM citation lists
3. Sets `cited_by_perplexity`, `cited_by_chatgpt`, `cited_by_gemini` booleans on each citation
4. Data persists to Airtable Citations table for trend analysis

This mapping reveals which sources drive AI visibility (e.g., "G2 cited by all 3 platforms, Wikipedia cited by none").

## Context Files

Agents reference shared context:
- `context/frameworks/ai-seo-framework.md` - 4-pillar evaluation criteria
- `context/queries/industry-queries.md` - Query taxonomy patterns
- `context/standards/output-quality.md` - Report formatting standards

Apply these consistently across all agents.

## Known Behavioral Issues

### Playwright Browser Lock
**Symptom:** Browser agents spawn endless tabs, system hangs
**Root Cause:** Zombie `mcp-chrome` processes hold locks on browser profile at `/Users/adamsandler/Library/Caches/ms-playwright/mcp-chrome-032dfe6`
**Prevention:** `playwright-cleanup` skill runs automatically before browser agents
**Detection:** Agents timeout after 90 seconds, invoke cleanup, report partial results
**Recovery:** Never retry in same session - let user reinvoke

### Agent Memory Limits
Audit generates 5,000+ lines across 4 steps. Keep context efficient:
- Orchestrator should NOT read agent implementation files
- Agents should return summaries, not raw data dumps
- Step 4 synthesis receives summaries from Steps 1-3, not full outputs

## Scoring Methodology

### Trust Nodes (Step 1)
29 nodes across 6 categories. Track presence (✓/✗):
- Knowledge Graphs (3): Wikipedia, Wikidata, Google Knowledge Panel
- Review Platforms (5): G2, Capterra, Trustpilot, Software Advice, GetApp
- Directories (4): Crunchbase, Product Hunt, AngelList, BuiltWith
- Company Profiles (2): LinkedIn, Bloomberg/Pitchbook
- News & PR (10): Last 6 months coverage
- Seed Sites (5): TechCrunch, VentureBeat, Forbes, Inc, Fast Company

### Citation Quality (Step 2)
Five dimensions (0-10 scale):
1. **Authority** - Domain authority, editorial standards
2. **Data Structure** - Schema.org markup, structured data
3. **Brand Alignment** - Accurate representation, sentiment
4. **Freshness** - Publication date, last updated
5. **Cross-Link Signals** - References to/from other trust nodes

Average across all citations for composite score.

### LLM Visibility (Step 3)
Query taxonomy per platform:
1. Evaluative: "What are the top [category] in 2025?"
2. Comparative: "Best [category] for [use case]"
3. Brand-Specific: "[Brand] reviews and credentials"

Track: appearance (✓/✗), position (#1-10 or unranked), citation sources (URLs), competitors mentioned.

## Documentation Maintenance

When making significant changes, update `README.md`:

**After adding agents:** Update "Specialized Agents" section
**After creating skills:** Update "Skills" section
**After fixing bugs:** Update "Known Issues & Solutions"
**After completing TODOs:** Check off README TODO list
**After major features:** Update "What It Does" section

Always update "Last updated" date at bottom of README.

## Development Workflow

### Creating New Skills
```bash
cd .claude/skills/skill-creator
python scripts/init_skill.py <skill-name> --path ..
```

Follow skill-creator guidance in `.claude/skills/skill-creator/SKILL.md`.

### Packaging Skills
```bash
python .claude/skills/skill-creator/scripts/package_skill.py .claude/skills/<skill-name>
```

Validates and creates distributable `.zip`.

### Adding New Agents

1. Create agent file in `.claude/agents/<name>.md`
2. Include YAML frontmatter: `name`, `description`, `model`, `color`
3. Define clear workflow steps with checkpoints
4. Reference context files for consistency
5. Update orchestrator to invoke new agent
6. Update README "Specialized Agents" section

### Testing Agents Individually

Invoke agents directly to test:
```bash
@source-discovery
@citation-quality-analyzer
@perplexity-citation-checker
@chatgpt-citation-checker
@gemini-citation-checker
```

Provide test brand/category context in prompt.

## Quality Standards from .claude/instructions.md

All analysis must:
- Apply entity-first optimization approach
- Prioritize statistical specificity over vague claims
- Score against 4-pillar framework (Entity, Statistical, Structure, Authority)
- Reference specific framework elements
- Provide concrete, measurable recommendations
- Include scoring with evidence
- Be actionable, not just observational

Output structure:
1. Citation status summary
2. Framework-based scoring
3. Competitive comparison
4. Priority recommendations
5. Specific next actions
