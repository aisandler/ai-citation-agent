#!/usr/bin/env python3
"""
Update ClickUp audit citation records with LLM platform citation data.
Version 2: Fetch all records with pagination support.
"""

import os
import requests
import json
from typing import Dict, List

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

# Citation mapping based on Step 3 LLM evaluation results
CITATION_UPDATES = {
    'g2.com/products/clickup/reviews': {
        'cited_by_chatgpt': True,
        'cited_by_gemini': True,
        'notes': 'Implied via comparison content (ChatGPT), Wrike article reference (Gemini)'
    },
    'capterra.com/p/158833/ClickUp': {
        'cited_by_chatgpt': True,
        'cited_by_gemini': True,
        'notes': 'Implied via comparison content (ChatGPT), Wrike article reference (Gemini)'
    },
    'trustpilot.com/review/clickup.com': {
        'cited_by_perplexity': True,
        'notes': 'Query 3, TrustRadius/Trustpilot mentioned'
    },
    'techcrunch.com/2025/03/13/clickup-is-launching-a-revamped-calendar-tool': {
        'cited_by_perplexity': True,
        'notes': 'TechCrunch in Query 1 additional sources'
    },
    'venturebeat.com/virtual/clickup-takes-on-slack-and-teams': {
        'cited_by_perplexity': True,
        'notes': 'VentureBeat in Query 1 additional sources'
    },
    'fastcompany.com/91258582/clickup-ceo-zeb-evans-interview': {
        'cited_by_perplexity': True,
        'notes': 'Fast Company in Query 1 additional sources'
    },
    'thedigitalprojectmanager.com/tools/clickup-review': {
        'cited_by_perplexity': True,
        'cited_by_chatgpt': True,
        'notes': 'Perplexity citations [3], [5], [10] across all 3 queries; implied via comparison content (ChatGPT)'
    },
    'tech.co/project-management-software/clickup-review': {
        'cited_by_perplexity': True,
        'cited_by_chatgpt': True,
        'notes': 'Perplexity citations [5], [3] in Query 1 and Query 3; Tech.co 4.5/5 rating mentioned (ChatGPT)'
    },
    'cloudwards.net/clickup-review': {
        'cited_by_perplexity': True,
        'notes': 'Perplexity citation [4] in Query 3'
    },
    'getapp.com/project-management-planning-software/a/clickup/reviews': {
        'cited_by_gemini': True,
        'notes': 'Wrike article references GetApp'
    }
}


def get_all_citations_for_audit(audit_id: str) -> List[Dict]:
    """Fetch ALL citation records linked to the specified audit (with pagination)."""
    url = f'https://api.airtable.com/v0/{BASE_ID}/{CITATIONS_TABLE}'

    all_records = []
    offset = None

    while True:
        params = {
            'filterByFormula': f'FIND("{audit_id}", ARRAYJOIN({{audit}}))'
        }

        if offset:
            params['offset'] = offset

        response = requests.get(url, headers=HEADERS, params=params)
        response.raise_for_status()

        data = response.json()
        records = data.get('records', [])
        all_records.extend(records)

        # Check if there are more pages
        offset = data.get('offset')
        if not offset:
            break

    return all_records


def update_citation_record(record_id: str, fields: Dict) -> Dict:
    """Update a single citation record."""
    url = f'https://api.airtable.com/v0/{BASE_ID}/{CITATIONS_TABLE}/{record_id}'

    payload = {'fields': fields}

    response = requests.patch(url, headers=HEADERS, json=payload)
    response.raise_for_status()

    return response.json()


def match_citation_url(source_url: str, pattern: str) -> bool:
    """Check if source URL matches the pattern (flexible matching)."""
    return pattern.lower() in source_url.lower()


def main():
    print(f"🔍 Fetching ALL citation records for audit: {AUDIT_ID}\n")

    # Get all citations for this audit
    citations = get_all_citations_for_audit(AUDIT_ID)
    print(f"Found {len(citations)} citation records\n")

    if not citations:
        print("❌ No citation records found. Check audit_id.")
        return

    # Track update statistics
    stats = {
        'perplexity': 0,
        'chatgpt': 0,
        'gemini': 0,
        'total_updated': 0,
        'skipped': 0
    }

    # Process each citation
    for citation in citations:
        record_id = citation['id']
        fields = citation.get('fields', {})
        source_url = fields.get('source_url', '')

        print(f"Processing: {source_url}")

        # Find matching update pattern
        update_fields = {}
        matched = False

        for pattern, updates in CITATION_UPDATES.items():
            if match_citation_url(source_url, pattern):
                matched = True

                # Build update payload
                if updates.get('cited_by_perplexity'):
                    update_fields['cited_by_perplexity'] = True
                    stats['perplexity'] += 1
                    print(f"  ✓ Perplexity citation")

                if updates.get('cited_by_chatgpt'):
                    update_fields['cited_by_chatgpt'] = True
                    stats['chatgpt'] += 1
                    print(f"  ✓ ChatGPT citation")

                if updates.get('cited_by_gemini'):
                    update_fields['cited_by_gemini'] = True
                    stats['gemini'] += 1
                    print(f"  ✓ Gemini citation")

                # Append notes if provided
                if updates.get('notes'):
                    existing_notes = fields.get('notes', '')
                    if existing_notes:
                        update_fields['notes'] = f"{existing_notes}\n\nLLM Citations: {updates['notes']}"
                    else:
                        update_fields['notes'] = f"LLM Citations: {updates['notes']}"

                break

        if matched and update_fields:
            # Update the record
            try:
                update_citation_record(record_id, update_fields)
                stats['total_updated'] += 1
                print(f"  ✅ Updated record {record_id}\n")
            except Exception as e:
                print(f"  ❌ Failed to update: {e}\n")
        else:
            stats['skipped'] += 1
            print(f"  ⊘ No LLM citations for this source\n")

    # Print summary
    print("\n" + "="*60)
    print("📊 UPDATE SUMMARY")
    print("="*60)
    print(f"Total citation records processed: {len(citations)}")
    print(f"Records updated: {stats['total_updated']}")
    print(f"Records skipped (no LLM citations): {stats['skipped']}")
    print(f"\nLLM Citation Counts:")
    print(f"  • Perplexity citations added: {stats['perplexity']}")
    print(f"  • ChatGPT citations added: {stats['chatgpt']}")
    print(f"  • Gemini citations added: {stats['gemini']}")
    print("\n✅ Citation update complete!")


if __name__ == '__main__':
    main()
