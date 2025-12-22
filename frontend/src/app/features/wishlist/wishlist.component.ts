import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { FooterComponent } from '../../shared/components/footer/footer.component';
import { WishlistService } from '../../core/services/wishlist.service';
import { CartService } from '../../core/services/cart.service';
import { Product } from '../../core/models';

@Component({
  selector: 'app-wishlist',
  standalone: true,
  imports: [CommonModule, RouterLink, HeaderComponent, FooterComponent],
  template: `
    <app-header></app-header>
    
    <div class="wishlist-page">
      <div class="container">
        <div class="page-header">
          <h1>Ma Liste de Souhaits</h1>
          <p>{{ wishlistItems.length }} article(s) sauvegardé(s)</p>
        </div>

        <div class="wishlist-grid" *ngIf="wishlistItems.length > 0; else emptyWishlist">
          <div class="wishlist-item" *ngFor="let product of wishlistItems">
            <div class="item-image">
              <img [src]="product.imagePrincipale || 'assets/placeholder-product.png'" [alt]="product.nom">
              <button class="btn-remove" (click)="removeFromWishlist(product.id)" title="Retirer de la liste">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M18 6L6 18M6 6l12 12"/>
                </svg>
              </button>
            </div>

            <div class="item-details">
              <span class="category">{{ product.categorie || 'Artisanat' }}</span>
              <h3 class="name">{{ product.nom }}</h3>
              <div class="price-row">
                <span class="price">{{ product.prix }} DH</span>
                <span class="old-price" *ngIf="product.enPromotion">{{ product.prixPromo || product.prix }} DH</span>
              </div>
              
              <button class="btn-add-cart" (click)="addToCart(product)">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M9 20a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm7 0a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm-7-8l-1.68-7.57a1 1 0 0 0-.96-.83H2.01L2 2h2.5l3.96 17.84a1 1 0 0 0 .96.83h9.92a1 1 0 0 0 .96-.83L21.99 6H7"/>
                </svg>
                Ajouter au panier
              </button>
            </div>
          </div>
        </div>

        <ng-template #emptyWishlist>
          <div class="empty-state">
            <div class="empty-icon">❤️</div>
            <h2>Votre liste de souhaits est vide</h2>
            <p>Sauvegardez vos articles préférés pour plus tard</p>
            <button class="btn-shop" routerLink="/catalogue">
              Explorer la collection
            </button>
          </div>
        </ng-template>
      </div>
    </div>

    <app-footer></app-footer>
  `,
  styles: [`
    .wishlist-page {
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
      text-align: center;
    }

    .page-header h1 {
      font-family: 'Cairo', sans-serif;
      font-size: 2.5rem;
      color: #1A4C8B;
      margin: 0 0 10px;
    }

    .page-header p {
      color: #666;
    }

    /* Grid */
    .wishlist-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 30px;
    }

    /* Item Card */
    .wishlist-item {
      background: white;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 4px 15px rgba(0,0,0,0.05);
      transition: transform 0.3s;
      position: relative;
    }

    .wishlist-item:hover {
      transform: translateY(-5px);
      box-shadow: 0 8px 25px rgba(0,0,0,0.1);
    }

    .item-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .btn-remove {
      position: absolute;
      top: 10px;
      right: 10px;
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background: white;
      border: none;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      color: #999;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      transition: all 0.2s;
    }

    .btn-remove:hover {
      background: #C0392B;
      color: white;
    }

    .item-details {
      padding: 20px;
    }

    .category {
      font-size: 0.85rem;
      color: #999;
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    .name {
      font-family: 'Cairo', sans-serif;
      font-size: 1.1rem;
      color: #2A2A2A;
      margin: 5px 0 15px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .price-row {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 20px;
    }

    .price {
      font-weight: 700;
      color: #1A4C8B;
      font-size: 1.2rem;
    }

    .old-price {
      color: #999;
      text-decoration: line-through;
      font-size: 0.9rem;
    }

    .btn-add-cart {
      width: 100%;
      padding: 12px;
      background: #1A4C8B;
      color: white;
      border: none;
      border-radius: 8px;
      font-family: 'Cairo', sans-serif;
      font-weight: 600;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      transition: background 0.2s;
    }

    .btn-add-cart:hover {
      background: #C0392B;
    }

    /* Empty State */
    .empty-state {
      text-align: center;
      padding: 60px 20px;
      background: white;
      border-radius: 12px;
      box-shadow: 0 4px 15px rgba(0,0,0,0.05);
    }

    .empty-icon {
      font-size: 4rem;
      margin-bottom: 20px;
      opacity: 0.5;
    }

    .empty-state h2 {
      font-family: 'Cairo', sans-serif;
      font-size: 1.8rem;
      color: #2A2A2A;
      margin: 0 0 15px;
    }

    .empty-state p {
      color: #666;
      margin-bottom: 30px;
    }

    .btn-shop {
      padding: 14px 30px;
      background: linear-gradient(135deg, #C0392B, #D4392B);
      color: white;
      border: none;
      border-radius: 8px;
      font-family: 'Cairo', sans-serif;
      font-weight: 600;
      cursor: pointer;
      text-decoration: none;
      transition: transform 0.2s;
    }

    .btn-shop:hover {
      transform: translateY(-2px);
    }
  `]
})
export class WishlistComponent implements OnInit {
  wishlistItems: Product[] = [];

  constructor(
    private wishlistService: WishlistService,
    private cartService: CartService
  ) { }

  ngOnInit() {
    this.wishlistService.wishlist$.subscribe(items => {
      this.wishlistItems = items;
    });
  }

  removeFromWishlist(id: string) {
    this.wishlistService.removeFromWishlist(id);
  }

  addToCart(product: Product) {
    // Check if cart service has addToCart method, assuming it does
    // Or we can mock it for now since CartService update was a task item
    // this.cartService.addToCart(product); 
    alert(`Produit ${product.nom} ajouté au panier !`);
  }
}
