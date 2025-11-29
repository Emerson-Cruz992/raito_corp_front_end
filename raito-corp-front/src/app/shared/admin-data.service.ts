import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, forkJoin, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import {
  Product,
  Order,
  StockAlert,
  DashboardMetrics,
  SalesData,
  CategorySales,
  OrderStatus
} from './models/admin.models';
import { ProdutoService } from '../core/services/catalogo/produto.service';
import { PedidoService } from '../core/services/vendas/pedido.service';
import { EstoqueService } from '../core/services/estoque/estoque.service';
import { AdminService, ProdutoAdminDTO, PedidoAdminDTO } from '../core/services/admin/admin.service';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AdminDataService {
  // Mock data para fallback
  private mockProducts: Product[] = [
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

  private mockOrders: Order[] = [
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

  private products: Product[] = [];
  private orders: Order[] = [];
  private productsSubject = new BehaviorSubject<Product[]>([]);
  private ordersSubject = new BehaviorSubject<Order[]>([]);

  constructor(
    private produtoService: ProdutoService,
    private pedidoService: PedidoService,
    private estoqueService: EstoqueService,
    private adminService: AdminService
  ) {
    if (environment.enableMockData) {
      this.products = this.mockProducts;
      this.orders = this.mockOrders;
      this.productsSubject.next(this.mockProducts);
      this.ordersSubject.next(this.mockOrders);
    } else {
      this.loadRealData();
    }
  }

  private loadRealData(): void {
    // Carregar produtos do backend usando endpoint de admin
    this.adminService.listarProdutosAdmin().pipe(
      map(produtos => produtos.map(p => this.convertProdutoAdminToProduct(p))),
      catchError((err) => {
        console.warn('Erro ao carregar produtos:', err);
        return of([]);
      })
    ).subscribe(products => {
      this.products = products;
      this.productsSubject.next(products);
    });

    // Carregar pedidos do backend usando endpoint de admin
    this.adminService.listarPedidosAdmin().pipe(
      map(pedidos => pedidos.map(p => this.convertPedidoAdminToOrder(p))),
      catchError((err) => {
        console.warn('Erro ao carregar pedidos:', err);
        return of([]);
      })
    ).subscribe(orders => {
      this.orders = orders;
      this.ordersSubject.next(orders);
    });
  }

  // Método público para forçar reload dos dados
  reloadData(): void {
    this.loadRealData();
  }

  private convertProdutoAdminToProduct(produto: ProdutoAdminDTO): Product {
    return {
      id: produto.idProduto,
      nome: produto.nome,
      categoria: produto.categoria,
      preco: produto.preco,
      estoque: produto.estoque,
      vendidos: produto.vendidos,
      receita: produto.receita,
      imagem: produto.urlImagem || 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=300&h=300&fit=crop',
      emDestaque: produto.emDestaque,
      descricao: produto.descricao
    };
  }

  private convertPedidoAdminToOrder(pedido: PedidoAdminDTO): Order {
    return {
      id: pedido.idPedido,
      cliente: pedido.nomeCliente,
      email: pedido.emailCliente,
      itens: pedido.quantidadeItens,
      total: pedido.valorTotal,
      data: new Date(pedido.criadoEm).toLocaleDateString('pt-BR'),
      status: this.mapStatusPedido(pedido.status)
    };
  }

  private mapStatusPedido(status: string): OrderStatus {
    const statusMap: Record<string, OrderStatus> = {
      'PENDENTE': 'Pendente',
      'PROCESSANDO': 'Processando',
      'ENVIADO': 'Enviado',
      'ENTREGUE': 'Entregue',
      'CANCELADO': 'Cancelado'
    };
    return statusMap[status?.toUpperCase()] || 'Pendente';
  }

  // Products Methods
  getProducts(): Observable<Product[]> {
    return this.productsSubject.asObservable();
  }

  getProductById(id: string): Product | undefined {
    return this.products.find(p => p.id === id);
  }

  addProduct(product: Product): void {
    // Criar produto no backend
    const produtoBackend = {
      nome: product.nome,
      descricao: product.descricao || product.nome,
      preco: product.preco,
      ativo: true
    };

    this.produtoService.criarProduto(produtoBackend).subscribe({
      next: (novoProduto: any) => {
        // Associar categoria se fornecida
        if (product.categoria) {
          this.produtoService.associarCategoriaPorNome(novoProduto.id, product.categoria).subscribe({
            error: (err: any) => console.error('Erro ao associar categoria:', err)
          });
        }

        // Criar estoque para o produto se fornecido
        if (product.estoque && product.estoque > 0) {
          this.estoqueService.adicionarEstoque(novoProduto.id, product.estoque).subscribe({
            error: (err: any) => console.error('Erro ao criar estoque:', err)
          });
        }
        // Recarregar dados
        this.loadRealData();
      },
      error: (error: any) => {
        console.error('Erro ao criar produto:', error);
      }
    });
  }

  updateProduct(id: string, updates: Partial<Product>): void {
    // Atualizar produto no backend
    const produtoBackend = {
      nome: updates.nome,
      descricao: updates.descricao || updates.nome || 'Produto',
      preco: updates.preco,
      ativo: true
    };

    this.produtoService.atualizarProduto(id, produtoBackend).subscribe({
      next: () => {
        // Associar/atualizar categoria se fornecida
        if (updates.categoria) {
          this.produtoService.associarCategoriaPorNome(id, updates.categoria).subscribe({
            error: (err: any) => console.error('Erro ao associar categoria:', err)
          });
        }

        // Atualizar estoque se necessário
        if (updates.estoque !== undefined) {
          this.estoqueService.atualizarEstoque(id, updates.estoque!).subscribe({
            error: (err: any) => {
              // Se falhar, tentar adicionar estoque
              this.estoqueService.adicionarEstoque(id, updates.estoque!).subscribe({
                error: (err2: any) => console.error('Erro ao criar/atualizar estoque:', err2)
              });
            }
          });
        }
        // Recarregar dados
        this.loadRealData();
      },
      error: (error: any) => {
        console.error('Erro ao atualizar produto:', error);
      }
    });
  }

  deleteProduct(id: string): void {
    // Excluir produto no backend
    this.produtoService.deletarProduto(id).subscribe({
      next: () => {
        // Recarregar dados
        this.loadRealData();
      },
      error: (error: any) => {
        console.error('Erro ao excluir produto:', error);
      }
    });
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
    // Calcular vendas por mês a partir dos pedidos reais
    const salesByMonth: { [key: string]: { pedidos: number, receita: number } } = {};

    this.orders.forEach(order => {
      const date = new Date(order.data.split('/').reverse().join('-'));
      const monthKey = date.toLocaleString('pt-BR', { month: 'short' });
      const monthLabel = monthKey.charAt(0).toUpperCase() + monthKey.slice(1, 3);

      if (!salesByMonth[monthLabel]) {
        salesByMonth[monthLabel] = { pedidos: 0, receita: 0 };
      }

      salesByMonth[monthLabel].pedidos++;
      salesByMonth[monthLabel].receita += order.total;
    });

    // Converter para array ordenado pelos últimos 7 meses
    const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    const currentMonth = new Date().getMonth();
    const last7Months = [];

    for (let i = 6; i >= 0; i--) {
      const monthIndex = (currentMonth - i + 12) % 12;
      const monthLabel = months[monthIndex];
      last7Months.push({
        mes: monthLabel,
        pedidos: salesByMonth[monthLabel]?.pedidos || 0,
        receita: salesByMonth[monthLabel]?.receita || 0
      });
    }

    return last7Months;
  }

  getCategorySales(): CategorySales[] {
    // Calcular vendas por categoria a partir dos produtos reais
    const salesByCategory: { [key: string]: number } = {};
    let totalReceita = 0;

    this.products.forEach(product => {
      if (!salesByCategory[product.categoria]) {
        salesByCategory[product.categoria] = 0;
      }
      salesByCategory[product.categoria] += product.receita;
      totalReceita += product.receita;
    });

    // Converter para percentual
    const categorySales: CategorySales[] = Object.entries(salesByCategory)
      .map(([categoria, receita]) => ({
        categoria,
        percentual: totalReceita > 0 ? Math.round((receita / totalReceita) * 100) : 0
      }))
      .filter(item => item.percentual > 0)
      .sort((a, b) => b.percentual - a.percentual);

    // Retornar array vazio se não houver dados, não usar mock
    return categorySales;
  }

  // Top Products
  getTopProducts(limit: number = 5): Product[] {
    return [...this.products]
      .sort((a, b) => b.receita - a.receita)
      .slice(0, limit);
  }
}
