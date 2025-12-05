import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { CartService } from '../shared/cart.service';
import { AuthService } from '../core/services/auth.service';
import { ProdutoService } from '../core/services/catalogo/produto.service';
import { Produto } from '../shared/models';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  currentUser: any = null;
  firstName: string = '';
  showUserMenu: boolean = false;
  produtosDestaque: Produto[] = [];

  constructor(
    private cart: CartService,
    private authService: AuthService,
    private router: Router,
    private produtoService: ProdutoService
  ) {}

  ngOnInit() {
    // Observar mudanças no usuário logado
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      if (user && user.nome) {
        // Pegar apenas o primeiro nome
        this.firstName = user.nome.split(' ')[0];
      } else {
        this.firstName = '';
      }
    });

    // Carregar produtos em destaque
    this.produtoService.listarProdutosEmDestaque().subscribe({
      next: (produtos) => {
        this.produtosDestaque = produtos;
      },
      error: (err) => {
        console.error('Erro ao carregar produtos em destaque:', err);
        // Se houver erro, usar produtos fictícios como fallback
        this.produtosDestaque = [];
      }
    });
  }

  getCartCount() { return this.cart.getCount(); }

  isAuthenticated(): boolean {
    return this.authService.isAuthenticated;
  }

  isAdmin(): boolean {
    return this.currentUser?.tipoUsuario === 'admin';
  }

  toggleUserMenu(): void {
    this.showUserMenu = !this.showUserMenu;
  }

  closeUserMenu(): void {
    this.showUserMenu = false;
  }

  logout(): void {
    this.authService.logout();
    this.showUserMenu = false;
    this.router.navigate(['/']);
  }
  contactForm = {
    nome: '',
    email: '',
    telefone: '',
    tipoServico: '',
    mensagem: '',
    receberNovidades: false
  };

  estadisticas = [
    { numero: '500+', descricao: 'Projetos Realizados' },
    { numero: '15 Anos', descricao: 'De Experiência' },
    { numero: '98%', descricao: 'Clientes Satisfeitos' }
  ];

  produtos = [
    {
      imagem: 'https://images.unsplash.com/photo-1517991104123-023dcd3118c9?w=300',
      badges: ['Novo', 'Promoção'],
      categoria: 'Lustres',
      nome: 'Lustre Pendente Moderno LED',
      precoAtual: 'R$ 299,90',
      precoAnterior: 'R$ 399,90'
    },
    {
      imagem: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300',
      badges: ['Novo'],
      categoria: 'Plafons',
      nome: 'Plafon LED Circular 24W',
      precoAtual: 'R$ 159,90',
      precoAnterior: null
    },
    {
      imagem: 'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=300',
      badges: [],
      categoria: 'Trilhos',
      nome: 'Trilho Industrial com 3 Spots',
      precoAtual: 'R$ 239,90',
      precoAnterior: null
    },
    {
      imagem: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=300',
      badges: [],
      categoria: 'Comercial',
      nome: 'Sistema LED Comercial',
      precoAtual: 'R$ 489,90',
      precoAnterior: null
    }
  ];

  onSubmit() {
    // TODO: Implementar envio de formulário de contato para o back-end
    // ContactService.sendMessage(this.contactForm)
  }

  goToCatalogWithProduct(produto: Produto) {
    // Navegar para o catálogo passando o ID real do produto
    this.router.navigate(['/catalogo'], {
      queryParams: {
        openProduct: produto.id,
        fromHome: 'true'
      }
    });
  }

  formatPrice(preco: number): string {
    return `R$ ${preco.toFixed(2).replace('.', ',')}`;
  }
}