import { apiClient } from './api';
import { PredictiveRiskData } from '@/types';

export class RiskService {
  static async getPredictiveRisk(): Promise<PredictiveRiskData | null> {
    try {
      const response = await apiClient.get<{ success: boolean; data: PredictiveRiskData }>('/risk');
      if (response.data?.success && response.data.data) {
        return response.data.data;
      }
      return null;
    } catch (error) {
      console.warn('API fetch predictive risk fallback:', error);
      return null;
    }
  }

  static async forecastRisk(payload: {
    language: string;
    fileName: string;
    sourceCode: string;
  }): Promise<PredictiveRiskData> {
    try {
      const response = await apiClient.post<{ success: boolean; data: PredictiveRiskData; message?: string }>(
        '/risk/forecast',
        payload
      );
      if (response.data?.success && response.data.data) {
        return response.data.data;
      }
      throw new Error(response.data?.message || 'Failed to forecast risk');
    } catch (error: any) {
      const msg = error.response?.data?.message || error.message || 'Risk forecast failed';
      const err: any = new Error(msg);
      err.status = error.response?.status;
      throw err;
    }
  }
}
