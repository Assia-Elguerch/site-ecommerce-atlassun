import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { tap, catchError, map } from 'rxjs/operators';
import { StorageService } from './storage.service';
import { ApiService } from './api.service';
import { AuthService } from './auth.service';
import { Product } from '../models';

@Injectable({
    providedIn: 'root'
})
export class WishlistService {
    private wishlistSubject: BehaviorSubject<Product[]>;
    public wishlist$: Observable<Product[]>;

    constructor(
        private storageService: StorageService,
        private apiService: ApiService,
        private authService: AuthService
    ) {
        this.wishlistSubject = new BehaviorSubject<Product[]>([]);
        this.wishlist$ = this.wishlistSubject.asObservable();

        // Load initial wishlist
        this.loadWishlist();
    }

    /**
     * Load wishlist from API or LocalStorage (for guests)
     */
    loadWishlist(): void {
        const guestWishlist = this.storageService.getItem<Product[]>('guest_wishlist') || [];

        if (!this.authService.isAuthenticated()) {
            this.wishlistSubject.next(guestWishlist);
            return;
        }

        this.apiService.get<{ data: Product[] }>('/wishlist')
            .pipe(
                map(response => response.data || []),
                catchError(() => of(guestWishlist)) // Fallback to guest wishlist if API fails
            )
            .subscribe({
                next: (products) => this.wishlistSubject.next(products),
                error: (err) => console.error('Failed to load wishlist', err)
            });
    }

    /**
     * Get current wishlist value
     */
    getWishlist(): Product[] {
        return this.wishlistSubject.value;
    }

    /**
     * Add product to wishlist
     */
    addToWishlist(product: Product): void {
        const current = this.wishlistSubject.value;
        if (current.some(p => p.id === product.id)) return;

        const updated = [...current, product];
        this.wishlistSubject.next(updated);

        if (!this.authService.isAuthenticated()) {
            this.storageService.setItem('guest_wishlist', updated);
            return;
        }

        this.apiService.post<{ data: Product[] }>(`/wishlist/${product.id}`, {})
            .subscribe({
                error: (err) => console.error('Error adding to wishlist', err)
            });
    }

    /**
     * Remove product from wishlist
     */
    removeFromWishlist(productId: string | number): void {
        const updated = this.wishlistSubject.value.filter(p => String(p.id) !== String(productId));
        this.wishlistSubject.next(updated);

        if (!this.authService.isAuthenticated()) {
            this.storageService.setItem('guest_wishlist', updated);
            return;
        }

        this.apiService.delete<{ data: Product[] }>(`/wishlist/${productId}`)
            .subscribe({
                error: (err) => console.error('Error removing from wishlist', err)
            });
    }

    /**
     * Toggle item in wishlist
     */
    toggleWishlist(product: Product): boolean {
        const isIn = this.isInWishlist(product.id);
        if (isIn) {
            this.removeFromWishlist(product.id);
            return false;
        } else {
            this.addToWishlist(product);
            return true;
        }
    }

    /**
     * Check if product is in wishlist
     */
    isInWishlist(productId: string | number): boolean {
        return this.wishlistSubject.value.some(p => String(p.id) === String(productId));
    }

    /**
     * Get count
     */
    getWishlistCount(): number {
        return this.wishlistSubject.value.length;
    }

    /**
     * Get IDs
     */
    getWishlistIds(): (string | number)[] {
        return this.wishlistSubject.value.map(p => p.id);
    }
}
