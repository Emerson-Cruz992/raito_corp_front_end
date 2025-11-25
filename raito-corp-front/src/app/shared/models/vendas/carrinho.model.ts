/**
 * Model: Carrinho
 * Representa um carrinho de compras
 */
export interface Carrinho {
  idCarrinho: string;
  idCliente: string;
  criadoEm?: Date;
  itens: ItemCarrinho[];
}

/**
 * Model: ItemCarrinho
 * Representa um item do carrinho
 */
export interface ItemCarrinho {
  idCarrinho: string;
  idProduto: string;
  quantidade: number;
  precoUnitario: number;
}

/**
 * DTO para adicionar item ao carrinho
 */
export interface AdicionarItemCarrinhoDTO {
  idProduto: string;
  quantidade: number;
  preco: number;
}

/**
 * Resposta do cálculo total do carrinho
 */
export interface CarrinhoTotalResponse {
  total: number;
  quantidade: number;
}
