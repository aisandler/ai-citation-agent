# Project Cleanup Plan for Public Release

## Summary
Preparing the AI Citation Agent for public distribution with fresh setup support.

## Issues Identified

### 1. Extraneous Files (Delete)
- `.claude/agents/.citation-tracker.md.swp` - vim swap file
- `scripts/export-b2-management-to-airtable.js.bak` - backup file
- `scripts/explore-new-source-base.js` - exploration script
- `scripts/explore-source-base.js` - exploration script
- `scripts/list-source-tables.js` - development utility
- `.claude/agents/content-analyzer-seo.md` - unused agent

### 2. Brand-Specific Export Scripts (Archive/Remove)
**Problem:** 20+ brand-specific export scripts (~7,500 lines) duplicate functionality that should be handled by the airtable-writer agent.

**Files to move to `scripts/archive/examples/`:**
- export-agmb-law-to-airtable.js
- export-bbg-to-airtable.js
- export-accurate-legal-billing-to-airtable.js
- export-b2-management-to-airtable.js
- export-fairlife-to-airtable.js
- export-jasper-to-airtable.js
- export-klaviyo-to-airtable.js
- export-legal-billing-group-to-airtable.js
- export-msf-to-airtable.js
- export-timebillers-llc-to-airtable.js
- export-uptime-practice-to-airtable.js
- export-watson-legal-services-to-airtable.js
- export_frontline_to_airtable.js
- export_ways2well_to_airtable.sh
- complete-timebillers-export.js

**Keep as infrastructure:**
- `setup-airtable-schema.js` - schema creation
- `test-airtable-connection.js` - connection testing
- `delete-airtable-tables.js` - utility
- `read-audit-queue.js` - batch audit feature
- `sync-audit-results.js` - batch audit feature
- `add-audit-fields-to-source.js` - batch audit feature

### 3. Architecture Issue: airtable-writer Agent

**Current State:**
- The `airtable-writer` agent is well-designed and integrated into the orchestrator
- But in practice, users created manual brand-specific export scripts instead
- This violates the agent-based architecture

**Solution:**
- **Keep** the airtable-writer agent (it's the right design)
- **Remove** brand-specific export scripts (move to examples)
- **Ensure** the orchestrator properly invokes the agent
- **Create** a generic export utility for edge cases

### 4. Documentation Gaps
- Need comprehensive setup guide for new users
- MCP server configuration instructions
- Credential management (Airtable, Perplexity API)
- Environment variable setup

## Action Items

### Phase 1: File Cleanup
1. Delete swap/backup/exploration files
2. Move brand-specific exports to `scripts/archive/examples/`
3. Keep infrastructure scripts
4. Create `.gitkeep` files where needed

### Phase 2: Airtable Integration Fix
1. Verify airtable-writer agent works correctly
2. Update orchestrator to ensure agent is invoked
3. Create generic export utility script (optional fallback)
4. Update schema setup script with latest fields

### Phase 3: Documentation
1. Create `SETUP.md` with fresh installation guide
2. Document MCP server configuration
3. Create `.env.local.example` template
4. Update README with credential setup
5. Add troubleshooting guide

### Phase 4: Testing
1. Test complete audit workflow end-to-end
2. Verify Airtable export works via agent
3. Test with fresh credentials
4. Validate MCP server setup

## Schema Updates Needed

Review `setup-airtable-schema.js` for:
- All fields match agent expectations
- Proper field types and relationships
- Any new fields added during development
- Consistent naming conventions

## Files to Keep vs Archive

### Keep (Production)
```
scripts/
  ├── setup-airtable-schema.js      ✓ Infrastructure
  ├── test-airtable-connection.js   ✓ Utility
  ├── delete-airtable-tables.js     ✓ Utility
  ├── read-audit-queue.js           ✓ Batch audit
  ├── sync-audit-results.js         ✓ Batch audit
  └── add-audit-fields-to-source.js ✓ Batch audit
```

### Archive (Examples)
```
scripts/archive/examples/
  ├── export-agmb-law-to-airtable.js
  ├── export-bbg-to-airtable.js
  └── [... 13 more brand-specific scripts]
```

### Delete
```
.claude/agents/.citation-tracker.md.swp
scripts/export-b2-management-to-airtable.js.bak
scripts/explore-new-source-base.js
scripts/explore-source-base.js
scripts/list-source-tables.js
.claude/agents/content-analyzer-seo.md
```

## Timeline
- Phase 1 (Cleanup): 15 minutes
- Phase 2 (Airtable Fix): 30 minutes
- Phase 3 (Documentation): 45 minutes
- Phase 4 (Testing): 30 minutes

**Total: ~2 hours**
