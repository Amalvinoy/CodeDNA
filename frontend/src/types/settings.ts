export interface AnalysisPreferences {
  strictMode: boolean;
  autoFix: boolean;
  predictiveAlerts: boolean;
}

export interface UserSettings {
  name: string;
  email: string;
  avatar: string;
  primaryRole: string;
  engineeringFocus: string;
  preferences: AnalysisPreferences;
}

export interface UpdateSettingsPayload {
  name?: string;
  avatar?: string;
  primaryRole?: string;
  engineeringFocus?: string;
  preferences?: Partial<AnalysisPreferences>;
}
