/**
 * Model: Produto
 * Representa um produto do catálogo
 */
export interface Produto {
  id: string;
  nome: string;
  descricao?: string;
  preco: number;
  ativo: boolean;
  emDestaque?: boolean;
  isNovidade?: boolean;
  isPromocao?: boolean;
  precoOriginal?: number;
  imagemUrl?: string;
  criadoEm?: Date;
  quantidadeEstoque?: number; // Quantidade disponível no estoque
}

/**
 * DTO para criação de produto
 */
export interface CriarProdutoDTO {
  nome: string;
  descricao?: string;
  preco: number;
  ativo?: boolean;
  emDestaque?: boolean;
  isNovidade?: boolean;
  isPromocao?: boolean;
  precoOriginal?: number;
}

/**
 * DTO para atualização de produto
 */
export interface AtualizarProdutoDTO {
  nome?: string;
  descricao?: string;
  preco?: number;
  ativo?: boolean;
  emDestaque?: boolean;
  isNovidade?: boolean;
  isPromocao?: boolean;
  precoOriginal?: number;
}
