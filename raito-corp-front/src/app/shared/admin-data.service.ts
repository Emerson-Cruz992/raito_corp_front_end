import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import {
  Product,
  Order,
  StockAlert,
  DashboardMetrics,
  SalesData,
  CategorySales,
  OrderStatus
} from './models/admin.models';

@Injectable({
  providedIn: 'root'
})
export class AdminDataService {
  // Mock data - em produção, isso viria de uma API
  private products: Product[] = [
    {
      id: 'prod-001',
      nome: 'Lustre Pendente Moderno LED',
      categoria: 'Lustres',
      preco: 299.90,
      estoque: 15,
      vendidos: 45,
      receita: 13495.50,
      imagem: 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=300&h=300&fit=crop'
    },
    {
      id: 'prod-002',
      nome: 'Lustre Cristal Premium',
      categoria: 'Lustres',
      preco: 1299.90,
      precoOriginal: 1599.90,
      estoque: 8,
      vendidos: 12,
      receita: 15598.80,
      imagem: 'https://images.unsplash.com/photo-1565538810643-b5bdb714032a?w=300&h=300&fit=crop'
    },
    {
      id: 'prod-003',
      nome: 'Pendente Industrial Triplo',
      categoria: 'Lustres',
      preco: 349.90,
      estoque: 5,
      vendidos: 28,
      receita: 9797.20,
      imagem: 'https://images.unsplash.com/photo-1524484485831-a92ffc0de03f?w=300&h=300&fit=crop'
    },
    {
      id: 'prod-004',
      nome: 'Lustre Aramado Geométrico',
      categoria: 'Lustres',
      preco: 279.90,
      estoque: 22,
      vendidos: 34,
      receita: 9516.60,
      imagem: 'https://images.unsplash.com/photo-1534105615436-70204e7ec7dd?w=300&h=300&fit=crop'
    },
    {
      id: 'prod-005',
      nome: 'Plafon LED Circular 24W',
      categoria: 'Plafons',
      preco: 159.90,
      estoque: 45,
      vendidos: 78,
      receita: 12472.20,
      imagem: 'https://images.unsplash.com/photo-1550985616-10810253b84d?w=300&h=300&fit=crop'
    },
    {
      id: 'prod-006',
      nome: 'Plafon Quadrado Embutir 36W',
      categoria: 'Plafons',
      preco: 189.90,
      estoque: 32,
      vendidos: 56,
      receita: 10634.40,
      imagem: 'https://images.unsplash.com/photo-1545167622-3a6ac756afa4?w=300&h=300&fit=crop'
    },
    {
      id: 'prod-007',
      nome: 'Plafon Smart RGB WiFi',
      categoria: 'Plafons',
      preco: 329.90,
      estoque: 18,
      vendidos: 42,
      receita: 13855.80,
      imagem: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=300&fit=crop'
    },
    {
      id: 'prod-008',
      nome: 'Plafon Sobrepor 18W',
      categoria: 'Plafons',
      preco: 129.90,
      estoque: 3,
      vendidos: 89,
      receita: 11561.10,
      imagem: 'https://images.unsplash.com/photo-1567225557594-88d73e55f2cb?w=300&h=300&fit=crop'
    },
    {
      id: 'prod-009',
      nome: 'Trilho Industrial com 3 Spots',
      categoria: 'Trilhos',
      preco: 239.90,
      estoque: 28,
      vendidos: 38,
      receita: 9116.20,
      imagem: 'https://images.unsplash.com/photo-1524439878670-c4be474249e8?w=300&h=300&fit=crop'
    },
    {
      id: 'prod-010',
      nome: 'Trilho Magnético 2m + 5 Spots',
      categoria: 'Trilhos',
      preco: 589.90,
      estoque: 12,
      vendidos: 23,
      receita: 13567.70,
      imagem: 'https://images.unsplash.com/photo-1540932239986-30128078f3c5?w=300&h=300&fit=crop'
    }
  ];

  private orders: Order[] = [
    { id: 'ORD-001', cliente: 'João Silva', email: 'joao@email.com', itens: 3, total: 789.70, data: '31/10/2025', status: 'Entregue' },
    { id: 'ORD-002', cliente: 'Maria Santos', email: 'maria@email.com', itens: 3, total: 789.70, data: '30/11/2025', status: 'Enviado' },
    { id: 'ORD-003', cliente: 'Pedro Oliveira', email: 'pedro@email.com', itens: 2, total: 519.80, data: '29/11/2025', status: 'Processando' },
    { id: 'ORD-004', cliente: 'Ana Costa', email: 'ana@email.com', itens: 1, total: 329.90, data: '28/11/2025', status: 'Pendente' },
    { id: 'ORD-005', cliente: 'Carlos Mendes', email: 'carlos@email.com', itens: 4, total: 1098.60, data: '27/11/2025', status: 'Enviado' },
    { id: 'ORD-006', cliente: 'Juliana Lima', email: 'juliana@email.com', itens: 1, total: 329.90, data: '31/10/2025', status: 'Cancelado' },
    { id: 'ORD-007', cliente: 'Roberto Alves', email: 'roberto@email.com', itens: 4, total: 1098.60, data: '29/10/2025', status: 'Entregue' },
    { id: 'ORD-008', cliente: 'Fernanda Souza', email: 'fernanda@email.com', itens: 3, total: 879.70, data: '02/11/2025', status: 'Processando' }
  ];

  private salesByMonth: SalesData[] = [
    { mes: 'Mai', pedidos: 32, receita: 45234.50 },
    { mes: 'Jun', pedidos: 38, receita: 52841.30 },
    { mes: 'Jul', pedidos: 35, receita: 48932.10 },
    { mes: 'Ago', pedidos: 45, receita: 61245.80 },
    { mes: 'Set', pedidos: 42, receita: 55632.40 },
    { mes: 'Out', pedidos: 52, receita: 68734.20 },
    { mes: 'Nov', pedidos: 28, receita: 42156.80 }
  ];

  private categoryDistribution: CategorySales[] = [
    { categoria: 'Lustres', percentual: 35 },
    { categoria: 'Plafons', percentual: 28 },
    { categoria: 'Trilhos', percentual: 18 },
    { categoria: 'Comercial', percentual: 12 },
    { categoria: 'Outros', percentual: 7 }
  ];

  private productsSubject = new BehaviorSubject<Product[]>(this.products);
  private ordersSubject = new BehaviorSubject<Order[]>(this.orders);

  constructor() { }

  // Products Methods
  getProducts(): Observable<Product[]> {
    return this.productsSubject.asObservable();
  }

  getProductById(id: string): Product | undefined {
    return this.products.find(p => p.id === id);
  }

  addProduct(product: Product): void {
    this.products.push(product);
    this.productsSubject.next([...this.products]);
  }

  updateProduct(id: string, updates: Partial<Product>): void {
    const index = this.products.findIndex(p => p.id === id);
    if (index !== -1) {
      this.products[index] = { ...this.products[index], ...updates };
      this.productsSubject.next([...this.products]);
    }
  }

  deleteProduct(id: string): void {
    this.products = this.products.filter(p => p.id !== id);
    this.productsSubject.next([...this.products]);
  }

  // Orders Methods
  getOrders(): Observable<Order[]> {
    return this.ordersSubject.asObservable();
  }

  getOrderById(id: string): Order | undefined {
    return this.orders.find(o => o.id === id);
  }

  updateOrderStatus(id: string, status: OrderStatus): void {
    const index = this.orders.findIndex(o => o.id === id);
    if (index !== -1) {
      this.orders[index].status = status;
      this.ordersSubject.next([...this.orders]);
    }
  }

  // Stock Alerts Methods
  getStockAlerts(): StockAlert[] {
    return this.products
      .filter(p => p.estoque <= 10)
      .map(p => ({
        produtoId: p.id,
        produtoNome: p.nome,
        categoria: p.categoria,
        estoqueAtual: p.estoque,
        alertaEm: 10,
        status: p.estoque <= 5 ? 'Crítico' : 'Normal'
      }));
  }

  // Dashboard Metrics
  getDashboardMetrics(): DashboardMetrics {
    const receitaTotal = this.products.reduce((sum, p) => sum + p.receita, 0);
    const produtosVendidos = this.products.reduce((sum, p) => sum + p.vendidos, 0);
    const totalPedidos = this.orders.length;
    const pedidosPendentes = this.orders.filter(o => o.status === 'Pendente').length;
    const alertasEstoque = this.getStockAlerts().length;
    const alertasRequerAtencao = this.getStockAlerts().filter(a => a.status === 'Crítico').length;

    return {
      receitaTotal,
      receitaCrescimento: 12.5,
      produtosVendidos,
      vendidosCrescimento: 8.3,
      totalPedidos,
      pedidosPendentes,
      alertasEstoque,
      alertasRequerAtencao
    };
  }

  // Sales Data
  getSalesByMonth(): SalesData[] {
    return this.salesByMonth;
  }

  getCategorySales(): CategorySales[] {
    return this.categoryDistribution;
  }

  // Top Products
  getTopProducts(limit: number = 5): Product[] {
    return [...this.products]
      .sort((a, b) => b.receita - a.receita)
      .slice(0, limit);
  }
}
