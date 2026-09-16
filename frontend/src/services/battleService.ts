import { apiClient } from './api';
import { CodeBattleData } from '@/types';

export class BattleService {
  static async getCodeBattleData(): Promise<CodeBattleData | null> {
    try {
      const response = await apiClient.get<{ success: boolean; data: CodeBattleData }>('/battle');
      if (response.data?.success && response.data.data) {
        return response.data.data;
      }
      return null;
    } catch (error) {
      console.warn('API fetch code battle data fallback:', error);
      return null;
    }
  }

  static async generateBattle(payload: {
    file: string;
    language: string;
    originalCode: string;
  }): Promise<CodeBattleData> {
    try {
      const response = await apiClient.post<{ success: boolean; data: CodeBattleData; message?: string }>(
        '/battle/generate',
        payload
      );
      if (response.data?.success && response.data.data) {
        return response.data.data;
      }
      throw new Error(response.data?.message || 'Failed to generate code battle');
    } catch (error: any) {
      const msg = error.response?.data?.message || error.message || 'Failed to generate code battle';
      const err: any = new Error(msg);
      err.status = error.response?.status;
      throw err;
    }
  }

  static async submitDefense(reasoning: string): Promise<{
    success: boolean;
    evaluation: string;
    pointsAwarded?: number;
    message?: string;
  }> {
    try {
      const response = await apiClient.post<{
        success: boolean;
        data: {
          success: boolean;
          evaluation?: string;
          aiFeedback?: string;
          message?: string;
          pointsAwarded?: number;
        };
      }>('/battle/defense', { reasoning });

      if (response.data?.data) {
        return {
          success: response.data.data.success,
          evaluation:
            response.data.data.evaluation ||
            response.data.data.aiFeedback ||
            response.data.data.message ||
            'Defense rationale evaluated.',
          pointsAwarded: response.data.data.pointsAwarded,
          message: response.data.data.message,
        };
      }
      throw new Error('No defense evaluation data returned from server.');
    } catch (error: any) {
      const msg = error.response?.data?.message || error.message || 'Defense evaluation failed';
      throw new Error(msg);
    }
  }
}
