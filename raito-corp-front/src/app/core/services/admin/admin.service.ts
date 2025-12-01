import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

export interface ProdutoAdminDTO {
  idProduto: string;
  nome: string;
  categoria: string;
  preco: number;
  estoque: number;
  vendidos: number;
  receita: number;
  urlImagem: string;
  emDestaque: boolean;
  descricao: string;
  isNovidade: boolean;
  isPromocao: boolean;
  precoOriginal: number;
}

export interface PedidoAdminDTO {
  idPedido: string;
  nomeCliente: string;
  emailCliente: string;
  valorTotal: number;
  status: string;
  criadoEm: string;
  quantidadeItens: number;
}

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private readonly baseUrl = `${environment.apiUrl}/admin`;

  constructor(private http: HttpClient) {}

  listarProdutosAdmin(): Observable<ProdutoAdminDTO[]> {
    return this.http.get<ProdutoAdminDTO[]>(`${this.baseUrl}/produtos`);
  }

  listarPedidosAdmin(): Observable<PedidoAdminDTO[]> {
    return this.http.get<PedidoAdminDTO[]>(`${this.baseUrl}/pedidos`);
  }
}
