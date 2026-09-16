'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import {
  User,
  LoginCredentials,
  RegisterCredentials,
  AuthContextType,
} from '@/types/auth';
import { AuthService } from '@/services/authService';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const PUBLIC_ROUTES = ['/', '/login', '/register'];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const router = useRouter();
  const pathname = usePathname();

  const refreshUser = useCallback(async () => {
    try {
      const currentUser = await AuthService.getCurrentUser();
      setUser(currentUser);
    } catch {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  // Route guard effect
  useEffect(() => {
    if (isLoading) return;

    const isPublic = PUBLIC_ROUTES.includes(pathname || '/');

    if (!user && !isPublic) {
      router.push('/login');
    }
  }, [user, isLoading, pathname, router]);

  const login = async (credentials: LoginCredentials) => {
    setIsLoading(true);
    const result = await AuthService.login(credentials);
    if (result.success && result.user) {
      setUser(result.user);
      setIsLoading(false);
      return { success: true };
    }
    setIsLoading(false);
    return { success: false, message: result.message || 'Login failed.' };
  };

  const register = async (credentials: RegisterCredentials) => {
    setIsLoading(true);
    const result = await AuthService.register(credentials);
    if (result.success && result.user) {
      setUser(result.user);
      setIsLoading(false);
      return { success: true };
    }
    setIsLoading(false);
    return { success: false, message: result.message || 'Registration failed.' };
  };

  const logout = async () => {
    setIsLoading(true);
    await AuthService.logout();
    setUser(null);
    setIsLoading(false);
    router.push('/login');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
