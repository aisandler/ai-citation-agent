# Setup Guide

Complete setup instructions for running the AI Citation Agent on your machine.

## Prerequisites

- **Node.js** 18+ (recommend 20+)
- **npm** or **pnpm**
- **Claude Code** (https://claude.com/code) or compatible AI agent system
- **Airtable account** (free tier works)
- **Perplexity API key** (optional, for Step 3)

## Step 1: Clone and Install

```bash
git clone <repository-url>
cd ai-citation-agent
npm install
```

## Step 2: Configure Environment Variables

### Create `.env.local` file

Copy the example file and fill in your credentials:

```bash
cp .env.local.example .env.local
```

### Get Your Airtable Credentials

1. **Create API Key:**
   - Go to https://airtable.com/create/tokens
   - Click "Create new token"
   - Name it "AI Citation Agent"
   - Add scopes: `data.records:read`, `data.records:write`, `schema.bases:read`, `schema.bases:write`
   - Click "Create token"
   - Copy the token (starts with `pat...`)

2. **Create New Base:**
   - Go to https://airtable.com/
   - Click "Add a base" → "Start from scratch"
   - Name it "AI Citation Intelligence"
   - Copy the Base ID from the URL: `https://airtable.com/appXXXXXXXXXXXXXX`
   - The `appXXXXXXXXXXXXXX` part is your Base ID

3. **Update `.env.local`:**
   ```
   AIRTABLE_API_KEY=pat...your_token_here
   AIRTABLE_BASE_ID=appXXXXXXXXXXXXXX
   ```

### Optional: Get Perplexity API Key

1. Go to https://www.perplexity.ai/settings/api
2. Create an API key
3. Add to `.env.local`:
   ```
   PERPLEXITY_API_KEY=your_key_here
   ```

**Note:** If you skip this, the Perplexity agent will use the browser automation fallback (slower but works).

## Step 3: Setup Airtable Schema

Create the 5 required tables in your Airtable base:

```bash
node scripts/setup-airtable-schema.js
```

This creates:
- **Audit_Runs** - Main audit records
- **Trust_Nodes** - Trust node tracking
- **Citations** - Citation quality scores
- **LLM_Responses** - Platform query results
- **Priorities** - Action items

**Expected output:**
```
✅ AIRTABLE SCHEMA SETUP COMPLETE

Tables Created:
1. ✓ Audit_Runs (20 fields)
2. ✓ Trust_Nodes (8 fields)
3. ✓ Citations (15 fields)
4. ✓ LLM_Responses (15 fields)
5. ✓ Priorities (12 fields)
```

## Step 4: Configure MCP Servers

The project uses Model Context Protocol (MCP) servers for browser automation.

### Required MCP Servers

1. **Playwright MCP** (for ChatGPT/Gemini browser automation)
   - Should be auto-configured in Claude Code
   - If not, add to `.claude/mcp.json`:
   ```json
   {
     "playwright-ms": {
       "command": "npx",
       "args": ["-y", "@executeautomation/playwright-mcp-server"]
     }
   }
   ```

2. **Perplexity MCP** (if using API instead of browser)
   - Add to `.claude/mcp.json`:
   ```json
   {
     "perplexity": {
       "command": "npx",
       "args": ["-y", "@modelcontextprotocol/server-perplexity"],
       "env": {
         "PERPLEXITY_API_KEY": "your_key_here"
       }
     }
   }
   ```

### Verify MCP Setup

Check that MCP servers are running:
```bash
# In Claude Code, run:
/mcp list
```

You should see `playwright-ms` in the list.

## Step 5: Test Your Setup

### Test Airtable Connection

```bash
node scripts/test-airtable-connection.js
```

**Expected output:**
```
✅ Connection successful!
Current tables in base (5):
  1. Audit_Runs
  2. Trust_Nodes
  3. Citations
  4. LLM_Responses
  5. Priorities
```

### Run Your First Audit

In Claude Code, run:
```bash
/agents:audit-citations
```

Follow the prompts:
1. **Brand name:** Try "Jasper" or any brand you want to audit
2. **Category:** e.g., "AI writing tools"
3. **Content URLs:** (optional) Leave blank or provide a URL

The audit takes ~8-10 minutes and generates:
- Markdown report in `output/[brand]-audit-report-[date].md`
- Data exported to Airtable (if you opt-in at the end)

## Troubleshooting

### "Endless browser tabs" issue

If browser agents spawn infinite tabs:

1. Run cleanup skill:
   ```bash
   @playwright-cleanup
   ```

2. Or manually:
   ```bash
   bash .claude/skills/playwright-cleanup/scripts/cleanup_browser.sh
   ```

### Airtable schema errors

If you need to recreate the schema:

1. Delete existing tables:
   ```bash
   node scripts/delete-airtable-tables.js
   ```
   ⚠️ **Warning:** This deletes all data!

2. Recreate schema:
   ```bash
   node scripts/setup-airtable-schema.js
   ```

### Agent invocation errors

Make sure you're using the correct syntax:
- Orchestrators: `/agents:audit-citations` (slash command)
- Individual agents: `@source-discovery` (skill invocation)
- Skills: `@playwright-cleanup` (skill invocation)

### "Module not found" errors

Ensure all dependencies are installed:
```bash
npm install
```

Common missing packages:
- `airtable`
- `dotenv`
- `playwright`

## Optional: Batch Audit Setup

If you want to audit multiple competitors from an Airtable queue:

### Create Source Base

1. Create a second Airtable base for competitive intelligence
2. Create table: "1_Basic Info" with columns:
   - `Competitor Name` (single line text)
   - `Website URL` (URL)
   - `Category` (single line text)
3. Create table: "4_Marketing Presence" (for results sync)
4. Add the Source Base ID to `.env.local`:
   ```
   SOURCE_BASE_ID=appXXXXXXXXXXXXXX
   ```

### Run Batch Audits

```bash
# 1. Read competitors from source base
node scripts/read-audit-queue.js

# 2. Run audits (manually or via orchestrator)
/agents:audit-citations

# 3. Sync results back to source base
node scripts/sync-audit-results.js
```

See [docs/AIRTABLE_INTEGRATION.md](docs/AIRTABLE_INTEGRATION.md) for complete guide.

## Next Steps

- Read [CLAUDE.md](CLAUDE.md) for project architecture
- Review [README.md](README.md) for usage examples
- Check [output/](output/) for example audit reports
- Explore [.claude/agents/](. claude/agents/) for agent implementations

## Need Help?

- Check [Known Issues](README.md#known-issues--solutions) in README
- Review agent documentation in `.claude/agents/`
- Check the CLAUDE.md file for troubleshooting tips

---

**Last updated:** 2025-11-04
