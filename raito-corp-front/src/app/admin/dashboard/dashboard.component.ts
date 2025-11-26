import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminDataService } from '../../shared/admin-data.service';
import { DashboardMetrics, SalesData, CategorySales, Product } from '../../shared/models/admin.models';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  metrics!: DashboardMetrics;
  salesByMonth: SalesData[] = [];
  categorySales: CategorySales[] = [];
  topProducts: Product[] = [];

  constructor(private adminDataService: AdminDataService) {}

  ngOnInit() {
    // Forçar reload dos dados ao entrar no dashboard
    this.adminDataService.reloadData();

    // Aguardar um pouco e então carregar os dados
    setTimeout(() => {
      this.loadDashboardData();
    }, 500);

    // Se inscrever para atualizações de produtos e pedidos
    this.adminDataService.getProducts().subscribe(() => {
      this.loadDashboardData();
    });

    this.adminDataService.getOrders().subscribe(() => {
      this.loadDashboardData();
    });
  }

  loadDashboardData() {
    this.metrics = this.adminDataService.getDashboardMetrics();
    this.salesByMonth = this.adminDataService.getSalesByMonth();
    this.categorySales = this.adminDataService.getCategorySales();
    this.topProducts = this.adminDataService.getTopProducts(5);
  }

  formatCurrency(value: number): string {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }

  getMaxSalesValue(): number {
    if (!this.salesByMonth || this.salesByMonth.length === 0) {
      return 1;
    }
    const max = Math.max(...this.salesByMonth.map(s => s.receita));
    return max > 0 ? max : 1;
  }

  getSalesBarHeight(receita: number): number {
    if (!receita || receita === 0) {
      return 0;
    }
    const max = this.getMaxSalesValue();
    const percentage = (receita / max) * 100;
    // Garantir altura mínima de 10% para valores muito pequenos serem visíveis
    return Math.max(percentage, 10);
  }

  getCategoryColor(index: number): string {
    const colors = ['#111827', '#374151', '#4b5563', '#6b7280', '#9ca3af'];
    return colors[index] || '#d1d5db';
  }

  getPieSegments() {
    const radius = 70;
    const circumference = 2 * Math.PI * radius;
    let accumulatedPercentage = 0;

    return this.categorySales.map((cat, index) => {
      const percentage = cat.percentual;
      const dashLength = (percentage / 100) * circumference;
      const gapLength = circumference - dashLength;
      const rotation = (accumulatedPercentage / 100) * 360;

      accumulatedPercentage += percentage;

      return {
        color: this.getCategoryColor(index),
        dasharray: `${dashLength} ${gapLength}`,
        dashoffset: 0,
        rotation: rotation
      };
    });
  }
}
