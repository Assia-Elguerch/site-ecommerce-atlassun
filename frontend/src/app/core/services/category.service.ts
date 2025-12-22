import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import {
    Category,
    CategoryCreateRequest,
    CategoryUpdateRequest
} from '../models';

/**
 * Service de gestion des catégories
 */
@Injectable({
    providedIn: 'root'
})
export class CategoryService {

    constructor(private apiService: ApiService) { }

    /**
     * Obtenir toutes les catégories
     */
    getCategories(): Observable<Category[]> {
        return this.apiService.get<Category[]>('categories');
    }

    /**
     * Obtenir les catégories actives
     */
    getActiveCategories(): Observable<Category[]> {
        return this.apiService.get<Category[]>('categories/actives');
    }

    /**
     * Obtenir une catégorie par ID
     */
    getCategoryById(id: number): Observable<Category> {
        return this.apiService.get<Category>(`categories/${id}`);
    }

    /**
     * Créer une catégorie
     */
    createCategory(category: CategoryCreateRequest): Observable<Category> {
        return this.apiService.post<Category>('categories', category);
    }

    /**
     * Mettre à jour une catégorie
     */
    updateCategory(category: CategoryUpdateRequest): Observable<Category> {
        return this.apiService.put<Category>(`categories/${category.id}`, category);
    }

    /**
     * Supprimer une catégorie
     */
    deleteCategory(id: number): Observable<void> {
        return this.apiService.delete<void>(`categories/${id}`);
    }
}
