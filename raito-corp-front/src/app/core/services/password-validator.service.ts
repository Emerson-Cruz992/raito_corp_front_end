import { Injectable } from '@angular/core';

export interface PasswordStrength {
  score: number; // 0-100
  level: 'weak' | 'medium' | 'strong' | 'very-strong';
  feedback: string[];
  passed: boolean;
}

export interface PasswordRequirements {
  minLength: number;
  requireUppercase: boolean;
  requireLowercase: boolean;
  requireNumbers: boolean;
  requireSpecialChars: boolean;
  minStrengthScore: number;
}

@Injectable({
  providedIn: 'root'
})
export class PasswordValidatorService {
  private readonly defaultRequirements: PasswordRequirements = {
    minLength: 12,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSpecialChars: true,
    minStrengthScore: 60
  };

  private readonly commonPasswords = [
    'password', '123456', '12345678', 'qwerty', 'abc123',
    'monkey', '1234567', 'letmein', 'trustno1', 'dragon',
    'baseball', 'iloveyou', 'master', 'sunshine', 'ashley',
    'bailey', 'passw0rd', 'shadow', '123123', '654321',
    'superman', 'qazwsx', 'michael', 'football', 'admin',
    'senha', 'senha123', '12345', 'password123'
  ];

  /**
   * Valida uma senha contra os requisitos de segurança
   */
  validatePassword(password: string, requirements?: Partial<PasswordRequirements>): PasswordStrength {
    const reqs = { ...this.defaultRequirements, ...requirements };
    const feedback: string[] = [];
    let score = 0;

    if (!password) {
      return {
        score: 0,
        level: 'weak',
        feedback: ['A senha é obrigatória'],
        passed: false
      };
    }

    // Verifica comprimento mínimo
    if (password.length < reqs.minLength) {
      feedback.push(`A senha deve ter no mínimo ${reqs.minLength} caracteres`);
    } else {
      score += 25;
    }

    // Verifica letra maiúscula
    if (reqs.requireUppercase) {
      if (/[A-Z]/.test(password)) {
        score += 15;
      } else {
        feedback.push('Adicione pelo menos uma letra maiúscula');
      }
    }

    // Verifica letra minúscula
    if (reqs.requireLowercase) {
      if (/[a-z]/.test(password)) {
        score += 15;
      } else {
        feedback.push('Adicione pelo menos uma letra minúscula');
      }
    }

    // Verifica números
    if (reqs.requireNumbers) {
      if (/\d/.test(password)) {
        score += 15;
      } else {
        feedback.push('Adicione pelo menos um número');
      }
    }

    // Verifica caracteres especiais
    if (reqs.requireSpecialChars) {
      if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
        score += 15;
      } else {
        feedback.push('Adicione pelo menos um caractere especial (!@#$%^&*)');
      }
    }

    // Bonificações adicionais
    if (password.length >= 16) {
      score += 10;
    }
    if (password.length >= 20) {
      score += 5;
    }

    // Penalidades
    if (this.isCommonPassword(password.toLowerCase())) {
      score = Math.max(0, score - 30);
      feedback.push('Esta senha é muito comum. Escolha algo mais único');
    }

    if (this.hasRepeatingCharacters(password)) {
      score = Math.max(0, score - 10);
      feedback.push('Evite sequências ou caracteres repetidos');
    }

    if (this.isSequential(password)) {
      score = Math.max(0, score - 15);
      feedback.push('Evite sequências previsíveis (abc, 123, etc)');
    }

    // Determina o nível
    let level: PasswordStrength['level'];
    if (score >= 80) {
      level = 'very-strong';
    } else if (score >= 60) {
      level = 'strong';
    } else if (score >= 40) {
      level = 'medium';
    } else {
      level = 'weak';
    }

    // Verifica se passou nos requisitos mínimos
    const passed = score >= reqs.minStrengthScore && feedback.length === 0;

    return {
      score: Math.min(100, Math.max(0, score)),
      level,
      feedback,
      passed
    };
  }

  /**
   * Verifica se a senha contém informações pessoais
   */
  containsPersonalInfo(password: string, personalInfo: string[]): boolean {
    const lowerPassword = password.toLowerCase();
    return personalInfo.some(info =>
      info.length > 2 && lowerPassword.includes(info.toLowerCase())
    );
  }

  /**
   * Verifica se é uma senha comum
   */
  private isCommonPassword(password: string): boolean {
    return this.commonPasswords.some(common =>
      password.includes(common) || common.includes(password)
    );
  }

  /**
   * Verifica caracteres repetidos
   */
  private hasRepeatingCharacters(password: string): boolean {
    return /(.)\1{2,}/.test(password);
  }

  /**
   * Verifica sequências
   */
  private isSequential(password: string): boolean {
    const sequences = [
      'abcdefghijklmnopqrstuvwxyz',
      'zyxwvutsrqponmlkjihgfedcba',
      '01234567890',
      '09876543210',
      'qwertyuiop',
      'asdfghjkl',
      'zxcvbnm'
    ];

    const lowerPassword = password.toLowerCase();

    for (const seq of sequences) {
      for (let i = 0; i <= seq.length - 3; i++) {
        const subSeq = seq.substring(i, i + 3);
        if (lowerPassword.includes(subSeq)) {
          return true;
        }
      }
    }

    return false;
  }

  /**
   * Gera uma senha forte aleatória
   */
  generateStrongPassword(length: number = 16): string {
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';
    const special = '!@#$%^&*()_+-=[]{}|;:,.<>?';

    const allChars = uppercase + lowercase + numbers + special;
    let password = '';

    // Garante pelo menos um de cada tipo
    password += uppercase[Math.floor(Math.random() * uppercase.length)];
    password += lowercase[Math.floor(Math.random() * lowercase.length)];
    password += numbers[Math.floor(Math.random() * numbers.length)];
    password += special[Math.floor(Math.random() * special.length)];

    // Completa o resto aleatoriamente
    for (let i = password.length; i < length; i++) {
      password += allChars[Math.floor(Math.random() * allChars.length)];
    }

    // Embaralha a senha
    return password.split('').sort(() => Math.random() - 0.5).join('');
  }

  /**
   * Retorna dicas de senha forte
   */
  getPasswordTips(): string[] {
    return [
      'Use no mínimo 12 caracteres (quanto mais, melhor)',
      'Combine letras maiúsculas e minúsculas',
      'Inclua números e caracteres especiais',
      'Evite palavras do dicionário',
      'Não use informações pessoais (nome, data de nascimento, etc)',
      'Não reutilize senhas de outros sites',
      'Considere usar uma frase-senha (passphrase)',
      'Use um gerenciador de senhas'
    ];
  }
}
