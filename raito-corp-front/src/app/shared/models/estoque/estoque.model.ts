/**
 * Model: Estoque
 * Representa o controle de estoque de um produto
 */
export interface Estoque {
  idEstoque: string;
  idProduto: string;
  quantidade: number;
  reservado: number;
  atualizadoEm?: Date;
}

/**
 * DTO para adicionar produto ao estoque
 */
export interface AdicionarEstoqueDTO {
  idProduto: string;
  quantidade: number;
}

/**
 * DTO para atualizar quantidade em estoque
 */
export interface AtualizarEstoqueDTO {
  idProduto: string;
  quantidade: number;
}

/**
 * DTO para reservar estoque
 */
export interface ReservarEstoqueDTO {
  idProduto: string;
  quantidade: number;
}

/**
 * DTO para liberar reserva de estoque
 */
export interface LiberarEstoqueDTO {
  idProduto: string;
  quantidade: number;
}

/**
 * DTO para movimentar saída de estoque
 */
export interface SaidaEstoqueDTO {
  idProduto: string;
  quantidade: number;
}
