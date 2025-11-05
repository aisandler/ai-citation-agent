# Archived Scripts

## examples/

Brand-specific Airtable export scripts created during development. These have been replaced by the `airtable-writer` agent which handles exports generically.

**Why archived:** These scripts duplicate functionality that should be handled by the agent-based architecture. They're preserved here as reference examples of the Airtable export pattern.

**For new exports:** Use the `airtable-writer` agent via the audit orchestrator, or create a generic export utility if needed.

### Files in examples/
- `export-*-to-airtable.js` - Brand-specific export scripts (~15 files)
- Each follows the same pattern: parse audit data → write to Airtable
- Total: ~7,500 lines of duplicate code

### Migration Path
If you need to export an existing audit to Airtable:
1. Use `/agents:audit-citations` with the "Export to Airtable" option
2. Or invoke `@airtable-writer` agent directly with structured JSON
