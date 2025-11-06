import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminDataService } from '../../shared/admin-data.service';
import { StockAlert, Product } from '../../shared/models/admin.models';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-stock-management',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './stock-management.component.html',
  styleUrl: './stock-management.component.scss'
})
export class StockManagementComponent implements OnInit, OnDestroy {
  stockAlerts: StockAlert[] = [];
  allProducts: Product[] = [];
  private destroy$ = new Subject<void>();

  constructor(private adminDataService: AdminDataService) {}

  ngOnInit() {
    this.stockAlerts = this.adminDataService.getStockAlerts();
    this.adminDataService.getProducts()
      .pipe(takeUntil(this.destroy$))
      .subscribe(products => {
        this.allProducts = products;
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
