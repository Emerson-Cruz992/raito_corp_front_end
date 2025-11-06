import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../core/services/auth.service';

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
    this.isLoading = true;

    // TODO: Implementar lógica de autenticação com o back-end
    setTimeout(() => {
      this.isLoading = false;
      // AuthService.login(this.loginForm.email, this.loginForm.password)
    }, 1000);
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

    // TODO: Implementar registro com back-end
    setTimeout(() => {
      this.isLoading = false;
      // Após criar conta, mudar para tab de login
      this.activeTab = 'login';
      this.errorMessage = '';
      // Limpar formulário de registro
      this.registerForm = {
        nome: '',
        email: '',
        password: '',
        confirmPassword: '',
        acceptTerms: false
      };
    }, 1500);
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