import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminDataService } from '../../shared/admin-data.service';
import { StockAlert, Product } from '../../shared/models/admin.models';

@Component({
  selector: 'app-stock-management',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './stock-management.component.html',
  styleUrl: './stock-management.component.scss'
})
export class StockManagementComponent implements OnInit {
  stockAlerts: StockAlert[] = [];
  allProducts: Product[] = [];

  constructor(private adminDataService: AdminDataService) {}

  ngOnInit() {
    this.stockAlerts = this.adminDataService.getStockAlerts();
    this.adminDataService.getProducts().subscribe(products => {
      this.allProducts = products;
    });
  }
}
