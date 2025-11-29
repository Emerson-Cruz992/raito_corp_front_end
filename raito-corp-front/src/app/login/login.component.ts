import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../core/services/auth.service';
import { CredencialService } from '../core/services/cadastro/credencial.service';
import { UsuarioService } from '../core/services/cadastro/usuario.service';

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

  constructor(
    private authService: AuthService,
    private credencialService: CredencialService,
    private usuarioService: UsuarioService,
    private router: Router,
    private route: ActivatedRoute
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

    if (this.registerForm.password.length < 6) {
      this.errorMessage = 'Senha deve ter no mínimo 6 caracteres';
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
}