// Product Model
export interface Product {
  id: string;
  nome: string;
  categoria: string;
  preco: number;
  precoOriginal?: number;
  estoque: number;
  vendidos: number;
  receita: number;
  imagem?: string;
  descricao?: string;
  badges?: string[];
  emDestaque?: boolean;
}

// Order Model
export interface Order {
  id: string;
  cliente: string;
  email: string;
  itens: number;
  total: number;
  data: string;
  status: OrderStatus;
}

export type OrderStatus = 'Pendente' | 'Processando' | 'Enviado' | 'Entregue' | 'Cancelado';

// Stock Alert Model
export interface StockAlert {
  produtoId: string;
  produtoNome: string;
  categoria: string;
  estoqueAtual: number;
  alertaEm: number;
  status: 'Crítico' | 'Normal';
}

// Dashboard Metrics
export interface DashboardMetrics {
  receitaTotal: number;
  receitaCrescimento: number;
  produtosVendidos: number;
  vendidosCrescimento: number;
  totalPedidos: number;
  pedidosPendentes: number;
  alertasEstoque: number;
  alertasRequerAtencao: number;
}

// Sales by Month
export interface SalesData {
  mes: string;
  pedidos: number;
  receita: number;
}

// Sales by Category
export interface CategorySales {
  categoria: string;
  percentual: number;
}
