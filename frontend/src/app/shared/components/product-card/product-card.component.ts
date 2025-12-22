import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { Product } from '../../../core/models';
import { WishlistService } from '../../../core/services/wishlist.service';
import { CartService } from '../../../core/services/cart.service';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="product-card" [class.new]="product.nouveau">
      <!-- Status Badges -->
      <div class="badges-wrapper">
        <span class="badge new" *ngIf="product.nouveau">Nouveau</span>
        <span class="badge sale" *ngIf="product.enPromotion">Promo</span>
      </div>

      <!-- Quick Action Overlay -->
      <div class="card-media">
        <img [src]="product.imagePrincipale || 'assets/placeholder-product.png'" 
             [alt]="product.nom" 
             class="main-img"
             (click)="viewDetails()">
        
        <div class="media-overlay">
          <div class="overlay-actions" (click)="$event.stopPropagation()">
            <button class="icon-btn" (click)="toggleWishlist($event)" [class.active]="isInWishlist()" title="Favoris">
              <svg width="22" height="22" viewBox="0 0 24 24" [attr.fill]="isInWishlist() ? '#C0392B' : 'none'" [attr.stroke]="isInWishlist() ? '#C0392B' : 'currentColor'">
                <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l8.72-8.72 1.06-1.06a5.5 5.5 0 000-7.78z" stroke-width="2"/>
              </svg>
            </button>
            <button class="icon-btn" (click)="viewDetails()" title="Voir détails">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke-width="2"/>
                <circle cx="12" cy="12" r="3" stroke-width="2"/>
              </svg>
            </button>
          </div>
          <button class="add-to-cart-btn" (click)="addToCart($event)">
            <span>Ajouter au Panier</span>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4H6z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M3 6h18M16 10a4 4 0 01-8 0" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
        </div>
      </div>

      <!-- Content Area -->
      <div class="card-content" (click)="viewDetails()">
        <div class="category-tag">{{ product.categorie }}</div>
        <h3 class="name">{{ product.nom }}</h3>
        <div class="price-row">
          <div class="pricing">
            <span class="current" *ngIf="product.enPromotion">{{ product.prixPromo }} MAD</span>
            <span class="original" [class.discounted]="product.enPromotion">{{ product.prix }} MAD</span>
          </div>
          <div class="stars">
            <span class="star">★</span>
            <span class="rating">4.8</span>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .product-card {
      background: white;
      border-radius: 20px;
      overflow: hidden;
      box-shadow: 0 4px 20px rgba(0,0,0,0.04);
      transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
      position: relative;
      border: 1px solid rgba(212, 166, 80, 0.08);
      display: flex;
      flex-direction: column;
      height: 100%;
    }

    .product-card:hover {
      transform: translateY(-8px);
      box-shadow: 0 20px 40px rgba(26, 76, 139, 0.08);
      border-color: rgba(212, 166, 80, 0.2);
    }

    .badges-wrapper {
      position: absolute;
      top: 15px;
      left: 15px;
      z-index: 5;
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .badge {
      padding: 5px 12px;
      font-size: 0.65rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      border-radius: 8px;
      color: white;
      box-shadow: 0 4px 8px rgba(0,0,0,0.1);
    }

    .badge.new { background: #1A4C8B; }
    .badge.sale { background: #C0392B; }

    .card-media {
      position: relative;
      height: 300px;
      overflow: hidden;
      background: #f8fafc;
      cursor: pointer;
    }

    .main-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.6s ease;
    }

    .product-card:hover .main-img {
      transform: scale(1.05);
    }

    .media-overlay {
      position: absolute;
      inset: 0;
      background: rgba(26, 76, 139, 0.2);
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding: 20px;
      opacity: 0;
      transition: all 0.3s ease;
      backdrop-filter: blur(4px);
    }

    .product-card:hover .media-overlay {
      opacity: 1;
    }

    .overlay-actions {
      display: flex;
      justify-content: flex-end;
      gap: 10px;
      transform: translateY(-10px);
      transition: transform 0.3s ease;
    }

    .product-card:hover .overlay-actions {
      transform: translateY(0);
    }

    .icon-btn {
      width: 40px;
      height: 40px;
      background: white;
      border: none;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      color: #1A4C8B;
      transition: all 0.2s;
      box-shadow: 0 4px 12px rgba(0,0,0,0.08);
    }

    .icon-btn:hover {
      background: #D4A650;
      color: white;
      transform: scale(1.05);
    }

    .icon-btn.active {
      color: #C0392B;
    }

    .add-to-cart-btn {
      width: 100%;
      padding: 12px;
      background: #1A4C8B;
      color: white;
      border: none;
      border-radius: 12px;
      font-weight: 700;
      font-family: 'Cairo', sans-serif;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      cursor: pointer;
      transform: translateY(10px);
      transition: all 0.3s ease;
      box-shadow: 0 4px 15px rgba(26, 76, 139, 0.2);
    }

    .product-card:hover .add-to-cart-btn {
      transform: translateY(0);
    }

    .add-to-cart-btn:hover {
      background: #D4A650;
      box-shadow: 0 4px 15px rgba(212, 166, 80, 0.3);
    }

    .card-content {
      padding: 20px;
      flex: 1;
      display: flex;
      flex-direction: column;
    }

    .category-tag {
      font-size: 0.7rem;
      color: #94a3b8;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 6px;
    }

    .name {
      font-family: 'Cairo', sans-serif;
      font-size: 1.1rem;
      font-weight: 700;
      color: #1e293b;
      margin: 0 0 12px;
      line-height: 1.4;
      flex: 1;
    }

    .price-row {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
    }

    .pricing {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .current {
      color: #1A4C8B;
      font-weight: 800;
      font-size: 1.2rem;
    }

    .original {
      color: #94a3b8;
      font-size: 0.9rem;
      font-weight: 500;
    }

    .original.discounted {
      text-decoration: line-through;
      font-size: 0.8rem;
      opacity: 0.6;
    }

    .stars {
      display: flex;
      align-items: center;
      gap: 4px;
      padding: 3px 8px;
      background: #fefce8;
      border-radius: 6px;
      color: #D4A650;
      border: 1px solid rgba(212, 166, 80, 0.1);
    }

    .star { font-size: 0.85rem; }
    .rating { font-size: 0.8rem; font-weight: 700; }

    @media (max-width: 768px) {
      .card-media { height: 220px; }
      .media-overlay { opacity: 1; background: transparent; backdrop-filter: none; padding: 15px; }
      .add-to-cart-btn { transform: translateY(0); box-shadow: none; font-size: 0.9rem; }
      .overlay-actions { transform: translateY(0); }
    }
  `]
})
export class ProductCardComponent {
  @Input() product!: Product;

  constructor(
    private wishlistService: WishlistService,
    private cartService: CartService,
    private notificationService: NotificationService,
    private router: Router
  ) { }

  toggleWishlist(event: Event) {
    event.stopPropagation();
    const added = this.wishlistService.toggleWishlist(this.product);
    if (added) {
      this.notificationService.success(`${this.product.nom} ajouté aux favoris ❤️`);
    } else {
      this.notificationService.info(`${this.product.nom} retiré des favoris`);
    }
  }

  addToCart(event: Event) {
    event.stopPropagation();
    this.cartService.addToCart(this.product);
    this.notificationService.success(`${this.product.nom} ajouté au panier 🛒`);
  }

  viewDetails() {
    this.router.navigate(['/product', this.product.id]);
  }

  isInWishlist(): boolean {
    return this.wishlistService.isInWishlist(this.product.id);
  }
}
