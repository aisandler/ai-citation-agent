// TypeScript interfaces for parsed audit data

export interface AuditMetadata {
  brand: string;
  category: string;
  date: string;
  methodology: string;
  filePath: string;
  slug: string; // brand-date format for URLs
}

export interface ExecutiveSummary {
  overallScore: number; // 0-10
  keyFindings: string[];
  bottomLine: string;
}

export interface TrustNodeCategory {
  name: string;
  coverage: number; // e.g., 5
  total: number; // e.g., 5
  percentage: number; // 0-100
  status: 'Excellent' | 'Strong' | 'Good' | 'Moderate' | 'Weak';
}

export interface TrustNodeCoverage {
  overall: {
    coverage: number; // e.g., 27
    total: number; // e.g., 29
    percentage: number; // 0-100
    health: string; // e.g., "Strong"
  };
  categories: TrustNodeCategory[];
  criticalGaps: {
    name: string;
    priority: 'Priority 1' | 'Priority 2' | 'Priority 3';
    impact: 'HIGH IMPACT' | 'MEDIUM IMPACT' | 'LOW IMPACT';
    status: string;
    impact_description: string;
    why_matters: string;
    action: string;
  }[];
}

export interface CitationQualityDimension {
  name: string;
  score: number; // 0-10
  assessment: 'Strong' | 'Moderate' | 'Weak';
}

export interface CitationQuality {
  average: number; // 0-10
  distribution: {
    highQuality: { count: number; percentage: number }; // 8-10
    mediumQuality: { count: number; percentage: number }; // 5-7
    lowQuality: { count: number; percentage: number }; // 0-4
  };
  dimensions: CitationQualityDimension[];
  strongest: string;
  weakest: string;
}

export interface LLMPlatformResult {
  platform: 'Perplexity' | 'ChatGPT' | 'Gemini';
  cited: boolean;
  position: number | null; // ranking position, null if not ranked
  positionText: string; // e.g., "#2", "Not ranked", "Incomplete"
  citationsFound: number;
  context?: string; // optional description text
}

export interface CompetitorRanking {
  name: string;
  perplexity: string; // "#1", "✗", etc.
  chatgpt: string;
  gemini: string;
  avgPosition: number | null;
}

export interface LLMRankings {
  platforms: LLMPlatformResult[];
  aiCitationRate: number; // percentage 0-100
  competitors: CompetitorRanking[];
}

export interface Priority {
  level: 'Immediate' | 'Strategic' | 'Long-term';
  title: string;
  currentStatus?: string;
  impact: 'High' | 'Medium' | 'Low';
  action: string;
  successMetric?: string;
  timeline?: string;
}

export interface Priorities {
  immediate: Priority[];
  strategic: Priority[];
  longTerm: Priority[];
}

export interface ParsedAudit {
  metadata: AuditMetadata;
  executiveSummary: ExecutiveSummary;
  trustNodeCoverage: TrustNodeCoverage;
  citationQuality: CitationQuality;
  llmRankings: LLMRankings;
  priorities: Priorities;
  rawMarkdown: string; // original markdown content
}

export interface AuditListItem {
  metadata: AuditMetadata;
  overallScore: number;
  trustNodePercentage: number;
  citationQuality: number;
  aiCitationRate: number;
}
