import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CartService, CartItem } from '../shared/cart.service';
import { AuthService } from '../core/services/auth.service';
import { EnderecoService } from '../core/services/cadastro/endereco.service';
import { CarrinhoService } from '../core/services/vendas/carrinho.service';
import { PedidoService } from '../core/services/vendas/pedido.service';
import { AdminDataService } from '../shared/admin-data.service';
import { NotificationService } from '../shared/notification.service';
import { firstValueFrom } from 'rxjs';

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
  isProcessing = false;

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
    private router: Router,
    private authService: AuthService,
    private enderecoService: EnderecoService,
    private carrinhoService: CarrinhoService,
    private pedidoService: PedidoService,
    private adminDataService: AdminDataService,
    private notification: NotificationService
  ) {}

  ngOnInit() {
    this.checkAuthentication();
  }

  checkAuthentication() {
    this.isAuthenticated = this.authService.isAuthenticated;
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
    this.notification.confirm(
      'Tem certeza?',
      'Deseja realmente limpar todos os itens do carrinho?',
      () => {
        this.cart.clear();
        this.notification.success('Carrinho limpo', 'Todos os itens foram removidos do carrinho.');
      }
    );
  }

  proceedToCheckout() {
    if (!this.isAuthenticated) {
      this.router.navigate(['/login'], { queryParams: { returnUrl: '/cart' } });
    } else {
      this.showAddressForm = true;
    }
  }

  async finalizarPedido() {
    if (!this.validarEndereco()) {
      this.notification.warning(
        'Dados incompletos',
        'Por favor, preencha todos os campos obrigatórios do endereço.'
      );
      return;
    }

    if (this.isProcessing) {
      return;
    }

    this.isProcessing = true;

    try {
      const user = this.authService.currentUserValue;
      if (!user) {
        this.notification.error('Erro', 'Usuário não autenticado');
        this.isProcessing = false;
        return;
      }

      const idCliente = user.id.toString();

      // 1. Criar endereço
      const novoEndereco = await firstValueFrom(this.enderecoService.criarEndereco({
        idCliente: idCliente,
        cep: this.endereco.cep,
        rua: this.endereco.logradouro,
        numero: this.endereco.numero,
        complemento: this.endereco.complemento || undefined,
        bairro: this.endereco.bairro,
        cidade: this.endereco.cidade,
        estado: this.endereco.estado,
        enderecoPrincipal: false
      }));

      // 2. Criar carrinho no backend
      const carrinho = await firstValueFrom(this.carrinhoService.criarCarrinho(idCliente));

      // 3. Adicionar itens ao carrinho
      for (const item of this.items) {
        await firstValueFrom(this.carrinhoService.adicionarItem(
          carrinho.idCarrinho,
          item.id.toString(),
          item.qty,
          item.price
        ));
      }

      // 4. Finalizar pedido
      await firstValueFrom(this.pedidoService.finalizarPedido(
        idCliente,
        carrinho.idCarrinho,
        novoEndereco.idEndereco
      ));

      // Recarregar dados admin
      this.adminDataService.reloadData();

      // Limpar carrinho local
      this.cart.clear();

      this.notification.success(
        'Pedido realizado!',
        'Seu pedido foi finalizado com sucesso e está sendo processado.'
      );

      setTimeout(() => {
        this.router.navigate(['/']);
      }, 2000);
    } catch (error: any) {
      this.notification.error(
        'Erro ao finalizar pedido',
        error.message || 'Ocorreu um erro ao processar seu pedido. Tente novamente.'
      );
    } finally {
      this.isProcessing = false;
    }
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
          } else {
            this.notification.warning('CEP não encontrado', 'O CEP informado não foi encontrado.');
          }
        })
        .catch(() => {
          this.notification.error('Erro', 'Erro ao buscar CEP. Verifique sua conexão.');
        });
    }
  }
}
