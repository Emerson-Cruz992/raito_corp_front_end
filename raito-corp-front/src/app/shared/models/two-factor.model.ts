/**
 * Modelo para configuração de autenticação de dois fatores (2FA)
 */

export interface TwoFactorConfig {
  userId: number;
  enabled: boolean;
  secret?: string;
  backupCodes?: string[];
  createdAt?: Date;
  lastUsedAt?: Date;
}

export interface TwoFactorSetup {
  secret: string;
  qrCodeUrl: string;
  manualEntryKey: string;
  backupCodes: string[];
}

export interface TwoFactorLoginRequest {
  email: string;
  password: string;
  twoFactorCode?: string;
  backupCode?: string;
}

export interface TwoFactorLoginResponse {
  requiresTwoFactor: boolean;
  userId?: number;
  tempToken?: string;
  accessToken?: string;
  refreshToken?: string;
}
