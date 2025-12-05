import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface ProductDetailData {
  id: string;  // UUID do produto
  name: string;
  category: string;
  price: number;
  originalPrice?: number;
  image: string;
  badges: string[];
  isNew: boolean;
  isPromotion: boolean;
  stockQuantity: number;
  description?: string;
}

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.scss'
})
export class ProductDetailComponent {
  @Input() open = false;
  @Input() product?: ProductDetailData;
  @Output() closed = new EventEmitter<void>();
  @Output() addToCart = new EventEmitter<ProductDetailData>();

  onBackdropClick(e: MouseEvent) {
    if ((e.target as HTMLElement).classList.contains('modal-backdrop')) {
      this.closed.emit();
    }
  }

  onAddToCart() {
    if (this.product) {
      this.addToCart.emit(this.product);
    }
  }
}
