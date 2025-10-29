# Airtable Audit Linkage Setup Guide

## Problem Identified

Currently, Trust Nodes, Citations, LLM Responses, and Priorities tables have **no link back to their parent Audit Run**. This means:

❌ Can't filter "Show me all citations from the monday.com audit"
❌ Can't create rollups like "Average citation quality per audit"
❌ Can't track trends across multiple audits for the same brand
❌ Each table is isolated without audit context

## Solution: Add Linked Record Fields

Add an `audit` field to each child table that links to the `Audit_Runs` table.

---

## Implementation Steps

### Step 1: Run the Linkage Script

The script at `scripts/add-audit-linkage.js` will automatically add the `audit` field to all 4 tables.

```bash
cd /Users/adamsandler/projects/ai-citation-agent

# Set your Airtable Personal Access Token
export AIRTABLE_TOKEN=your_personal_access_token_here

# Run the script
node scripts/add-audit-linkage.js
```

**Expected Output:**
```
🔗 Adding audit linkage to AI Citation Intelligence schema...

✓ Added "audit" field to Trust_Nodes
✓ Added "audit" field to Citations
✓ Added "audit" field to LLM_Responses
✓ Added "audit" field to Priorities

==================================================
✓ Successfully updated: 4 tables
==================================================
```

### Step 2: Verify in Airtable

1. Open your base: https://airtable.com/appXQsoTkWGPqwaOx
2. Check each table - you should see a new **"audit"** field (link to Audit_Runs)
3. The field will be empty for the existing monday.com records (they were created before linkage)

### Step 3: (Optional) Manually Link Existing Records

If you want to link the existing monday.com audit records:

1. Open the `Trust_Nodes` table
2. Find all 28 records from the monday.com audit (2025-10-29)
3. Click the empty "audit" field for each record
4. Select the monday.com audit run (ID: `recIeLaUrfBwOia7I`)
5. Repeat for `Citations` (12 records), `LLM_Responses` (5 records), `Priorities` (7 records)

**Or skip this** - future audits will automatically have linkage.

---

## What You Get After Setup

### 1. Filtering by Audit

**View all trust nodes for a specific audit:**
- In Trust_Nodes table, create filtered view: `audit = [monday.com 2025-10-29]`

**View only high-priority items from latest audit:**
- In Priorities table, filter: `priority_level = Immediate AND audit = [latest]`

### 2. Rollup Fields on Audit_Runs

Add these rollup fields to see aggregate metrics per audit:

**Average Citation Quality:**
- Field type: Rollup
- Link field: (create reverse link from Audit_Runs → Citations)
- Rollup field: overall_quality
- Aggregation: AVERAGE()

**Trust Nodes Present Count:**
- Field type: Rollup
- Link field: (create reverse link from Audit_Runs → Trust_Nodes)
- Rollup field: present
- Aggregation: COUNTALL() with filter `present = true`

**High Priority Count:**
- Field type: Rollup
- Link field: (create reverse link from Audit_Runs → Priorities)
- Rollup field: priority_level
- Aggregation: COUNTALL() with filter `priority_level = Immediate`

### 3. Trend Analysis Views

**Compare Citation Quality Across Quarterly Audits:**
- Group by: brand_name
- Sort by: audit_date (descending)
- Show fields: citation_quality, average_citation_quality (rollup)
- Chart: Line chart over time

**Track Trust Node Additions:**
- Group by: brand_name
- Formula field: `{trust_node_coverage} / 29 * 100` (percentage)
- Chart: Progress over time

**Monitor LLM Ranking Improvements:**
- Group by: brand_name
- Show fields: perplexity_rank, chatgpt_rank, gemini_rank
- Formula field: `AVERAGE({perplexity_rank}, {chatgpt_rank}, {gemini_rank})`
- Chart: Lower is better (track downward trend)

### 4. Dashboard Views

**Latest Audit Dashboard:**
- Filter: `audit_date >= TODAY() - 90 days`
- Group by: brand_name
- Show key metrics: overall_score, trust_node_percentage, ai_citation_rate

**Brand Comparison Dashboard:**
- Group by: brand_name
- Show metrics per audit: overall_score, citation_quality, LLM average position
- Sort by: overall_score (descending)

**Priority Tracker:**
- All priorities with parent audit context
- Group by: priority_level
- Filter: status ≠ Completed
- Sort by: impact (High → Medium → Low)

---

## How Future Audits Will Work

When you run `/agents:audit-citations` for another brand:

1. **Audit Run created** → Returns `recXXXXXXXXX` (capture this ID)
2. **Trust Nodes created** → Each includes `"audit": ["recXXXXXXXXX"]`
3. **Citations created** → Each includes `"audit": ["recXXXXXXXXX"]`
4. **LLM Responses created** → Each includes `"audit": ["recXXXXXXXXX"]`
5. **Priorities created** → Each includes `"audit": ["recXXXXXXXXX"]`

All records automatically linked! ✓

---

## Troubleshooting

**"audit field already exists" error:**
- This is fine! The script detected the field was already added
- Verify the field type is "Link to Audit_Runs" in each table

**Records not linking automatically:**
- Check the `airtable-writer` agent is passing `"audit": [audit_id]` in each record creation
- Verify the audit_id is captured from Step 1 (Audit Run creation)
- Check Airtable API response for errors

**Can't create rollup fields:**
- First create reverse link from Audit_Runs → child tables
- In Audit_Runs table, add field type "Link to another record"
- Select the child table (e.g., Citations)
- Airtable will create bidirectional link
- Then add rollup field using that link

---

## Schema Diagram (After Linkage)

```
┌─────────────────┐
│   Audit_Runs    │
│  (Main Table)   │
└────────┬────────┘
         │
         ├─── audit (link) ───┐
         │                     │
    ┌────▼───────┐       ┌────▼──────────┐
    │Trust_Nodes │       │   Citations   │
    │  (28 recs) │       │   (12 recs)   │
    └────────────┘       └───────────────┘
         │
         ├─── audit (link) ───┐
         │                     │
    ┌────▼──────────┐    ┌────▼──────┐
    │LLM_Responses  │    │Priorities │
    │   (5 recs)    │    │ (7 recs)  │
    └───────────────┘    └───────────┘
```

Each child table has an `audit` field linking back to its parent Audit Run.

---

## Next Actions

After adding linkage:

1. ✅ Run the script (Step 1 above)
2. ✅ Verify fields exist in Airtable (Step 2)
3. ⚪ (Optional) Manually link monday.com records
4. ⚪ Add rollup fields to Audit_Runs for aggregate metrics
5. ⚪ Create dashboard views for trend analysis
6. ⚪ Run next audit (test automatic linkage)

---

**Script Location:** `/Users/adamsandler/projects/ai-citation-agent/scripts/add-audit-linkage.js`

**Airtable Base:** https://airtable.com/appXQsoTkWGPqwaOx

**Next Audit Date:** December 29, 2025 (60 days from monday.com audit)
