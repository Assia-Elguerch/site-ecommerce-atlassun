import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { FooterComponent } from '../../shared/components/footer/footer.component';
import { ProductCardComponent } from '../../shared/components/product-card/product-card.component';
import { Product } from '../../core/models';
import { ProductService } from '../../core/services/product.service';

@Component({
  selector: 'app-promotions',
  standalone: true,
  imports: [CommonModule, RouterLink, HeaderComponent, FooterComponent, ProductCardComponent],
  template: `
    <app-header></app-header>
    
    <div class="page-container">
      <div class="hero-banner">
      </div>

      <div class="container">
        <!-- Loading State -->
        <div class="loading" *ngIf="isLoading">
            <p>Chargement des promotions...</p>
        </div>

        <!-- Products Grid -->
        <div class="products-grid" *ngIf="!isLoading">
          <app-product-card 
            *ngFor="let item of promoItems" 
            [product]="item"
          ></app-product-card>
        </div>

        <!-- Empty State -->
        <div class="empty-state" *ngIf="!isLoading && promoItems.length === 0">
            <p>Aucune promotion disponible pour le moment.</p>
        </div>
      </div>
    </div>

    <app-footer></app-footer>
  `,
  styles: [`
    .page-container {
      background: #FAF7F0;
      min-height: calc(100vh - 200px);
      padding-bottom: 80px;
    }

    .container {
      max-width: 1280px;
      margin: 0 auto;
      padding: 0 20px;
    }

    .hero-banner {
      background-image: linear-gradient(rgba(0,0,0,0.2), rgba(0,0,0,0.2)), url("/assets/images/banner/banner_promotion_page.png");
      background-repeat: no-repeat;
      background-position: center center;
      background-size: cover;
      height: 40vh;
      min-height: 300px;
      margin-bottom: 50px;
      animation: kenBurns 20s infinite alternate ease-in-out;
      overflow: hidden;
    }

    @keyframes kenBurns {
      from { transform: scale(1); }
      to { transform: scale(1.1); }
    }

    .loading, .empty-state {
        text-align: center;
        padding: 40px;
        font-family: 'Cairo', sans-serif;
        font-size: 1.2rem;
        color: #1A4C8B;
    }

    /* products grid standard */
    .products-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 30px;
    }
  `]
})
export class PromotionsComponent implements OnInit {
  private productService = inject(ProductService);
  promoItems: Product[] = [];
  isLoading = true;

  ngOnInit() {
    this.loadPromotions();
  }

  loadPromotions() {
    this.isLoading = true;
    this.productService.getPromoProducts(12).subscribe({
      next: (products) => {
        this.promoItems = products;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading promotions:', err);
        this.isLoading = false;
      }
    });
  }
}
