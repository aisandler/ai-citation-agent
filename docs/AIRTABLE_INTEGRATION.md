# Airtable Integration Guide

## Overview

The AI Citation Agent now supports **bidirectional Airtable integration** for competitive intelligence automation. This allows you to:

1. **Queue audits** from a source Airtable base (your competitive intelligence tracker)
2. **Run automated batch audits** for multiple competitors
3. **Export detailed results** to a dedicated audit base
4. **Sync scores back** to your source base for dashboard viewing

---

## Architecture

### Two Airtable Bases

**1. Source Base: Competitive Intelligence** (`appB9ECe1uBMCRcmr`)
- **Purpose**: Track competitors, market research, strategic analysis
- **Key Tables**:
  - `1_Basic Info` - Competitor names, websites, categories (audit inputs)
  - `4_Marketing Presence` - Website quality, AI citations, audit scores (audit outputs)
- **Your Control**: Manually add/edit competitors here

**2. Detailed Base: AI Citation Intelligence** (`appXQsoTkWGPqwaOx`)
- **Purpose**: Store granular audit data for analysis and trending
- **Tables**: `Audit_Runs`, `Trust_Nodes`, `Citations`, `LLM_Responses`, `Priorities`
- **Auto-Populated**: Scripts write audit results here

### Data Flow

```
┌─────────────────────────────────────────────────────────────┐
│ SOURCE BASE: Competitive Intelligence                       │
│ ┌─────────────────────┐      ┌────────────────────────┐    │
│ │  1_Basic Info       │      │  4_Marketing Presence  │    │
│ │  ─────────────      │      │  ─────────────────────  │    │
│ │  • Competitor Name  │───┐  │  • ChatGPT Cited?      │    │
│ │  • Website URL      │   │  │  • Overall AI Score    │    │
│ │  • Category         │   │  │  • Trust Node Coverage │    │
│ └─────────────────────┘   │  │  • Last Audited        │    │
└───────────────────────────┼──┴────────────────────────────┘
                            │         ▲
                            ▼         │
                        ┌───────────┴──────────┐
                        │  Audit Orchestrator  │
                        │  (/agents:audit-    │
                        │   citations)         │
                        └───────────┬──────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────┐
│ DETAILED BASE: AI Citation Intelligence                     │
│ ┌──────────────┬──────────────┬──────────────┬──────────┐  │
│ │ Audit_Runs   │ Trust_Nodes  │ Citations    │ Priorities│  │
│ │ ────────────  │ ───────────  │ ─────────    │ ──────────│  │
│ │ • Brand      │ • Node Name  │ • Source URL │ • Title   │  │
│ │ • Overall    │ • Present?   │ • Quality    │ • Impact  │  │
│ │   Score      │ • Quality    │ • Platform   │ • Status  │  │
│ └──────────────┴──────────────┴──────────────┴──────────┘  │
└─────────────────────────────────────────────────────────────┘
```

---

## Workflows

### Workflow 1: Read Audit Queue

**Script**: `scripts/read-audit-queue.js`

**What it does**:
1. Connects to source base (`appB9ECe1uBMCRcmr`)
2. Reads all records from `1_Basic Info` table
3. Extracts audit inputs: brand name, category, website URL
4. Saves to `output/audit-queue.json`

**When to use**: Before running batch audits, to see who's in the queue

**Example**:
```bash
node scripts/read-audit-queue.js
```

**Output**:
```
✅ Found 9 competitor(s) in queue:

1. Accurate Legal Billing
   Category: Legal Billing/eBilling/AI Software
   URL: https://www.accuratelegalbilling.com
   Record ID: recwSHQth6Wzth5tp

2. Beyond Square One (BSO)
   Category: Legal Billing/eBilling/Practice Management Consulting
   URL: http://beyondsquareone.com
   Record ID: recHUwE3FXVRtju17

...

💾 Audit queue saved to: output/audit-queue.json
```

---

### Workflow 2: Run Single Audit

**Command**: `/agents:audit-citations`

**What it does**: Runs complete 4-step audit for a single brand

**Inputs** (from queue):
- Brand Name: `Beyond Square One (BSO)`
- Category: `Legal Billing/eBilling/Practice Management Consulting`
- Content URLs: `http://beyondsquareone.com`

**Outputs**:
1. Markdown report: `output/beyond-square-one-bso-audit-report-2025-11-02.md`
2. Export script: `scripts/export-beyond-square-one-bso-to-airtable.js`
3. Automatically executes export to detailed base

**Time**: ~8-10 minutes per audit

---

### Workflow 3: Sync Results to Source Base

**Script**: `scripts/sync-audit-results.js`

**What it does**:
1. Reads completed audits from detailed base
2. Finds matching competitors in source base
3. Updates `4_Marketing Presence` with scores and citations
4. Sets audit status and next audit date

**When to use**:
- After completing single audit
- After batch of audits
- To refresh source base with latest data

**Example**:
```bash
node scripts/sync-audit-results.js
```

**What gets synced**:

| Field in Source Base | Value from Audit |
|---------------------|------------------|
| ChatGPT Cited? | ✓/✗ checkbox |
| Perplexity Cited? | Yes/No text |
| Gemini Cited? | Yes/No text |
| Overall AI Score | 0-10 score |
| Trust Node Coverage | 0-29 count |
| Citation Quality Score | 0-10 average |
| Last Audited | Date |
| Next Audit Due | Date + 60 days |
| Perplexity Rank | #1-10 or null |
| ChatGPT Rank | #1-10 or null |
| Gemini Rank | #1-10 or null |
| Audit Record Link | Record ID in detailed base |
| Audit Status | "Complete" |

**Output**:
```
🔄 Syncing audit results for: Beyond Square One (BSO)
   ✓ Found audit from 2025-11-02
     Overall Score: 3.5
     Trust Nodes: 6/29
     Citation Quality: 7.2/10
   ✓ Found competitor record: recHUwE3FXVRtju17
   💾 Updating source base with audit results...
   ✅ Successfully synced Beyond Square One (BSO)
      - Overall Score: 3.5
      - Trust Nodes: 6/29
      - Citation Quality: 7.2/10
      - ChatGPT: No
      - Perplexity: Yes (#3)
      - Gemini: Yes (#2)
      - Next Audit: 2026-01-01
```

---

### Workflow 4: Batch Audit (Future)

**Command**: `/agents:batch-audit` (or `@batch-audit`)

**What it does**: Orchestrates multiple audits in sequence

**Process**:
1. Read queue
2. Filter for pending audits (no recent audit or flagged for re-audit)
3. Prompt user for confirmation
4. Run audits sequentially (to avoid browser conflicts)
5. Export each to detailed base
6. Sync all results to source base
7. Summary report

**Time**: ~10 minutes per competitor

**Example session**:
```
I've loaded 9 competitors from your queue. Current status:

✅ Audited (within 60 days): 8
⏳ Pending audit: 1 (Beyond Square One)

Would you like to:
1. Audit only the 1 pending competitor (~10 minutes)
2. Re-audit all 9 competitors (full refresh, ~90 minutes)
3. Audit specific competitors (you choose)
4. Just sync existing results

[User selects option 1]

🚀 Starting audit for Beyond Square One (BSO)...
[Runs audit, exports, syncs]
✅ Batch complete! 1/1 successful
```

---

## Field Mappings

### Source Base → Audit Inputs

| Source Table | Source Field | Audit Input |
|-------------|-------------|-------------|
| 1_Basic Info | Competitor Name | `brand_name` |
| 1_Basic Info | Category | `category` |
| 1_Basic Info | Website URL | `content_urls[0]` |

### Audit Outputs → Source Base

| Audit Field | Target Table | Target Field |
|------------|-------------|-------------|
| `overall_score` | 4_Marketing Presence | Overall AI Score |
| `trust_node_coverage` | 4_Marketing Presence | Trust Node Coverage |
| `citation_quality` | 4_Marketing Presence | Citation Quality Score |
| `audit_date` | 4_Marketing Presence | Last Audited |
| `audit_date + 60 days` | 4_Marketing Presence | Next Audit Due |
| `chatgpt_cited` | 4_Marketing Presence | ChatGPT Cited? |
| `perplexity_cited` | 4_Marketing Presence | Perplexity Cited? |
| `gemini_cited` | 4_Marketing Presence | Gemini Cited? |
| `chatgpt_rank` | 4_Marketing Presence | ChatGPT Rank |
| `perplexity_rank` | 4_Marketing Presence | Perplexity Rank |
| `gemini_rank` | 4_Marketing Presence | Gemini Rank |
| `audit_record_id` | 4_Marketing Presence | Audit Record Link |

---

## Scripts Reference

### `scripts/read-audit-queue.js`
- **Purpose**: Fetch competitors from source base
- **Output**: `output/audit-queue.json`
- **Usage**: `node scripts/read-audit-queue.js`

### `scripts/sync-audit-results.js`
- **Purpose**: Sync completed audits back to source base
- **Reads**: Detailed base (`Audit_Runs` table)
- **Writes**: Source base (`4_Marketing Presence` table)
- **Usage**: `node scripts/sync-audit-results.js`

### `scripts/add-audit-fields-to-source.js`
- **Purpose**: Add audit tracking fields to source base (one-time setup)
- **Usage**: `node scripts/add-audit-fields-to-source.js`
- **Note**: Already completed, fields exist

### `scripts/list-source-tables.js`
- **Purpose**: Explore source base schema (debugging)
- **Usage**: `node scripts/list-source-tables.js`

### `scripts/export-{brand}-to-airtable.js`
- **Purpose**: Export single audit to detailed base
- **Auto-generated**: Created by audit orchestrator
- **Usage**: `node scripts/export-accurate-legal-billing-to-airtable.js`

---

## Current Status

### Completed Audits (8/9)

| Competitor | Overall Score | Trust Nodes | Citation Quality | Platforms |
|-----------|--------------|-------------|-----------------|-----------|
| **Uptime Practice** | 7.2 | 5/29 | 6.5 | ChatGPT (#2), Perplexity (#1), Gemini (#1) |
| **Frontline Managed Services** | 4.8 | 14/29 | 6.2 | Perplexity (#1) |
| **Accurate Legal Billing** | 4.2 | 11/29 | 7.6 | Perplexity |
| **Remote Attorneys** | 3.8 | 8/29 | 4.2 | Perplexity (#2) |
| **B2 Management & Consulting** | 2.8 | 3/29 | 7.9 | Perplexity |
| **Legal Billing Group** | 2.1 | 2/29 | 6.6 | — |
| **TimeBillers, LLC** | 1.4 | 1/29 | 5.7 | — |
| **Watson Legal Services** | 1.2 | 1/29 | 5.8 | — |

### Pending Audit (1/9)

- **Beyond Square One (BSO)** - Legal Billing/eBilling/Practice Management Consulting

---

## Next Steps

1. **Run pending audit**:
   ```bash
   /agents:audit-citations
   ```
   - Brand: Beyond Square One (BSO)
   - Category: Legal Billing/eBilling/Practice Management Consulting
   - URL: http://beyondsquareone.com

2. **View results in Airtable**:
   - Source base: https://airtable.com/appB9ECe1uBMCRcmr
   - Detailed base: https://airtable.com/appXQsoTkWGPqwaOx

3. **Monitor audit schedule**:
   - Check "Next Audit Due" field in source base
   - Re-audit competitors when > 60 days old

4. **Add new competitors**:
   - Manually add to "1_Basic Info" table in source base
   - Run `read-audit-queue.js` to refresh queue
   - Run audit for new competitor
   - Sync results

---

## Troubleshooting

### "Competitor not found in Marketing Presence table"
**Problem**: Sync script can't find matching record
**Solution**: Ensure `Competitor` field in "4_Marketing Presence" exactly matches `Competitor Name` in "1_Basic Info"

### "Audit not found"
**Problem**: Trying to sync before audit completes
**Solution**: Run `/agents:audit-citations` first, then sync

### "No audit queue found"
**Problem**: Missing `output/audit-queue.json`
**Solution**: Run `node scripts/read-audit-queue.js` first

### Browser conflicts in batch mode
**Problem**: Multiple audits running simultaneously cause browser issues
**Solution**: Run audits sequentially, invoke `@playwright-cleanup` between audits

---

## Environment Variables

Required in `.env.local`:
```
AIRTABLE_API_KEY=patWZsSk3nJ2xUsTy...
AIRTABLE_BASE_ID=appXQsoTkWGPqwaOx  # Detailed base
```

Source base ID is hardcoded in scripts: `appB9ECe1uBMCRcmr`

---

## API Rate Limits

Airtable API limits:
- 5 requests per second per base
- Scripts include 200ms delays between records
- Batch audits respect limits automatically

---

## Future Enhancements

1. **Automated scheduling**: Cron job to check "Next Audit Due" and auto-trigger audits
2. **Slack notifications**: Alert when competitor rankings change
3. **Trend visualization**: Charts showing score changes over time
4. **Webhook integration**: Real-time sync when source base is updated
5. **Comparison view**: Side-by-side competitor analysis in source base

---

Last updated: 2025-11-02
