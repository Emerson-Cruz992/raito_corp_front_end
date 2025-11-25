/**
 * Model: ImagemProduto
 * Representa uma imagem de produto
 */
export interface ImagemProduto {
  id: string;
  idProduto: string;
  url: string;
  principal: boolean;
}

/**
 * DTO para upload de imagem
 */
export interface UploadImagemDTO {
  imagem: File;
  principal: boolean;
}

/**
 * Resposta do upload de imagem
 */
export interface ImagemUploadResponse {
  id: string;
  url: string;
  principal: boolean;
}
