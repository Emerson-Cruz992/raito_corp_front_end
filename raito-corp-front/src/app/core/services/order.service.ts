import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService, PaginatedResponse } from './api.service';
import { Order, OrderStatus } from '../../shared/models/admin.models';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private readonly endpoint = '/orders';

  constructor(private api: ApiService) {}

  /**
   * Busca todos os pedidos (Admin/Manager)
   */
  getAllOrders(page = 0, size = 20, sort?: string): Observable<PaginatedResponse<Order>> {
    const params = { page, size, ...(sort && { sort }) };
    return this.api.get<PaginatedResponse<Order>>(this.endpoint, params);
  }

  /**
   * Busca pedidos do usuário logado
   */
  getMyOrders(page = 0, size = 20): Observable<PaginatedResponse<Order>> {
    const params = { page, size };
    return this.api.get<PaginatedResponse<Order>>(`${this.endpoint}/my-orders`, params);
  }

  /**
   * Busca um pedido por ID
   */
  getOrderById(id: string): Observable<Order> {
    return this.api.get<Order>(`${this.endpoint}/${id}`);
  }

  /**
   * Busca pedidos por status
   */
  getOrdersByStatus(status: OrderStatus, page = 0, size = 20): Observable<PaginatedResponse<Order>> {
    const params = { status, page, size };
    return this.api.get<PaginatedResponse<Order>>(`${this.endpoint}/status`, params);
  }

  /**
   * Cria um novo pedido
   */
  createOrder(order: CreateOrderRequest): Observable<Order> {
    return this.api.post<Order>(this.endpoint, order);
  }

  /**
   * Atualiza o status de um pedido (Admin/Manager)
   */
  updateOrderStatus(id: string, status: OrderStatus): Observable<Order> {
    return this.api.patch<Order>(`${this.endpoint}/${id}/status`, { status });
  }

  /**
   * Cancela um pedido
   */
  cancelOrder(id: string, reason?: string): Observable<Order> {
    return this.api.patch<Order>(`${this.endpoint}/${id}/cancel`, { reason });
  }

  /**
   * Busca estatísticas de pedidos (Admin)
   */
  getOrderStatistics(startDate?: string, endDate?: string): Observable<OrderStatistics> {
    const params = { ...(startDate && { startDate }), ...(endDate && { endDate }) };
    return this.api.get<OrderStatistics>(`${this.endpoint}/statistics`, params);
  }
}

export interface CreateOrderRequest {
  items: OrderItem[];
  shippingAddress: Address;
  billingAddress?: Address;
  paymentMethod: string;
  notes?: string;
}

export interface OrderItem {
  productId: number;
  quantity: number;
}

export interface Address {
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
}

export interface OrderStatistics {
  totalOrders: number;
  totalRevenue: number;
  averageOrderValue: number;
  ordersByStatus: Record<OrderStatus, number>;
  revenueByMonth: { month: string; revenue: number }[];
}
