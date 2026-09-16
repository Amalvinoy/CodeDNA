import { apiClient } from './api';
import { DeveloperDnaProfile } from '@/types';

export class DnaService {
  static getCodeDnaProfile = DnaService.getDnaProfile;

  static async getDnaProfile(): Promise<DeveloperDnaProfile | null> {
    try {
      const response = await apiClient.get<{ success: boolean; data: any }>('/dna');
      if (response.data?.success && response.data.data) {
        const d = response.data.data;
        return {
          overallScore: d.overallScore || 0,
          maxScore: d.maxScore || 100,
          improvementMonthPercent: d.improvementMonthPercent || 0,
          level: d.level || 1,
          levelTitle: d.levelTitle || 'JUNIOR DEVELOPER',
          progressToNextLevel: d.progressToNextLevel || 20,
          attributes: {
            security: d.attributes?.security ?? 0,
            correctness: d.attributes?.correctness ?? 0,
            maintainability: d.attributes?.maintainability ?? 0,
            architecture: d.attributes?.architecture ?? 0,
            performance: d.attributes?.performance ?? 0,
          },
          metrics: {
            codeComplexity: d.metrics?.codeComplexity ?? 0,
            testCoverage: d.metrics?.testCoverage ?? 0,
            modularity: d.metrics?.modularity ?? 0,
            recurringBugFrequency: d.metrics?.recurringBugFrequency ?? 0,
            codeEfficiency: d.metrics?.codeEfficiency ?? 0,
          },
          strengths: (d.strengths || []).map((s: any, idx: number) => ({
            id: s.id || `str-${idx}`,
            title: s.title,
            percentile: s.percentile || 'Top 10%',
            description: s.description,
            color: s.color || 'green',
          })),
          areasForOptimization: (d.areasForOptimization || d.recurringWeaknesses || []).map((w: any, idx: number) => ({
            id: w.id || w.key || `opt-${idx}`,
            title: w.title,
            priority: w.priority || (w.occurrenceCount >= 3 ? 'High Priority' : 'Medium Priority'),
            description: w.description,
            occurrenceCount: typeof w.occurrenceCount === 'number' ? w.occurrenceCount : 2,
          })),
          evolutionTrajectory: d.evolutionTrajectory || [],
          patternHistory: (d.patternHistory || []).map((p: any) => ({
            category: p.category,
            pastFrequency: p.pastFrequency || 0,
            currentFrequency: p.currentFrequency || 0,
          })),
          languages: (d.languages || []).map((l: any) => ({
            language: l.language,
            percentage: l.percentage,
            count: l.count,
          })),
          reviewCount: d.reviewCount ?? 0,
        };
      }
      return null;
    } catch (error: any) {
      console.error('API fetch DNA profile error:', error);
      throw error;
    }
  }

  static async getDnaSummary(): Promise<any> {
    try {
      const response = await apiClient.get<{ success: boolean; data: any }>('/dna/summary');
      if (response.data?.success) {
        return response.data.data;
      }
      return null;
    } catch (error) {
      console.warn('API fetch DNA summary fallback:', error);
      return null;
    }
  }

  static async rebuildDna(): Promise<DeveloperDnaProfile | null> {
    try {
      const response = await apiClient.post<{ success: boolean; data: any }>('/dna/rebuild');
      if (response.data?.success) {
        return await this.getDnaProfile();
      }
      return null;
    } catch (error) {
      console.error('API rebuild DNA error:', error);
      return null;
    }
  }
}
