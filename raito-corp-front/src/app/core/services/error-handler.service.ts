import { Injectable, ErrorHandler } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../../environments/environment';

export interface AppError {
  message: string;
  code?: string;
  details?: any;
  timestamp: Date;
}

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService implements ErrorHandler {
  private errorLog: AppError[] = [];

  /**
   * Trata erros globais da aplicação
   */
  handleError(error: Error | HttpErrorResponse): void {
    const appError: AppError = {
      message: this.getErrorMessage(error),
      timestamp: new Date()
    };

    if (error instanceof HttpErrorResponse) {
      appError.code = `HTTP_${error.status}`;
      appError.details = {
        url: error.url,
        status: error.status,
        statusText: error.statusText,
        body: error.error
      };

      this.handleHttpError(error);
    } else {
      this.handleClientError(error);
    }

    this.logError(appError);
  }

  /**
   * Trata erros HTTP
   */
  private handleHttpError(error: HttpErrorResponse): void {
    let message = 'Ocorreu um erro inesperado';

    switch (error.status) {
      case 0:
        message = 'Não foi possível conectar ao servidor. Verifique sua conexão.';
        break;
      case 400:
        message = this.extractErrorMessage(error) || 'Dados inválidos';
        break;
      case 401:
        message = 'Sessão expirada. Faça login novamente.';
        break;
      case 403:
        message = 'Você não tem permissão para acessar este recurso';
        break;
      case 404:
        message = 'Recurso não encontrado';
        break;
      case 409:
        message = this.extractErrorMessage(error) || 'Conflito de dados';
        break;
      case 422:
        message = this.extractErrorMessage(error) || 'Dados inválidos';
        break;
      case 500:
        message = 'Erro interno do servidor';
        break;
      case 503:
        message = 'Serviço temporariamente indisponível';
        break;
    }

    this.showUserNotification(message, 'error');
  }

  /**
   * Trata erros do cliente (JavaScript)
   */
  private handleClientError(error: Error): void {
    const message = environment.production
      ? 'Ocorreu um erro inesperado'
      : error.message;

    this.showUserNotification(message, 'error');

    // Em produção, enviar erro para serviço de monitoramento
    if (environment.production) {
      this.sendErrorToMonitoring(error);
    }
  }

  /**
   * Extrai mensagem de erro do response do servidor
   */
  private extractErrorMessage(error: HttpErrorResponse): string | null {
    if (error.error && typeof error.error === 'object') {
      return error.error.message || error.error.error || null;
    }
    return null;
  }

  /**
   * Obtém mensagem de erro formatada
   */
  private getErrorMessage(error: Error | HttpErrorResponse): string {
    if (error instanceof HttpErrorResponse) {
      return this.extractErrorMessage(error) || error.message;
    }
    return error.message;
  }

  /**
   * Loga o erro
   */
  private logError(error: AppError): void {
    this.errorLog.push(error);

    // Manter apenas os últimos 50 erros
    if (this.errorLog.length > 50) {
      this.errorLog.shift();
    }

    // Log no console em desenvolvimento
    if (environment.enableDebugLogs) {
      console.error('[Error Handler]', error);
    }
  }

  /**
   * Mostra notificação para o usuário
   * TODO: Implementar com biblioteca de toast/snackbar
   */
  private showUserNotification(message: string, type: 'error' | 'warning' | 'info'): void {
    // Por enquanto usando alert simples
    // Em produção, substituir por biblioteca como ngx-toastr, Angular Material Snackbar, etc.
    if (!environment.production) {
      console.error(`[${type.toUpperCase()}] ${message}`);
    }

    // TODO: Implementar toast notification
    // this.toastr.error(message);
  }

  /**
   * Envia erro para serviço de monitoramento
   * TODO: Integrar com Sentry, LogRocket, etc.
   */
  private sendErrorToMonitoring(error: Error): void {
    // Implementar integração com serviço de monitoramento
    // Exemplo: Sentry.captureException(error);
  }

  /**
   * Obtém log de erros
   */
  getErrorLog(): AppError[] {
    return [...this.errorLog];
  }

  /**
   * Limpa log de erros
   */
  clearErrorLog(): void {
    this.errorLog = [];
  }
}
