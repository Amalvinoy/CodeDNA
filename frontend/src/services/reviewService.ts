import { apiClient } from './api';
import { ReviewItem, CodeFinding, FindingCategory, FindingSeverity } from '@/types';

export interface SubmitReviewRequest {
  language: string;
  fileName?: string;
  sourceCode: string;
}

/**
 * Explicit adapter for normalizing backend findings to CodeFinding
 */
export function adaptBackendFinding(raw: any, defaultFileName = 'source.code'): CodeFinding {
  const categoryStr = (raw.category || 'correctness').toString().toLowerCase();
  const validCategories: FindingCategory[] = [
    'correctness',
    'security',
    'performance',
    'architecture',
    'maintainability',
    'style',
  ];
  const category: FindingCategory = validCategories.includes(categoryStr as FindingCategory)
    ? (categoryStr as FindingCategory)
    : 'correctness';

  const severityStr = (raw.severity || 'medium').toString().toLowerCase();
  const validSeverities: FindingSeverity[] = ['critical', 'high', 'medium', 'low', 'info'];
  const severity: FindingSeverity = validSeverities.includes(severityStr as FindingSeverity)
    ? (severityStr as FindingSeverity)
    : 'medium';

  const lineStart = Number(raw.lineStart || raw.line || 1);
  const lineEnd = raw.lineEnd || raw.endLine || lineStart;
  const fileName = raw.fileName || raw.file || defaultFileName;

  return {
    id: String(raw.id || raw._id || Math.random().toString(36).substring(2, 9)),
    category,
    severity,
    title: String(raw.title || 'Code Issue'),
    description: raw.description || raw.whyItMatters || '',
    fileName,
    file: fileName,
    lineStart,
    line: lineStart,
    lineEnd,
    endLine: lineEnd,
    columnStart: raw.columnStart,
    columnEnd: raw.columnEnd,
    codeSnippet: raw.codeSnippet || '',
    whyItMatters: raw.whyItMatters || raw.description || '',
    suggestedFix: raw.suggestedFix || '',
    confidence: raw.confidence,
    historicalRuleId: raw.historicalRuleId,
    historicalMatch: raw.historicalMatch,
    historicalSimilarity: raw.historicalSimilarity,
    historicalMatchPercent:
      raw.historicalMatchPercent !== undefined
        ? raw.historicalMatchPercent
        : raw.confidence
        ? Math.round(raw.confidence * 100)
        : undefined,
    codeContextSnippet: raw.codeContextSnippet,
  };
}

/**
 * Explicit adapter for normalizing backend review responses to ReviewItem
 */
export function adaptBackendReview(raw: any): ReviewItem {
  const fileName = raw.fileName || raw.file || 'source.code';
  const rawFindings = Array.isArray(raw.findings)
    ? raw.findings
    : Array.isArray(raw.issues)
    ? raw.issues
    : [];

  const findings: CodeFinding[] = rawFindings.map((f: any) => adaptBackendFinding(f, fileName));

  const criticalCount =
    typeof raw.criticalCount === 'number'
      ? raw.criticalCount
      : findings.filter((f: CodeFinding) => f.severity === 'critical').length;
  const warningCount =
    typeof raw.warningCount === 'number'
      ? raw.warningCount
      : findings.filter((f: CodeFinding) => f.severity === 'high' || f.severity === 'medium').length;

  const status =
    criticalCount > 0 ? 'Critical' : warningCount > 0 ? 'Warning' : 'Clean';

  return {
    id: String(raw.reviewIdString || raw._id || raw.id || ''),
    reviewIdString: raw.reviewIdString,
    title: raw.fileName ? `${raw.fileName} Review` : raw.title || 'Code Review',
    aiSummary: raw.aiSummary || '',
    fileName,
    file: fileName,
    language: (raw.language || 'TS').toUpperCase(),
    sourceCode: raw.sourceCode,
    qualityScore: typeof raw.qualityScore === 'number' ? raw.qualityScore : 8.0,
    scoreDelta: typeof raw.scoreDelta === 'number' ? raw.scoreDelta : 0,
    issuesCount: typeof raw.issuesCount === 'number' ? raw.issuesCount : findings.length,
    criticalCount,
    warningCount,
    status,
    timestamp: raw.createdAt ? new Date(raw.createdAt).toLocaleDateString() : 'Recently',
    findings,
    issues: findings,
  };
}

export class ReviewService {
  static async submitReview(
    payload: SubmitReviewRequest
  ): Promise<{ success: boolean; data?: ReviewItem; message?: string }> {
    try {
      const response = await apiClient.post<{
        success: boolean;
        message?: string;
        data: any;
      }>('/reviews', payload);

      if (response.data?.success && response.data.data) {
        return {
          success: true,
          data: adaptBackendReview(response.data.data),
        };
      }

      return {
        success: false,
        message: response.data?.message || 'Review failed.',
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to submit review.',
      };
    }
  }

  static async getReviews(page = 1, limit = 20): Promise<ReviewItem[]> {
    try {
      const response = await apiClient.get<{
        success: boolean;
        data: any[];
      }>(`/reviews?page=${page}&limit=${limit}`);

      if (response.data?.success && Array.isArray(response.data.data)) {
        return response.data.data.map(adaptBackendReview);
      }
      return [];
    } catch (error) {
      console.warn('API fetch reviews error:', error);
      return [];
    }
  }

  static async getReviewById(id: string): Promise<ReviewItem | null> {
    try {
      const response = await apiClient.get<{
        success: boolean;
        data: any;
      }>(`/reviews/${id}`);

      if (response.data?.success && response.data.data) {
        return adaptBackendReview(response.data.data);
      }
      return null;
    } catch (error) {
      console.warn(`API fetch review ${id} error:`, error);
      return null;
    }
  }

  static async deleteReview(id: string): Promise<boolean> {
    try {
      const response = await apiClient.delete<{ success: boolean }>(`/reviews/${id}`);
      return Boolean(response.data?.success);
    } catch (error) {
      console.error(`API delete review ${id} error:`, error);
      return false;
    }
  }
}
