import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminDataService } from '../../shared/admin-data.service';
import { Product } from '../../shared/models/admin.models';
import { ProductModalComponent } from '../product-modal/product-modal.component';
import { ProdutoService } from '../../core/services/catalogo/produto.service';
import { EstoqueService } from '../../core/services/estoque/estoque.service';
import { Produto, CriarProdutoDTO, AtualizarProdutoDTO } from '../../shared/models';
import { NotificationService } from '../../shared/notification.service';
import { Subject } from 'rxjs';
import { takeUntil, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-products-management',
  standalone: true,
  imports: [CommonModule, FormsModule, ProductModalComponent],
  templateUrl: './products-management.component.html',
  styleUrl: './products-management.component.scss'
})
export class ProductsManagementComponent implements OnInit, OnDestroy {
  @ViewChild(ProductModalComponent) productModal?: ProductModalComponent;

  products: Product[] = [];
  searchTerm = '';
  isModalOpen = false;
  selectedProduct: Product | null = null;
  isDeleteModalOpen = false;
  productToDelete: Product | null = null;
  private destroy$ = new Subject<void>();
  isSaving = false;

  constructor(
    private adminDataService: AdminDataService,
    private produtoService: ProdutoService,
    private estoqueService: EstoqueService,
    private notification: NotificationService
  ) {}

  ngOnInit() {
    this.adminDataService.getProducts()
      .pipe(takeUntil(this.destroy$))
      .subscribe(products => {
        this.products = products;
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  get filteredProducts() {
    return this.products.filter(p =>
      p.nome.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      p.categoria.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  formatCurrency(value: number): string {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }

  openNewProductModal() {
    this.selectedProduct = null;
    this.isModalOpen = true;
  }

  openEditModal(product: Product) {
    this.selectedProduct = product;
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
    this.selectedProduct = null;
  }

  saveProduct(product: Product) {
    this.isSaving = true;

    if (this.selectedProduct) {
      // Editar produto existente
      const idProduto = this.selectedProduct.id;
      const updateDTO: AtualizarProdutoDTO = {
        nome: product.nome,
        descricao: product.descricao,
        preco: product.preco,
        precoOriginal: product.precoOriginal,
        ativo: true,
        emDestaque: product.emDestaque,
        isNovidade: product.isNovidade,
        isPromocao: product.isPromocao
      };

      this.produtoService.atualizarProduto(idProduto, updateDTO)
        .pipe(
          switchMap((produtoAtualizado) => {
            const promises: Promise<any>[] = [];

            // Se houver imagem selecionada, fazer upload
            const imageFile = this.productModal?.getSelectedImageFile();
            if (imageFile) {
              promises.push(this.produtoService.uploadImagem(produtoAtualizado.id, imageFile).toPromise());
            }

            // Atualizar categoria se fornecida
            if (product.categoria) {
              promises.push(this.produtoService.associarCategoriaPorNome(produtoAtualizado.id, product.categoria).toPromise());
            }

            // Atualizar estoque se fornecido
            if (product.estoque !== undefined && product.estoque !== this.selectedProduct?.estoque) {
              promises.push(
                this.estoqueService.atualizarEstoque(produtoAtualizado.id, product.estoque).toPromise()
                  .catch(() => this.estoqueService.adicionarEstoque(produtoAtualizado.id, product.estoque).toPromise())
              );
            }

            return Promise.all(promises).then(() => produtoAtualizado);
          }),
          takeUntil(this.destroy$)
        )
        .subscribe({
          next: () => {
            this.isSaving = false;
            this.closeModal();
            // Recarregar lista de produtos
            this.adminDataService.reloadData();
            // Aguardar um pouco para o backend processar e então recarregar
            setTimeout(() => {
              this.loadProducts();
            }, 500);
            this.notification.success('Sucesso!', 'Produto atualizado com sucesso!');
          },
          error: (error) => {
            this.isSaving = false;
            this.notification.error('Erro', 'Erro ao atualizar produto. Tente novamente.');
          }
        });
    } else {
      // Criar novo produto
      const createDTO: CriarProdutoDTO = {
        nome: product.nome,
        descricao: product.descricao,
        preco: product.preco,
        ativo: true,
        emDestaque: product.emDestaque || false
      };

      this.produtoService.criarProduto(createDTO)
        .pipe(
          switchMap((novoProduto) => {
            // Se houver imagem selecionada, fazer upload
            const imageFile = this.productModal?.getSelectedImageFile();
            if (imageFile) {
              return this.produtoService.uploadImagem(novoProduto.id, imageFile);
            }
            return [novoProduto];
          }),
          takeUntil(this.destroy$)
        )
        .subscribe({
          next: () => {
            this.isSaving = false;
            this.closeModal();
            // Recarregar lista de produtos
            this.loadProducts();
            this.notification.success('Sucesso!', 'Produto criado com sucesso!');
          },
          error: (error) => {
            this.isSaving = false;
            this.notification.error('Erro', 'Erro ao criar produto. Tente novamente.');
          }
        });
    }
  }

  private loadProducts() {
    this.adminDataService.getProducts()
      .pipe(takeUntil(this.destroy$))
      .subscribe(products => {
        this.products = products;
      });
  }

  openDeleteModal(product: Product) {
    this.productToDelete = product;
    this.isDeleteModalOpen = true;
  }

  closeDeleteModal() {
    this.isDeleteModalOpen = false;
    this.productToDelete = null;
  }

  confirmDelete() {
    if (this.productToDelete) {
      this.adminDataService.deleteProduct(this.productToDelete.id);
      this.closeDeleteModal();
    }
  }
}
