#!/bin/bash

# Playwright Browser Cleanup Script
# Detects and kills zombie mcp-chrome processes that cause endless tab loops

set -euo pipefail

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Find all mcp-chrome processes (excluding this grep command itself)
PROCESSES=$(ps aux | grep -i "mcp-chrome" | grep -v grep | awk '{print $2}' || true)

# Count processes - handle empty string case
if [ -z "$PROCESSES" ]; then
    PROCESS_COUNT=0
else
    PROCESS_COUNT=$(echo "$PROCESSES" | wc -l | tr -d ' ')
fi

if [ "$PROCESS_COUNT" -eq 0 ]; then
    echo -e "${GREEN}✅ No Playwright browser processes found. Clean slate confirmed.${NC}"
    exit 0
fi

echo -e "${YELLOW}⚠️  Found $PROCESS_COUNT Playwright browser process(es). Cleaning up...${NC}"

# Kill all found processes
KILLED_COUNT=0
FAILED_COUNT=0

for PID in $PROCESSES; do
    if kill -9 "$PID" 2>/dev/null; then
        ((KILLED_COUNT++))
    else
        ((FAILED_COUNT++))
    fi
done

# Verify cleanup
REMAINING_PROCESSES=$(ps aux | grep -i "mcp-chrome" | grep -v grep || true)
if [ -z "$REMAINING_PROCESSES" ]; then
    REMAINING=0
else
    REMAINING=$(echo "$REMAINING_PROCESSES" | wc -l | tr -d ' ')
fi

if [ "$REMAINING" -eq 0 ]; then
    echo -e "${GREEN}✅ Successfully killed $KILLED_COUNT process(es). Clean slate confirmed.${NC}"
    exit 0
else
    echo -e "${RED}❌ Failed to clean up all processes. $REMAINING process(es) still running.${NC}"
    echo -e "${RED}   Manual intervention required:${NC}"
    echo -e "   ${YELLOW}ps aux | grep -i 'mcp-chrome' | grep -v grep${NC}"
    echo -e "   ${YELLOW}kill -9 [PID numbers]${NC}"
    exit 1
fi
