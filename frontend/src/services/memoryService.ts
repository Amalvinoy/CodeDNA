import { apiClient } from './api';
import { MemoryRuleItem } from '@/types';

export interface HistoricalRuleQuery {
  category?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export class MemoryService {
  static async getMemoryRules(query: HistoricalRuleQuery = {}): Promise<MemoryRuleItem[]> {
    try {
      const params = new URLSearchParams();
      if (query.category && query.category !== 'All') params.set('category', query.category.toLowerCase());
      if (query.search) params.set('search', query.search);
      if (query.page) params.set('page', query.page.toString());
      if (query.limit) params.set('limit', query.limit.toString());

      const url = `/historical-rules?${params.toString()}`;
      const response = await apiClient.get<{ success: boolean; data: any[] }>(url);

      if (response.data?.success && Array.isArray(response.data.data)) {
        return response.data.data.map((r: any) => ({
          id: r.externalId || r._id,
          title: r.description,
          description: r.description,
          category: (r.type || 'GENERAL').toUpperCase(),
          matchPercent: r.metadata?.matchPercent || 95,
          occurrenceCount: r.metadata?.occurrenceCount || 1,
          learnedFrom: r.metadata?.learnedFrom || 'Engineering Review Knowledge Base',
          lastEnforced: r.metadata?.lastEnforced || 'Recently',
          preventionRate: r.metadata?.preventionRate || 98,
        }));
      }
      return [];
    } catch (error) {
      console.warn('API fetch historical rules fallback:', error);
      return [];
    }
  }

  static async getReviewHistoricalContext(reviewId: string): Promise<any> {
    try {
      const response = await apiClient.get<{ success: boolean; data: any }>(
        `/reviews/${reviewId}/historical-context`
      );
      if (response.data?.success) {
        return response.data.data;
      }
      return null;
    } catch (error) {
      console.warn(`Failed to fetch historical context for review ${reviewId}:`, error);
      return null;
    }
  }
}
