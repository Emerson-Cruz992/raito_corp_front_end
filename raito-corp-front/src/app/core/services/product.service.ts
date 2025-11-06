import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService, PaginatedResponse } from './api.service';
import { Product } from '../../shared/models/admin.models';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private readonly endpoint = '/products';

  constructor(private api: ApiService) {}

  /**
   * Busca todos os produtos com paginação
   */
  getProducts(page = 0, size = 20, sort?: string): Observable<PaginatedResponse<Product>> {
    const params = { page, size, ...(sort && { sort }) };
    return this.api.get<PaginatedResponse<Product>>(this.endpoint, params);
  }

  /**
   * Busca um produto por ID
   */
  getProductById(id: number): Observable<Product> {
    return this.api.get<Product>(`${this.endpoint}/${id}`);
  }

  /**
   * Busca produtos por categoria
   */
  getProductsByCategory(category: string, page = 0, size = 20): Observable<PaginatedResponse<Product>> {
    const params = { category, page, size };
    return this.api.get<PaginatedResponse<Product>>(`${this.endpoint}/category`, params);
  }

  /**
   * Busca produtos com filtros
   */
  searchProducts(filters: ProductFilters): Observable<PaginatedResponse<Product>> {
    return this.api.get<PaginatedResponse<Product>>(`${this.endpoint}/search`, filters);
  }

  /**
   * Cria um novo produto (Admin)
   */
  createProduct(product: Partial<Product>): Observable<Product> {
    return this.api.post<Product>(this.endpoint, product);
  }

  /**
   * Atualiza um produto existente (Admin)
   */
  updateProduct(id: number, product: Partial<Product>): Observable<Product> {
    return this.api.put<Product>(`${this.endpoint}/${id}`, product);
  }

  /**
   * Atualiza parcialmente um produto (Admin)
   */
  patchProduct(id: number, updates: Partial<Product>): Observable<Product> {
    return this.api.patch<Product>(`${this.endpoint}/${id}`, updates);
  }

  /**
   * Remove um produto (Admin)
   */
  deleteProduct(id: number): Observable<void> {
    return this.api.delete<void>(`${this.endpoint}/${id}`);
  }

  /**
   * Upload de imagem do produto
   */
  uploadProductImage(productId: number, file: File): Observable<{ imageUrl: string }> {
    return this.api.uploadFile<{ imageUrl: string }>(
      `${this.endpoint}/${productId}/image`,
      file
    );
  }

  /**
   * Atualiza estoque do produto
   */
  updateStock(productId: number, quantity: number): Observable<Product> {
    return this.api.patch<Product>(`${this.endpoint}/${productId}/stock`, { quantity });
  }
}

export interface ProductFilters {
  search?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  page?: number;
  size?: number;
  sort?: string;
}
