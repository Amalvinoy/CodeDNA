import { apiClient } from './api';

export interface HealthCheckResponse {
  success: boolean;
  service: string;
  status: string;
  database?: {
    status: 'connected' | 'disconnected';
  };
}

export class HealthService {
  static async checkHealth(): Promise<HealthCheckResponse> {
    try {
      const response = await apiClient.get<HealthCheckResponse>('/health');
      return response.data;
    } catch (error) {
      return {
        success: false,
        service: 'code-dna-backend',
        status: 'unreachable',
        database: {
          status: 'disconnected',
        },
      };
    }
  }
}
