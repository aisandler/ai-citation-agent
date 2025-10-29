#!/usr/bin/env python3
"""
Check Citations table contents to debug the linkage issue.
"""

import os
import requests
import json

# Airtable configuration
AIRTABLE_API_KEY = os.environ.get('AIRTABLE_API_KEY')
BASE_ID = 'appXQsoTkWGPqwaOx'
CITATIONS_TABLE = 'Citations'
AUDIT_RUNS_TABLE = 'Audit_Runs'

# API headers
HEADERS = {
    'Authorization': f'Bearer {AIRTABLE_API_KEY}',
    'Content-Type': 'application/json'
}


def get_all_records(table_name: str, max_records: int = 10):
    """Fetch records from a table."""
    url = f'https://api.airtable.com/v0/{BASE_ID}/{table_name}'

    params = {'maxRecords': max_records}

    response = requests.get(url, headers=HEADERS, params=params)
    response.raise_for_status()

    return response.json().get('records', [])


def search_audit_by_brand(brand_name: str):
    """Search for audit by brand name."""
    url = f'https://api.airtable.com/v0/{BASE_ID}/{AUDIT_RUNS_TABLE}'

    params = {
        'filterByFormula': f'{{brand_name}} = "{brand_name}"'
    }

    response = requests.get(url, headers=HEADERS, params=params)
    response.raise_for_status()

    return response.json().get('records', [])


print("="*60)
print("🔍 Checking Airtable Data")
print("="*60)

# Check if ClickUp audit exists
print("\n1. Searching for ClickUp audit in Audit_Runs table...")
try:
    audits = search_audit_by_brand("ClickUp")
    if audits:
        print(f"   Found {len(audits)} audit(s):")
        for audit in audits:
            audit_id = audit['id']
            fields = audit.get('fields', {})
            print(f"   • Audit ID: {audit_id}")
            print(f"     Brand: {fields.get('brand_name')}")
            print(f"     Date: {fields.get('audit_date')}")
            print(f"     Status: {fields.get('status')}")
    else:
        print("   ❌ No ClickUp audit found")
except Exception as e:
    print(f"   ❌ Error: {e}")

# Check Citations table
print("\n2. Checking first 10 records in Citations table...")
try:
    citations = get_all_records(CITATIONS_TABLE, max_records=10)
    if citations:
        print(f"   Found {len(citations)} citation(s):")
        for i, citation in enumerate(citations, 1):
            citation_id = citation['id']
            fields = citation.get('fields', {})
            print(f"\n   [{i}] Citation ID: {citation_id}")
            print(f"       URL: {fields.get('source_url', 'N/A')}")
            print(f"       Domain: {fields.get('source_domain', 'N/A')}")
            print(f"       Linked to audit: {fields.get('audit', 'None')}")
    else:
        print("   ❌ No citations found in table")
except Exception as e:
    print(f"   ❌ Error: {e}")

# Check Audit_Runs table
print("\n3. Checking first 5 records in Audit_Runs table...")
try:
    audits = get_all_records(AUDIT_RUNS_TABLE, max_records=5)
    if audits:
        print(f"   Found {len(audits)} audit(s):")
        for i, audit in enumerate(audits, 1):
            audit_id = audit['id']
            fields = audit.get('fields', {})
            print(f"\n   [{i}] Audit ID: {audit_id}")
            print(f"       Brand: {fields.get('brand_name', 'N/A')}")
            print(f"       Date: {fields.get('audit_date', 'N/A')}")
    else:
        print("   ❌ No audits found in table")
except Exception as e:
    print(f"   ❌ Error: {e}")

print("\n" + "="*60)
