---
name: dashboard-builder
description: Deploy and update the AI Visibility Dashboard with audit report data. Use this skill after audit completion to build and deploy the Next.js dashboard to Vercel, or when manually updating the dashboard with new/historical audit reports. Handles validation, build, and deployment workflows.
---

# Dashboard Builder

## Overview

Build and deploy the AI Visibility Dashboard to Vercel. This skill validates audit markdown files, builds the Next.js production bundle, and handles Vercel deployment with proper authentication and error handling.

## When to Use This Skill

Use this skill in these scenarios:

1. **After audit completion**: Audit orchestrator has generated a new markdown report in `output/` directory
2. **Manual dashboard update**: User wants to deploy/update the dashboard with latest audit data
3. **Historical deployment**: User wants to deploy dashboard with a specific historical audit (future enhancement)
4. **Troubleshooting**: Dashboard deployment failed and needs debugging

## Core Workflow

### Decision Tree

```
Start
  ↓
Is audit file specified?
  ├─ No → Find latest audit in output/ directory
  └─ Yes → Use specified audit file
  ↓
Validate audit file is parseable
  ├─ Invalid → Report errors and exit
  └─ Valid → Continue
  ↓
Build Next.js production bundle
  ├─ Build fails → Report errors, check troubleshooting
  └─ Build succeeds → Continue
  ↓
Deploy to Vercel
  ├─ Preview (default) → Deploy to preview URL
  └─ Production (--prod flag) → Deploy to production URL
  ↓
Return deployment URL and status
```

### Step 1: Locate and Validate Audit File

Find the audit file to deploy:

```bash
# List available audits
ls -lt output/*.md | head -5

# Most recent audit will be used by default
# Dashboard automatically loads latest by filename sort
```

Validate the audit file is parseable:

```bash
node .claude/skills/dashboard-builder/scripts/validate_audit.js output/brand-audit-report-2025-10-29.md
```

The validation script checks:
- File exists and is readable
- All required sections are present (Steps 1-3, recommendations)
- Data can be extracted by parser
- Values are within expected ranges

**Expected output:**
```
✅ Validation PASSED - audit file is ready for dashboard deployment

📋 Audit Summary:
   Brand: Klaviyo
   Category: Marketing Automation
   Overall Score: 7.8/10
   Trust Node Coverage: 27/29 (93%)
   Citation Quality: 7.1/10
   AI Citation Rate: 67%
```

If validation fails, see `references/troubleshooting.md` for parser issues.

### Step 2: Build Production Bundle

Build the Next.js dashboard for production deployment:

```bash
bash .claude/skills/dashboard-builder/scripts/build_dashboard.sh
```

The build script:
1. Changes to dashboard directory
2. Installs dependencies if needed
3. Cleans previous build artifacts
4. Runs `npm run build`
5. Reports success or failure with error details

**Expected output:**
```
✅ Build completed successfully!
   Output: /path/to/dashboard/.next
```

**Common build issues:**
- Missing dependencies → Script runs `npm install` automatically
- TypeScript errors → Check `dashboard/lib/parser/` files
- Port conflicts → Not applicable to production build

See `references/troubleshooting.md` for detailed build error solutions.

### Step 3: Deploy to Vercel

Deploy the built dashboard to Vercel:

```bash
# Preview deployment (staging)
bash .claude/skills/dashboard-builder/scripts/deploy_vercel.sh

# Production deployment
bash .claude/skills/dashboard-builder/scripts/deploy_vercel.sh --production
```

The deployment script:
1. Checks Vercel CLI is installed
2. Verifies authentication status
3. Runs `vercel` or `vercel --prod`
4. Reports deployment URL

**Expected output:**
```
✅ Deployment completed successfully!

📋 Next steps:
   - Visit your dashboard URL (shown above)
   - Verify all data displays correctly
   - Share the URL with stakeholders
```

**First-time deployment:**

Vercel will prompt for project configuration:
- **Set up and deploy**: Yes
- **Which scope**: Select your account
- **Link to existing project**: No (first time)
- **Project name**: ai-visibility-dashboard (or custom)
- **Directory**: ./ (already in dashboard/)
- **Override settings**: No (uses vercel.json)

**Authentication required:**

If not logged in, run:
```bash
vercel login
```

See `references/vercel-setup.md` for complete Vercel CLI setup instructions.

### Step 4: Verify Deployment

After successful deployment:

1. **Visit the dashboard URL** (provided in deployment output)
2. **Check data displays correctly**:
   - Overall score shows correct value
   - Trust Node Radar displays 6 categories
   - Citation Quality bars show 5 dimensions
   - LLM Rankings table shows 3 platforms
   - Priority Timeline shows recommendations

3. **Test responsiveness** (mobile/tablet/desktop)

4. **Share URL with stakeholders**

## Data Management

### How Dashboard Loads Data

The dashboard automatically loads the **latest audit** from `output/*.md` by:
1. Scanning `../output/` directory (relative to dashboard/)
2. Sorting files by name (descending)
3. Parsing the first (most recent) file
4. Displaying extracted data

**File naming convention:**
```
{brand}-audit-report-{YYYY-MM-DD}.md
```

Example: `klaviyo-audit-report-2025-10-29.md`

### Updating Dashboard with New Audit

When a new audit is generated:

1. **Automatic**: Vercel ISR revalidates every 60 seconds
   - New audit appears automatically within 1 minute
   - No manual deployment needed

2. **Manual**: Force immediate update
   ```bash
   bash .claude/skills/dashboard-builder/scripts/deploy_vercel.sh --production
   ```

### Historical Audits

Current implementation: Dashboard shows latest audit only.

**Future enhancement**: Support for audit selection/history view (pending individual audit view page implementation).

Historical audits are preserved in:
- `output/*.md` files (markdown archive)
- Airtable (structured data with trends)

## Integration with Audit Orchestrator

The audit orchestrator can optionally invoke this skill after completing Step 4:

**Orchestrator pseudo-code:**
```
Step 4 complete → Markdown saved to output/
                ↓
             Prompt user: "Deploy dashboard to Vercel?"
                ↓
             User confirms
                ↓
             Invoke @dashboard-builder skill
                ↓
             Return deployment URL
```

This integration is pending implementation (see TODO in project README).

## Resources

### Scripts

- **validate_audit.js** - Validates audit markdown file is parseable
  - Usage: `node scripts/validate_audit.js <path-to-audit.md>`
  - Checks all required sections and data validity
  - Returns summary of parsed data

- **build_dashboard.sh** - Builds Next.js production bundle
  - Usage: `bash scripts/build_dashboard.sh`
  - Handles dependency installation
  - Cleans previous builds
  - Reports success/failure

- **deploy_vercel.sh** - Deploys to Vercel with authentication
  - Usage: `bash scripts/deploy_vercel.sh [--production]`
  - Checks Vercel CLI installation
  - Handles authentication
  - Deploys to preview or production

### References

- **vercel-setup.md** - Complete Vercel CLI setup guide
  - Installation instructions
  - Authentication workflow
  - Project linking process
  - Custom domain configuration
  - Environment variable setup

- **troubleshooting.md** - Common issues and solutions
  - Build errors (TypeScript, dependencies, ports)
  - Parser issues (validation failures, blank data)
  - Deployment errors (authentication, build failures, 404s)
  - Data update issues (stale data, wrong audit displayed)
  - Performance optimization

## Example Usage

### Scenario 1: Deploy after audit completion

```bash
# Audit completes, markdown saved to output/
# User invokes skill

@dashboard-builder

# Skill executes:
# 1. Finds latest audit: output/klaviyo-audit-report-2025-10-29.md
# 2. Validates audit (✅ PASSED)
# 3. Builds production bundle (✅ SUCCESS)
# 4. Deploys to Vercel (✅ DEPLOYED)
# 5. Returns URL: https://ai-visibility-dashboard-abc123.vercel.app
```

### Scenario 2: Manual update with specific audit

```bash
# User wants to deploy specific audit

@dashboard-builder

# Then specify audit file when prompted
# Or run scripts directly:

node .claude/skills/dashboard-builder/scripts/validate_audit.js output/older-audit.md
bash .claude/skills/dashboard-builder/scripts/build_dashboard.sh
bash .claude/skills/dashboard-builder/scripts/deploy_vercel.sh --production
```

### Scenario 3: Troubleshooting failed deployment

```bash
# Deployment failed with errors

@dashboard-builder

# Skill checks common issues:
# - Vercel CLI not installed → Install: npm install -g vercel
# - Not authenticated → Run: vercel login
# - Build errors → Check: references/troubleshooting.md
# - Parser errors → Validate: scripts/validate_audit.js
```

## Next Steps

After successful deployment:

1. **Bookmark dashboard URL** for easy access
2. **Share with stakeholders** (clients, team members)
3. **Set up monitoring** (Vercel Analytics, uptime checks)
4. **Configure custom domain** (optional, see vercel-setup.md)
5. **Schedule re-audits** to keep dashboard updated with fresh data

## Limitations

Current limitations (future enhancements):

1. **Single audit view**: Dashboard shows latest audit only
   - Future: Individual audit view page for historical browsing
   - Future: Audit comparison view for trend analysis

2. **Static deployment**: Dashboard deployed with specific audit data
   - Current: ISR revalidation every 60 seconds
   - Future: Dynamic audit selection via URL params

3. **Local data source**: Dashboard reads from `output/*.md` files
   - Current: Files must be in repository or accessible to Vercel build
   - Future: Airtable integration for remote data source

See project README for full roadmap and TODO list.
