import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminDataService } from '../../shared/admin-data.service';
import { Product } from '../../shared/models/admin.models';
import { ProductModalComponent } from '../product-modal/product-modal.component';

@Component({
  selector: 'app-products-management',
  standalone: true,
  imports: [CommonModule, FormsModule, ProductModalComponent],
  templateUrl: './products-management.component.html',
  styleUrl: './products-management.component.scss'
})
export class ProductsManagementComponent implements OnInit {
  products: Product[] = [];
  searchTerm = '';
  isModalOpen = false;
  selectedProduct: Product | null = null;
  isDeleteModalOpen = false;
  productToDelete: Product | null = null;

  constructor(private adminDataService: AdminDataService) {}

  ngOnInit() {
    this.adminDataService.getProducts().subscribe(products => {
      this.products = products;
    });
  }

  get filteredProducts() {
    return this.products.filter(p =>
      p.nome.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      p.categoria.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  formatCurrency(value: number): string {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }

  openNewProductModal() {
    this.selectedProduct = null;
    this.isModalOpen = true;
  }

  openEditModal(product: Product) {
    this.selectedProduct = product;
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
    this.selectedProduct = null;
  }

  saveProduct(product: Product) {
    if (this.selectedProduct) {
      this.adminDataService.updateProduct(product.id, product);
    } else {
      this.adminDataService.addProduct(product);
    }
    this.closeModal();
  }

  openDeleteModal(product: Product) {
    this.productToDelete = product;
    this.isDeleteModalOpen = true;
  }

  closeDeleteModal() {
    this.isDeleteModalOpen = false;
    this.productToDelete = null;
  }

  confirmDelete() {
    if (this.productToDelete) {
      this.adminDataService.deleteProduct(this.productToDelete.id);
      this.closeDeleteModal();
    }
  }
}
