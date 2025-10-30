// Extraction functions for parsing markdown audit sections

import type {
  ExecutiveSummary,
  TrustNodeCoverage,
  CitationQuality,
  LLMRankings,
  Priorities,
} from './types';

/**
 * Extract executive summary section
 */
export function extractExecutiveSummary(markdown: string): ExecutiveSummary {
  const summaryMatch = markdown.match(
    /## Executive Summary\s*\n\s*\*\*Overall AI Visibility Score:\*\* ([\d.]+)\/10([\s\S]*?)(?=\n##|$)/
  );

  if (!summaryMatch) {
    return {
      overallScore: 0,
      keyFindings: [],
      bottomLine: 'Unable to parse executive summary',
    };
  }

  const overallScore = parseFloat(summaryMatch[1]);
  const content = summaryMatch[2];

  // Extract key findings
  const findingsMatch = content.match(
    /\*\*Key Findings:\*\*\s*\n((?:\d+\.\s*\*\*[^*]+\*\*[^\n]+\n?)+)/
  );
  const keyFindings: string[] = [];

  if (findingsMatch) {
    const findings = findingsMatch[1].match(/\d+\.\s*\*\*([^*]+)\*\*[^\n]+/g);
    if (findings) {
      keyFindings.push(
        ...findings.map((f) => f.replace(/\d+\.\s*\*\*([^*]+)\*\*\s*/, ''))
      );
    }
  }

  // Extract bottom line
  const bottomLineMatch = content.match(
    /\*\*Bottom Line:\*\*\s*([^\n]+)/
  );
  const bottomLine = bottomLineMatch ? bottomLineMatch[1] : '';

  return { overallScore, keyFindings, bottomLine };
}

/**
 * Extract trust node coverage data
 */
export function extractTrustNodeCoverage(
  markdown: string
): TrustNodeCoverage {
  const coverageMatch = markdown.match(
    /## STEP 1 RESULTS: Source & Citation Discovery[\s\S]*?### Trust Node Coverage Map[\s\S]*?\*\*Overall Coverage:\*\* (\d+)\/(\d+) trust nodes \(([\d.]+)%[^)]*\)([\s\S]*?)(?=### Critical Missing Nodes|$)/
  );

  if (!coverageMatch) {
    return {
      overall: { coverage: 0, total: 0, percentage: 0, health: 'Unknown' },
      categories: [],
      criticalGaps: [],
    };
  }

  const [, coverage, total, percentage] = coverageMatch;
  const tableSection = coverageMatch[4];

  // Parse category table
  const categoryRows = tableSection.match(
    /\|\s*([^|]+)\s*\|\s*([\d.]+)\/(\d+)\s*\|\s*([^|]+)\s*\|/g
  );

  const categories = (categoryRows || [])
    .slice(1) // Skip header row
    .map((row) => {
      const match = row.match(
        /\|\s*([^|]+)\s*\|\s*([\d.]+)\/(\d+)\s*\|\s*([^|]+)\s*\|/
      );
      if (!match) return null;

      const [, name, cov, tot, status] = match;
      const coverage = parseFloat(cov);
      const total = parseInt(tot);
      const statusText = status.trim().replace(/✓\s*/, '');

      return {
        name: name.trim(),
        coverage,
        total,
        percentage: Math.round((coverage / total) * 100),
        status: statusText as any,
      };
    })
    .filter((c) => c !== null);

  // Extract health status
  const healthMatch = markdown.match(
    /\*\*Trust Node Health:\*\*\s*([^\n]+)/
  );
  const health = healthMatch ? healthMatch[1].trim() : 'Unknown';

  // Parse critical gaps
  const gapsSection = markdown.match(
    /### Critical Missing Nodes[\s\S]*?\*\*Blocking AI Visibility:\*\*([\s\S]*?)(?=\n##|---)/
  );

  const criticalGaps = [];
  if (gapsSection) {
    const gapMatches = gapsSection[1].matchAll(
      /\d+\.\s*\*\*([^*]+)\*\*\s*\(([^)]+)\s*-\s*([^)]+)\)[\s\S]*?-\s*\*\*Status:\*\*\s*([^\n]+)[\s\S]*?-\s*\*\*Impact:\*\*\s*([^\n]+)[\s\S]*?-\s*\*\*Why this matters:\*\*\s*([^\n]+)[\s\S]*?-\s*\*\*Action:\*\*\s*([^\n]+)/g
    );

    for (const match of gapMatches) {
      criticalGaps.push({
        name: match[1].trim(),
        priority: match[2].trim() as any,
        impact: match[3].trim() as any,
        status: match[4].trim(),
        impact_description: match[5].trim(),
        why_matters: match[6].trim(),
        action: match[7].trim(),
      });
    }
  }

  return {
    overall: {
      coverage: parseInt(coverage),
      total: parseInt(total),
      percentage: parseFloat(percentage),
      health,
    },
    categories: categories as any,
    criticalGaps,
  };
}

/**
 * Extract citation quality scorecard
 */
export function extractCitationQuality(markdown: string): CitationQuality {
  const qualityMatch = markdown.match(
    /## STEP 2 RESULTS: Citation Quality Scoring[\s\S]*?\*\*Average Citation Quality:\*\*\s*([\d.]+)\/10([\s\S]*?)(?=\n##)/
  );

  if (!qualityMatch) {
    return {
      average: 0,
      distribution: {
        highQuality: { count: 0, percentage: 0 },
        mediumQuality: { count: 0, percentage: 0 },
        lowQuality: { count: 0, percentage: 0 },
      },
      dimensions: [],
      strongest: '',
      weakest: '',
    };
  }

  const average = parseFloat(qualityMatch[1]);
  const content = qualityMatch[2];

  // Parse distribution
  const distributionMatches = {
    high: content.match(/High-quality \(8-10\):\s*(\d+)\s*citations\s*\((\d+)%\)/),
    medium: content.match(/Medium-quality \(5-7\):\s*(\d+)\s*citations\s*\((\d+)%\)/),
    low: content.match(/Low-quality \(0-4\):\s*(\d+)\s*citations\s*\((\d+)%\)/),
  };

  const distribution = {
    highQuality: {
      count: distributionMatches.high ? parseInt(distributionMatches.high[1]) : 0,
      percentage: distributionMatches.high ? parseInt(distributionMatches.high[2]) : 0,
    },
    mediumQuality: {
      count: distributionMatches.medium ? parseInt(distributionMatches.medium[1]) : 0,
      percentage: distributionMatches.medium ? parseInt(distributionMatches.medium[2]) : 0,
    },
    lowQuality: {
      count: distributionMatches.low ? parseInt(distributionMatches.low[1]) : 0,
      percentage: distributionMatches.low ? parseInt(distributionMatches.low[2]) : 0,
    },
  };

  // Parse dimension breakdown table
  const dimensionRows = content.match(
    /\|\s*([^|]+)\s*\|\s*([\d.]+)\/10\s*\|\s*([^|]+)\s*\|/g
  );

  const dimensions = (dimensionRows || [])
    .slice(1) // Skip header
    .map((row) => {
      const match = row.match(/\|\s*([^|]+)\s*\|\s*([\d.]+)\/10\s*\|\s*([^|]+)\s*\|/);
      if (!match) return null;

      return {
        name: match[1].trim(),
        score: parseFloat(match[2]),
        assessment: match[3].trim() as any,
      };
    })
    .filter((d) => d !== null);

  // Extract strongest and weakest
  const strongestMatch = content.match(
    /\*\*Strongest Dimension:\*\*\s*([^(]+)/
  );
  const weakestMatch = content.match(/\*\*Weakest Dimension:\*\*\s*([^(]+)/);

  return {
    average,
    distribution,
    dimensions: dimensions as any,
    strongest: strongestMatch ? strongestMatch[1].trim() : '',
    weakest: weakestMatch ? weakestMatch[1].trim() : '',
  };
}

/**
 * Extract LLM rankings and platform results
 */
export function extractLLMRankings(markdown: string): LLMRankings {
  const rankingsMatch = markdown.match(
    /## STEP 3 RESULTS: LLM Response Evaluation([\s\S]*?)(?=^## )/m
  );

  if (!rankingsMatch) {
    return {
      platforms: [],
      aiCitationRate: 0,
      competitors: [],
    };
  }

  const content = rankingsMatch[1];

  // Parse platform table - handles both 4 and 5 column formats
  // 4 columns: Platform | Brand Cited? | Position | Citations Found
  // 5 columns: Platform | Brand Cited? | Position | Citations Found | Query Coverage
  const tableMatch = content.match(
    /\| Platform \| Brand Cited\? \| Position \| Citations Found \|[\s\S]*?\n((?:\|[^|]*\|[^|]*\|[^|]*\|[^|]*\|[^|]*\n?)+)/
  );

  let platformRows: string[] = [];
  if (tableMatch) {
    platformRows = tableMatch[1]
      .split('\n')
      .filter(row => row.trim() && !row.includes('---') && !row.includes('Platform'))
      .filter(row => row.includes('Perplexity') || row.includes('ChatGPT') || row.includes('Gemini'));
  }

  const platforms = platformRows.map((row) => {
      // Match 4 or 5 columns - capture first 4, ignore 5th if present
      const match = row.match(
        /\|\s*(Perplexity|ChatGPT|Gemini)\s*\|\s*([^|]+)\s*\|\s*([^|]+)\s*\|\s*([^|]+)\s*\|/
      );
      if (!match) return null;

      const platform = match[1] as 'Perplexity' | 'ChatGPT' | 'Gemini';
      const citedText = match[2].trim();
      const cited = citedText.includes('✓');
      const positionText = match[3].trim();
      const citationsText = match[4].trim();
      const citationsFound = citationsText === '-' ? 0 : (parseInt(citationsText) || 0);

      // Parse position
      let position: number | null = null;
      const posMatch = positionText.match(/#(\d+)/);
      if (posMatch) {
        position = parseInt(posMatch[1]);
      }

      return {
        platform,
        cited,
        position,
        positionText,
        citationsFound,
      };
    })
    .filter((p) => p !== null);

  // Extract AI citation rate
  const rateMatch = content.match(
    /\*\*AI Citation Rate:\*\*\s*(\d+)%/
  );
  const aiCitationRate = rateMatch ? parseInt(rateMatch[1]) : 0;

  // Parse competitor table
  const competitorMatch = content.match(
    /### Competitive Intelligence[\s\S]*?\*\*Who's Winning AI Citations:\*\*[\s\S]*?\| Competitor \|[\s\S]*?\n((?:\|[^|]*\|[^|]*\|[^|]*\|[^|]*\|[^|]*\|\n)+)/
  );

  const competitors = [];
  if (competitorMatch) {
    const compRows = competitorMatch[1]
      .split('\n')
      .filter((row) => row.trim() && !row.includes('---'));

    for (const row of compRows) {
      const match = row.match(
        /\|\s*([^|]+)\s*\|\s*([^|]+)\s*\|\s*([^|]+)\s*\|\s*([^|]+)\s*\|\s*([^|]+)\s*\|/
      );
      if (!match) continue;

      const name = match[1].trim();
      if (name === 'Competitor') continue; // Skip header

      const parsePos = (text: string): string => text.trim() || '-';
      const getAvg = (text: string): number | null => {
        const num = parseFloat(text.trim());
        return isNaN(num) ? null : num;
      };

      competitors.push({
        name,
        perplexity: parsePos(match[2]),
        chatgpt: parsePos(match[3]),
        gemini: parsePos(match[4]),
        avgPosition: getAvg(match[5]),
      });
    }
  }

  return {
    platforms: platforms as any,
    aiCitationRate,
    competitors,
  };
}

/**
 * Extract strategic priorities
 */
export function extractPriorities(markdown: string): Priorities {
  const prioritiesMatch = markdown.match(
    /## STRATEGIC RECOMMENDATIONS([\s\S]*?)(?=\n## RE-AUDIT SCHEDULE|$)/
  );

  if (!prioritiesMatch) {
    return { immediate: [], strategic: [], longTerm: [] };
  }

  const content = prioritiesMatch[1];

  const parsePrioritySection = (section: string, level: 'Immediate' | 'Strategic' | 'Long-term') => {
    const priorities = [];
    const priorityMatches = section.matchAll(
      /\*\*Priority \d+:\s*([^*]+)\*\*[\s\S]*?-\s*\*\*Current status:\*\*\s*([^\n]+)[\s\S]*?-\s*\*\*Impact:\*\*\s*([^\n]+)[\s\S]*?-\s*\*\*Action:\*\*\s*([\s\S]*?)(?:-\s*\*\*Success metric:|$)/g
    );

    for (const match of priorityMatches) {
      const action = match[4].trim().split('\n').filter(line => line.trim()).join(' ');

      const impactText = match[3].trim();
      const impact: 'High' | 'Medium' | 'Low' =
        impactText.includes('High') ? 'High' :
        impactText.includes('Medium') ? 'Medium' : 'Low';

      priorities.push({
        level,
        title: match[1].trim(),
        currentStatus: match[2].trim(),
        impact,
        action,
      });
    }

    return priorities;
  };

  // Extract immediate priorities
  const immediateMatch = content.match(
    /### 🔴 IMMEDIATE PRIORITIES \(This Month\)([\s\S]*?)(?=### 🟡|$)/
  );
  const immediate = immediateMatch
    ? parsePrioritySection(immediateMatch[1], 'Immediate')
    : [];

  // Extract strategic initiatives
  const strategicMatch = content.match(
    /### 🟡 STRATEGIC INITIATIVES \(This Quarter\)([\s\S]*?)(?=### 🟢|$)/
  );
  const strategic = strategicMatch
    ? parsePrioritySection(strategicMatch[1], 'Strategic')
    : [];

  // Extract long-term vision
  const longTermMatch = content.match(
    /### 🟢 LONG-TERM VISION \(6-12 Months\)([\s\S]*?)$/
  );
  const longTerm = longTermMatch
    ? parsePrioritySection(longTermMatch[1], 'Long-term')
    : [];

  return { immediate, strategic, longTerm };
}
