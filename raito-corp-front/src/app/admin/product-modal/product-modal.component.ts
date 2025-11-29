import { Component, EventEmitter, Input, OnInit, OnChanges, SimpleChanges, Output } from '@angular/core';
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
export class ProductModalComponent implements OnInit, OnChanges {
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
    descricao: '',
    emDestaque: false,
    imagem: ''
  };

  precoDisplay: string = '';
  precoOriginalDisplay: string = '';
  imagePreview: string | null = null;
  selectedImageFile: File | null = null;

  categories = ['Lustres', 'Plafons', 'Trilhos', 'Comercial', 'Lampadas', 'Arandelas'];

  ngOnInit() {
    this.loadProductData();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['product'] || changes['isOpen']) {
      this.loadProductData();
    }
  }

  private loadProductData() {
    if (this.product) {
      this.formData = { ...this.product };
      this.precoDisplay = this.formatCurrencyInput(this.product.preco);
      if (this.product.precoOriginal) {
        this.precoOriginalDisplay = this.formatCurrencyInput(this.product.precoOriginal);
      }
      // Carregar preview da imagem se existir
      if (this.product.imagem) {
        this.imagePreview = this.product.imagem;
      }
    } else {
      // Resetar formulário para novo produto
      this.formData = {
        nome: '',
        categoria: 'Lustres',
        preco: 0,
        estoque: 0,
        vendidos: 0,
        receita: 0,
        descricao: '',
        emDestaque: false,
        imagem: ''
      };
      this.precoDisplay = '0,00';
      this.precoOriginalDisplay = '';
      this.imagePreview = null;
      this.selectedImageFile = null;
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
        descricao: this.formData.descricao || '',
        emDestaque: this.formData.emDestaque || false,
        imagem: this.imagePreview || this.formData.imagem || ''
      };

      // Emitir evento com produto e arquivo de imagem se houver
      this.save.emit(productToSave);
    }
  }

  getSelectedImageFile(): File | null {
    return this.selectedImageFile;
  }

  onClose() {
    this.close.emit();
  }

  onImageSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];

      // Validar tamanho (máximo 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('A imagem deve ter no máximo 5MB');
        return;
      }

      // Validar tipo
      if (!file.type.startsWith('image/')) {
        alert('Por favor, selecione apenas arquivos de imagem');
        return;
      }

      this.selectedImageFile = file;

      // Criar preview
      const reader = new FileReader();
      reader.onload = (e) => {
        this.imagePreview = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  removeImage() {
    this.imagePreview = null;
    this.selectedImageFile = null;
    this.formData.imagem = '';
  }
}
