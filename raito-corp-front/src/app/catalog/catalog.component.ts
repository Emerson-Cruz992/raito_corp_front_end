import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ProductDetailComponent, ProductDetailData } from '../product-detail/product-detail.component';
import { CartService } from '../shared/cart.service';
import { ProdutoService } from '../core/services/catalogo/produto.service';
import { Produto } from '../shared/models';
import { NotificationService } from '../shared/notification.service';
import { environment } from '../../environments/environment';

interface Product {
  id: string;  // UUID do banco de dados
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
    { name: 'Todos', count: 0, slug: 'todos' }
  ];

  allProducts: Product[] = [];

  filteredProducts: Product[] = [];
  currentProducts: Product[] = [];

  // Feedback visual
  addingToCart: { [productId: string]: boolean } = {};
  showSuccessMessage: { [productId: string]: boolean } = {};

  constructor(
    private cartService: CartService,
    private route: ActivatedRoute,
    private produtoService: ProdutoService,
    private notification: NotificationService,
    private http: HttpClient
  ) {}

  ngOnInit() {
    // Carregar categorias primeiro
    this.loadCategories();

    // Carregar produtos do backend
    this.loadProductsFromBackend();

    // Verificar se veio da home com um produto para abrir
    this.route.queryParams.subscribe(params => {
      const openProductId = params['openProduct'];
      const fromHome = params['fromHome'];

      if (openProductId && fromHome === 'true') {
        const product = this.allProducts.find(p => p.id === openProductId);

        if (product) {
          setTimeout(() => {
            this.openDetail(product);
          }, 300);
        }
      }
    });
  }

  /**
   * Carrega categorias do backend
   */
  loadCategories() {
    this.http.get<any[]>(`${environment.apiUrl}/categorias`).subscribe({
      next: (categorias) => {
        // Resetar categorias com "Todos"
        this.categories = [
          { name: 'Todos', count: 0, slug: 'todos' }
        ];

        // Adicionar categorias do backend
        categorias.forEach(cat => {
          this.categories.push({
            name: cat.nome,
            count: 0, // Será atualizado depois de carregar produtos
            slug: cat.nome.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
          });
        });
      },
      error: (error) => {
        console.error('Erro ao carregar categorias:', error);
      }
    });
  }

  /**
   * Carrega produtos do backend COM ESTOQUE
   */
  loadProductsFromBackend() {
    // Usar endpoint com informação de estoque
    this.http.get<any[]>(`${environment.apiUrl}/produtos/com-estoque`).subscribe({
      next: (produtos) => {

        // Converter produtos do backend para o formato local
        this.allProducts = produtos
          .filter(p => p.ativo)
          .map((p) => ({
            id: p.id,  // Usar o UUID real do banco de dados
            name: p.nome,
            category: p.categorias && p.categorias.length > 0 ? p.categorias[0] : 'Sem Categoria',
            price: p.preco,
            originalPrice: p.precoOriginal,
            image: p.imagemUrl || 'https://images.unsplash.com/photo-1517991104123-023dcd3118c9?w=400',
            badges: p.emDestaque ? ['Destaque'] : [],
            isNew: p.isNovidade || false,
            isPromotion: p.isPromocao || false,
            stockQuantity: p.quantidadeEstoque || 0,
            description: p.descricao
          }));

        // Atualizar contagem de produtos por categoria
        this.updateCategoryCounts();

        this.filteredProducts = [...this.allProducts];
        this.currentProducts = [...this.allProducts];
        this.applyFilters();
      },
      error: (error) => {
        this.notification.error('Erro', 'Não foi possível carregar os produtos');
        this.allProducts = [];
        this.filteredProducts = [];
        this.currentProducts = [];
      }
    });
  }

  /**
   * Atualiza a contagem de produtos por categoria
   */
  updateCategoryCounts() {
    // Resetar contadores
    this.categories.forEach(cat => cat.count = 0);

    // Contar produtos por categoria
    this.allProducts.forEach(product => {
      // Contar para "Todos"
      this.categories[0].count++;

      // Contar para categoria específica
      const category = this.categories.find(c => c.name === product.category);
      if (category) {
        category.count++;
      }
    });
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

  // Adicionar ao carrinho do modal de detalhes
  addToCartFromDetail(productDetail: ProductDetailData) {
    // Verificar se há estoque disponível
    if (productDetail.stockQuantity === 0) {
      this.notification.error('Produto Esgotado', 'Este produto não está mais disponível em estoque');
      return;
    }

    // Verificar se a quantidade no carrinho já atingiu o limite de estoque
    const currentCartQty = this.getCartQuantity(productDetail.id);
    if (currentCartQty >= productDetail.stockQuantity) {
      this.notification.error('Estoque Insuficiente', `Apenas ${productDetail.stockQuantity} unidades disponíveis. Você já adicionou o máximo permitido.`);
      return;
    }

    // Adicionar ao carrinho
    this.cartService.addItem(
      {
        id: productDetail.id,
        name: productDetail.name,
        price: productDetail.price,
        image: productDetail.image
      },
      1
    );

    // Fechar modal
    this.closeDetail();

    // Mostrar feedback visual
    this.notification.success('Adicionado!', `${productDetail.name} foi adicionado ao carrinho`);
  }

  // Mapeia Product -> ProductDetailData
  mapToDetail(product?: Product): ProductDetailData | undefined {
    if (!product) return undefined;
    return {
      id: product.id,
      name: product.name,
      category: product.category,
      price: product.price,
      originalPrice: product.originalPrice,
      image: product.image,
      badges: product.badges,
      isNew: product.isNew,
      isPromotion: product.isPromotion,
      stockQuantity: product.stockQuantity,
      description: product.description || 'Produto de alta qualidade com garantia estendida e suporte especializado.'
    };
  }

  // Adicionar produto ao carrinho com feedback visual
  addToCart(product: Product, event: Event) {
    event.stopPropagation();

    // Verificar se há estoque disponível
    if (product.stockQuantity === 0) {
      this.notification.error('Produto Esgotado', 'Este produto não está mais disponível em estoque');
      return;
    }

    // Verificar se a quantidade no carrinho já atingiu o limite de estoque
    const currentCartQty = this.getCartQuantity(product.id);
    if (currentCartQty >= product.stockQuantity) {
      this.notification.error('Estoque Insuficiente', `Apenas ${product.stockQuantity} unidades disponíveis. Você já adicionou o máximo permitido.`);
      return;
    }

    // Mostrar loading
    this.addingToCart[product.id] = true;

    // Simular delay de API (remover quando integrar com back-end)
    setTimeout(() => {
      // Adicionar ao carrinho
      this.cartService.addItem(
        {
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.image
        },
        1
      );

      // Remover loading e mostrar sucesso
      this.addingToCart[product.id] = false;
      this.showSuccessMessage[product.id] = true;

      // Esconder mensagem de sucesso após 2 segundos
      setTimeout(() => {
        this.showSuccessMessage[product.id] = false;
      }, 2000);
    }, 300);
  }

  // Verificar se produto está no carrinho
  isInCart(productId: string): boolean {
    const items = this.cartService.getItems();
    return items.some(item => item.id === productId);
  }

  // Obter quantidade do produto no carrinho
  getCartQuantity(productId: string): number {
    const items = this.cartService.getItems();
    const item = items.find(i => i.id === productId);
    return item?.qty || 0;
  }

  // Verificar se produto está esgotado
  isOutOfStock(product: Product): boolean {
    return product.stockQuantity === 0;
  }

  // Verificar se pode adicionar mais ao carrinho
  canAddMore(product: Product): boolean {
    const currentCartQty = this.getCartQuantity(product.id);
    return currentCartQty < product.stockQuantity;
  }
}
