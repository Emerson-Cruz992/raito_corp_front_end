import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../api.service';
import { Produto, CriarProdutoDTO, AtualizarProdutoDTO } from '../../../shared/models';

@Injectable({
  providedIn: 'root'
})
export class ProdutoService {
  private readonly endpoint = '/produtos';

  constructor(private api: ApiService) {}

  /**
   * Lista todos os produtos
   * API: GET /api/produtos
   */
  listarProdutos(): Observable<Produto[]> {
    return this.api.get<Produto[]>(this.endpoint);
  }

  /**
   * Busca um produto por ID
   * API: GET /api/produtos/{idProduto}
   */
  buscarPorId(id: string): Observable<Produto> {
    return this.api.get<Produto>(`${this.endpoint}/${id}`);
  }

  /**
   * Cria um novo produto
   * API: POST /api/produtos
   */
  criarProduto(produto: CriarProdutoDTO): Observable<Produto> {
    return this.api.post<Produto>(this.endpoint, produto);
  }

  /**
   * Atualiza um produto existente
   * API: PUT /api/produtos/{idProduto}
   */
  atualizarProduto(id: string, produto: AtualizarProdutoDTO): Observable<Produto> {
    return this.api.put<Produto>(`${this.endpoint}/${id}`, produto);
  }

  /**
   * Deleta um produto
   * API: DELETE /api/produtos/{idProduto}
   */
  deletarProduto(id: string): Observable<void> {
    return this.api.delete<void>(`${this.endpoint}/${id}`);
  }

  /**
   * Associa uma categoria a um produto pelo nome da categoria
   * API: POST /api/produtos/{idProduto}/categoria-nome/{nomeCategoria}
   */
  associarCategoriaPorNome(idProduto: string, nomeCategoria: string): Observable<string> {
    return this.api.post<string>(`${this.endpoint}/${idProduto}/categoria-nome/${nomeCategoria}`, {});
  }
}
