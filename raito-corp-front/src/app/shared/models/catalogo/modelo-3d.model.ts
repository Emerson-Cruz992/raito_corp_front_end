/**
 * Model: Modelo3D
 * Representa um modelo 3D de produto
 */
export interface Modelo3D {
  id: string;
  idProduto: string;
  nomeArquivo: string;
  url: string;
  formato: string;
}

/**
 * DTO para upload de modelo 3D
 */
export interface UploadModelo3DDTO {
  arquivo: File;
  formato: string;
}
