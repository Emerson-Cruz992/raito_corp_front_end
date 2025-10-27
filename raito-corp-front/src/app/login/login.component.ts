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
  form = { 
    email: '', 
    password: '', 
    remember: true 
  };

  onSubmit() {
    console.log('Login submit', this.form);
    // Aqui você implementaria a lógica de login
  }
}