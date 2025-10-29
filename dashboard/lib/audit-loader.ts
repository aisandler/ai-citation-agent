// Load and parse audit markdown files from output directory

import { readFileSync, readdirSync, statSync } from 'fs';
import { join } from 'path';
import { parseAuditMarkdown, parseAuditList } from './parser/markdownParser';
import type { ParsedAudit, AuditListItem } from './parser/types';

// Path to output directory (relative to dashboard root)
const OUTPUT_DIR = join(process.cwd(), '..', 'output');

/**
 * Get all audit report markdown files from output directory
 */
function getAuditFiles(): string[] {
  try {
    const files = readdirSync(OUTPUT_DIR);
    return files
      .filter((file) => file.endsWith('-audit-report-') || file.match(/-audit-report-\d{4}-\d{2}-\d{2}\.md$/))
      .map((file) => join(OUTPUT_DIR, file));
  } catch (error) {
    console.error('Error reading output directory:', error);
    return [];
  }
}

/**
 * Load and parse a single audit file
 */
export function loadAudit(filePath: string): ParsedAudit | null {
  try {
    const content = readFileSync(filePath, 'utf-8');
    return parseAuditMarkdown(content, filePath);
  } catch (error) {
    console.error(`Error loading audit from ${filePath}:`, error);
    return null;
  }
}

/**
 * Load all audits from output directory
 */
export function loadAllAudits(): ParsedAudit[] {
  const files = getAuditFiles();

  const markdownFiles = files.map((filePath) => ({
    content: readFileSync(filePath, 'utf-8'),
    filePath,
  }));

  return parseAuditList(markdownFiles);
}

/**
 * Load latest audit (by date)
 */
export function loadLatestAudit(): ParsedAudit | null {
  const audits = loadAllAudits();
  return audits.length > 0 ? audits[0] : null;
}

/**
 * Load audit by slug (e.g., "klaviyo-2025-10-29")
 */
export function loadAuditBySlug(slug: string): ParsedAudit | null {
  const audits = loadAllAudits();
  return audits.find((audit) => audit.metadata.slug === slug) || null;
}

/**
 * Get summary list of all audits (for list pages)
 */
export function getAuditList(): AuditListItem[] {
  const audits = loadAllAudits();

  return audits.map((audit) => ({
    metadata: audit.metadata,
    overallScore: audit.executiveSummary.overallScore,
    trustNodePercentage: audit.trustNodeCoverage.overall.percentage,
    citationQuality: audit.citationQuality.average,
    aiCitationRate: audit.llmRankings.aiCitationRate,
  }));
}

/**
 * Get all unique brands from audits
 */
export function getAllBrands(): string[] {
  const audits = loadAllAudits();
  const brands = new Set(audits.map((audit) => audit.metadata.brand));
  return Array.from(brands).sort();
}

/**
 * Get audits for a specific brand
 */
export function getAuditsByBrand(brand: string): ParsedAudit[] {
  const audits = loadAllAudits();
  return audits.filter(
    (audit) => audit.metadata.brand.toLowerCase() === brand.toLowerCase()
  );
}

/**
 * Get file modification time for cache invalidation
 */
export function getAuditFileModTime(filePath: string): Date {
  try {
    const stats = statSync(filePath);
    return stats.mtime;
  } catch (error) {
    return new Date();
  }
}

/**
 * Check if output directory exists and has audit files
 */
export function hasAudits(): boolean {
  const files = getAuditFiles();
  return files.length > 0;
}
