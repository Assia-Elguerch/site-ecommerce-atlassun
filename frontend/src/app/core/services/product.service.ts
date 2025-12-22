import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiService } from './api.service';
import {
    Product,
    ProductCreateRequest,
    ProductUpdateRequest,
    ProductFilter,
    PaginatedResponse,
    PageRequest
} from '../models';

/**
 * Service de gestion des produits
 */
@Injectable({
    providedIn: 'root'
})
export class ProductService {

    constructor(private apiService: ApiService) { }

    /**
     * Obtenir tous les produits avec filtres et pagination
     */
    getProducts(filter?: ProductFilter, pageRequest?: PageRequest): Observable<PaginatedResponse<Product>> {
        const params = {
            ...filter,
            page: pageRequest?.page || 0,
            limit: pageRequest?.size || 12,
            sort: pageRequest?.sort ? `${pageRequest.sort.field},${pageRequest.sort.direction}` : undefined
        };

        return this.apiService.get<any>('products', params).pipe(
            map(response => {
                if (response.status === 'success' && response.data) {
                    return {
                        content: response.data.products,
                        totalElements: response.data.pagination.total,
                        totalPages: response.data.pagination.totalPages,
                        currentPage: response.data.pagination.page,
                        pageSize: response.data.pagination.limit
                    };
                }
                return {
                    content: [],
                    totalElements: 0,
                    totalPages: 0,
                    currentPage: 0,
                    pageSize: 12
                };
            })
        );
    }

    /**
     * Obtenir un produit par ID
     */
    getProductById(id: string): Observable<Product> {
        return this.apiService.get<any>(`products/${id}`).pipe(
            map(response => response.data.product)
        );
    }

    /**
     * Créer un produit
     */
    createProduct(product: ProductCreateRequest): Observable<Product> {
        return this.apiService.post<any>('products', product).pipe(
            map(response => response.data.product)
        );
    }

    /**
     * Mettre à jour un produit
     */
    updateProduct(product: ProductUpdateRequest): Observable<Product> {
        return this.apiService.patch<any>(`products/${product.id}`, product).pipe(
            map(response => response.data.product)
        );
    }

    /**
     * Supprimer un produit
     */
    deleteProduct(id: string): Observable<void> {
        return this.apiService.delete<void>(`products/${id}`);
    }

    /**
     * Obtenir les produits en vedette
     */
    getFeaturedProducts(limit: number = 8): Observable<Product[]> {
        return this.apiService.get<any>('products/bestsellers/list', { limit }).pipe(
            map(response => response.data.products)
        );
    }

    /**
     * Obtenir les nouveaux produits
     */
    getNewProducts(limit: number = 8): Observable<Product[]> {
        return this.apiService.get<any>('products/nouveautes/list', { limit }).pipe(
            map(response => response.data.products)
        );
    }

    /**
     * Obtenir les produits en promotion
     */
    getPromoProducts(limit: number = 8): Observable<Product[]> {
        return this.apiService.get<any>('products/promotions/list', { limit }).pipe(
            map(response => response.data.products)
        );
    }

    /**
     * Rechercher des produits
     */
    searchProducts(query: string, pageRequest?: PageRequest): Observable<PaginatedResponse<Product>> {
        return this.getProducts({ search: query } as any, pageRequest);
    }
}
