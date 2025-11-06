import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService, UserRole } from '../services/auth.service';

/**
 * Guard genérico para proteger rotas baseado em roles
 * Uso: canActivate: [roleGuard], data: { roles: ['ADMIN', 'MANAGER'] }
 */
export const roleGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Verifica se está autenticado
  if (!authService.isAuthenticated) {
    router.navigate(['/login'], {
      queryParams: { returnUrl: state.url }
    });
    return false;
  }

  // Obtém as roles permitidas da configuração da rota
  const allowedRoles = route.data['roles'] as UserRole[];

  if (!allowedRoles || allowedRoles.length === 0) {
    return true; // Se não há roles definidas, permite acesso
  }

  // Verifica se o usuário tem alguma das roles permitidas
  const userRole = authService.userRole;
  if (userRole && allowedRoles.includes(userRole)) {
    return true;
  }

  // Usuário não tem permissão
  router.navigate(['/']);
  return false;
};
