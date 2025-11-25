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
  criadoEm?: Date;
}

/**
 * DTO para criação de produto
 */
export interface CriarProdutoDTO {
  nome: string;
  descricao?: string;
  preco: number;
  ativo?: boolean;
}

/**
 * DTO para atualização de produto
 */
export interface AtualizarProdutoDTO {
  nome?: string;
  descricao?: string;
  preco?: number;
  ativo?: boolean;
}
