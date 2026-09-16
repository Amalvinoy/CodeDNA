import { apiClient } from './api';
import {
  User,
  LoginCredentials,
  RegisterCredentials,
  AuthResponse,
} from '@/types/auth';

export class AuthService {
  static async register(
    credentials: RegisterCredentials
  ): Promise<{ success: boolean; user?: User; message?: string }> {
    try {
      const response = await apiClient.post<AuthResponse>(
        '/auth/register',
        credentials
      );

      if (response.data?.success && response.data.data?.user) {
        if (response.data.data.token && typeof window !== 'undefined') {
          localStorage.setItem('codedna_token', response.data.data.token);
        }
        return {
          success: true,
          user: response.data.data.user,
        };
      }

      return {
        success: false,
        message: response.data?.message || 'Registration failed.',
      };
    } catch (error: any) {
      return {
        success: false,
        message:
          error.response?.data?.message ||
          'Failed to connect to authentication server.',
      };
    }
  }

  static async login(
    credentials: LoginCredentials
  ): Promise<{ success: boolean; user?: User; message?: string }> {
    try {
      const response = await apiClient.post<AuthResponse>(
        '/auth/login',
        credentials
      );

      if (response.data?.success && response.data.data?.user) {
        if (response.data.data.token && typeof window !== 'undefined') {
          localStorage.setItem('codedna_token', response.data.data.token);
        }
        return {
          success: true,
          user: response.data.data.user,
        };
      }

      return {
        success: false,
        message: response.data?.message || 'Invalid email or password.',
      };
    } catch (error: any) {
      return {
        success: false,
        message:
          error.response?.data?.message ||
          'Invalid email or password.',
      };
    }
  }

  static async logout(): Promise<void> {
    try {
      await apiClient.post('/auth/logout');
    } catch (error) {
      console.warn('Logout API error:', error);
    } finally {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('codedna_token');
      }
    }
  }

  static async getCurrentUser(): Promise<User | null> {
    try {
      const response = await apiClient.get<{
        success: boolean;
        data?: { user: User };
      }>('/auth/me');

      if (response.data?.success && response.data.data?.user) {
        return response.data.data.user;
      }
      return null;
    } catch (error) {
      return null;
    }
  }
}
