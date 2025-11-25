/**
 * Model: Categoria
 * Representa uma categoria de produtos
 */
export interface Categoria {
  id: string;
  nome: string;
  descricao?: string;
  ativo: boolean;
}

/**
 * DTO para criação de categoria
 */
export interface CriarCategoriaDTO {
  nome: string;
  descricao?: string;
}

/**
 * DTO para atualização de categoria
 */
export interface AtualizarCategoriaDTO {
  nome?: string;
  descricao?: string;
  ativo?: boolean;
}

/**
 * Model: ProdutoCategoria
 * Representa a relação entre produto e categoria
 */
export interface ProdutoCategoria {
  produtoId: string;
  categoriaId: string;
}
