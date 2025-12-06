import { Injectable } from '@angular/core';

interface RateLimitConfig {
  maxAttempts: number;
  windowMs: number;
  blockDurationMs: number;
}

interface AttemptRecord {
  count: number;
  firstAttempt: number;
  blockedUntil?: number;
}

@Injectable({
  providedIn: 'root'
})
export class RateLimiterService {
  private attempts = new Map<string, AttemptRecord>();

  private readonly configs: { [key: string]: RateLimitConfig } = {
    login: {
      maxAttempts: 5,
      windowMs: 15 * 60 * 1000, // 15 minutos
      blockDurationMs: 30 * 60 * 1000 // 30 minutos
    },
    twoFactor: {
      maxAttempts: 3,
      windowMs: 10 * 60 * 1000, // 10 minutos
      blockDurationMs: 60 * 60 * 1000 // 1 hora
    },
    passwordReset: {
      maxAttempts: 3,
      windowMs: 60 * 60 * 1000, // 1 hora
      blockDurationMs: 2 * 60 * 60 * 1000 // 2 horas
    },
    api: {
      maxAttempts: 60,
      windowMs: 60 * 1000, // 1 minuto
      blockDurationMs: 5 * 60 * 1000 // 5 minutos
    }
  };

  constructor() {
    // Limpa registros antigos a cada 5 minutos
    setInterval(() => this.cleanup(), 5 * 60 * 1000);
  }

  /**
   * Verifica se uma ação pode ser executada
   * @param key Identificador único (ex: email do usuário, IP, etc)
   * @param action Tipo de ação (login, twoFactor, etc)
   * @returns true se permitido, false se bloqueado
   */
  checkLimit(key: string, action: keyof typeof this.configs = 'api'): {
    allowed: boolean;
    remainingAttempts?: number;
    blockedUntil?: Date;
    retryAfter?: number;
  } {
    const config = this.configs[action];
    const recordKey = `${action}:${key}`;
    const now = Date.now();

    let record = this.attempts.get(recordKey);

    // Verifica se está bloqueado
    if (record?.blockedUntil && record.blockedUntil > now) {
      return {
        allowed: false,
        blockedUntil: new Date(record.blockedUntil),
        retryAfter: Math.ceil((record.blockedUntil - now) / 1000)
      };
    }

    // Se não há registro ou a janela expirou, cria novo
    if (!record || (now - record.firstAttempt) > config.windowMs) {
      record = {
        count: 0,
        firstAttempt: now
      };
      this.attempts.set(recordKey, record);
    }

    // Incrementa tentativas
    record.count++;

    // Verifica se excedeu o limite
    if (record.count > config.maxAttempts) {
      record.blockedUntil = now + config.blockDurationMs;
      this.attempts.set(recordKey, record);

      return {
        allowed: false,
        blockedUntil: new Date(record.blockedUntil),
        retryAfter: Math.ceil(config.blockDurationMs / 1000)
      };
    }

    return {
      allowed: true,
      remainingAttempts: config.maxAttempts - record.count
    };
  }

  /**
   * Registra uma tentativa bem-sucedida e limpa o contador
   */
  recordSuccess(key: string, action: keyof typeof this.configs = 'api'): void {
    const recordKey = `${action}:${key}`;
    this.attempts.delete(recordKey);
  }

  /**
   * Reseta o rate limit para uma chave específica
   */
  reset(key: string, action: keyof typeof this.configs = 'api'): void {
    const recordKey = `${action}:${key}`;
    this.attempts.delete(recordKey);
  }

  /**
   * Obtém informações sobre o status de rate limit
   */
  getStatus(key: string, action: keyof typeof this.configs = 'api'): {
    attempts: number;
    maxAttempts: number;
    isBlocked: boolean;
    blockedUntil?: Date;
  } {
    const config = this.configs[action];
    const recordKey = `${action}:${key}`;
    const record = this.attempts.get(recordKey);
    const now = Date.now();

    if (!record) {
      return {
        attempts: 0,
        maxAttempts: config.maxAttempts,
        isBlocked: false
      };
    }

    const isBlocked = record.blockedUntil ? record.blockedUntil > now : false;

    return {
      attempts: record.count,
      maxAttempts: config.maxAttempts,
      isBlocked,
      blockedUntil: record.blockedUntil ? new Date(record.blockedUntil) : undefined
    };
  }

  /**
   * Limpa registros expirados
   */
  private cleanup(): void {
    const now = Date.now();

    this.attempts.forEach((record, key) => {
      const action = key.split(':')[0] as keyof typeof this.configs;
      const config = this.configs[action];

      // Remove se a janela e o bloqueio expiraram
      const windowExpired = (now - record.firstAttempt) > config.windowMs;
      const blockExpired = !record.blockedUntil || record.blockedUntil < now;

      if (windowExpired && blockExpired) {
        this.attempts.delete(key);
      }
    });
  }

  /**
   * Obtém tempo de espera formatado
   */
  getWaitTimeMessage(seconds: number): string {
    if (seconds < 60) {
      return `${seconds} segundo${seconds !== 1 ? 's' : ''}`;
    } else if (seconds < 3600) {
      const minutes = Math.ceil(seconds / 60);
      return `${minutes} minuto${minutes !== 1 ? 's' : ''}`;
    } else {
      const hours = Math.ceil(seconds / 3600);
      return `${hours} hora${hours !== 1 ? 's' : ''}`;
    }
  }

  /**
   * Limpa todos os rate limits (use com cuidado!)
   */
  clearAll(): void {
    this.attempts.clear();
  }
}
