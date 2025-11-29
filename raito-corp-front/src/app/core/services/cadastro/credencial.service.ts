import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../api.service';
import { Credencial, CriarCredencialDTO, LoginDTO, LoginResponse } from '../../../shared/models';

@Injectable({
  providedIn: 'root'
})
export class CredencialService {
  private readonly endpoint = '/credenciais';

  constructor(private api: ApiService) {}

  /**
   * Cria uma nova credencial
   */
  criarCredencial(credencial: CriarCredencialDTO): Observable<Credencial> {
    return this.api.post<Credencial>(`${this.endpoint}/criar`, credencial);
  }

  /**
   * Realiza login
   * API: POST /api/credenciais/login (body: {email, senha})
   */
  login(email: string, senha: string): Observable<LoginResponse> {
    return this.api.post<LoginResponse>(`${this.endpoint}/login`, { email, senha });
  }

  /**
   * Busca credencial por email
   */
  buscarPorEmail(email: string): Observable<Credencial> {
    return this.api.get<Credencial>(`${this.endpoint}/email/${email}`);
  }

  /**
   * Busca credencial por ID de usuário
   */
  buscarPorUsuario(idUsuario: string): Observable<Credencial> {
    return this.api.get<Credencial>(`${this.endpoint}/usuario/${idUsuario}`);
  }

  /**
   * Atualiza senha
   */
  atualizarSenha(idCredencial: string, novaSenha: string): Observable<void> {
    return this.api.put<void>(`${this.endpoint}/${idCredencial}/senha`, {
      senhaHash: novaSenha
    });
  }

  /**
   * Desbloqueia credencial
   */
  desbloquear(idCredencial: string): Observable<void> {
    return this.api.put<void>(`${this.endpoint}/${idCredencial}/desbloquear`, {});
  }
}
