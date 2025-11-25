import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../api.service';
import { Endereco, CriarEnderecoDTO, AtualizarEnderecoDTO } from '../../../shared/models';

@Injectable({
  providedIn: 'root'
})
export class EnderecoService {
  private readonly endpoint = '/enderecos';

  constructor(private api: ApiService) {}

  /**
   * Lista todos os endereços
   */
  listarEnderecos(): Observable<Endereco[]> {
    return this.api.get<Endereco[]>(`${this.endpoint}/listar`);
  }

  /**
   * Busca endereços de um cliente
   */
  buscarPorCliente(idCliente: string): Observable<Endereco[]> {
    return this.api.get<Endereco[]>(`${this.endpoint}/cliente/${idCliente}`);
  }

  /**
   * Busca um endereço por ID
   */
  buscarPorId(id: string): Observable<Endereco> {
    return this.api.get<Endereco>(`${this.endpoint}/${id}`);
  }

  /**
   * Cria um novo endereço
   */
  criarEndereco(endereco: CriarEnderecoDTO): Observable<Endereco> {
    return this.api.post<Endereco>(`${this.endpoint}/criar`, endereco);
  }

  /**
   * Atualiza um endereço existente
   */
  atualizarEndereco(id: string, endereco: AtualizarEnderecoDTO): Observable<Endereco> {
    return this.api.put<Endereco>(`${this.endpoint}/${id}`, endereco);
  }

  /**
   * Deleta um endereço
   */
  deletarEndereco(id: string): Observable<void> {
    return this.api.delete<void>(`${this.endpoint}/${id}`);
  }
}
