import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../core/services/auth.service';
import { CredencialService } from '../core/services/cadastro/credencial.service';
import { UsuarioService } from '../core/services/cadastro/usuario.service';
import { PasswordValidatorService, PasswordStrength } from '../core/services/password-validator.service';
import { RateLimiterService } from '../core/services/rate-limiter.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
  activeTab: 'login' | 'register' = 'login';

  loginForm = {
    email: '',
    password: '',
    remember: true
  };

  registerForm = {
    nome: '',
    email: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false
  };

  errorMessage = '';
  isLoading = false;
  showPassword = false;
  showConfirmPassword = false;
  passwordStrength: PasswordStrength | null = null;
  showPasswordStrength = false;

  constructor(
    private authService: AuthService,
    private credencialService: CredencialService,
    private usuarioService: UsuarioService,
    private router: Router,
    private route: ActivatedRoute,
    private passwordValidator: PasswordValidatorService,
    private rateLimiter: RateLimiterService
  ) {}

  ngOnInit() {
    // Check if user came from register route
    this.route.queryParams.subscribe(params => {
      if (params['tab'] === 'register') {
        this.activeTab = 'register';
      }
    });
  }

  switchTab(tab: 'login' | 'register') {
    this.activeTab = tab;
    this.errorMessage = '';
  }

  onLoginSubmit() {
    this.errorMessage = '';

    // Validações
    if (!this.loginForm.email.trim()) {
      this.errorMessage = 'Email é obrigatório';
      return;
    }

    if (!this.loginForm.password.trim()) {
      this.errorMessage = 'Senha é obrigatória';
      return;
    }

    // Verifica rate limiting
    const rateLimitCheck = this.rateLimiter.checkLimit(this.loginForm.email, 'login');
    if (!rateLimitCheck.allowed) {
      const waitTime = this.rateLimiter.getWaitTimeMessage(rateLimitCheck.retryAfter || 0);
      this.errorMessage = `Muitas tentativas de login falhadas. Tente novamente em ${waitTime}.`;
      return;
    }

    this.isLoading = true;

    // Fazer login via API
    this.credencialService.login(this.loginForm.email, this.loginForm.password).subscribe({
      next: (response) => {
        console.log('Login bem-sucedido:', response);

        // Buscar dados do usuário para saber o tipo
        this.credencialService.buscarPorEmail(this.loginForm.email).subscribe({
          next: (credencial) => {
            // Buscar dados completos do usuário
            this.usuarioService.buscarPorId(credencial.idUsuario).subscribe({
              next: (usuario) => {
                // Salvar dados do usuário no AuthService com o token do login
                this.authService.setCurrentUser(usuario, response.token);

                // Login bem-sucedido - limpa rate limit
                this.rateLimiter.recordSuccess(this.loginForm.email, 'login');

                this.isLoading = false;

                // Redirecionar baseado no tipo de usuário
                if (usuario.tipoUsuario === 'admin') {
                  this.router.navigate(['/admin']);
                } else {
                  this.router.navigate(['/']);
                }
              },
              error: (error) => {
                console.error('Erro ao buscar usuário:', error);
                this.isLoading = false;
                this.errorMessage = 'Erro ao carregar dados do usuário';
              }
            });
          },
          error: (error) => {
            console.error('Erro ao buscar credencial:', error);
            this.isLoading = false;
            this.errorMessage = 'Erro ao carregar credenciais';
          }
        });
      },
      error: (error) => {
        console.error('Erro no login:', error);
        this.isLoading = false;
        if (error.status === 401 || error.status === 404) {
          this.errorMessage = 'Email ou senha incorretos';
        } else {
          this.errorMessage = 'Erro ao fazer login. Tente novamente.';
        }
      }
    });
  }

  onRegisterSubmit() {
    this.errorMessage = '';

    // Validações
    if (!this.registerForm.nome.trim()) {
      this.errorMessage = 'Nome é obrigatório';
      return;
    }

    if (!this.registerForm.email.trim()) {
      this.errorMessage = 'Email é obrigatório';
      return;
    }

    if (!this.isValidEmail(this.registerForm.email)) {
      this.errorMessage = 'Email inválido';
      return;
    }

    // Validação forte de senha
    const passwordValidation = this.passwordValidator.validatePassword(this.registerForm.password);
    if (!passwordValidation.passed) {
      this.errorMessage = passwordValidation.feedback.join('. ');
      this.showPasswordStrength = true;
      return;
    }

    // Verifica informações pessoais na senha
    const personalInfo = [
      this.registerForm.nome,
      this.registerForm.email.split('@')[0]
    ];
    if (this.passwordValidator.containsPersonalInfo(this.registerForm.password, personalInfo)) {
      this.errorMessage = 'A senha não deve conter seu nome ou email';
      return;
    }

    if (this.registerForm.password !== this.registerForm.confirmPassword) {
      this.errorMessage = 'As senhas não coincidem';
      return;
    }

    if (!this.registerForm.acceptTerms) {
      this.errorMessage = 'Você deve aceitar os termos de uso';
      return;
    }

    this.isLoading = true;

    // Primeiro, criar o usuário
    const nomeCompleto = this.registerForm.nome.trim();
    const partesNome = nomeCompleto.split(' ');
    const nome = partesNome[0];
    const sobrenome = partesNome.slice(1).join(' ') || '';

    this.usuarioService.criarUsuario({
      nome: nome,
      sobrenome: sobrenome,
      tipoUsuario: 'cliente'
    }).subscribe({
      next: (usuario) => {
        // Depois, criar as credenciais do usuário
        this.credencialService.criarCredencial({
          idUsuario: usuario.idUsuario,
          email: this.registerForm.email,
          senhaHash: this.registerForm.password
        }).subscribe({
          next: (credencial) => {
            console.log('Cadastro realizado com sucesso!', { usuario, credencial });
            this.isLoading = false;

            // Fazer login automático após cadastro
            this.credencialService.login(this.registerForm.email, this.registerForm.password).subscribe({
              next: (loginResponse) => {
                // Salvar dados do usuário no AuthService
                this.authService.setCurrentUser(usuario, loginResponse.token);

                // Redirecionar para home
                this.router.navigate(['/']);
              },
              error: (error) => {
                console.error('Erro ao fazer login automático:', error);
                // Mesmo com erro no login, mostrar sucesso e pedir para fazer login manual
                this.activeTab = 'login';
                this.errorMessage = 'Conta criada com sucesso! Faça login para continuar.';
                this.registerForm = {
                  nome: '',
                  email: '',
                  password: '',
                  confirmPassword: '',
                  acceptTerms: false
                };
              }
            });
          },
          error: (error) => {
            console.error('Erro ao criar credenciais:', error);
            this.isLoading = false;
            if (error.status === 409 || error.error?.message?.includes('já existe')) {
              this.errorMessage = 'Este email já está cadastrado';
            } else {
              this.errorMessage = 'Erro ao criar credenciais. Tente novamente.';
            }
          }
        });
      },
      error: (error) => {
        console.error('Erro ao criar usuário:', error);
        this.isLoading = false;
        this.errorMessage = 'Erro ao criar usuário. Tente novamente.';
      }
    });
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  // Atualiza a força da senha enquanto o usuário digita
  onPasswordChange() {
    if (this.registerForm.password.length > 0) {
      this.passwordStrength = this.passwordValidator.validatePassword(this.registerForm.password);
      this.showPasswordStrength = true;
    } else {
      this.showPasswordStrength = false;
      this.passwordStrength = null;
    }
  }

  getPasswordStrengthClass(): string {
    if (!this.passwordStrength) return '';
    return `strength-${this.passwordStrength.level}`;
  }

  getPasswordStrengthLabel(): string {
    if (!this.passwordStrength) return '';
    const labels = {
      'weak': 'Fraca',
      'medium': 'Média',
      'strong': 'Forte',
      'very-strong': 'Muito Forte'
    };
    return labels[this.passwordStrength.level];
  }
}