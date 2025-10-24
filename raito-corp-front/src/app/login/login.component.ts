import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  activeTab: 'login' | 'register' = 'login';

  loginForm = { 
    email: '', 
    password: '', 
    remember: true 
  };

  registerForm = {
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  };

  setActiveTab(tab: 'login' | 'register') {
    this.activeTab = tab;
  }

  onLoginSubmit() {
    console.log('Login submit', this.loginForm);
    // Aqui você implementaria a lógica de login
  }

  onRegisterSubmit() {
    if (this.registerForm.password !== this.registerForm.confirmPassword) {
      alert('As senhas não coincidem');
      return;
    }
    console.log('Register submit', this.registerForm);
    // Aqui você implementaria a lógica de cadastro
  }
}