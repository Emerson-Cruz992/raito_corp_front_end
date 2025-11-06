import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

/**
 * Guard para proteger rotas que requerem permissão de administrador
 */
export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Verifica se está autenticado
  if (!authService.isAuthenticated) {
    router.navigate(['/login'], {
      queryParams: { returnUrl: state.url }
    });
    return false;
  }

  // Verifica se tem role de admin
  if (authService.isAdmin()) {
    return true;
  }

  // Usuário autenticado mas sem permissão
  router.navigate(['/']);
  return false;
};
