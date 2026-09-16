import { apiClient } from './api';
import { DeveloperXpData, TechnicalBadge } from '@/types';

export interface AchievementsData {
  xp: DeveloperXpData;
  improvementStreak: number;
  milestones: {
    id: string;
    title: string;
    category: string;
    xpReward: string;
    completed: boolean;
    date?: string;
    progress?: string;
  }[];
  badges: TechnicalBadge[];
}

export class AchievementService {
  static async getAchievements(): Promise<AchievementsData | null> {
    try {
      const response = await apiClient.get<{ success: boolean; data: any }>('/achievements');
      if (response.data?.success && response.data.data) {
        const d = response.data.data;
        return {
          xp: {
            level: d.level ?? 1,
            levelTitle: d.levelTitle || 'Junior Developer',
            currentXp: d.currentXp ?? 0,
            targetXp: d.targetXp ?? 1000,
            nextLevel: (d.level ?? 1) + 1,
          },
          improvementStreak: d.improvementStreak ?? 0,
          milestones: d.milestones || [],
          badges: d.badges || [],
        };
      }
      return null;
    } catch (error) {
      console.warn('API fetch achievements fallback:', error);
      return null;
    }
  }
}
