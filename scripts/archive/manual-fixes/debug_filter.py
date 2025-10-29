#!/usr/bin/env python3
"""
Debug Airtable filter formula for linked records.
"""

import os
import requests
import json

# Airtable configuration
AIRTABLE_API_KEY = os.environ.get('AIRTABLE_API_KEY')
BASE_ID = 'appXQsoTkWGPqwaOx'
CITATIONS_TABLE = 'Citations'
AUDIT_ID = 'rec32pmt8f5KF1z80'

# API headers
HEADERS = {
    'Authorization': f'Bearer {AIRTABLE_API_KEY}',
    'Content-Type': 'application/json'
}

print("Testing different filter formulas...\n")

# Test 1: Get all records and filter manually
print("Test 1: Fetching all citations and filtering manually...")
url = f'https://api.airtable.com/v0/{BASE_ID}/{CITATIONS_TABLE}'
response = requests.get(url, headers=HEADERS)
all_records = response.json().get('records', [])

clickup_citations = [r for r in all_records if AUDIT_ID in r.get('fields', {}).get('audit', [])]
print(f"Found {len(clickup_citations)} ClickUp citations via manual filter\n")

for i, citation in enumerate(clickup_citations, 1):
    fields = citation.get('fields', {})
    print(f"[{i}] {citation['id']}")
    print(f"    URL: {fields.get('source_url')}")
    print(f"    audit field: {fields.get('audit')}")
    print()

# Test 2: Try different filter formulas
test_formulas = [
    f'FIND("{AUDIT_ID}", ARRAYJOIN({{audit}}))',
    f'{{audit}} = "{AUDIT_ID}"',
    f'SEARCH("{AUDIT_ID}", ARRAYJOIN({{audit}}))',
]

for i, formula in enumerate(test_formulas, 1):
    print(f"\nTest {i+1}: Filter formula = {formula}")
    try:
        params = {'filterByFormula': formula}
        response = requests.get(url, headers=HEADERS, params=params)
        records = response.json().get('records', [])
        print(f"  Result: {len(records)} records")
    except Exception as e:
        print(f"  Error: {e}")
