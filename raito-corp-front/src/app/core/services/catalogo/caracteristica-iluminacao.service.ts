import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import {
  CaracteristicaIluminacao,
  CriarCaracteristicaIluminacaoDTO,
  AtualizarCaracteristicaIluminacaoDTO
} from '../../../shared/models';

@Injectable({
  providedIn: 'root'
})
export class CaracteristicaIluminacaoService {
  private readonly apiUrl = environment.apiUrl;
  private readonly endpoint = '/iluminacao';

  constructor(private http: HttpClient) {}

  /**
   * Busca características de iluminação de um produto
   * API: GET /api/iluminacao/produto/{idProduto}
   */
  buscarPorProduto(idProduto: string): Observable<CaracteristicaIluminacao> {
    return this.http.get<CaracteristicaIluminacao>(`${this.apiUrl}${this.endpoint}/produto/${idProduto}`);
  }

  /**
   * Cria características de iluminação para um produto
   * API: POST /api/iluminacao/produto/{idProduto}?potencia=X&temperaturaCor=Y...
   */
  criar(idProduto: string, caracteristica: CriarCaracteristicaIluminacaoDTO): Observable<CaracteristicaIluminacao> {
    let params = new HttpParams()
      .set('potencia', caracteristica.potencia)
      .set('temperaturaCor', caracteristica.temperaturaCor)
      .set('fluxoLuminoso', caracteristica.fluxoLuminoso);

    if (caracteristica.tensao) {
      params = params.set('tensao', caracteristica.tensao);
    }
    if (caracteristica.eficiencia) {
      params = params.set('eficiencia', caracteristica.eficiencia);
    }
    if (caracteristica.indiceProtecao) {
      params = params.set('indiceProtecao', caracteristica.indiceProtecao);
    }
    if (caracteristica.regulavel !== undefined) {
      params = params.set('regulavel', String(caracteristica.regulavel));
    }

    return this.http.post<CaracteristicaIluminacao>(
      `${this.apiUrl}${this.endpoint}/produto/${idProduto}`,
      {},
      { params }
    );
  }

  /**
   * Atualiza características de iluminação
   * API: PUT /api/iluminacao/{idCaracteristica}
   */
  atualizar(idCaracteristica: string, caracteristica: AtualizarCaracteristicaIluminacaoDTO): Observable<CaracteristicaIluminacao> {
    return this.http.put<CaracteristicaIluminacao>(
      `${this.apiUrl}${this.endpoint}/${idCaracteristica}`,
      caracteristica
    );
  }

  /**
   * Deleta características de iluminação
   * API: DELETE /api/iluminacao/{idCaracteristica}
   */
  deletar(idCaracteristica: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}${this.endpoint}/${idCaracteristica}`);
  }
}
