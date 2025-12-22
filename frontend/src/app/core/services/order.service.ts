import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import {
    Order,
    OrderCreateRequest,
    OrderUpdateStatusRequest,
    PaginatedResponse,
    PageRequest,
    OrderStatus
} from '../models';

/**
 * Service de gestion des commandes
 */
@Injectable({
    providedIn: 'root'
})
export class OrderService {

    constructor(private apiService: ApiService) { }

    /**
     * Créer une commande
     */
    createOrder(order: OrderCreateRequest): Observable<Order> {
        return this.apiService.post<Order>('commandes', order);
    }

    /**
     * Obtenir toutes les commandes (avec pagination)
     */
    getOrders(pageRequest?: PageRequest): Observable<PaginatedResponse<Order>> {
        const params = {
            page: pageRequest?.page || 0,
            size: pageRequest?.size || 10,
            sort: pageRequest?.sort ? `${pageRequest.sort.field},${pageRequest.sort.direction}` : 'dateCommande,desc'
        };

        return this.apiService.get<PaginatedResponse<Order>>('commandes', params);
    }

    /**
     * Obtenir les commandes d'un client
     */
    getOrdersByClient(clientId: number, pageRequest?: PageRequest): Observable<PaginatedResponse<Order>> {
        const params = {
            page: pageRequest?.page || 0,
            size: pageRequest?.size || 10,
            sort: 'dateCommande,desc'
        };

        return this.apiService.get<PaginatedResponse<Order>>(`commandes/client/${clientId}`, params);
    }

    /**
     * Obtenir une commande par ID
     */
    getOrderById(id: number): Observable<Order> {
        return this.apiService.get<Order>(`commandes/${id}`);
    }

    /**
     * Obtenir une commande par numéro
     */
    getOrderByNumber(numero: string): Observable<Order> {
        return this.apiService.get<Order>(`commandes/numero/${numero}`);
    }

    /**
     * Mettre à jour le statut d'une commande
     */
    updateOrderStatus(request: OrderUpdateStatusRequest): Observable<Order> {
        return this.apiService.patch<Order>(`commandes/${request.id}/statut`, request);
    }

    /**
     * Obtenir les commandes par statut
     */
    getOrdersByStatus(statut: OrderStatus, pageRequest?: PageRequest): Observable<PaginatedResponse<Order>> {
        const params = {
            statut,
            page: pageRequest?.page || 0,
            size: pageRequest?.size || 10,
            sort: 'dateCommande,desc'
        };

        return this.apiService.get<PaginatedResponse<Order>>('commandes/statut', params);
    }

    /**
     * Annuler une commande
     */
    cancelOrder(id: number): Observable<Order> {
        return this.apiService.patch<Order>(`commandes/${id}/annuler`, {});
    }

    /**
     * Obtenir les statistiques des commandes (admin)
     */
    getOrderStats(): Observable<any> {
        return this.apiService.get<any>('commandes/stats');
    }
}
