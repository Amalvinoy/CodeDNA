'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import {
  Settings,
  User as UserIcon,
  Key,
  Sliders,
  Shield,
  Save,
  Check,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import { SettingsService } from '@/services/settingsService';
import { useAuth } from '@/context/AuthContext';

export default function SettingsPage() {
  const { refreshUser } = useAuth();
  const [activeTab, setActiveTab] = useState<'profile' | 'review' | 'api' | 'security'>('profile');
  
  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [primaryRole, setPrimaryRole] = useState('');
  const [engineeringFocus, setEngineeringFocus] = useState('');
  const [strictMode, setStrictMode] = useState(true);
  const [autoFix, setAutoFix] = useState(true);
  const [predictiveAlerts, setPredictiveAlerts] = useState(true);

  // Status State
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load Settings from Backend
  const loadSettings = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await SettingsService.getSettings();
      setName(data.name || '');
      setEmail(data.email || '');
      setPrimaryRole(data.primaryRole || 'Fullstack Developer');
      setEngineeringFocus(data.engineeringFocus || 'TypeScript, Node.js');
      setStrictMode(data.preferences?.strictMode ?? true);
      setAutoFix(data.preferences?.autoFix ?? true);
      setPredictiveAlerts(data.preferences?.predictiveAlerts ?? true);
    } catch (err: any) {
      console.error('Failed to load settings:', err);
      setError(err.response?.data?.message || err.message || 'Failed to load settings.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  // Real Save Handler
  const handleSave = async () => {
    try {
      setIsSaving(true);
      setError(null);
      
      const updated = await SettingsService.updateSettings({
        name,
        primaryRole,
        engineeringFocus,
        preferences: {
          strictMode,
          autoFix,
          predictiveAlerts,
        },
      });

      // Update local state with confirmed backend data
      setName(updated.name);
      setPrimaryRole(updated.primaryRole);
      setEngineeringFocus(updated.engineeringFocus);
      setStrictMode(updated.preferences.strictMode);
      setAutoFix(updated.preferences.autoFix);
      setPredictiveAlerts(updated.preferences.predictiveAlerts);

      // Refresh global auth user if name changed
      await refreshUser();

      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err: any) {
      console.error('Failed to save settings:', err);
      setError(err.response?.data?.message || err.message || 'Failed to save settings.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <AppLayout>
      <div className="space-y-6 max-w-4xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
              <span>Settings</span>
              <Settings className="w-6 h-6 text-[#38bdf8]" />
            </h1>
            <p className="text-xs font-mono text-[#64748b] mt-1">
              Configure your developer profile, analysis preferences, and API integrations.
            </p>
          </div>

          <button
            onClick={handleSave}
            disabled={isLoading || isSaving}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#56b6f7] hover:bg-[#38bdf8] disabled:opacity-50 text-[#030712] font-mono font-bold text-xs transition-all active:scale-[0.98]"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Saving...</span>
              </>
            ) : saved ? (
              <>
                <Check className="w-4 h-4" />
                <span>Saved!</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save Changes</span>
              </>
            )}
          </button>
        </div>

        {/* Error Feedback */}
        {error && (
          <div className="flex items-center gap-2 p-3 bg-red-950/40 border border-red-800/50 rounded-lg text-red-300 text-xs font-mono">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-[#172033] pb-2">
          {[
            { id: 'profile', label: 'Developer Profile', icon: UserIcon },
            { id: 'review', label: 'Review Engine', icon: Sliders },
            { id: 'api', label: 'API Keys', icon: Key },
            { id: 'security', label: 'Security & Auth', icon: Shield },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-mono transition-all ${
                  isActive
                    ? 'bg-[#131d2e] text-[#38bdf8] font-bold border border-[#1e3e60]'
                    : 'text-[#94a3b8] hover:text-white hover:bg-[#0c1322]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        {isLoading ? (
          <div className="bg-[#0b101b] border border-[#162032] rounded-xl p-12 flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-6 h-6 text-[#38bdf8] animate-spin" />
            <span className="text-xs font-mono text-[#64748b]">Loading configuration...</span>
          </div>
        ) : (
          <>
            {activeTab === 'profile' && (
              <div className="bg-[#0b101b] border border-[#162032] rounded-xl p-6 space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-base font-bold text-white tracking-tight">
                    Developer Information
                  </h2>
                  <span className="text-[11px] font-mono text-[#64748b]">
                    Account: <span className="text-[#94a3b8]">{email}</span>
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono text-[#94a3b8]">Display Name</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your name"
                      className="w-full px-3.5 py-2 bg-[#080d16] border border-[#172235] rounded-lg text-xs font-mono text-white focus:outline-none focus:border-[#38bdf8]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-mono text-[#94a3b8]">Primary Role</label>
                    <input
                      type="text"
                      value={primaryRole}
                      onChange={(e) => setPrimaryRole(e.target.value)}
                      placeholder="e.g. Senior Fullstack Architect"
                      className="w-full px-3.5 py-2 bg-[#080d16] border border-[#172235] rounded-lg text-xs font-mono text-white focus:outline-none focus:border-[#38bdf8]"
                    />
                  </div>

                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="text-xs font-mono text-[#94a3b8]">Engineering Focus & Ecosystems</label>
                    <input
                      type="text"
                      value={engineeringFocus}
                      onChange={(e) => setEngineeringFocus(e.target.value)}
                      placeholder="e.g. TypeScript, Node.js, Python, Go, Cloud Architecture"
                      className="w-full px-3.5 py-2 bg-[#080d16] border border-[#172235] rounded-lg text-xs font-mono text-white focus:outline-none focus:border-[#38bdf8]"
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'review' && (
              <div className="bg-[#0b101b] border border-[#162032] rounded-xl p-6 space-y-6">
                <h2 className="text-base font-bold text-white tracking-tight">
                  Review & Analysis Preferences
                </h2>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3.5 bg-[#080d16] border border-[#172033] rounded-lg">
                    <div>
                      <div className="text-xs font-bold text-white">Strict OWASP Top 10 Enforcement</div>
                      <div className="text-[11px] text-[#64748b] mt-0.5">Flag potential vulnerabilities even in internal scripts.</div>
                    </div>
                    <input
                      type="checkbox"
                      checked={strictMode}
                      onChange={(e) => setStrictMode(e.target.checked)}
                      className="w-4 h-4 accent-[#38bdf8] cursor-pointer"
                    />
                  </div>

                  <div className="flex items-center justify-between p-3.5 bg-[#080d16] border border-[#172033] rounded-lg">
                    <div>
                      <div className="text-xs font-bold text-white">Automated AST Fix Suggestions</div>
                      <div className="text-[11px] text-[#64748b] mt-0.5">Generate 1-click refactoring diffs for detected anti-patterns.</div>
                    </div>
                    <input
                      type="checkbox"
                      checked={autoFix}
                      onChange={(e) => setAutoFix(e.target.checked)}
                      className="w-4 h-4 accent-[#38bdf8] cursor-pointer"
                    />
                  </div>

                  <div className="flex items-center justify-between p-3.5 bg-[#080d16] border border-[#172033] rounded-lg">
                    <div>
                      <div className="text-xs font-bold text-white">Predictive Risk Forecast Notifications</div>
                      <div className="text-[11px] text-[#64748b] mt-0.5">Alert before merging code with high historical regression probability.</div>
                    </div>
                    <input
                      type="checkbox"
                      checked={predictiveAlerts}
                      onChange={(e) => setPredictiveAlerts(e.target.checked)}
                      className="w-4 h-4 accent-[#38bdf8] cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'api' && (
              <div className="bg-[#0b101b] border border-[#162032] rounded-xl p-6 space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-base font-bold text-white tracking-tight">
                    API & LLM Integrations
                  </h2>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#162032] text-[#94a3b8] border border-[#1e293b]">
                    Server Environment Managed
                  </span>
                </div>

                <div className="space-y-4">
                  <div className="p-3.5 bg-[#080d16] border border-[#172033] rounded-lg flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-white">LLM Provider API Key</div>
                      <div className="text-[11px] text-[#64748b] mt-0.5 font-mono">Managed securely via backend environment variables</div>
                    </div>
                    <span className="px-2.5 py-1 bg-[#101827] border border-[#1e293b] text-xs font-mono text-[#94a3b8] rounded">
                      Not configured
                    </span>
                  </div>

                  <div className="p-3.5 bg-[#080d16] border border-[#172033] rounded-lg flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-white">GitHub Access Token (PR Analysis)</div>
                      <div className="text-[11px] text-[#64748b] mt-0.5 font-mono">Personal access token for automated repository scans</div>
                    </div>
                    <span className="px-2.5 py-1 bg-[#101827] border border-[#1e293b] text-xs font-mono text-[#94a3b8] rounded">
                      Not configured
                    </span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="bg-[#0b101b] border border-[#162032] rounded-xl p-6 space-y-6">
                <h2 className="text-base font-bold text-white tracking-tight">
                  Security & Active Sessions
                </h2>

                <div className="space-y-3">
                  <div className="p-3.5 bg-[#080d16] border border-[#172033] rounded-lg flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-white">Two-Factor Authentication (2FA)</div>
                      <div className="text-[11px] text-[#94a3b8] mt-0.5 font-mono">Not configured</div>
                    </div>
                    <span className="px-3 py-1 bg-[#101827] border border-[#1e293b] text-xs font-mono text-[#64748b] rounded">
                      Not configured
                    </span>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </AppLayout>
  );
}
