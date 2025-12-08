import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
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
import { EstoqueService } from '../core/services/estoque/estoque.service';
import { AdminService, ProdutoAdminDTO, PedidoAdminDTO } from '../core/services/admin/admin.service';

@Injectable({
  providedIn: 'root'
})
export class AdminDataService {
  private products: Product[] = [];
  private orders: Order[] = [];
  private productsSubject = new BehaviorSubject<Product[]>([]);
  private ordersSubject = new BehaviorSubject<Order[]>([]);

  constructor(
    private produtoService: ProdutoService,
    private estoqueService: EstoqueService,
    private adminService: AdminService
  ) {
    this.loadRealData();
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
      precoOriginal: produto.precoOriginal,
      estoque: produto.estoque,
      vendidos: produto.vendidos,
      receita: produto.receita,
      imagem: produto.urlImagem || 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=300&h=300&fit=crop',
      emDestaque: produto.emDestaque,
      isNovidade: produto.isNovidade,
      isPromocao: produto.isPromocao,
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

        // Criar estoque para o produto (sempre, mesmo se for 0)
        const quantidadeEstoque = product.estoque ?? 0;
        this.estoqueService.adicionarEstoque(novoProduto.id, quantidadeEstoque).subscribe({
          error: (err: any) => console.error('Erro ao criar estoque:', err)
        });
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

        // Atualizar estoque se necessário (o backend agora faz upsert automaticamente)
        if (updates.estoque !== undefined) {
          this.estoqueService.atualizarEstoque(id, updates.estoque!).subscribe({
            error: (err: any) => console.error('Erro ao atualizar estoque:', err)
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
      // order.data vem como string formatada "dd/MM/yyyy" (ex: "31/10/2025")
      const [day, month, year] = order.data.split('/');
      const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));

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
