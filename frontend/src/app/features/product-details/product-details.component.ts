import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Product } from '../../core/models';
import { ProductService } from '../../core/services/product.service';
import { WishlistService } from '../../core/services/wishlist.service';
import { CartService } from '../../core/services/cart.service';
import { NotificationService } from '../../core/services/notification.service';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { FooterComponent } from '../../shared/components/footer/footer.component';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, HeaderComponent, FooterComponent],
  template: `
    <app-header></app-header>

    <div class="product-details-page animate-fade-in" *ngIf="product">
      <div class="container container-content">
        <!-- Breadcrumbs -->
        <nav class="breadcrumb">
          <a routerLink="/">Accueil</a>
          <span class="separator">/</span>
          <a routerLink="/catalogue">Catalogue</a>
          <span class="separator">/</span>
          <span class="current">{{ product.nom }}</span>
        </nav>

        <div class="product-main">
          <!-- Image Gallery -->
          <div class="product-gallery">
            <div class="main-image-container">
              <div class="badge-overlay" *ngIf="product.nouveau">Nouveau</div>
              <img [src]="selectedImage || product.imagePrincipale" [alt]="product.nom" class="main-image">
            </div>
            <div class="thumbnail-list" *ngIf="product.images && product.images.length > 0">
              <div 
                *ngFor="let img of product.images" 
                class="thumbnail" 
                [class.active]="img === selectedImage"
                (click)="selectedImage = img"
              >
                <img [src]="img" [alt]="product.nom">
              </div>
            </div>
          </div>

          <!-- Product Info -->
          <div class="product-info-panel">
            <div class="header-info">
              <span class="category" *ngIf="product.categorie">{{ product.categorie }}</span>
              <h1 class="product-title">{{ product.nom }}</h1>
              <div class="price-container">
                <span class="current-price" *ngIf="product.enPromotion">{{ product.prixPromo }} MAD</span>
                <span class="old-price" [class.promo]="product.enPromotion">{{ product.prix }} MAD</span>
                <span class="discount-pill" *ngIf="product.enPromotion">
                  -{{ calculateDiscount() }}%
                </span>
              </div>
            </div>

            <div class="description-box">
              <h3>Description</h3>
              <p>{{ product.description }}</p>
            </div>

            <div class="options-section" *ngIf="product.tailles && product.tailles.length > 0">
              <h3>Choisir une taille</h3>
              <div class="option-chips">
                <button 
                  *ngFor="let t of product.tailles" 
                  class="chip" 
                  [class.selected]="selectedSize === t"
                  (click)="selectedSize = t"
                >
                  {{ t }}
                </button>
              </div>
            </div>

            <div class="quantity-section">
              <h3>Quantité</h3>
              <div class="qty-control">
                <button (click)="updateQty(-1)" [disabled]="quantity <= 1">-</button>
                <span>{{ quantity }}</span>
                <button (click)="updateQty(1)" [disabled]="quantity >= product.stock">+</button>
              </div>
              <span class="stock-status" [class.low]="product.stock < 5">
                {{ product.stock > 0 ? (product.stock < 5 ? 'Plus que ' + product.stock + ' en stock !' : 'En stock') : 'Rupture de stock' }}
              </span>
            </div>

            <div class="action-buttons">
              <button class="btn-cart" (click)="addToCart()" [disabled]="product.stock <= 0">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4H6z" stroke-width="2"/>
                  <path d="M3 6h18M16 10a4 4 0 01-8 0" stroke-width="2"/>
                </svg>
                Ajouter au panier
              </button>
              <button class="btn-wishlist" (click)="toggleWishlist()" [class.active]="isInWishlist()">
                <svg width="22" height="22" viewBox="0 0 24 24" [attr.fill]="isInWishlist() ? '#C0392B' : 'none'" [attr.stroke]="isInWishlist() ? '#C0392B' : 'currentColor'">
                  <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l8.72-8.72 1.06-1.06a5.5 5.5 0 000-7.78z" stroke-width="2"/>
                </svg>
              </button>
            </div>

            <div class="trust-badges">
              <div class="badge">
                <span class="icon">📦</span>
                <span>Livraison Gratuite (dès 500 DH)</span>
              </div>
              <div class="badge">
                <span class="icon">🛡️</span>
                <span>Paiement 100% Sécurisé</span>
              </div>
              <div class="badge">
                <span class="icon">✨</span>
                <span>Produit Artisanal Authentique</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="loading-state" *ngIf="!product && !error">
      <div class="loader"></div>
      <p>Chargement de vos trésors...</p>
    </div>

    <div class="error-state" *ngIf="error">
      <span class="error-icon">😕</span>
      <h2>Oops ! Produit introuvable</h2>
      <p>{{ error }}</p>
      <button routerLink="/catalogue" class="btn-primary">Retour au catalogue</button>
    </div>

    <app-footer></app-footer>
  `,
  styles: [`
    @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800&family=Poppins:wght@300;400;500;600;700&display=swap');

    .product-details-page {
      font-family: 'Poppins', sans-serif;
      background: #fdfdfd;
      padding-bottom: 80px;
    }

    .container-content {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 20px;
    }

    /* Breadcrumbs */
    .breadcrumb {
      padding: 30px 0;
      display: flex;
      align-items: center;
      gap: 10px;
      font-size: 0.9rem;
      color: #94a3b8;
    }

    .breadcrumb a { color: #1A4C8B; font-weight: 500; }
    .breadcrumb .separator { color: #cbd5e0; }
    .breadcrumb .current { color: #64748b; }

    /* Layout */
    .product-main {
      display: grid;
      grid-template-columns: 1fr 500px;
      gap: 60px;
    }

    /* Gallery */
    .product-gallery {
      position: sticky;
      top: 100px;
      height: fit-content;
    }

    .main-image-container {
      position: relative;
      border-radius: 30px;
      overflow: hidden;
      background: #f8f9fa;
      aspect-ratio: 1;
      box-shadow: 0 20px 40px rgba(0,0,0,0.05);
    }

    .main-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.6s ease;
    }

    .main-image:hover { transform: scale(1.05); }

    .badge-overlay {
      position: absolute;
      top: 25px;
      left: 25px;
      background: #27AE60;
      color: white;
      padding: 8px 18px;
      border-radius: 50px;
      font-weight: 700;
      font-size: 0.8rem;
      z-index: 2;
    }

    .thumbnail-list {
      display: flex;
      gap: 15px;
      margin-top: 20px;
      overflow-x: auto;
      padding-bottom: 5px;
    }

    .thumbnail {
      width: 80px;
      height: 80px;
      border-radius: 12px;
      overflow: hidden;
      cursor: pointer;
      border: 2px solid transparent;
      transition: all 0.3s ease;
    }

    .thumbnail.active { border-color: #1A4C8B; }
    .thumbnail img { width: 100%; height: 100%; object-fit: cover; }

    /* Info Panel */
    .product-info-panel {
      padding: 20px 0;
    }

    .category {
      font-family: 'Cairo', sans-serif;
      text-transform: uppercase;
      letter-spacing: 2px;
      color: #D4A650;
      font-weight: 700;
      font-size: 0.9rem;
      display: block;
      margin-bottom: 10px;
    }

    .product-title {
      font-family: 'Cairo', sans-serif;
      font-size: 3rem;
      font-weight: 800;
      color: #1e293b;
      line-height: 1.1;
      margin-bottom: 25px;
    }

    .price-container {
      display: flex;
      align-items: center;
      gap: 15px;
      margin-bottom: 35px;
    }

    .current-price {
      font-size: 2.2rem;
      font-weight: 800;
      color: #1A4C8B;
    }

    .old-price {
      font-size: 1.5rem;
      color: #cbd5e0;
      font-weight: 500;
    }

    .old-price.promo {
      text-decoration: line-through;
    }

    .discount-pill {
      background: #C0392B;
      color: white;
      padding: 4px 12px;
      border-radius: 5px;
      font-weight: 700;
      font-size: 0.9rem;
    }

    .description-box h3, .options-section h3, .quantity-section h3 {
      font-family: 'Cairo', sans-serif;
      font-size: 1.1rem;
      font-weight: 700;
      color: #1e293b;
      margin-bottom: 15px;
    }

    .description-box p {
      line-height: 1.8;
      color: #64748b;
      margin-bottom: 40px;
    }

    .option-chips {
      display: flex;
      gap: 12px;
      margin-bottom: 40px;
    }

    .chip {
      padding: 10px 25px;
      border: 2px solid #e2e8f0;
      border-radius: 12px;
      background: white;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .chip.selected {
      border-color: #1A4C8B;
      background: #1A4C8B;
      color: white;
    }

    .qty-control {
      display: inline-flex;
      align-items: center;
      background: #f1f5f9;
      border-radius: 15px;
      padding: 5px;
      gap: 20px;
    }

    .qty-control button {
      width: 40px;
      height: 40px;
      border: none;
      background: white;
      border-radius: 12px;
      font-size: 1.2rem;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .qty-control button:hover:not(:disabled) { background: #1A4C8B; color: white; }
    .qty-control span { font-weight: 700; font-size: 1.1rem; min-width: 30px; text-align: center; }

    .stock-status {
      margin-left: 20px;
      font-size: 0.9rem;
      font-weight: 600;
      color: #27AE60;
    }

    .stock-status.low { color: #C0392B; }

    .action-buttons {
      display: flex;
      gap: 15px;
      margin-top: 50px;
    }

    .btn-cart {
      flex: 1;
      height: 65px;
      background: #D4A650;
      color: white;
      border: none;
      border-radius: 18px;
      font-family: 'Cairo', sans-serif;
      font-weight: 700;
      font-size: 1.1rem;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 12px;
      cursor: pointer;
      transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      box-shadow: 0 10px 25px rgba(212, 166, 80, 0.3);
    }

    .btn-cart:hover:not(:disabled) {
      background: #E5B761;
      transform: translateY(-5px);
      box-shadow: 0 15px 35px rgba(212, 166, 80, 0.5);
    }

    .btn-wishlist {
      width: 65px;
      height: 65px;
      background: #f1f5f9;
      border: none;
      border-radius: 18px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .btn-wishlist:hover { background: #e2e8f0; transform: scale(1.05); }
    .btn-wishlist.active { background: white; box-shadow: 0 5px 15px rgba(192, 57, 43, 0.15); }

    .trust-badges {
      margin-top: 60px;
      display: grid;
      gap: 20px;
      padding-top: 40px;
      border-top: 1px solid #e2e8f0;
    }

    .trust-badges .badge {
      display: flex;
      align-items: center;
      gap: 15px;
      color: #64748b;
      font-size: 0.9rem;
      font-weight: 500;
    }

    .trust-badges .icon { font-size: 1.4rem; }

    /* states */
    .loading-state, .error-state {
      min-height: 60vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      padding: 40px;
    }

    .loader {
      width: 50px;
      height: 50px;
      border: 5px solid #f3f3f3;
      border-top: 5px solid #1A4C8B;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin-bottom: 20px;
    }

    @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }

    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    .animate-fade-in { animation: fadeIn 1s ease-out; }

    @media (max-width: 1024px) {
      .product-main { grid-template-columns: 1fr; }
      .product-gallery { position: static; }
      .product-title { font-size: 2.2rem; }
    }
  `]
})
export class ProductDetailsComponent implements OnInit {
  product: Product | null = null;
  selectedImage: string = '';
  selectedSize: string = '';
  quantity: number = 1;
  isLoading = true;
  error = '';

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private wishlistService: WishlistService,
    private cartService: CartService,
    private notificationService: NotificationService
  ) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      const id = params['id'];
      if (id) {
        this.loadProduct(id);
      }
    });
  }

  loadProduct(id: string) {
    this.isLoading = true;
    this.productService.getProductById(id).subscribe({
      next: (prod) => {
        this.product = prod;
        this.selectedImage = prod.imagePrincipale;
        if (prod.tailles && prod.tailles.length > 0) {
          this.selectedSize = prod.tailles[0];
        }
        this.isLoading = false;
      },
      error: (err) => {
        this.error = "Nous n'avons pas pu trouver ce produit. Il a peut-être été retiré de la vente.";
        this.isLoading = false;
      }
    });
  }

  updateQty(delta: number) {
    this.quantity += delta;
  }

  calculateDiscount(): number {
    if (!this.product || !this.product.prixPromo) return 0;
    const diff = this.product.prix - this.product.prixPromo;
    return Math.round((diff / this.product.prix) * 100);
  }

  toggleWishlist() {
    if (!this.product) return;
    const added = this.wishlistService.toggleWishlist(this.product);
    if (added) {
      this.notificationService.success(`${this.product.nom} ajouté aux favoris ❤️`);
    } else {
      this.notificationService.info(`${this.product.nom} retiré des favoris`);
    }
  }

  addToCart() {
    if (!this.product) return;
    this.cartService.addToCart(this.product, this.quantity, this.selectedSize);
    this.notificationService.success(`${this.product.nom} ajouté au panier 🛒`);
  }

  isInWishlist(): boolean {
    return this.product ? this.wishlistService.isInWishlist(this.product.id) : false;
  }
}
