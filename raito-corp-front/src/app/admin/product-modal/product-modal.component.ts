import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Product } from '../../shared/models/admin.models';

@Component({
  selector: 'app-product-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './product-modal.component.html',
  styleUrl: './product-modal.component.scss'
})
export class ProductModalComponent implements OnInit {
  @Input() product: Product | null = null;
  @Input() isOpen = false;
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<Product>();

  formData: Partial<Product> = {
    nome: '',
    categoria: 'Lustres',
    preco: 0,
    estoque: 0,
    vendidos: 0,
    receita: 0,
    descricao: ''
  };

  precoDisplay: string = '';
  precoOriginalDisplay: string = '';

  categories = ['Lustres', 'Plafons', 'Trilhos', 'Comercial', 'Lampadas', 'Arandelas'];

  ngOnInit() {
    if (this.product) {
      this.formData = { ...this.product };
      this.precoDisplay = this.formatCurrencyInput(this.product.preco);
      if (this.product.precoOriginal) {
        this.precoOriginalDisplay = this.formatCurrencyInput(this.product.precoOriginal);
      }
    }
  }

  formatCurrencyInput(value: number): string {
    return value.toFixed(2).replace('.', ',');
  }

  onPrecoChange(value: string) {
    const numericValue = this.parseCurrency(value);
    this.formData.preco = numericValue;
    this.precoDisplay = this.formatCurrencyInput(numericValue);
  }

  onPrecoOriginalChange(value: string) {
    const numericValue = this.parseCurrency(value);
    this.formData.precoOriginal = numericValue;
    this.precoOriginalDisplay = this.formatCurrencyInput(numericValue);
  }

  parseCurrency(value: string): number {
    const cleaned = value.replace(/[^\d,]/g, '').replace(',', '.');
    return parseFloat(cleaned) || 0;
  }

  onSave() {
    if (this.formData.nome && this.formData.preco !== undefined) {
      const timestamp = new Date().getTime();
      const productToSave: Product = {
        id: this.product?.id || `prod-${timestamp}`,
        nome: this.formData.nome,
        categoria: this.formData.categoria || 'Lustres',
        preco: this.formData.preco,
        estoque: this.formData.estoque || 0,
        vendidos: this.product?.vendidos || 0,
        receita: this.product?.receita || 0,
        descricao: this.formData.descricao || ''
      };
      this.save.emit(productToSave);
    }
  }

  onClose() {
    this.close.emit();
  }
}
