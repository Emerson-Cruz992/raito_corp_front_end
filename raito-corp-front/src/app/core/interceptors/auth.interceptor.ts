import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, switchMap, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { environment } from '../../../environments/environment';

/**
 * Interceptor HTTP para adicionar token de autenticação nas requisições
 * e tratar erros de autenticação (401, 403)
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);

  // URLs que não precisam de autenticação
  const publicEndpoints = [
    '/auth/login',
    '/auth/refresh',
    '/auth/register',
    '/public/'
  ];

  // Verifica se a requisição é para um endpoint público
  const isPublicEndpoint = publicEndpoints.some(endpoint =>
    req.url.includes(endpoint)
  );

  // Se for endpoint público, não adiciona token
  if (isPublicEndpoint) {
    return next(req);
  }

  // Adiciona o token de autenticação
  const token = authService.getToken();
  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  // Processa a requisição e trata erros
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      // Token expirado ou inválido
      if (error.status === 401 && !req.url.includes('/auth/refresh')) {
        // Tenta renovar o token
        return authService.refreshToken().pipe(
          switchMap(() => {
            // Reenvia a requisição original com o novo token
            const newToken = authService.getToken();
            const clonedRequest = req.clone({
              setHeaders: {
                Authorization: `Bearer ${newToken}`
              }
            });
            return next(clonedRequest);
          }),
          catchError(refreshError => {
            // Se falhar ao renovar, faz logout
            authService.logout();
            return throwError(() => refreshError);
          })
        );
      }

      // Acesso negado
      if (error.status === 403) {
        // Redirecionar para página de acesso negado ou home
        return throwError(() => new Error('Acesso negado'));
      }

      return throwError(() => error);
    })
  );
};
