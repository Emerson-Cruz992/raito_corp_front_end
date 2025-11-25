import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../api.service';
import { Categoria, CriarCategoriaDTO, AtualizarCategoriaDTO } from '../../../shared/models';

@Injectable({
  providedIn: 'root'
})
export class CategoriaService {
  private readonly endpoint = '/categorias';

  constructor(private api: ApiService) {}

  /**
   * Lista todas as categorias
   * API: GET /api/categorias
   */
  listarCategorias(): Observable<Categoria[]> {
    return this.api.get<Categoria[]>(this.endpoint);
  }

  /**
   * Busca uma categoria por ID
   * API: GET /api/categorias/{id}
   */
  buscarPorId(id: string): Observable<Categoria> {
    return this.api.get<Categoria>(`${this.endpoint}/${id}`);
  }

  /**
   * Cria uma nova categoria
   * API: POST /api/categorias/criar
   */
  criarCategoria(categoria: CriarCategoriaDTO): Observable<Categoria> {
    return this.api.post<Categoria>(`${this.endpoint}/criar`, categoria);
  }

  /**
   * Atualiza uma categoria existente
   * API: PUT /api/categorias/{id}
   */
  atualizarCategoria(id: string, categoria: AtualizarCategoriaDTO): Observable<Categoria> {
    return this.api.put<Categoria>(`${this.endpoint}/${id}`, categoria);
  }

  /**
   * Deleta uma categoria
   * API: DELETE /api/categorias/{id}
   */
  deletarCategoria(id: string): Observable<void> {
    return this.api.delete<void>(`${this.endpoint}/${id}`);
  }
}
