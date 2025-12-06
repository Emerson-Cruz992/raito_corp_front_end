import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PedidoService } from '../../core/services/vendas/pedido.service';
import { Pedido, StatusPedido } from '../../shared/models';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-orders-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './orders-management.component.html',
  styleUrl: './orders-management.component.scss'
})
export class OrdersManagementComponent implements OnInit, OnDestroy {
  orders: Pedido[] = [];
  selectedOrder: Pedido | null = null;
  showModal = false;
  statusOptions: StatusPedido[] = ['PENDENTE', 'PROCESSANDO', 'ENVIADO', 'ENTREGUE', 'CANCELADO'];
  private destroy$ = new Subject<void>();

  constructor(private pedidoService: PedidoService) {}

  ngOnInit() {
    this.loadOrders();
  }

  loadOrders() {
    this.pedidoService.listarTodos()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (orders) => {
          this.orders = orders || [];
          console.log('Pedidos carregados:', this.orders.length);
          console.log('Dados completos dos pedidos:', JSON.stringify(orders, null, 2));
        },
        error: (error) => {
          console.error('Erro ao carregar pedidos:', error);
          this.orders = [];
          alert('Erro ao carregar pedidos. Por favor, tente novamente.');
        }
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  openOrderDetails(order: Pedido) {
    this.selectedOrder = {...order};
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.selectedOrder = null;
  }

  updateOrderStatus() {
    if (this.selectedOrder && this.selectedOrder.idPedido) {
      this.pedidoService.atualizarStatus(this.selectedOrder.idPedido, this.selectedOrder.status)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (pedidoAtualizado) => {
            // Atualiza o pedido na lista
            const index = this.orders.findIndex(p => p.idPedido === pedidoAtualizado.idPedido);
            if (index !== -1) {
              this.orders[index] = pedidoAtualizado;
            }
            this.closeModal();
          },
          error: (error) => {
            console.error('Erro ao atualizar status do pedido:', error);
            alert('Erro ao atualizar status do pedido');
          }
        });
    }
  }

  formatCurrency(value: number | null | undefined): string {
    if (value === null || value === undefined) {
      return 'R$ 0,00';
    }
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }

  getStatusColor(status: StatusPedido): string {
    const colors: Record<StatusPedido, string> = {
      'PENDENTE': 'warning',
      'PROCESSANDO': 'info',
      'ENVIADO': 'success',
      'ENTREGUE': 'success',
      'CANCELADO': 'danger'
    };
    return colors[status];
  }

  getTotalItems(order: Pedido): number {
    if (!order.itens || order.itens.length === 0) {
      return 0;
    }
    return order.itens.reduce((total, item) => total + (item.quantidade || 0), 0);
  }
}
