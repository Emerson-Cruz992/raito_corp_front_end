import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CartService } from '../shared/cart.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  constructor(private cart: CartService) {}

  getCartCount() { return this.cart.getCount(); }
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

  addFeaturedToCart(produto: any, index: number) {
    // Converter o precoAtual (string "R$ xxx,yy") para number simples
    const price = Number((produto.precoAtual || '0').toString().replace(/[^0-9,]/g, '').replace(',', '.')) || 0;
    const id = 1000 + index; // id sintético para destaques
    this.cart.addItem({ id, name: produto.nome, price, image: produto.imagem }, 1);
  }
}