import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Estoque } from '../../../shared/models';

@Injectable({
  providedIn: 'root'
})
export class EstoqueService {
  private readonly apiUrl = environment.apiUrl;
  private readonly endpoint = '/estoque';

  constructor(private http: HttpClient) {}

  /**
   * Lista todo o estoque
   * API: GET /api/estoque
   */
  listarEstoque(): Observable<Estoque[]> {
    return this.http.get<Estoque[]>(`${this.apiUrl}${this.endpoint}`);
  }

  /**
   * Busca estoque de um produto específico
   * API: GET /api/estoque/{idProduto}
   */
  buscarPorProduto(idProduto: string): Observable<Estoque> {
    return this.http.get<Estoque>(`${this.apiUrl}${this.endpoint}/${idProduto}`);
  }

  /**
   * Adiciona produto ao estoque
   * API: POST /api/estoque/adicionar?idProduto={UUID}&quantidade=10
   */
  adicionarEstoque(idProduto: string, quantidade: number): Observable<Estoque> {
    return this.http.post<Estoque>(
      `${this.apiUrl}${this.endpoint}/adicionar?idProduto=${idProduto}&quantidade=${quantidade}`,
      {}
    );
  }

  /**
   * Atualiza quantidade em estoque
   * API: PUT /api/estoque/atualizar?idProduto={UUID}&quantidade=50
   */
  atualizarEstoque(idProduto: string, quantidade: number): Observable<Estoque> {
    return this.http.put<Estoque>(
      `${this.apiUrl}${this.endpoint}/atualizar?idProduto=${idProduto}&quantidade=${quantidade}`,
      {}
    );
  }

  /**
   * Reserva estoque
   * API: PUT /api/estoque/reservar?idProduto={UUID}&quantidade=3
   */
  reservarEstoque(idProduto: string, quantidade: number): Observable<Estoque> {
    return this.http.put<Estoque>(
      `${this.apiUrl}${this.endpoint}/reservar?idProduto=${idProduto}&quantidade=${quantidade}`,
      {}
    );
  }

  /**
   * Libera reserva de estoque
   * API: PUT /api/estoque/liberar?idProduto={UUID}&quantidade=2
   */
  liberarReserva(idProduto: string, quantidade: number): Observable<Estoque> {
    return this.http.put<Estoque>(
      `${this.apiUrl}${this.endpoint}/liberar?idProduto=${idProduto}&quantidade=${quantidade}`,
      {}
    );
  }

  /**
   * Movimenta saída de estoque
   * API: PUT /api/estoque/saida?idProduto={UUID}&quantidade=1
   */
  movimentarSaida(idProduto: string, quantidade: number): Observable<Estoque> {
    return this.http.put<Estoque>(
      `${this.apiUrl}${this.endpoint}/saida?idProduto=${idProduto}&quantidade=${quantidade}`,
      {}
    );
  }
}
