---
name: playwright-cleanup
description: Detect and clean up zombie Playwright browser processes that cause endless tab loops during browser automation. Use this skill before invoking any browser-based agents (chatgpt-citation-checker, gemini-citation-checker) or when user reports stuck/multiplying browser tabs. Also useful for manual cleanup when browser automation fails or hangs.
---

# Playwright Cleanup

## Overview

Clean up zombie Playwright browser processes that block new browser automation sessions and cause endless tab opening loops. This skill provides both automated cleanup via script and manual verification steps to ensure a clean slate before browser-based agent invocations.

## When to Use This Skill

Use this skill in these scenarios:

1. **Before browser automation** - Always invoke before chatgpt-citation-checker or gemini-citation-checker agents
2. **After automation failure** - When browser agents fail, hang, or report errors
3. **Endless tabs detected** - When browser tabs multiply uncontrollably during automation
4. **Manual cleanup** - When user explicitly requests browser process cleanup
5. **Pre-audit check** - Before running full audit-citations workflow that uses browser agents

## Core Workflow

### Step 1: Detect Zombie Processes

Run the cleanup script to detect and clean up Playwright browser processes:

```bash
bash .claude/skills/playwright-cleanup/scripts/cleanup_browser.sh
```

The script will:
- Search for all `mcp-chrome` processes (Playwright's browser profile)
- Count the number of zombie processes found
- Kill all found processes safely
- Verify cleanup succeeded
- Return exit code and status message

### Step 2: Interpret Results

The script returns one of three outcomes:

**✅ Clean Slate (Exit Code 0, 0 processes found)**
```
No Playwright browser processes found. Clean slate confirmed.
```
→ Safe to proceed with browser automation

**⚠️ Cleanup Completed (Exit Code 0, N processes killed)**
```
Found and killed 3 Playwright browser processes. Clean slate confirmed.
```
→ Zombie processes were detected and cleaned up. Safe to proceed with browser automation.

**❌ Cleanup Failed (Exit Code 1)**
```
Failed to clean up Playwright processes. Manual intervention required.
```
→ Do NOT proceed with browser automation. Report error to user and request manual cleanup.

### Step 3: Report Status

Always report the cleanup status clearly:

**If clean slate (0 processes):**
```
✅ Browser cleanup complete: Clean slate confirmed (0 processes running)
```

**If processes were killed:**
```
✅ Browser cleanup complete: Cleaned up [N] zombie processes. Safe to proceed.
```

**If cleanup failed:**
```
❌ Browser cleanup failed: Could not kill all processes. Manual intervention needed.

Please run manually:
ps aux | grep -i "mcp-chrome" | grep -v grep
kill -9 [PID numbers]
```

## Integration with Browser Agents

Browser-based agents (chatgpt-citation-checker, gemini-citation-checker) should invoke this skill as Step 0 before any browser automation:

```markdown
### Step 0: Browser Cleanup ✓

@playwright-cleanup

Wait for confirmation:
- ✅ "Clean slate confirmed" → Proceed to Step 1
- ⚠️ "Cleaned up [N] processes" → Proceed to Step 1
- ❌ "Cleanup failed" → STOP and report error
```

## Manual Verification (Fallback)

If the script fails or is unavailable, use these manual commands:

### Check for processes:
```bash
ps aux | grep -i "mcp-chrome" | grep -v grep
```

### Kill processes if found:
```bash
kill -9 [PID1] [PID2] [PID3]
```

### Verify cleanup:
```bash
ps aux | grep -i "mcp-chrome" | grep -v grep | wc -l
```
Should return: `0`

## Root Cause Explanation

**Why this happens:**

Playwright browser automation uses a persistent browser profile at:
```
/Users/adamsandler/Library/Caches/ms-playwright/mcp-chrome-032dfe6
```

When a browser session doesn't close cleanly:
1. The browser process becomes a "zombie" that holds a lock on the profile
2. New browser sessions detect the lock and attempt to reconnect
3. This creates a loop: new session → detects lock → spawns retry → spawns more tabs
4. Result: Endless tab multiplication

**Prevention:**

Always invoke this skill before browser automation to ensure no zombie processes exist.

## Resources

### scripts/cleanup_browser.sh

Shell script that:
- Detects mcp-chrome processes
- Kills them with proper error handling
- Returns exit code (0 = success, 1 = failure)
- Outputs process count and status message

Can be executed without loading into context for fast, deterministic cleanup.
