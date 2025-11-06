import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminDataService } from '../../shared/admin-data.service';
import { Order, OrderStatus } from '../../shared/models/admin.models';
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
  orders: Order[] = [];
  selectedOrder: Order | null = null;
  showModal = false;
  statusOptions: OrderStatus[] = ['Pendente', 'Processando', 'Enviado', 'Entregue', 'Cancelado'];
  private destroy$ = new Subject<void>();

  constructor(private adminDataService: AdminDataService) {}

  ngOnInit() {
    this.adminDataService.getOrders()
      .pipe(takeUntil(this.destroy$))
      .subscribe(orders => {
        this.orders = orders;
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  openOrderDetails(order: Order) {
    this.selectedOrder = {...order};
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.selectedOrder = null;
  }

  updateOrderStatus() {
    if (this.selectedOrder) {
      this.adminDataService.updateOrderStatus(this.selectedOrder.id, this.selectedOrder.status);
      this.closeModal();
    }
  }

  formatCurrency(value: number): string {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }

  getStatusColor(status: OrderStatus): string {
    const colors: Record<OrderStatus, string> = {
      'Pendente': 'warning',
      'Processando': 'info',
      'Enviado': 'success',
      'Entregue': 'success',
      'Cancelado': 'danger'
    };
    return colors[status];
  }
}
