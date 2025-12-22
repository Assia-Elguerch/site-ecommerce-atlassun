import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import {
    User,
    UserCreateRequest,
    UserUpdateRequest,
    PaginatedResponse,
    PageRequest,
    UserRole
} from '../models';

/**
 * Service de gestion des utilisateurs
 */
@Injectable({
    providedIn: 'root'
})
export class UserService {

    constructor(private apiService: ApiService) { }

    /**
     * Obtenir tous les utilisateurs (avec pagination)
     */
    getUsers(pageRequest?: PageRequest): Observable<PaginatedResponse<User>> {
        const params = {
            page: pageRequest?.page || 0,
            size: pageRequest?.size || 10,
            sort: pageRequest?.sort ? `${pageRequest.sort.field},${pageRequest.sort.direction}` : 'dateInscription,desc'
        };

        return this.apiService.get<PaginatedResponse<User>>('users', params);
    }

    /**
     * Obtenir un utilisateur par ID
     */
    getUserById(id: number): Observable<User> {
        return this.apiService.get<User>(`users/${id}`);
    }

    /**
     * Créer un utilisateur
     */
    createUser(user: UserCreateRequest): Observable<User> {
        return this.apiService.post<User>('users', user);
    }

    /**
     * Mettre à jour un utilisateur
     */
    updateUser(user: UserUpdateRequest): Observable<User> {
        return this.apiService.put<User>(`users/${user.id}`, user);
    }

    /**
     * Supprimer un utilisateur
     */
    deleteUser(id: number): Observable<void> {
        return this.apiService.delete<void>(`users/${id}`);
    }

    /**
     * Obtenir les utilisateurs par rôle
     */
    getUsersByRole(role: UserRole, pageRequest?: PageRequest): Observable<PaginatedResponse<User>> {
        const params = {
            role,
            page: pageRequest?.page || 0,
            size: pageRequest?.size || 10
        };

        return this.apiService.get<PaginatedResponse<User>>('users/role', params);
    }

    /**
     * Activer/Désactiver un utilisateur
     */
    toggleUserStatus(id: number): Observable<User> {
        return this.apiService.patch<User>(`users/${id}/toggle-status`, {});
    }

    /**
     * Rechercher des utilisateurs
     */
    searchUsers(query: string, pageRequest?: PageRequest): Observable<PaginatedResponse<User>> {
        const params = {
            q: query,
            page: pageRequest?.page || 0,
            size: pageRequest?.size || 10
        };

        return this.apiService.get<PaginatedResponse<User>>('users/search', params);
    }
}
