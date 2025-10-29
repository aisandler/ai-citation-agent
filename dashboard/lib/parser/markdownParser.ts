// Main markdown parser for audit reports

import matter from 'gray-matter';
import type { ParsedAudit, AuditMetadata } from './types';
import {
  extractExecutiveSummary,
  extractTrustNodeCoverage,
  extractCitationQuality,
  extractLLMRankings,
  extractPriorities,
} from './extractors';

/**
 * Parse audit metadata from markdown content and filename
 */
function parseMetadata(markdown: string, filePath: string): AuditMetadata {
  // Try to parse frontmatter if it exists
  const { data, content } = matter(markdown);

  // Extract from markdown header if frontmatter doesn't exist
  const headerMatch = content.match(
    /# AI VISIBILITY AUDIT REPORT[\s\S]*?\*\*Brand:\*\*\s*([^\n]+)[\s\S]*?\*\*Category:\*\*\s*([^\n]+)[\s\S]*?\*\*Date:\*\*\s*([^\n]+)[\s\S]*?\*\*Methodology:\*\*\s*([^\n]+)/
  );

  const brand = data.brand || (headerMatch ? headerMatch[1].trim() : 'Unknown');
  const category = data.category || (headerMatch ? headerMatch[2].trim() : 'Unknown');
  const date = data.date || (headerMatch ? headerMatch[3].trim() : 'Unknown');
  const methodology =
    data.methodology || (headerMatch ? headerMatch[4].trim() : 'Unknown');

  // Generate slug from filename (e.g., "klaviyo-audit-report-2025-10-29.md" -> "klaviyo-2025-10-29")
  const filename = filePath.split('/').pop() || '';
  const slug = filename
    .replace(/-audit-report-/, '-')
    .replace('.md', '')
    .toLowerCase();

  return {
    brand,
    category,
    date,
    methodology,
    filePath,
    slug,
  };
}

/**
 * Main parser function - parses complete audit markdown file
 */
export function parseAuditMarkdown(
  markdown: string,
  filePath: string
): ParsedAudit {
  try {
    const metadata = parseMetadata(markdown, filePath);
    const executiveSummary = extractExecutiveSummary(markdown);
    const trustNodeCoverage = extractTrustNodeCoverage(markdown);
    const citationQuality = extractCitationQuality(markdown);
    const llmRankings = extractLLMRankings(markdown);
    const priorities = extractPriorities(markdown);

    return {
      metadata,
      executiveSummary,
      trustNodeCoverage,
      citationQuality,
      llmRankings,
      priorities,
      rawMarkdown: markdown,
    };
  } catch (error) {
    console.error(`Error parsing audit from ${filePath}:`, error);
    throw error;
  }
}

/**
 * Validate parsed audit data
 */
export function validateParsedAudit(audit: ParsedAudit): {
  valid: boolean;
  errors: string[];
  warnings: string[];
} {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Check critical fields
  if (!audit.metadata.brand || audit.metadata.brand === 'Unknown') {
    errors.push('Brand name is missing or could not be parsed');
  }

  if (audit.executiveSummary.overallScore === 0) {
    warnings.push('Overall score could not be parsed or is 0');
  }

  if (audit.trustNodeCoverage.categories.length === 0) {
    warnings.push('Trust node categories could not be parsed');
  }

  if (audit.citationQuality.dimensions.length === 0) {
    warnings.push('Citation quality dimensions could not be parsed');
  }

  if (audit.llmRankings.platforms.length === 0) {
    warnings.push('LLM platform results could not be parsed');
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Parse multiple audits and sort by date (newest first)
 */
export function parseAuditList(
  markdownFiles: { content: string; filePath: string }[]
): ParsedAudit[] {
  const audits = markdownFiles
    .map(({ content, filePath }) => {
      try {
        return parseAuditMarkdown(content, filePath);
      } catch (error) {
        console.error(`Failed to parse ${filePath}:`, error);
        return null;
      }
    })
    .filter((audit): audit is ParsedAudit => audit !== null);

  // Sort by date (newest first)
  return audits.sort((a, b) => {
    const dateA = new Date(a.metadata.date);
    const dateB = new Date(b.metadata.date);
    return dateB.getTime() - dateA.getTime();
  });
}
