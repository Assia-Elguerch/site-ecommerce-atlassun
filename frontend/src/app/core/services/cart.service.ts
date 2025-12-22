import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { StorageService } from './storage.service';
import { Cart, CartItem, Product } from '../models';

/**
 * Service de gestion du panier
 */
@Injectable({
    providedIn: 'root'
})
export class CartService {
    private readonly CART_KEY = 'atlassun_cart';
    private readonly FRAIS_LIVRAISON = 30; // 30 MAD

    private cartSubject: BehaviorSubject<Cart>;
    public cart$: Observable<Cart>;

    constructor(private storageService: StorageService) {
        const savedCart = this.loadCart();
        this.cartSubject = new BehaviorSubject<Cart>(savedCart);
        this.cart$ = this.cartSubject.asObservable();
    }

    /**
     * Obtenir le panier actuel
     */
    get cart(): Cart {
        return this.cartSubject.value;
    }

    /**
     * Ajouter un produit au panier
     */
    addToCart(produit: Product, quantite: number = 1, taille?: string, couleur?: string): void {
        const cart = this.cart;

        // Vérifier si le produit existe déjà dans le panier
        const existingItemIndex = cart.items.findIndex(item =>
            item.produit.id === produit.id &&
            item.taille === taille &&
            item.couleur === couleur
        );

        if (existingItemIndex > -1) {
            // Augmenter la quantité
            cart.items[existingItemIndex].quantite += quantite;
        } else {
            // Ajouter un nouvel article
            cart.items.push({ produit, quantite, taille, couleur });
        }

        this.updateCart(cart);
    }

    /**
     * Retirer un produit du panier
     */
    removeFromCart(index: number): void {
        const cart = this.cart;
        cart.items.splice(index, 1);
        this.updateCart(cart);
    }

    /**
     * Mettre à jour la quantité d'un article
     */
    updateQuantity(index: number, quantite: number): void {
        const cart = this.cart;

        if (quantite <= 0) {
            this.removeFromCart(index);
            return;
        }

        if (cart.items[index]) {
            cart.items[index].quantite = quantite;
            this.updateCart(cart);
        }
    }

    /**
     * Vider le panier
     */
    clearCart(): void {
        this.updateCart({ items: [], sousTotal: 0, fraisLivraison: 0, total: 0 });
    }

    /**
     * Obtenir le nombre total d'articles dans le panier
     */
    getItemCount(): number {
        return this.cart.items.reduce((count, item) => count + item.quantite, 0);
    }

    /**
     * Appliquer un code promo
     * @returns pourcentage de réduction (ex: 20 pour 20%)
     */
    applyPromoCode(code: string): number {
        const validCodes: { [key: string]: number } = {
            'ATLAS20': 20,
            'BIENVENUE10': 10,
            'SOLDES50': 50
        };

        const discount = validCodes[code.toUpperCase()] || 0;

        if (discount > 0) {
            const cart = this.cart;
            // Stocker le code promo et la réduction dans le panier si le modèle le permettait
            // Pour l'instant, on recalcul le total avec la réduction temporaire
            this.updateCart(cart, discount);
        }

        return discount;
    }

    /**
     * Calculer et mettre à jour le panier
     */
    private updateCart(cart: Cart, discountPercent: number = 0): void {
        // Calculer le sous-total
        cart.sousTotal = cart.items.reduce((total, item) => {
            const prix = item.produit.prixPromo || item.produit.prix;
            return total + (prix * item.quantite);
        }, 0);

        // Calculer la réduction
        const reduction = (cart.sousTotal * discountPercent) / 100;

        // Calculer les frais de livraison (gratuit si > 500 MAD après réduction)
        const subtotalAfterDiscount = cart.sousTotal - reduction;
        cart.fraisLivraison = subtotalAfterDiscount > 500 ? 0 : this.FRAIS_LIVRAISON;

        // Calculer le total
        cart.total = subtotalAfterDiscount + cart.fraisLivraison;

        // Sauvegarder et émettre
        this.saveCart(cart);
        this.cartSubject.next(cart);
    }

    /**
     * Charger le panier depuis le stockage
     */
    private loadCart(): Cart {
        const savedCart = this.storageService.getItem<Cart>(this.CART_KEY);
        return savedCart || { items: [], sousTotal: 0, fraisLivraison: 0, total: 0 };
    }

    /**
     * Sauvegarder le panier dans le stockage
     */
    private saveCart(cart: Cart): void {
        this.storageService.setItem(this.CART_KEY, cart);
    }
}
