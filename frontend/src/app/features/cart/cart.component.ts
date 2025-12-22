import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { FooterComponent } from '../../shared/components/footer/footer.component';
import { CartService } from '../../core/services/cart.service';
import { Cart, CartItem } from '../../core/models';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, HeaderComponent, FooterComponent],
  template: `
    <app-header></app-header>
    
    <div class="cart-page">
      <div class="container">
        <div class="page-header">
          <h1>Mon Panier</h1>
          <p>{{ getItemsCount() }} article(s) dans votre panier</p>
        </div>

        <div class="cart-layout" *ngIf="getItemsCount() > 0; else emptyCart">
          <!-- Cart Items -->
          <div class="cart-items">
            <div class="cart-item" *ngFor="let item of cart.items; let i = index">
              <div class="item-image">
                <img [src]="item.produit.imagePrincipale || 'assets/placeholder-product.png'" [alt]="item.produit.nom" class="cart-img" *ngIf="item.produit.imagePrincipale">
                <div class="image-placeholder" *ngIf="!item.produit.imagePrincipale">
                  <span>🏺</span>
                </div>
              </div>

              <div class="item-details">
                <h3 class="item-name">{{ item.produit.nom }}</h3>
                <p class="item-category">Artisanat Marocain</p>
                <p class="item-price">{{ item.produit.prixPromo || item.produit.prix }} MAD</p>
              </div>

              <div class="item-quantity">
                <button class="qty-btn" (click)="decreaseQuantity(i)">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <line x1="5" y1="12" x2="19" y2="12"/>
                  </svg>
                </button>
                <span class="qty-value">{{ item.quantite }}</span>
                <button class="qty-btn" (click)="increaseQuantity(i)">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <line x1="12" y1="5" x2="12" y2="19"/>
                    <line x1="5" y1="12" x2="19" y2="12"/>
                  </svg>
                </button>
              </div>

              <div class="item-total">
                <strong>{{ (item.produit.prixPromo || item.produit.prix) * item.quantite }} MAD</strong>
              </div>

              <button class="btn-remove" (click)="removeItem(i)" title="Supprimer">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <polyline points="3 6 5 6 21 6"/>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                  <line x1="10" y1="11" x2="10" y2="17"/>
                  <line x1="14" y1="11" x2="14" y2="17"/>
                </svg>
              </button>
            </div>
          </div>

          <!-- Cart Summary -->
          <aside class="cart-summary">
            <div class="summary-card">
              <h2>Récapitulatif</h2>

              <!-- Promo Code -->
              <div class="promo-section">
                <div class="promo-input">
                  <input 
                    type="text" 
                    placeholder="Code promo"
                    [(ngModel)]="promoCode">
                  <button class="btn-apply" (click)="applyPromo()">
                    Appliquer
                  </button>
                </div>
                <p class="promo-success" *ngIf="promoApplied">
                  ✓ Code promo appliqué (-{{ discountPercent }}%)
                </p>
              </div>

              <!-- Price Details -->
              <div class="price-details">
                <div class="price-row">
                  <span>Sous-total</span>
                  <strong>{{ cart.sousTotal }} MAD</strong>
                </div>

                <div class="price-row" *ngIf="promoApplied">
                  <span>Réduction (-{{ discountPercent }}%)</span>
                  <strong class="discount-amount">-{{ getDiscountAmount() }} MAD</strong>
                </div>

                <div class="price-row">
                  <span>Frais de livraison</span>
                  <strong>{{ cart.fraisLivraison }} MAD</strong>
                </div>

                <div class="shipping-info" *ngIf="cart.fraisLivraison > 0">
                  🚚 Livraison gratuite à partir de 500 MAD
                </div>
                <div class="shipping-info success" *ngIf="cart.fraisLivraison === 0">
                  ✨ Livraison gratuite offerte !
                </div>

                <div class="price-row total">
                  <span>Total</span>
                  <strong>{{ cart.total }} MAD</strong>
                </div>
              </div>

              <!-- Checkout Button -->
              <button class="btn-checkout" routerLink="/checkout">
                Passer la commande
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <line x1="5" y1="12" x2="19" y2="12"/>
                  <polyline points="12 5 19 12 12 19"/>
                </svg>
              </button>

              <button class="btn-continue" routerLink="/catalogue">
                Continuer mes achats
              </button>
            </div>

            <!-- Trust Badges -->
            <div class="trust-badges">
              <div class="badge">
                <span class="badge-icon">🔒</span>
                <div>
                  <strong>Paiement sécurisé</strong>
                  <p>Transactions 100% sécurisées</p>
                </div>
              </div>
              <div class="badge">
                <span class="badge-icon">📦</span>
                <div>
                  <strong>Livraison rapide</strong>
                  <p>2-5 jours ouvrables</p>
                </div>
              </div>
              <div class="badge">
                <span class="badge-icon">↩️</span>
                <div>
                  <strong>Retours gratuits</strong>
                  <p>14 jours pour changer d'avis</p>
                </div>
              </div>
            </div>
          </aside>
        </div>

        <!-- Empty Cart -->
        <ng-template #emptyCart>
          <div class="empty-cart">
            <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="#E0E0E0" stroke-width="1.5">
              <circle cx="9" cy="21" r="1"/>
              <circle cx="20" cy="21" r="1"/>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
            </svg>
            <h2>Votre panier est vide</h2>
            <p>Découvrez notre collection de produits artisanaux marocains</p>
            <button class="btn-shop" routerLink="/catalogue">
              Découvrir le catalogue
            </button>
          </div>
        </ng-template>
      </div>
    </div>

    <app-footer></app-footer>
  `,
  styles: [`
    .cart-page {
      background: #FAF7F0;
      min-height: calc(100vh - 200px);
      padding: 40px 0 80px;
    }

    .container {
      max-width: 1280px;
      margin: 0 auto;
      padding: 0 20px;
    }

    .page-header {
      margin-bottom: 40px;
    }

    .page-header h1 {
      font-family: 'Cairo', sans-serif;
      font-size: 2.5rem;
      color: #1A4C8B;
      margin: 0 0 10px;
    }

    .page-header p {
      color: #666;
      margin: 0;
    }

    /* Layout */
    .cart-layout {
      display: grid;
      grid-template-columns: 1fr 400px;
      gap: 30px;
    }

    /* Cart Items */
    .cart-items {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .cart-item {
      background: white;
      border-radius: 12px;
      padding: 25px;
      display: grid;
      grid-template-columns: 100px 1fr auto auto auto;
      gap: 25px;
      align-items: center;
      box-shadow: 0 2px 8px rgba(0,0,0,0.05);
      transition: all 0.2s;
    }

    .cart-item:hover {
      box-shadow: 0 4px 16px rgba(0,0,0,0.1);
    }

    .item-image {
      width: 100px;
      height: 100px;
      border-radius: 8px;
      overflow: hidden;
    }

    .cart-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .image-placeholder {
      width: 100%;
      height: 100%;
      background: linear-gradient(135deg, #f5f5f5, #e0e0e0);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 2.5rem;
    }

    .item-details {
      display: flex;
      flex-direction: column;
      gap: 5px;
    }

    .item-name {
      font-family: 'Cairo', sans-serif;
      font-size: 1.1rem;
      font-weight: 600;
      color: #2A2A2A;
      margin: 0;
    }

    .item-category {
      font-size: 0.9rem;
      color: #999;
      margin: 0;
    }

    .item-price {
      font-family: 'Cairo', sans-serif;
      font-size: 1rem;
      color: #1A4C8B;
      font-weight: 600;
      margin: 5px 0 0;
    }

    /* Quantity Controls */
    .item-quantity {
      display: flex;
      align-items: center;
      gap: 15px;
      background: #F8F9FA;
      padding: 8px 15px;
      border-radius: 8px;
    }

    .qty-btn {
      width: 28px;
      height: 28px;
      background: white;
      border: 2px solid #E0E0E0;
      border-radius: 6px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #666;
      transition: all 0.2s;
    }

    .qty-btn:hover {
      border-color: #1A4C8B;
      color: #1A4C8B;
      transform: scale(1.1);
    }

    .qty-value {
      font-family: 'Cairo', sans-serif;
      font-size: 1.1rem;
      font-weight: 600;
      color: #2A2A2A;
      min-width: 30px;
      text-align: center;
    }

    .item-total {
      font-family: 'Cairo', sans-serif;
      font-size: 1.35rem;
      color: #C0392B;
      min-width: 140px;
      text-align: right;
    }

    .btn-remove {
      width: 40px;
      height: 40px;
      background: transparent;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      color: #999;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s;
    }

    .btn-remove:hover {
      background: #FEE;
      color: #C0392B;
    }

    /* Cart Summary */
    .cart-summary {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .summary-card {
      background: white;
      border-radius: 24px;
      padding: 40px;
      box-shadow: 0 10px 40px rgba(0,0,0,0.03);
      position: sticky;
      top: 200px;
      border: 1px solid rgba(212, 166, 80, 0.08);
      overflow: hidden;
    }

    .summary-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 6px;
      background: linear-gradient(90deg, #1A4C8B, #D4A650);
    }

    .summary-card h2 {
      font-family: 'Cairo', sans-serif;
      font-size: 1.5rem;
      margin: 0 0 25px;
      padding-bottom: 15px;
      border-bottom: 2px solid #F0F0F0;
    }

    /* Promo Code */
    .promo-section {
      margin-bottom: 25px;
    }

    .promo-input {
      display: flex;
      gap: 10px;
      margin-bottom: 10px;
    }

    .promo-input input {
      flex: 1;
      padding: 12px 16px;
      border: 2px solid #E0E0E0;
      border-radius: 8px;
      font-family: 'Poppins', sans-serif;
      font-size: 0.95rem;
    }

    .promo-input input:focus {
      outline: none;
      border-color: #1A4C8B;
    }

    .btn-apply {
      padding: 12px 20px;
      background: #f1f5f9;
      border: none;
      border-radius: 12px;
      font-family: 'Cairo', sans-serif;
      font-weight: 700;
      color: #1A4C8B;
      cursor: pointer;
      transition: all 0.2s;
    }

    .btn-apply:hover {
      background: #1A4C8B;
      border-color: #1A4C8B;
      color: white;
    }

    .promo-success {
      color: #27AE60;
      font-size: 0.9rem;
      margin: 0;
      font-weight: 500;
    }

    /* Price Details */
    .price-details {
      display: flex;
      flex-direction: column;
      gap: 15px;
      margin-bottom: 25px;
    }

    .price-row {
      display: flex;
      justify-content: space-between;
      font-size: 0.95rem;
    }

    .price-row.total {
      padding-top: 20px;
      border-top: 2px solid #f1f5f9;
      margin-top: 15px;
      font-size: 1.4rem;
      color: #1A4C8B;
      font-weight: 800;
    }

    .discount-amount {
      color: #27AE60;
    }

    .shipping-info {
      padding: 12px;
      background: #FFF3CD;
      border-radius: 8px;
      font-size: 0.85rem;
      color: #856404;
      text-align: center;
    }

    .shipping-info.success {
      background: #D4EDDA;
      color: #155724;
    }

    /* Buttons */
    .btn-checkout {
      width: 100%;
      padding: 16px;
      background: linear-gradient(135deg, #1A4C8B, #2A5C9B);
      color: white;
      border: none;
      border-radius: 12px;
      font-family: 'Cairo', sans-serif;
      font-size: 1.1rem;
      font-weight: 600;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      transition: all 0.3s;
      box-shadow: 0 4px 15px rgba(26, 76, 139, 0.3);
      margin-bottom: 15px;
    }

    .btn-checkout:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(26, 76, 139, 0.4);
    }

    .btn-continue {
      width: 100%;
      padding: 14px;
      background: #F5F5F5;
      border: 2px solid #E0E0E0;
      border-radius: 12px;
      font-family: 'Poppins', sans-serif;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s;
    }

    .btn-continue:hover {
      background: #E0E0E0;
    }

    /* Trust Badges */
    .trust-badges {
      background: white;
      border-radius: 12px;
      padding: 25px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.05);
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .badge {
      display: flex;
      gap: 15px;
      align-items: flex-start;
    }

    .badge-icon {
      font-size: 2rem;
      flex-shrink: 0;
    }

    .badge strong {
      display: block;
      font-family: 'Cairo', sans-serif;
      color: #2A2A2A;
      margin-bottom: 3px;
    }

    .badge p {
      font-size: 0.85rem;
      color: #666;
      margin: 0;
    }

    /* Empty Cart */
    .empty-cart {
      text-align: center;
      padding: 80px 20px;
    }

    .empty-cart h2 {
      font-family: 'Cairo', sans-serif;
      font-size: 2rem;
      color: #2A2A2A;
      margin: 30px 0 15px;
    }

    .empty-cart p {
      color: #666;
      font-size: 1.1rem;
      margin: 0 0 40px;
    }

    .btn-shop {
      padding: 16px 40px;
      background: linear-gradient(135deg, #1A4C8B, #2A5C9B);
      color: white;
      border: none;
      border-radius: 12px;
      font-family: 'Cairo', sans-serif;
      font-size: 1.1rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s;
      box-shadow: 0 4px 15px rgba(26, 76, 139, 0.3);
    }

    .btn-shop:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(26, 76, 139, 0.4);
    }

    /* Responsive */
    @media (max-width: 1024px) {
      .cart-layout {
        grid-template-columns: 1fr;
      }

      .summary-card {
        position: static;
      }
    }

    @media (max-width: 768px) {
      .cart-item {
        grid-template-columns: 80px 1fr;
        gap: 15px;
      }

      .item-quantity,
      .item-total,
      .btn-remove {
        grid-column: 2;
      }

     .item-quantity {
        justify-content: flex-start;
      }
    }
  `]
})
export class CartComponent implements OnInit, OnDestroy {
  cart: Cart = { items: [], sousTotal: 0, fraisLivraison: 0, total: 0 };
  promoCode = '';
  promoApplied = false;
  discountPercent = 0;
  private cartSubscription?: Subscription;

  constructor(private cartService: CartService) { }

  ngOnInit() {
    this.cartSubscription = this.cartService.cart$.subscribe(cart => {
      this.cart = cart;
    });
  }

  ngOnDestroy() {
    if (this.cartSubscription) {
      this.cartSubscription.unsubscribe();
    }
  }

  getItemsCount(): number {
    return this.cartService.getItemCount();
  }

  getDiscountAmount(): number {
    return this.promoApplied ? Math.round(this.cart.sousTotal * (this.discountPercent / 100)) : 0;
  }

  increaseQuantity(index: number) {
    const item = this.cart.items[index];
    this.cartService.updateQuantity(index, item.quantite + 1);
  }

  decreaseQuantity(index: number) {
    const item = this.cart.items[index];
    this.cartService.updateQuantity(index, item.quantite - 1);
  }

  removeItem(index: number) {
    if (confirm('Retirer cet article du panier ?')) {
      this.cartService.removeFromCart(index);
    }
  }

  applyPromo() {
    if (!this.promoCode.trim()) return;

    const discount = this.cartService.applyPromoCode(this.promoCode);
    if (discount > 0) {
      this.promoApplied = true;
      this.discountPercent = discount;
    } else {
      alert('Code promo invalide');
      this.promoApplied = false;
      this.discountPercent = 0;
    }
  }
}
