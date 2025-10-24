import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CartService, CartItem } from '../shared/cart.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss'
})
export class CartComponent {
  constructor(private cart: CartService) {}

  get items(): CartItem[] { return this.cart.getItems(); }
  get total(): number { return this.cart.getTotal(); }

  inc(item: CartItem) { this.cart.updateQty(item.id, item.qty + 1); }
  dec(item: CartItem) { this.cart.updateQty(item.id, Math.max(1, item.qty - 1)); }
  remove(item: CartItem) { this.cart.removeItem(item.id); }
  clear() { this.cart.clear(); }
}
