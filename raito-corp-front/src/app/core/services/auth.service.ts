import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { tap, catchError, map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { TwoFactorAuthService } from './two-factor-auth.service';

export interface LoginRequest {
  email: string;
  password: string;
  twoFactorCode?: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
  user: User;
  requiresTwoFactor?: boolean;
  tempToken?: string;
}

export interface User {
  id: number;
  email: string;
  nome: string;
  role: UserRole;
  twoFactorEnabled?: boolean;
}

export type UserRole = 'ADMIN' | 'USER' | 'MANAGER';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser$: Observable<User | null>;
  private tokenExpirationTimer: any;
  private pendingTwoFactorSubject = new BehaviorSubject<boolean>(false);
  public pendingTwoFactor$ = this.pendingTwoFactorSubject.asObservable();
  private tempToken: string | null = null;

  constructor(
    private http: HttpClient,
    private router: Router,
    private twoFactorService: TwoFactorAuthService
  ) {
    const storedUser = this.getStoredUser();
    this.currentUserSubject = new BehaviorSubject<User | null>(storedUser);
    this.currentUser$ = this.currentUserSubject.asObservable();

    // Verificar se tem token ao iniciar (validação JWT desabilitada temporariamente)
    if (storedUser && !this.getToken()) {
      this.logout();
    }
  }

  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  public get isAuthenticated(): boolean {
    // Temporário: aceitar qualquer token até implementar JWT de verdade
    return !!this.getToken() && !!this.currentUserValue;
  }

  public get userRole(): UserRole | null {
    return this.currentUserValue?.role || null;
  }

  /**
   * Realiza login no sistema
   */
  login(email: string, password: string, twoFactorCode?: string): Observable<LoginResponse> {
    const loginRequest: LoginRequest = { email, password, twoFactorCode };

    return this.http.post<LoginResponse>(`${environment.apiUrl}/auth/login`, loginRequest)
      .pipe(
        tap(response => {
          if (response.requiresTwoFactor) {
            // Login inicial bem-sucedido, mas precisa de 2FA
            this.tempToken = response.tempToken || null;
            this.pendingTwoFactorSubject.next(true);
          } else {
            // Login completo
            this.handleAuthenticationSuccess(response);
          }
        }),
        catchError(error => this.handleAuthenticationError(error))
      );
  }

  /**
   * Verifica o código 2FA e completa o login
   */
  verifyTwoFactor(userId: number, code: string): Observable<LoginResponse> {
    return this.twoFactorService.verify(userId, code).pipe(
      tap(verifyResponse => {
        if (verifyResponse.valid) {
          this.pendingTwoFactorSubject.next(false);
          this.tempToken = null;
        }
      }),
      catchError(error => {
        return throwError(() => new Error('Código 2FA inválido'));
      })
    ) as any;
  }

  /**
   * Obtém o status pendente de 2FA
   */
  get isPendingTwoFactor(): boolean {
    return this.pendingTwoFactorSubject.value;
  }

  /**
   * Obtém o token temporário (usado durante 2FA)
   */
  getTempToken(): string | null {
    return this.tempToken;
  }

  /**
   * Realiza logout do sistema
   */
  logout(): void {
    // Limpar dados locais (não precisa chamar backend por enquanto)
    this.clearAuthData();
  }

  /**
   * Atualiza o access token usando o refresh token
   */
  refreshToken(): Observable<LoginResponse> {
    const refreshToken = this.getRefreshToken();

    if (!refreshToken) {
      return throwError(() => new Error('Refresh token não encontrado'));
    }

    return this.http.post<LoginResponse>(`${environment.apiUrl}/auth/refresh`, { refreshToken })
      .pipe(
        tap(response => this.handleAuthenticationSuccess(response)),
        catchError(error => {
          this.logout();
          return throwError(() => error);
        })
      );
  }

  /**
   * Obtém o token de acesso
   */
  getToken(): string | null {
    return localStorage.getItem(environment.tokenKey);
  }

  /**
   * Obtém o refresh token
   */
  getRefreshToken(): string | null {
    return localStorage.getItem(environment.refreshTokenKey);
  }

  /**
   * Verifica se o usuário tem uma role específica
   */
  hasRole(role: UserRole): boolean {
    return this.currentUserValue?.role === role;
  }

  /**
   * Verifica se o usuário tem permissão de admin
   */
  isAdmin(): boolean {
    return this.hasRole('ADMIN');
  }

  /**
   * Define o usuário atual (para login customizado)
   */
  setCurrentUser(usuario: any, token?: string): void {
    // Adaptar o modelo de usuário do backend para o modelo local
    const user: User = {
      id: usuario.idUsuario || usuario.id,
      email: usuario.email || '',
      nome: usuario.nome,
      role: usuario.tipoUsuario === 'admin' ? 'ADMIN' : 'USER'
    };

    // Salvar token se fornecido
    if (token) {
      localStorage.setItem(environment.tokenKey, token);
    }

    localStorage.setItem('raito_user', JSON.stringify(user));
    this.currentUserSubject.next(user);
  }

  /**
   * Verifica se o token ainda é válido
   */
  private isTokenValid(): boolean {
    const token = this.getToken();
    if (!token) return false;

    try {
      const payload = this.decodeToken(token);
      const expirationDate = new Date(payload.exp * 1000);
      return expirationDate > new Date();
    } catch {
      return false;
    }
  }

  /**
   * Decodifica o token JWT
   */
  private decodeToken(token: string): any {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      return JSON.parse(window.atob(base64));
    } catch {
      return null;
    }
  }

  /**
   * Armazena os dados de autenticação
   */
  private handleAuthenticationSuccess(response: LoginResponse): void {
    localStorage.setItem(environment.tokenKey, response.accessToken);
    localStorage.setItem(environment.refreshTokenKey, response.refreshToken);
    localStorage.setItem('raito_user', JSON.stringify(response.user));

    this.currentUserSubject.next(response.user);
    this.startTokenExpirationTimer(response.expiresIn);
  }

  /**
   * Trata erros de autenticação
   */
  private handleAuthenticationError(error: any): Observable<never> {
    let errorMessage = 'Erro ao realizar login';

    if (error.status === 401) {
      errorMessage = 'Email ou senha inválidos';
    } else if (error.status === 403) {
      errorMessage = 'Acesso negado';
    } else if (error.status === 0) {
      errorMessage = 'Não foi possível conectar ao servidor';
    }

    return throwError(() => new Error(errorMessage));
  }

  /**
   * Limpa todos os dados de autenticação
   */
  private clearAuthData(): void {
    localStorage.removeItem(environment.tokenKey);
    localStorage.removeItem(environment.refreshTokenKey);
    localStorage.removeItem('raito_user');

    this.currentUserSubject.next(null);
    this.stopTokenExpirationTimer();
    this.router.navigate(['/login']);
  }

  /**
   * Obtém o usuário armazenado no localStorage
   */
  private getStoredUser(): User | null {
    const userJson = localStorage.getItem('raito_user');
    if (!userJson) return null;

    try {
      return JSON.parse(userJson);
    } catch {
      return null;
    }
  }

  /**
   * Inicia timer para refresh automático do token
   */
  private startTokenExpirationTimer(expiresIn: number): void {
    this.stopTokenExpirationTimer();

    // Renovar token 1 minuto antes de expirar
    const timeout = (expiresIn - 60) * 1000;

    this.tokenExpirationTimer = setTimeout(() => {
      this.refreshToken().subscribe();
    }, timeout);
  }

  /**
   * Para o timer de expiração do token
   */
  private stopTokenExpirationTimer(): void {
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
      this.tokenExpirationTimer = null;
    }
  }
}
