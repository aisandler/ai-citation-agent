#!/bin/bash

# Export Ways2Well audit data to Airtable
# Base ID: appXQsoTkWGPqwaOx

# Load environment variables from .env.local
if [ -f .env.local ]; then
  export $(grep -v '^#' .env.local | xargs)
fi

if [ -z "$AIRTABLE_API_KEY" ]; then
  echo "❌ AIRTABLE_API_KEY not set in .env.local"
  echo "Create a .env.local file with: AIRTABLE_API_KEY=your_key_here"
  exit 1
fi

BASE_ID="${AIRTABLE_BASE_ID:-appXQsoTkWGPqwaOx}"

echo "================================================"
echo "EXPORTING WAYS2WELL AUDIT TO AIRTABLE"
echo "================================================"
echo ""

# Step 1: Create Audit_Runs record
echo "Step 1: Creating Audit_Runs record..."
AUDIT_RESPONSE=$(curl -s -X POST "https://api.airtable.com/v0/${BASE_ID}/Audit_Runs" \
  -H "Authorization: Bearer ${AIRTABLE_API_KEY}" \
  -H "Content-Type: application/json" \
  --data '{
    "fields": {
      "brand_name": "Ways2Well",
      "category": "Health and Fitness / Longevity Clinic",
      "audit_date": "2025-10-30",
      "overall_score": 2.8,
      "trust_node_coverage": 9,
      "trust_node_percentage": 0.31,
      "citation_quality": 6.5,
      "ai_citation_rate": 0.0,
      "status": "Complete",
      "executive_summary": "Ways2Well has weak trust node coverage (31%) with critical gaps in foundational knowledge graphs (0/3) and high-authority seed sites (0/5). Brand does not appear in any evaluative or comparative longevity clinic queries across all three major LLM platforms. Despite strong operational foundation (52,000+ patients), the company has minimal digital authority with only 5-year-old editorial coverage and no presence in wellness directories that LLMs cite.",
      "top_priority_1": "Establish wellness directory presence (Luxe Wellness Club, Longevity Clinic UK, Dr. David Jack guides)",
      "top_priority_2": "Fix Trustpilot reputation management (improve 3.2→4.0+ rating, 27%→100% response rate)",
      "top_priority_3": "Create proprietary program branding (Ways2Well Longevity Protocol with dedicated website page)",
      "next_audit_date": "2025-12-29",
      "perplexity_cited": false,
      "chatgpt_cited": false,
      "gemini_cited": false
    }
  }')

echo "$AUDIT_RESPONSE" | python3 -m json.tool

# Extract audit_id from response
AUDIT_ID=$(echo "$AUDIT_RESPONSE" | python3 -c "import sys, json; print(json.load(sys.stdin).get('id', ''))")

if [ -z "$AUDIT_ID" ]; then
    echo "ERROR: Failed to create Audit_Runs record"
    echo "$AUDIT_RESPONSE"
    exit 1
fi

echo ""
echo "✓ Audit_Runs record created: $AUDIT_ID"
echo ""

# Save audit_id for reference
echo "$AUDIT_ID" > /tmp/ways2well_audit_id.txt

echo "Audit ID saved: $AUDIT_ID"
echo ""
echo "Next steps: Create linked records for Trust_Nodes, Citations, LLM_Responses, and Priorities"
