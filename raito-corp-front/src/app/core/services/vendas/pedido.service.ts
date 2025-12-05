import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Pedido, PedidoFinalizadoResponse, StatusPedido } from '../../../shared/models';

@Injectable({
  providedIn: 'root'
})
export class PedidoService {
  private readonly apiUrl = environment.apiUrl;
  private readonly endpoint = '/pedidos';

  constructor(private http: HttpClient) {}

  /**
   * Finaliza um pedido
   * API: POST /api/pedidos/finalizar?idCliente={UUID}&idCarrinho={UUID}&idEnderecoEntrega={UUID}
   */
  finalizarPedido(idCliente: string, idCarrinho: string, idEnderecoEntrega: string): Observable<PedidoFinalizadoResponse> {
    return this.http.post<PedidoFinalizadoResponse>(
      `${this.apiUrl}${this.endpoint}/finalizar?idCliente=${idCliente}&idCarrinho=${idCarrinho}&idEnderecoEntrega=${idEnderecoEntrega}`,
      {}
    );
  }

  /**
   * Busca um pedido por ID
   * API: GET /api/pedidos/{idPedido}
   */
  buscarPorId(idPedido: string): Observable<Pedido> {
    return this.http.get<Pedido>(`${this.apiUrl}${this.endpoint}/${idPedido}`);
  }

  /**
   * Lista pedidos de um cliente
   * API: GET /api/pedidos/cliente/{idCliente}
   */
  listarPorCliente(idCliente: string): Observable<Pedido[]> {
    return this.http.get<Pedido[]>(`${this.apiUrl}${this.endpoint}/cliente/${idCliente}`);
  }

  /**
   * Atualiza status do pedido
   * API: PUT /api/pedidos/{idPedido}/status
   */
  atualizarStatus(idPedido: string, status: StatusPedido): Observable<Pedido> {
    return this.http.put<Pedido>(
      `${this.apiUrl}${this.endpoint}/${idPedido}/status`,
      { status }
    );
  }

  /**
   * Lista todos os pedidos (Admin)
   * API: GET /api/pedidos
   */
  listarTodos(): Observable<Pedido[]> {
    return this.http.get<Pedido[]>(`${this.apiUrl}${this.endpoint}`);
  }
}
