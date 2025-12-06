import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

export interface TwoFactorSetupResponse {
  secret: string;
  qrCodeUrl: string;
  backupCodes: string[];
}

export interface TwoFactorVerifyRequest {
  userId: number;
  token: string;
}

export interface TwoFactorVerifyResponse {
  valid: boolean;
  message?: string;
}

@Injectable({
  providedIn: 'root'
})
export class TwoFactorAuthService {
  private readonly endpoint = '/2fa';

  constructor(private api: ApiService) {}

  /**
   * Inicia o processo de configuração do 2FA
   * Retorna o secret e QR code para o usuário escanear
   */
  setup(userId: number): Observable<TwoFactorSetupResponse> {
    return this.api.post<TwoFactorSetupResponse>(`${this.endpoint}/setup`, { userId });
  }

  /**
   * Verifica e ativa o 2FA com o código TOTP
   */
  enable(userId: number, token: string): Observable<{ success: boolean; backupCodes: string[] }> {
    return this.api.post<{ success: boolean; backupCodes: string[] }>(
      `${this.endpoint}/enable`,
      { userId, token }
    );
  }

  /**
   * Desativa o 2FA (requer senha ou código de backup)
   */
  disable(userId: number, password: string): Observable<{ success: boolean }> {
    return this.api.post<{ success: boolean }>(
      `${this.endpoint}/disable`,
      { userId, password }
    );
  }

  /**
   * Verifica um código TOTP durante o login
   */
  verify(userId: number, token: string): Observable<TwoFactorVerifyResponse> {
    return this.api.post<TwoFactorVerifyResponse>(`${this.endpoint}/verify`, { userId, token });
  }

  /**
   * Usa um código de backup para login
   */
  useBackupCode(userId: number, backupCode: string): Observable<{ success: boolean }> {
    return this.api.post<{ success: boolean }>(
      `${this.endpoint}/backup-code`,
      { userId, backupCode }
    );
  }

  /**
   * Gera novos códigos de backup
   */
  regenerateBackupCodes(userId: number): Observable<{ backupCodes: string[] }> {
    return this.api.post<{ backupCodes: string[] }>(
      `${this.endpoint}/regenerate-backup-codes`,
      { userId }
    );
  }

  /**
   * Verifica se o 2FA está habilitado para um usuário
   */
  isEnabled(userId: number): Observable<{ enabled: boolean }> {
    return this.api.get<{ enabled: boolean }>(`${this.endpoint}/status/${userId}`);
  }

  /**
   * Gera um código TOTP no lado do cliente (para demonstração)
   * NOTA: Em produção, a verificação deve SEMPRE ser no backend
   */
  generateTOTP(secret: string): string {
    // Esta função é apenas para demonstração
    // Em produção real, use uma biblioteca como 'otplib' ou similar
    const time = Math.floor(Date.now() / 1000 / 30);
    return `${time % 1000000}`.padStart(6, '0');
  }

  /**
   * Valida o formato de um código TOTP
   */
  isValidTOTPFormat(token: string): boolean {
    return /^\d{6}$/.test(token);
  }
}
