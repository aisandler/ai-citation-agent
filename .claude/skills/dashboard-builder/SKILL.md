---
name: dashboard-builder
description: Transform audit markdown reports into structured JSON and launch the AI Visibility Dashboard. Bridges the gap between raw audit data and visual dashboards. Perfect for presentations demonstrating data transformation pipelines.
---

# Dashboard Builder

## Purpose

**Transform** audit markdown reports → **Structure** into clean JSON → **Visualize** in interactive dashboard

This skill demonstrates "bridging the gap" between unstructured audit data and dashboard visualizations.

## Quick Start

```bash
# Transform audit data
node .claude/skills/dashboard-builder/scripts/transform-audit.cjs output/klaviyo-audit-report-2025-10-29.md

# Launch dashboard
cd dashboard && npm run dev

# Visit: http://localhost:3000
```

## What It Does

### Step 1: Parse Markdown

Reads audit markdown file and extracts:
- Metadata (brand, category, date)
- Key metrics (overall score, trust nodes, citation quality, AI citation rate)
- Trust node categories (6 categories with coverage %)
- LLM platform rankings (Perplexity, ChatGPT, Gemini)
- Citation quality dimensions (5 dimensions scored 0-10)
- Strategic priorities (immediate action items)

### Step 2: Transform to JSON

Converts unstructured markdown into structured JSON:

```json
{
  "metadata": {
    "brand": "Klaviyo",
    "category": "Email CRM",
    "date": "2025-10-29"
  },
  "summary": {
    "overallScore": 7.9,
    "trustNodeCoverage": 27,
    "trustNodeTotal": 29,
    "citationQuality": 7.8,
    "aiCitationRate": 67
  },
  "trustNodes": { "categories": [...] },
  "citationQuality": { "dimensions": {...} },
  "llmRankings": [...],
  "priorities": [...]
}
```

### Step 3: Dashboard Loads Data

Dashboard automatically displays transformed JSON in visual format:
- **Trust Node Radar Chart** - 6-axis visualization
- **Citation Quality Scorecard** - 5-dimension bars
- **LLM Rankings Table** - Platform comparison
- **Priority Timeline** - Action items

## Presentation Demo Script

**Show the transformation in action:**

```bash
# 1. Show Input - Raw markdown audit
cat output/klaviyo-audit-report-2025-10-29.md | head -100

# 2. Run Transformation - Extract and structure
node .claude/skills/dashboard-builder/scripts/transform-audit.cjs output/klaviyo-audit-report-2025-10-29.md

# Output shows:
# ✅ Extracted 6 trust node categories
# ✅ Extracted 3 LLM platform rankings
# ✅ Extracted 3 priorities
# ✅ Generated structured JSON

# 3. Show Output - Clean JSON
cat dashboard/public/data/audit-data.json

# 4. Launch Dashboard - Visualize
cd dashboard && npm run dev
# Opens at http://localhost:3000
```

This demonstrates:
- INPUT: Unstructured markdown (human-readable)
- TRANSFORMATION: Skill extracts/structures data (bridge)
- OUTPUT: Clean JSON (machine-readable)
- RESULT: Interactive dashboard (visual)

## Key Features

✅ **Handles format variations** - Supports both 4 and 5 column LLM ranking tables
✅ **Robust parsing** - Extracts data even from incomplete audits
✅ **Standardized output** - Consistent JSON format for dashboard
✅ **Visual feedback** - Shows extracted metrics during transformation
✅ **Zero configuration** - Works out of the box

## Transformation Output

```
🔄 Dashboard Builder - Data Transformation
==========================================

📄 Input: output/klaviyo-audit-report-2025-10-29.md
✅ Loaded audit file (17044 characters)

📊 Extracted Metadata:
   Brand: Klaviyo
   Category: Email CRM and campaign platform
   Date: October 29, 2025

🔍 Extracted Key Metrics:
   Overall Score: 7.9/10
   Trust Nodes: 27/29 (93%)
   Citation Quality: 7.8/10
   AI Citation Rate: 67%

📈 Extracted Trust Node Categories: 6
   - Knowledge Graphs: 2.5/3
   - Review Platforms: 5/5
   - Directories: 4/4
   - Company Profiles: 2/2
   - News & PR: 8.5/10
   - Seed Sites: 4/5

🤖 Extracted LLM Platform Rankings: 3
   - Perplexity: ✓ at #2
   - ChatGPT: ✓ at #5
   - Gemini: ⚠️ Incomplete

📊 Extracted Citation Quality Dimensions:
   - authority: 8.5/10
   - dataStructure: 7.5/10
   - brandAlignment: 7/10
   - freshness: 8.5/10
   - crossLinks: 7.5/10

🎯 Extracted Priorities: 3
   1. Break Out of "E-commerce-Only" Positioning
   2. Secure Forbes Coverage
   3. Launch Trustpilot Campaign

✅ Transformation Complete!
📁 Output: dashboard/public/data/audit-data.json
📦 JSON Size: 1505 bytes
```

## Integration with Audit Orchestrator

The orchestrator can invoke this skill after audit completion:

```
Audit Complete → Save markdown → Invoke @dashboard-builder → Transform → Launch dashboard
```

## Troubleshooting

**Script not found:**
- Ensure you're in project root directory
- Check file: `.claude/skills/dashboard-builder/scripts/transform-audit.cjs`

**No data extracted:**
- Verify audit file format matches expected structure
- Check audit has all required sections (Steps 1-3, Executive Summary)
- Review script output for parsing warnings

**Dashboard shows blank:**
- Confirm transformation completed successfully
- Check `dashboard/public/data/audit-data.json` exists
- Restart dashboard dev server (`npm run dev`)

## Future Enhancements

- [ ] Support historical audit comparison
- [ ] Generate PDF reports from transformed data
- [ ] Export to additional formats (CSV, Excel)
- [ ] Validate audit completeness before transformation
- [ ] Deploy to Vercel with transformed data
