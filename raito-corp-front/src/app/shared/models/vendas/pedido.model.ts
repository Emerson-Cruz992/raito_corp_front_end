/**
 * Model: Pedido
 * Representa um pedido realizado
 */
export interface Pedido {
  idPedido: string;
  idCliente: string;
  idEnderecoEntrega?: string;
  valorTotal: number;
  status: StatusPedido;
  criadoEm?: Date;
  itens: ItemPedido[];
}

/**
 * Enum de status do pedido
 */
export type StatusPedido =
  | 'PENDENTE'
  | 'PROCESSANDO'
  | 'ENVIADO'
  | 'ENTREGUE'
  | 'CANCELADO';

/**
 * Model: ItemPedido
 * Representa um item do pedido
 */
export interface ItemPedido {
  idPedido: string;
  idProduto: string;
  quantidade: number;
  precoUnitario: number;
}

/**
 * DTO para finalizar pedido
 */
export interface FinalizarPedidoDTO {
  idCliente: string;
  idCarrinho: string;
  idEnderecoEntrega: string;
}

/**
 * DTO para atualizar status do pedido
 */
export interface AtualizarStatusPedidoDTO {
  status: StatusPedido;
}

/**
 * Resposta da finalização do pedido
 */
export interface PedidoFinalizadoResponse {
  idPedido: string;
  idCliente: string;
  valorTotal: number;
  status: StatusPedido;
  itens: ItemPedido[];
}
