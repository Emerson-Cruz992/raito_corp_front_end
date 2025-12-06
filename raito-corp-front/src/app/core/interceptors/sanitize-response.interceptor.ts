import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { tap } from 'rxjs/operators';

/**
 * Interceptor para sanitizar respostas da API
 * Remove dados sensíveis que não deveriam ser enviados ao frontend
 *
 * IMPORTANTE: Esta é uma camada ADICIONAL de segurança.
 * O ideal é que o backend NUNCA envie esses dados.
 */
export const sanitizeResponseInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    tap(event => {
      if (event instanceof HttpResponse) {
        // Remove dados sensíveis da resposta
        if (event.body) {
          // NÃO sanitizar respostas de login/auth (precisam do token)
          const isAuthEndpoint = req.url.includes('/auth/') || req.url.includes('/login');
          sanitizeData(event.body, isAuthEndpoint);
        }
      }
    })
  );
};

/**
 * Remove recursivamente dados sensíveis de objetos
 */
function sanitizeData(data: any, isAuthEndpoint: boolean = false): void {
  if (!data || typeof data !== 'object') {
    return;
  }

  // Campos sensíveis que devem ser removidos
  const sensitiveFields = [
    'senhaHash',
    'senha',
    'password',
    'passwordHash',
    'secret',
    'apiKey',
    'privateKey',
    'ssn',
    'cpf',
    'creditCard',
    'cvv'
  ];

  // NÃO remover token/refreshToken de endpoints de autenticação
  if (!isAuthEndpoint) {
    sensitiveFields.push('token', 'refreshToken');
  }

  // Campos que devem ser ofuscados (parcialmente visíveis)
  const fieldsToObfuscate = [
    'email',
    'telefone',
    'phone',
    'celular'
  ];

  if (Array.isArray(data)) {
    // Processar arrays recursivamente
    data.forEach(item => sanitizeData(item, isAuthEndpoint));
  } else {
    // Processar objetos
    Object.keys(data).forEach(key => {
      // Remover campos sensíveis completamente
      if (sensitiveFields.includes(key)) {
        console.warn(`⚠️ SECURITY: Campo sensível "${key}" removido da resposta`);
        delete data[key];
        return;
      }

      // Ofuscar campos parcialmente (exceto em endpoints de auth)
      if (!isAuthEndpoint && fieldsToObfuscate.includes(key) && typeof data[key] === 'string') {
        data[key] = obfuscate(data[key], key);
      }

      // Processar objetos aninhados
      if (data[key] && typeof data[key] === 'object') {
        sanitizeData(data[key], isAuthEndpoint);
      }
    });
  }
}

/**
 * Ofusca dados sensíveis mantendo parte visível
 */
function obfuscate(value: string, fieldType: string): string {
  if (!value || value.length === 0) {
    return value;
  }

  switch (fieldType) {
    case 'email':
      // email@example.com → e***l@example.com
      const [localPart, domain] = value.split('@');
      if (localPart && domain) {
        const firstChar = localPart[0];
        const lastChar = localPart[localPart.length - 1];
        return `${firstChar}${'*'.repeat(Math.max(localPart.length - 2, 3))}${lastChar}@${domain}`;
      }
      return value;

    case 'telefone':
    case 'phone':
    case 'celular':
      // (11) 98765-4321 → (11) ****-4321
      if (value.length > 4) {
        const last4 = value.slice(-4);
        const prefix = value.slice(0, value.length - 4).replace(/\d/g, '*');
        return prefix + last4;
      }
      return '*'.repeat(value.length);

    default:
      // Ofuscação padrão - mostra apenas primeiros e últimos caracteres
      if (value.length <= 4) {
        return '*'.repeat(value.length);
      }
      return `${value[0]}${'*'.repeat(value.length - 2)}${value[value.length - 1]}`;
  }
}

/**
 * Log de dados sensíveis detectados (apenas em desenvolvimento)
 */
function logSensitiveDataDetection(field: string, endpoint: string): void {
  if (!isProduction()) {
    console.group('🔒 Sensitive Data Detected');
    console.warn(`Field: ${field}`);
    console.warn(`Endpoint: ${endpoint}`);
    console.warn('This data should NOT be sent by the backend!');
    console.groupEnd();
  }
}

function isProduction(): boolean {
  // Verifica se está em produção
  return window.location.hostname !== 'localhost' &&
         !window.location.hostname.includes('127.0.0.1');
}
