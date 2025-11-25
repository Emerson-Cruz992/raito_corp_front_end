import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../api.service';
import { PerfilAcesso, CriarPerfilAcessoDTO, AtualizarPerfilAcessoDTO } from '../../../shared/models';

@Injectable({
  providedIn: 'root'
})
export class PerfilAcessoService {
  private readonly endpoint = '/perfis';

  constructor(private api: ApiService) {}

  /**
   * Lista todos os perfis de acesso
   */
  listarPerfis(): Observable<PerfilAcesso[]> {
    return this.api.get<PerfilAcesso[]>(this.endpoint);
  }

  /**
   * Busca um perfil por ID
   */
  buscarPorId(id: string): Observable<PerfilAcesso> {
    return this.api.get<PerfilAcesso>(`${this.endpoint}/${id}`);
  }

  /**
   * Cria um novo perfil de acesso
   */
  criarPerfil(perfil: CriarPerfilAcessoDTO): Observable<PerfilAcesso> {
    return this.api.post<PerfilAcesso>(this.endpoint, perfil);
  }

  /**
   * Atualiza um perfil de acesso
   */
  atualizarPerfil(id: string, perfil: AtualizarPerfilAcessoDTO): Observable<PerfilAcesso> {
    return this.api.put<PerfilAcesso>(`${this.endpoint}/${id}`, perfil);
  }

  /**
   * Deleta um perfil de acesso
   */
  deletarPerfil(id: string): Observable<void> {
    return this.api.delete<void>(`${this.endpoint}/${id}`);
  }

  /**
   * Atribui perfil a um usuário
   */
  atribuirPerfil(idUsuario: string, idPerfil: string): Observable<void> {
    return this.api.post<void>('/usuarios-perfis/atribuir', null, {
      idUsuario,
      idPerfil
    });
  }

  /**
   * Remove perfil de um usuário
   */
  removerPerfil(idUsuario: string, idPerfil: string): Observable<void> {
    return this.api.delete<void>('/usuarios-perfis/remover', {
      idUsuario,
      idPerfil
    });
  }

  /**
   * Lista perfis de um usuário
   */
  listarPerfisUsuario(idUsuario: string): Observable<PerfilAcesso[]> {
    return this.api.get<PerfilAcesso[]>('/usuarios-perfis/listar-perfis-usuario', {
      idUsuario
    });
  }

  /**
   * Lista usuários de um perfil
   */
  listarUsuariosPerfil(idPerfil: string): Observable<any[]> {
    return this.api.get<any[]>('/usuarios-perfis/listar-usuarios-perfil', {
      idPerfil
    });
  }
}
