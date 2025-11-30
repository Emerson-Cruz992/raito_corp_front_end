import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CartService, CartItem } from '../shared/cart.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {
  isAuthenticated = false;
  showAddressForm = false;

  // Dados de endereço
  endereco = {
    cep: '',
    logradouro: '',
    numero: '',
    complemento: '',
    bairro: '',
    cidade: '',
    estado: ''
  };

  constructor(
    private cart: CartService,
    private router: Router
  ) {}

  ngOnInit() {
    // Verificar se o usuário está autenticado
    this.checkAuthentication();
  }

  checkAuthentication() {
    const token = localStorage.getItem('raito_auth_token');
    console.log('Token encontrado:', token ? 'Sim' : 'Não');
    console.log('Token value:', token);
    this.isAuthenticated = !!token;
    console.log('isAuthenticated:', this.isAuthenticated);
  }

  get items(): CartItem[] { return this.cart.getItems(); }
  get total(): number { return this.cart.getTotal(); }
  get itemCount(): number { return this.items.length; }
  get subtotal(): number { return this.total; }
  get frete(): number { return this.subtotal > 200 ? 0 : 15; }
  get totalComFrete(): number { return this.subtotal + this.frete; }

  inc(item: CartItem) { this.cart.updateQty(item.id, item.qty + 1); }
  dec(item: CartItem) { this.cart.updateQty(item.id, Math.max(1, item.qty - 1)); }
  remove(item: CartItem) { this.cart.removeItem(item.id); }
  clear() {
    if (confirm('Tem certeza que deseja limpar o carrinho?')) {
      this.cart.clear();
    }
  }

  proceedToCheckout() {
    if (!this.isAuthenticated) {
      // Redirecionar para login
      this.router.navigate(['/login'], { queryParams: { returnUrl: '/cart' } });
    } else {
      // Mostrar formulário de endereço
      this.showAddressForm = true;
    }
  }

  async finalizarPedido() {
    if (!this.validarEndereco()) {
      alert('Por favor, preencha todos os campos obrigatórios do endereço.');
      return;
    }

    // Aqui você implementaria a lógica de finalização do pedido
    console.log('Finalizando pedido com endereço:', this.endereco);
    console.log('Itens:', this.items);
    console.log('Total:', this.totalComFrete);

    alert('Pedido realizado com sucesso! (Implementação em desenvolvimento)');
    this.cart.clear();
    this.router.navigate(['/']);
  }

  validarEndereco(): boolean {
    return !!(
      this.endereco.cep &&
      this.endereco.logradouro &&
      this.endereco.numero &&
      this.endereco.bairro &&
      this.endereco.cidade &&
      this.endereco.estado
    );
  }

  buscarCEP() {
    const cep = this.endereco.cep.replace(/\D/g, '');
    if (cep.length === 8) {
      fetch(`https://viacep.com.br/ws/${cep}/json/`)
        .then(res => res.json())
        .then(data => {
          if (!data.erro) {
            this.endereco.logradouro = data.logradouro;
            this.endereco.bairro = data.bairro;
            this.endereco.cidade = data.localidade;
            this.endereco.estado = data.uf;
          }
        })
        .catch(err => console.error('Erro ao buscar CEP:', err));
    }
  }
}
