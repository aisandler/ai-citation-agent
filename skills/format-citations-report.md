# Format Citation Report Skill

## Purpose
Transform raw citation analysis data into a standardized, professional report format.

## When to Use
Invoke this skill with `/format-citation-report` when you have completed citation research and analysis and need to structure the findings into a deliverable report.

## Input Expected
- Citation status data (platforms checked, results)
- Content scores (4-pillar framework assessment)
- Competitive analysis findings
- Gap identification
- Recommendations

## Output Format

Generate a report using this exact structure:
```markdown
# AI Citation Analysis Report

**Date:** [Auto-generate current date]
**Topic/Query:** [The search query or topic analyzed]
**Analyst:** AI Citation Intelligence Agent

---

## Executive Summary

[2-3 sentence overview]
- Current citation status: [Brief status]
- Critical finding: [Most important gap]
- Top priority: [#1 recommendation]

---

## Citation Status

### Platform Performance

| Platform | Query Tested | Cited? | Position | Context Quality |
|----------|--------------|--------|----------|----------------|
| ChatGPT | [query] | Yes/No | [if cited] | [assessment] |
| Perplexity | [query] | Yes/No | [if cited] | [assessment] |
| Gemini | [query] | Yes/No | [if cited] | [assessment] |

**Citation Rate:** [X]% (cited in [Y] of [Z] platforms tested)

**Competitor Comparison:**
- Competitor A: Cited in [X]% of queries
- Competitor B: Cited in [X]% of queries
- Our Position: [comparative statement]

---

## Framework Assessment

### 1. Entity Optimization: [Score]/10

**Evidence:**
- [Specific example from content]
- [Specific example from content]

**Analysis:** [What this score means]

---

### 2. Statistical Specificity: [Score]/10

**Evidence:**
- [Specific example from content]
- [Specific example from content]

**Analysis:** [What this score means]

---

### 3. Content Structure: [Score]/10

**Evidence:**
- [Specific example from content]
- [Specific example from content]

**Analysis:** [What this score means]

---

### 4. Authority Signals: [Score]/10

**Evidence:**
- [Specific example from content]
- [Specific example from content]

**Analysis:** [What this score means]

---

**Overall Assessment:** [Composite view of strengths and weaknesses]

**Citation-Worthy Status:** [Yes/No - requires 7+ on all pillars]

---

## Competitive Intelligence

### What Competitors Do Better:
1. [Specific competitive advantage with example]
2. [Specific competitive advantage with example]
3. [Specific competitive advantage with example]

### What We Do Better:
1. [Specific advantage with example]
2. [Specific advantage with example]

### Gap Analysis:
[Synthesis of where competitors are winning and why they're being cited instead of us]

---

## Priority Recommendations

### 🔴 HIGH PRIORITY

**Recommendation #1:** [Specific change]
- **Where:** [Location in content]
- **Why:** [Framework-based reasoning]
- **Expected Impact:** [Estimated improvement]
- **Effort:** [Low/Medium/High]

---

### 🟡 MEDIUM PRIORITY

**Recommendation #2:** [Specific change]
- **Where:** [Location in content]
- **Why:** [Framework-based reasoning]
- **Expected Impact:** [Estimated improvement]
- **Effort:** [Low/Medium/High]

---

### 🟢 LOW PRIORITY

**Recommendation #3:** [Specific change]
- **Where:** [Location in content]
- **Why:** [Framework-based reasoning]
- **Expected Impact:** [Estimated improvement]
- **Effort:** [Low/Medium/High]

---

## Next Actions

- [ ] [Specific task] - Owner: [Who] - Due: [When]
- [ ] [Specific task] - Owner: [Who] - Due: [When]
- [ ] [Specific task] - Owner: [Who] - Due: [When]

**Follow-up:** Re-audit in [timeframe] to measure improvement

---

*Analysis based on AI SEO Optimization Framework*
*Report generated: [Timestamp]*
```

## Usage Notes

- This skill only FORMATS data; it doesn't gather or analyze
- Ensure all sections have actual data before invoking
- Maintain consistent scoring methodology across reports
- Update this template if reporting needs change

---

*To invoke: `/format-citation-report` when analysis is complete*