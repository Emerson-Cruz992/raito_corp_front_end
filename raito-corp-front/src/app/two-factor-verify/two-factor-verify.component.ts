import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../core/services/auth.service';
import { TwoFactorAuthService } from '../core/services/two-factor-auth.service';

@Component({
  selector: 'app-two-factor-verify',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './two-factor-verify.component.html',
  styleUrl: './two-factor-verify.component.scss'
})
export class TwoFactorVerifyComponent implements OnInit {
  verificationCode = '';
  errorMessage = '';
  isLoading = false;
  userId: number | null = null;
  attemptsRemaining = 3;
  useBackupCode = false;
  backupCode = '';

  constructor(
    private authService: AuthService,
    private twoFactorService: TwoFactorAuthService,
    private router: Router
  ) {}

  ngOnInit() {
    // Verificar se há um processo de 2FA pendente
    if (!this.authService.isPendingTwoFactor) {
      this.router.navigate(['/login']);
      return;
    }

    // Obter userId do usuário atual (temporário)
    const tempUser = this.authService.currentUserValue;
    if (tempUser) {
      this.userId = tempUser.id;
    }
  }

  onSubmit() {
    if (!this.userId) {
      this.errorMessage = 'Erro de autenticação. Por favor, faça login novamente.';
      return;
    }

    if (this.useBackupCode) {
      this.verifyBackupCode();
    } else {
      this.verifyTOTPCode();
    }
  }

  private verifyTOTPCode() {
    if (!this.verificationCode || !this.twoFactorService.isValidTOTPFormat(this.verificationCode)) {
      this.errorMessage = 'Por favor, insira um código válido de 6 dígitos';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.authService.verifyTwoFactor(this.userId!, this.verificationCode).subscribe({
      next: (response) => {
        this.isLoading = false;
        // Redirecionar baseado na role do usuário
        const user = this.authService.currentUserValue;
        if (user?.role === 'ADMIN') {
          this.router.navigate(['/admin']);
        } else {
          this.router.navigate(['/']);
        }
      },
      error: (error) => {
        this.isLoading = false;
        this.attemptsRemaining--;

        if (this.attemptsRemaining <= 0) {
          this.errorMessage = 'Muitas tentativas falhadas. Por favor, faça login novamente.';
          setTimeout(() => {
            this.authService.logout();
          }, 2000);
        } else {
          this.errorMessage = `Código inválido. ${this.attemptsRemaining} tentativa(s) restante(s).`;
        }

        this.verificationCode = '';
      }
    });
  }

  private verifyBackupCode() {
    if (!this.backupCode || this.backupCode.trim().length === 0) {
      this.errorMessage = 'Por favor, insira um código de backup válido';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.twoFactorService.useBackupCode(this.userId!, this.backupCode.trim()).subscribe({
      next: (response) => {
        this.isLoading = false;
        if (response.success) {
          // Redirecionar baseado na role do usuário
          const user = this.authService.currentUserValue;
          if (user?.role === 'ADMIN') {
            this.router.navigate(['/admin']);
          } else {
            this.router.navigate(['/']);
          }
        } else {
          this.errorMessage = 'Código de backup inválido';
          this.backupCode = '';
        }
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = 'Erro ao verificar código de backup';
        this.backupCode = '';
      }
    });
  }

  toggleBackupCode() {
    this.useBackupCode = !this.useBackupCode;
    this.errorMessage = '';
    this.verificationCode = '';
    this.backupCode = '';
  }

  cancelVerification() {
    this.authService.logout();
  }

  // Auto-focus no próximo campo ao digitar
  onCodeInput(event: any, nextInput?: HTMLInputElement) {
    const value = event.target.value;
    if (value.length === 1 && nextInput) {
      nextInput.focus();
    }
  }
}
