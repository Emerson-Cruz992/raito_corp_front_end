import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface CartItem {
  id: string;  // UUID do produto
  name: string;
  price: number;
  image: string;
  qty: number;
}

const STORAGE_KEY = 'rc_cart_v1';

@Injectable({ providedIn: 'root' })
export class CartService {
  private items: CartItem[] = [];
  private itemsSubject = new BehaviorSubject<CartItem[]>([]);
  public items$: Observable<CartItem[]> = this.itemsSubject.asObservable();

  constructor() {
    this.load();
  }

  private save() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.items));
    this.itemsSubject.next([...this.items]);
  }

  private load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) this.items = JSON.parse(raw);
    } catch {
      this.items = [];
    }
    this.itemsSubject.next([...this.items]);
  }

  getItems(): CartItem[] {
    return [...this.items];
  }

  getCount(): number {
    return this.items.reduce((acc, it) => acc + it.qty, 0);
  }

  getTotal(): number {
    return this.items.reduce((acc, it) => acc + it.price * it.qty, 0);
  }

  addItem(item: Omit<CartItem, 'qty'>, qty: number = 1) {
    const found = this.items.find(i => i.id === item.id);
    if (found) {
      found.qty += qty;
    } else {
      this.items.push({ ...item, qty });
    }
    this.save();
  }

  updateQty(id: string, qty: number) {
    const it = this.items.find(i => i.id === id);
    if (!it) return;
    it.qty = Math.max(1, qty);
    this.save();
  }

  removeItem(id: string) {
    this.items = this.items.filter(i => i.id !== id);
    this.save();
  }

  clear() {
    this.items = [];
    this.save();
  }
}