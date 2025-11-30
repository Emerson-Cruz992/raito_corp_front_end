import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Carrinho, ItemCarrinho, CarrinhoTotalResponse } from '../../../shared/models';

@Injectable({
  providedIn: 'root'
})
export class CarrinhoService {
  private readonly apiUrl = environment.apiUrl;
  private readonly endpoint = '/carrinho';

  constructor(private http: HttpClient) {}

  /**
   * Cria um novo carrinho
   * API: POST /api/carrinho/criar
   */
  criarCarrinho(idCliente: string): Observable<Carrinho> {
    return this.http.post<Carrinho>(
      `${this.apiUrl}${this.endpoint}/criar`,
      { idCliente }
    );
  }

  /**
   * Lista itens do carrinho
   * API: GET /api/carrinho/{idCarrinho}/itens
   */
  listarItens(idCarrinho: string): Observable<ItemCarrinho[]> {
    return this.http.get<ItemCarrinho[]>(`${this.apiUrl}${this.endpoint}/${idCarrinho}/itens`);
  }

  /**
   * Adiciona item ao carrinho
   * API: POST /api/carrinho/{idCarrinho}/adicionar
   */
  adicionarItem(idCarrinho: string, idProduto: string, quantidade: number, preco: number): Observable<ItemCarrinho> {
    return this.http.post<ItemCarrinho>(
      `${this.apiUrl}${this.endpoint}/${idCarrinho}/adicionar`,
      { idProduto, quantidade, preco }
    );
  }

  /**
   * Remove item do carrinho
   * API: DELETE /api/carrinho/{idCarrinho}/remover/{idProduto}
   */
  removerItem(idCarrinho: string, idProduto: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}${this.endpoint}/${idCarrinho}/remover/${idProduto}`);
  }

  /**
   * Limpa o carrinho
   * API: DELETE /api/carrinho/{idCarrinho}/limpar
   */
  limparCarrinho(idCarrinho: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}${this.endpoint}/${idCarrinho}/limpar`);
  }

  /**
   * Calcula total do carrinho
   * API: GET /api/carrinho/{idCarrinho}/total
   */
  calcularTotal(idCarrinho: string): Observable<CarrinhoTotalResponse> {
    return this.http.get<CarrinhoTotalResponse>(`${this.apiUrl}${this.endpoint}/${idCarrinho}/total`);
  }
}
