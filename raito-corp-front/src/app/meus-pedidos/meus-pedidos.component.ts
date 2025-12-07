import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { PedidoService } from '../core/services/vendas/pedido.service';
import { ProdutoService } from '../core/services/catalogo/produto.service';
import { AuthService } from '../core/services/auth.service';
import { Pedido, StatusPedido } from '../shared/models';

interface PedidoComDetalhes extends Pedido {
  expanded?: boolean;
}

@Component({
  selector: 'app-meus-pedidos',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './meus-pedidos.component.html',
  styleUrl: './meus-pedidos.component.scss'
})
export class MeusPedidosComponent implements OnInit {
  pedidos: PedidoComDetalhes[] = [];
  loading = true;
  error: string | null = null;
  produtosMap: Map<string, string> = new Map();

  // Status steps para timeline
  statusSteps: StatusPedido[] = ['PENDENTE', 'PROCESSANDO', 'ENVIADO', 'ENTREGUE'];

  constructor(
    private pedidoService: PedidoService,
    private produtoService: ProdutoService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.carregarPedidos();
  }

  carregarPedidos(): void {
    const user = this.authService.currentUserValue;

    if (!user) {
      this.router.navigate(['/login']);
      return;
    }

    // Usar o ID do usuário diretamente como idCliente
    // (o sistema usa idUsuario como idCliente nos pedidos)
    const userId = user.id.toString();
    this.buscarPedidosDoCliente(userId);
  }

  private buscarPedidosDoCliente(idCliente: string): void {
    forkJoin({
      pedidos: this.pedidoService.listarPorCliente(idCliente),
      produtos: this.produtoService.listarProdutos()
    }).subscribe({
      next: ({ pedidos, produtos }) => {
        // Criar mapa de ID -> Nome do produto
        produtos.forEach(p => {
          this.produtosMap.set(p.id, p.nome);
        });

        this.pedidos = pedidos.map(p => ({ ...p, expanded: false }));
        this.pedidos.sort((a, b) => {
          const dateA = a.criadoEm ? new Date(a.criadoEm).getTime() : 0;
          const dateB = b.criadoEm ? new Date(b.criadoEm).getTime() : 0;
          return dateB - dateA;
        });
        this.loading = false;
      },
      error: (err) => {
        console.error('Erro ao buscar pedidos:', err);
        this.loading = false;
        this.error = 'Erro ao carregar seus pedidos. Tente novamente.';
      }
    });
  }

  getNomeProduto(idProduto: string): string {
    return this.produtosMap.get(idProduto) || `Produto #${idProduto.substring(0, 8)}`;
  }

  toggleExpand(pedido: PedidoComDetalhes): void {
    pedido.expanded = !pedido.expanded;
  }

  getStatusIndex(status: StatusPedido): number {
    if (status === 'CANCELADO') return -1;
    return this.statusSteps.indexOf(status);
  }

  isStepCompleted(pedido: Pedido, stepIndex: number): boolean {
    if (pedido.status === 'CANCELADO') return false;
    return this.getStatusIndex(pedido.status) >= stepIndex;
  }

  isStepActive(pedido: Pedido, stepIndex: number): boolean {
    if (pedido.status === 'CANCELADO') return false;
    return this.getStatusIndex(pedido.status) === stepIndex;
  }

  getStatusLabel(status: StatusPedido): string {
    const labels: Record<StatusPedido, string> = {
      'PENDENTE': 'Pendente',
      'PROCESSANDO': 'Processando',
      'ENVIADO': 'Enviado',
      'ENTREGUE': 'Entregue',
      'CANCELADO': 'Cancelado'
    };
    return labels[status] || status;
  }

  getStatusClass(status: StatusPedido): string {
    const classes: Record<StatusPedido, string> = {
      'PENDENTE': 'status-pendente',
      'PROCESSANDO': 'status-processando',
      'ENVIADO': 'status-enviado',
      'ENTREGUE': 'status-entregue',
      'CANCELADO': 'status-cancelado'
    };
    return classes[status] || '';
  }

  formatDate(date: Date | string | undefined): string {
    if (!date) return '-';
    const d = new Date(date);
    return d.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  formatCurrency(value: number): string {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }

  voltar(): void {
    this.router.navigate(['/']);
  }
}
