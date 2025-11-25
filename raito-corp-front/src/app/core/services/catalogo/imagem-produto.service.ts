import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { ImagemProduto, ImagemUploadResponse } from '../../../shared/models';

@Injectable({
  providedIn: 'root'
})
export class ImagemProdutoService {
  private readonly apiUrl = environment.apiUrl;
  private readonly endpoint = '/imagens';

  constructor(private http: HttpClient) {}

  /**
   * Lista todas as imagens de um produto
   * API: GET /api/imagens/produto/{idProduto}
   */
  listarImagensProduto(idProduto: string): Observable<ImagemProduto[]> {
    return this.http.get<ImagemProduto[]>(`${this.apiUrl}${this.endpoint}/produto/${idProduto}`);
  }

  /**
   * Upload de imagem de produto
   * API: POST /api/imagens/produto/{idProduto}/upload
   */
  uploadImagem(idProduto: string, imagem: File, principal: boolean): Observable<ImagemUploadResponse> {
    const formData = new FormData();
    formData.append('imagem', imagem);
    formData.append('principal', String(principal));

    return this.http.post<ImagemUploadResponse>(
      `${this.apiUrl}${this.endpoint}/produto/${idProduto}/upload`,
      formData
    );
  }

  /**
   * Deleta uma imagem
   * API: DELETE /api/imagens/{idImagem}
   */
  deletarImagem(idImagem: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}${this.endpoint}/${idImagem}`);
  }

  /**
   * Define uma imagem como principal
   * API: PUT /api/imagens/{idImagem}/principal
   */
  definirImagemPrincipal(idImagem: string): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}${this.endpoint}/${idImagem}/principal`, {});
  }
}
