import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../api.service';
import { Usuario, CriarUsuarioDTO, AtualizarUsuarioDTO } from '../../../shared/models';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private readonly endpoint = '/usuarios';

  constructor(private api: ApiService) {}

  /**
   * Lista todos os usuários
   */
  listarUsuarios(): Observable<Usuario[]> {
    return this.api.get<Usuario[]>(`${this.endpoint}/listar`);
  }

  /**
   * Busca um usuário por ID
   */
  buscarPorId(id: string): Observable<Usuario> {
    return this.api.get<Usuario>(`${this.endpoint}/${id}`);
  }

  /**
   * Cria um novo usuário
   */
  criarUsuario(usuario: CriarUsuarioDTO): Observable<Usuario> {
    return this.api.post<Usuario>(`${this.endpoint}/criar`, usuario);
  }

  /**
   * Atualiza um usuário existente
   */
  atualizarUsuario(id: string, usuario: AtualizarUsuarioDTO): Observable<Usuario> {
    return this.api.put<Usuario>(`${this.endpoint}/${id}`, usuario);
  }

  /**
   * Deleta um usuário
   */
  deletarUsuario(id: string): Observable<void> {
    return this.api.delete<void>(`${this.endpoint}/${id}`);
  }
}
