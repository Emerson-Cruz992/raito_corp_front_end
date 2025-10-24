import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ProductDetailComponent, ProductDetailData } from '../product-detail/product-detail.component';

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  originalPrice?: number;
  image: string;
  badges: string[];
  isNew: boolean;
  isPromotion: boolean;
}

interface Category {
  name: string;
  count: number;
  slug: string;
}

@Component({
  selector: 'app-catalog',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, ProductDetailComponent],
  templateUrl: './catalog.component.html',
  styleUrl: './catalog.component.scss'
})
export class CatalogComponent implements OnInit {
  searchTerm: string = '';
  selectedCategory: string = 'todos';
  showPromotionsOnly: boolean = false;
  showNewOnly: boolean = false;
  sortBy: string = 'default';

  // Estado para modal de detalhes
  isDetailOpen = false;
  selectedProduct: Product | undefined;

  categories: Category[] = [
    { name: 'Todos', count: 24, slug: 'todos' },
    { name: 'Lustres', count: 4, slug: 'lustres' },
    { name: 'Plafons', count: 4, slug: 'plafons' },
    { name: 'Trilhos', count: 4, slug: 'trilhos' },
    { name: 'Comercial', count: 4, slug: 'comercial' },
    { name: 'Arandelas', count: 4, slug: 'arandelas' },
    { name: 'Lâmpadas', count: 4, slug: 'lampadas' }
  ];

  allProducts: Product[] = [
    {
      id: 1,
      name: 'Lustre Pendente Moderno LED',
      category: 'Lustres',
      price: 299.90,
      originalPrice: 399.90,
      image: 'https://images.unsplash.com/photo-1517991104123-023dcd3118c9?w=400',
      badges: ['Novo', 'Promoção'],
      isNew: true,
      isPromotion: true
    },
    {
      id: 2,
      name: 'Lustre Cristal Premium',
      category: 'Lustres',
      price: 1299.90,
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400',
      badges: [],
      isNew: false,
      isPromotion: false
    },
    {
      id: 3,
      name: 'Pendente Industrial Triplo',
      category: 'Lustres',
      price: 349.90,
      originalPrice: 449.90,
      image: 'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=400',
      badges: ['Promoção'],
      isNew: false,
      isPromotion: true
    },
    {
      id: 4,
      name: 'Lustre Aramado Geométrico',
      category: 'Lustres',
      price: 259.90,
      image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400',
      badges: ['Novo'],
      isNew: true,
      isPromotion: false
    },
    {
      id: 5,
      name: 'Plafon LED Circular 24W',
      category: 'Plafons',
      price: 159.90,
      image: 'https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?w=400',
      badges: ['Novo'],
      isNew: true,
      isPromotion: false
    },
    {
      id: 6,
      name: 'Plafon Quadrado Embutir 36W',
      category: 'Plafons',
      price: 189.90,
      image: 'https://images.unsplash.com/photo-1524484485831-a92ffc0de03f?w=400',
      badges: [],
      isNew: false,
      isPromotion: false
    },
    {
      id: 7,
      name: 'Lâmpada Smart WiFi Colorida',
      category: 'Lâmpadas',
      price: 79.90,
      image: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400',
      badges: ['Novo'],
      isNew: true,
      isPromotion: false
    },
    {
      id: 8,
      name: 'Lâmpada Filamento Vintage E27',
      category: 'Lâmpadas',
      price: 34.90,
      image: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400',
      badges: [],
      isNew: false,
      isPromotion: false
    },
    {
      id: 9,
      name: 'Dimmer Touch Inteligente',
      category: 'Lâmpadas',
      price: 119.90,
      image: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400',
      badges: ['Novo'],
      isNew: true,
      isPromotion: false
    },
    {
      id: 10,
      name: 'Trilho Industrial com 3 Spots',
      category: 'Trilhos',
      price: 239.90,
      image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400',
      badges: [],
      isNew: false,
      isPromotion: false
    },
    {
      id: 11,
      name: 'Trilho LED Magnético',
      category: 'Trilhos',
      price: 289.90,
      image: 'https://images.unsplash.com/photo-1586473219010-2ffc57b0d282?w=400',
      badges: ['Novo'],
      isNew: true,
      isPromotion: false
    },
    {
      id: 12,
      name: 'Sistema LED Comercial',
      category: 'Comercial',
      price: 489.90,
      image: 'https://images.unsplash.com/photo-1586473219010-2ffc57b0d282?w=400',
      badges: [],
      isNew: false,
      isPromotion: false
    }
  ];

  filteredProducts: Product[] = [];
  currentProducts: Product[] = [];

  ngOnInit() {
    this.filteredProducts = [...this.allProducts];
    this.currentProducts = [...this.allProducts];
  }

  onSearch() {
    this.applyFilters();
  }

  onCategoryChange(category: string) {
    this.selectedCategory = category;
    this.applyFilters();
  }

  onQuickFilter(filterType: string) {
    if (filterType === 'promotions') {
      this.showPromotionsOnly = !this.showPromotionsOnly;
      this.showNewOnly = false;
    } else if (filterType === 'new') {
      this.showNewOnly = !this.showNewOnly;
      this.showPromotionsOnly = false;
    }
    this.applyFilters();
  }

  onSortChange() {
    this.applySort();
  }

  applyFilters() {
    let filtered = [...this.allProducts];

    // Filtro por categoria
    if (this.selectedCategory !== 'todos') {
      const categoryName = this.categories.find(c => c.slug === this.selectedCategory)?.name;
      if (categoryName) {
        filtered = filtered.filter(product => product.category === categoryName);
      }
    }

    // Filtro por busca
    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(term) ||
        product.category.toLowerCase().includes(term)
      );
    }

    // Filtros rápidos
    if (this.showPromotionsOnly) {
      filtered = filtered.filter(product => product.isPromotion);
    }

    if (this.showNewOnly) {
      filtered = filtered.filter(product => product.isNew);
    }

    this.filteredProducts = filtered;
    this.applySort();
  }

  private applySort() {
    let sorted = [...this.filteredProducts];

    switch (this.sortBy) {
      case 'price-asc':
        sorted.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        sorted.sort((a, b) => b.price - a.price);
        break;
      case 'name':
        sorted.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'newest':
        sorted.sort((a, b) => Number(b.isNew) - Number(a.isNew));
        break;
      default:
        // Manter ordem padrão
        break;
    }

    this.currentProducts = sorted;
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  }

  getStats() {
    return {
      total: this.allProducts.length,
      categories: this.categories.length - 1, // Excluir "Todos"
      new: this.allProducts.filter(p => p.isNew).length,
      promotions: this.allProducts.filter(p => p.isPromotion).length
    };
  }

  // Ações do modal
  openDetail(product: Product) {
    this.selectedProduct = product;
    this.isDetailOpen = true;
    document.body.classList.add('no-scroll');
  }

  closeDetail() {
    this.isDetailOpen = false;
    this.selectedProduct = undefined;
    document.body.classList.remove('no-scroll');
  }

  // Mapeia Product -> ProductDetailData
  mapToDetail(product?: Product): ProductDetailData | undefined {
    if (!product) return undefined;
    return {
      id: Number(product.id),
      name: product.name,
      category: product.category,
      price: Number(product.price),
      originalPrice: product.originalPrice != null ? Number(product.originalPrice) : undefined,
      image: product.image,
      badges: product.badges,
      isNew: Boolean(product.isNew),
      isPromotion: Boolean(product.isPromotion),
      description: 'Produto de alta qualidade com garantia estendida e suporte especializado.'
    };
  }
}
