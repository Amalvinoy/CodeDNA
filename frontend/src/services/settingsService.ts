import { apiClient } from './api';
import { UserSettings, UpdateSettingsPayload } from '@/types/settings';

export class SettingsService {
  static async getSettings(): Promise<UserSettings> {
    const response = await apiClient.get<{
      success: boolean;
      data: UserSettings;
    }>('/settings');

    if (!response.data?.success || !response.data?.data) {
      throw new Error('Failed to retrieve settings');
    }

    return response.data.data;
  }

  static async updateSettings(
    payload: UpdateSettingsPayload
  ): Promise<UserSettings> {
    const response = await apiClient.patch<{
      success: boolean;
      message: string;
      data: UserSettings;
    }>('/settings', payload);

    if (!response.data?.success || !response.data?.data) {
      throw new Error(response.data?.message || 'Failed to update settings');
    }

    return response.data.data;
  }
}
