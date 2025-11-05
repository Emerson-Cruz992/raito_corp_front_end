import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminDataService } from '../../shared/admin-data.service';
import { Order, OrderStatus } from '../../shared/models/admin.models';

@Component({
  selector: 'app-orders-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './orders-management.component.html',
  styleUrl: './orders-management.component.scss'
})
export class OrdersManagementComponent implements OnInit {
  orders: Order[] = [];
  selectedOrder: Order | null = null;
  showModal = false;
  statusOptions: OrderStatus[] = ['Pendente', 'Processando', 'Enviado', 'Entregue', 'Cancelado'];

  constructor(private adminDataService: AdminDataService) {}

  ngOnInit() {
    this.adminDataService.getOrders().subscribe(orders => {
      this.orders = orders;
    });
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
