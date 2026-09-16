export type FindingCategory =
  | 'correctness'
  | 'security'
  | 'performance'
  | 'architecture'
  | 'maintainability'
  | 'style';

export type FindingSeverity =
  | 'critical'
  | 'high'
  | 'medium'
  | 'low'
  | 'info';

// Backward-compatibility alias
export type IssueSeverity = FindingSeverity;

export interface CodeFinding {
  id: string;
  category: FindingCategory;
  severity: FindingSeverity;
  title: string;
  description?: string;
  fileName: string;
  file: string; // alias
  lineStart: number;
  line: number; // alias
  lineEnd?: number;
  endLine?: number; // alias
  columnStart?: number;
  columnEnd?: number;
  codeSnippet: string;
  whyItMatters: string;
  suggestedFix: string;
  confidence?: number;
  historicalRuleId?: string;
  historicalMatch?: boolean;
  historicalSimilarity?: number;
  historicalMatchPercent?: number;
  codeContextSnippet?: {
    startLine: number;
    lines: {
      lineNumber: number;
      code: string;
      isHighlighted?: boolean;
    }[];
  };
}

// Backward-compatibility alias
export type CodeIssue = CodeFinding;

export interface ReviewItem {
  id: string;
  reviewIdString?: string;
  title: string;
  aiSummary: string;
  fileName: string;
  file: string; // alias
  language: string;
  sourceCode?: string;
  qualityScore: number;
  scoreDelta: number;
  issuesCount: number;
  criticalCount: number;
  warningCount: number;
  status: 'Clean' | 'Critical' | 'Warning' | 'pending' | 'analyzing' | 'completed' | 'failed';
  timestamp: string;
  findings: CodeFinding[];
  issues: CodeFinding[]; // alias
}

export interface AttributeScore {
  name: string;
  label: string;
  score: number;
  fullMark: number;
}

export interface DeveloperDnaProfile {
  overallScore: number;
  maxScore: number;
  improvementMonthPercent: number;
  level: number;
  levelTitle: string;
  progressToNextLevel: number;
  attributes: {
    security: number;
    correctness: number;
    maintainability: number;
    architecture: number;
    performance: number;
  };
  metrics: {
    codeComplexity: number;
    testCoverage: number;
    modularity: number;
    recurringBugFrequency: number;
    codeEfficiency: number;
  };
  strengths: {
    id: string;
    title: string;
    percentile: string;
    description: string;
    color: 'green' | 'blue';
  }[];
  areasForOptimization: {
    id: string;
    title: string;
    priority: 'High Priority' | 'Medium Priority' | 'Low Priority';
    description: string;
    occurrenceCount?: number;
  }[];
  evolutionTrajectory: {
    month: string;
    score: number;
  }[];
  patternHistory: {
    category: string;
    pastFrequency: number;
    currentFrequency: number;
  }[];
  languages?: {
    language: string;
    percentage: number;
    count?: number;
  }[];
  reviewCount?: number;
}

export interface RecurringPattern {
  id: string;
  name: string;
  instances: number;
  severity: 'high' | 'medium' | 'low';
}

export interface RiskForecastItem {
  id: string;
  category: string;
  level: 'HIGH' | 'MEDIUM' | 'LOW';
  score: number;
}

// PASS 2 TYPES

export interface CodeBattleData {
  file: string;
  originalCode: string;
  optimizedCode: string;
  originalScore: number;
  optimizedScore: number;
  scoreDelta?: number;
  winner?: 'Original' | 'AI Optimization' | 'Tie';
  complexityOriginal: string;
  complexityOptimized: string;
  originalFindings?: any[];
  optimizedFindings?: any[];
  metrics: {
    security: { original: number; optimized: number };
    performance: { original: number; optimized: number };
    maintainability: { original: number; optimized: number };
  };
  winnerExplanation: string;
  summary?: string;
  changes?: Array<{ category: string; explanation: string }>;
}

export interface PredictiveRiskData {
  repository: string;
  prNumber: string;
  lastScanned: string;
  overallCategory: string;
  riskPercent: number;
  riskLevel: 'HIGH' | 'MEDIUM' | 'LOW';
  recommendation: string;
  confidencePercent: number;
  primaryFactors: {
    id: string;
    label: string;
    impactPercent: number;
    color: 'red' | 'amber' | 'cyan';
  }[];
  diagnosticReasoning: {
    summary: string;
    affectedClass: string;
    historicalEvidence: {
      occurrences: number;
      sampleReviews: number;
      productionAlerts: number;
      timeframe: string;
    };
    incidentTimeline: {
      id: string;
      pr: string;
      title: string;
      timeAgo: string;
      description: string;
      severity: 'red' | 'amber' | 'green';
    }[];
    targetFile: string;
    targetLines: string;
  };
}

export interface HistoryLogItem {
  id: string;
  reqNumber: string;
  service: string;
  title: string;
  timeAgo: string;
  score: number;
  summary: string;
  diffSnippet?: {
    removed: string;
    added: string;
  };
  badges: {
    label: string;
    type: 'security-pass' | 'perf-opt' | 'critical-risk' | 'warning-risk';
  }[];
}

export interface DeveloperXpData {
  level: number;
  levelTitle: string;
  currentXp: number;
  targetXp: number;
  nextLevel: number;
}

export interface TechnicalBadge {
  id: string;
  title: string;
  subtitle: string;
  icon: 'database' | 'bug' | 'speed' | 'cloud' | 'shield' | 'flame';
  isUnlocked: boolean;
  unlockedAt?: string;
}

export interface MemoryRuleItem {
  id: string;
  title: string;
  category: string;
  description: string;
  matchPercent: number;
  occurrenceCount: number;
  learnedFrom: string;
  lastEnforced: string;
  preventionRate: number;
}
