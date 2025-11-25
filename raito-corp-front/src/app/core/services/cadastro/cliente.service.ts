import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../api.service';
import { Cliente, CriarClienteDTO, AtualizarClienteDTO } from '../../../shared/models';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {
  private readonly endpoint = '/clientes';

  constructor(private api: ApiService) {}

  /**
   * Lista todos os clientes
   */
  listarClientes(): Observable<Cliente[]> {
    return this.api.get<Cliente[]>(`${this.endpoint}/listar`);
  }

  /**
   * Busca um cliente por ID
   */
  buscarPorId(id: string): Observable<Cliente> {
    return this.api.get<Cliente>(`${this.endpoint}/${id}`);
  }

  /**
   * Busca um cliente por CPF
   */
  buscarPorCpf(cpf: string): Observable<Cliente> {
    return this.api.get<Cliente>(`${this.endpoint}/cpf/${cpf}`);
  }

  /**
   * Cria um novo cliente
   */
  criarCliente(cliente: CriarClienteDTO): Observable<Cliente> {
    return this.api.post<Cliente>(`${this.endpoint}/criar`, cliente);
  }

  /**
   * Atualiza um cliente existente
   */
  atualizarCliente(id: string, cliente: AtualizarClienteDTO): Observable<Cliente> {
    return this.api.put<Cliente>(`${this.endpoint}/${id}`, cliente);
  }

  /**
   * Deleta um cliente
   */
  deletarCliente(id: string): Observable<void> {
    return this.api.delete<void>(`${this.endpoint}/${id}`);
  }
}
