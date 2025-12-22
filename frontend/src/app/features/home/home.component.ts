import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { FooterComponent } from '../../shared/components/footer/footer.component';
import { ProductCardComponent } from '../../shared/components/product-card/product-card.component';
import { Product } from '../../core/models';
import { ProductService } from '../../core/services/product.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, HeaderComponent, FooterComponent, ProductCardComponent],
  template: `
    <app-header></app-header>
    <div class="home-page">
      <!-- Hero Section -->
      <section class="hero">
        <div class="hero-overlay"></div>
        <div class="hero-content">
          <button class="btn-hero animate-button-entrance" routerLink="/catalogue">
            Explorer la Collection
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M5 12h14M12 5l7 7-7 7" stroke-width="2"/>
            </svg>
          </button>
        </div>
      </section>

      <!-- Categories Section -->
      <section class="categories-section">
        <div class="container">
          <h2 class="section-title">Nos Catégories</h2>
          <p class="section-subtitle">Explorez notre sélection premium</p>
          
            <div class="categories-grid">
              <div *ngFor="let category of categories; let i = index" 
                   class="category-card animate-on-scroll"
                   [style.animation-delay]="(i * 0.15) + 's'"
                   [routerLink]="['/catalogue']" 
                   [queryParams]="{category: category.slug}">
                <div class="category-image">
                  <img [src]="category.image" [alt]="category.name" />
                </div>
                <div class="category-info">
                  <h3>{{ category.name }}</h3>
                  <p>{{ category.count }} produits</p>
                </div>
              </div>
            </div>
        </div>
      </section>

      <!-- Featured Products -->
      <section class="products-section">
        <div class="container">
          <h2 class="section-title">Produits Vedettes</h2>
          <p class="section-subtitle">Nos coups de cœur spécialement sélectionnés</p>
          
          <div class="products-grid">
            <app-product-card 
              *ngFor="let product of featuredProducts; let i = index" 
              [product]="product"
              class="animate-product"
              [style.animation-delay]="(i * 0.12) + 's'"
            ></app-product-card>
          </div>
        </div>
      </section>

      <!-- Why Choose Us -->
      <section class="features-section">
        <div class="container">
          <div class="features-grid">
            <div class="feature-card" *ngFor="let feature of features; let i = index"
                 [style.animation-delay]="(i * 0.15) + 's'">
              <div class="feature-icon-box">
                <span [innerHTML]="feature.safeIcon"></span>
              </div>
              <h3>{{ feature.title }}</h3>
              <p>{{ feature.description }}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
    <app-footer></app-footer>
  `,
  styles: [`
    @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700&family=Poppins:wght@300;400;500;600&display=swap');

    /* Hero Section - Enhanced */
    .hero {
      position: relative;
      height: 70vh;
      min-height: 500px;
      background-image: url("/assets/images/banner/banner_home_page.png");
      background-repeat: no-repeat;
      background-position: center center;
      background-size: cover;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
      animation: kenBurns 25s infinite alternate ease-in-out;

      /* Particles Effect */
      &::after {
        content: '';
        position: absolute;
        inset: 0;
        background-image: 
          radial-gradient(circle, rgba(212,166,80,0.8) 1px, transparent 1px),
          radial-gradient(circle, rgba(255,255,255,0.6) 1px, transparent 1px);
        background-size: 50px 50px, 80px 80px;
        background-position: 0 0, 40px 40px;
        animation: particleFloat 30s linear infinite;
        opacity: 0.4;
        pointer-events: none;
        z-index: 1;
      }
    }

    @keyframes kenBurns {
      0% { transform: scale(1) rotate(0deg); }
      50% { transform: scale(1.08) rotate(0.5deg); }
      100% { transform: scale(1.15) rotate(-0.5deg); }
    }

    @keyframes particleFloat {
      from { background-position: 0 0, 40px 40px; }
      to { background-position: 100px 100px, 140px 140px; }
    }

    .hero-overlay {
      position: absolute;
      inset: 0;
      background: rgba(0, 0, 0, 0.3);
      z-index: 1;
    }

    .hero-content {
      position: relative;
      z-index: 2;
      text-align: center;
    }

    .btn-hero {
      padding: 20px 45px;
      background: #D4A650;
      color: #2A2A2A;
      border: none;
      border-radius: 50px;
      font-family: 'Cairo', sans-serif;
      font-size: 1.2rem;
      font-weight: 700;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 12px;
      transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      box-shadow: 0 10px 40px rgba(212, 166, 80, 0.4);
      position: relative;
      overflow: hidden;
    }

    .btn-hero::after {
      content: '';
      position: absolute;
      top: -50%;
      left: -50%;
      width: 200%;
      height: 200%;
      background: linear-gradient(45deg, transparent, rgba(255,255,255,0.4), transparent);
      transform: rotate(45deg);
      transition: 0.5s;
      animation: shimmer 3s infinite;
    }

    @keyframes shimmer {
      0% { left: -150%; }
      100% { left: 150%; }
    }

    .btn-hero:hover {
      transform: translateY(-5px) scale(1.05);
      background: #E5B761;
      box-shadow: 0 15px 50px rgba(212, 166, 80, 0.6);
    }

    .animate-button-entrance {
      animation: buttonEntrance 1.2s cubic-bezier(0.23, 1, 0.32, 1) both;
    }

    @keyframes buttonEntrance {
      from {
        opacity: 0;
        transform: translateY(40px) scale(0.9);
      }
      to {
        opacity: 1;
        transform: translateY(0) scale(1);
      }
    }

    /* Sections */
    .container {
      max-width: 1280px;
      margin: 0 auto;
      padding: 0 20px;
    }

    .categories-section,
    .products-section {
      padding: 80px 0;
      background: #FAF7F0;
    }

    .products-section {
      background: white;
    }

    .section-title {
      font-family: 'Cairo', sans-serif;
      font-size: 2.5rem;
      font-weight: 800;
      background: linear-gradient(135deg, #1A4C8B 0%, #2A5C9B 50%, #D4A650 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      text-align: center;
      margin: 0 0 10px;
      animation: titleGlow 3s ease-in-out infinite, fadeInUp 0.8s ease-out;
      position: relative;
      letter-spacing: -1px;

      &::after {
        content: '';
        position: absolute;
        bottom: -10px;
        left: 50%;
        transform: translateX(-50%);
        width: 80px;
        height: 4px;
        background: linear-gradient(90deg, transparent, #D4A650, transparent);
        border-radius: 2px;
        animation: lineExpand 1s ease-out 0.5s both;
      }
    }

    @keyframes titleGlow {
      0%, 100% {
        filter: drop-shadow(0 0 10px rgba(212,166,80,0.3));
      }
      50% {
        filter: drop-shadow(0 0 20px rgba(212,166,80,0.6));
      }
    }

    @keyframes lineExpand {
      from { width: 0; opacity: 0; }
      to { width: 80px; opacity: 1; }
    }

    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(30px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .section-subtitle {
      font-family: 'Poppins', sans-serif;
      font-size: 1.1rem;
      color: #666;
      text-align: center;
      margin: 0 0 60px;
      animation: fadeIn 1s ease-out 0.3s both;
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    .products-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 30px;
    }

    /* Categories Grid */
    .categories-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 30px;
      margin-top: 40px;
    }

    .category-card {
      position: relative;
      background: white;
      border-radius: 24px;
      overflow: hidden;
      box-shadow: 0 8px 30px rgba(0,0,0,0.08);
      border: 1px solid rgba(212, 166, 80, 0.1);
      transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
      cursor: pointer;
      animation: slideUp 0.6s ease-out both;
      height: 320px;
    }

    @keyframes slideUp {
      from {
        opacity: 0;
        transform: translateY(30px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .category-card:hover {
      transform: translateY(-12px) scale(1.02);
      box-shadow: 0 20px 60px rgba(26, 76, 139, 0.15);
      border-color: rgba(212, 166, 80, 0.4);
    }

    .category-image {
      position: relative;
      height: 220px;
      overflow: hidden;
    }

    .category-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
    }

    .category-card:hover .category-image img {
      transform: scale(1.15) rotate(2deg);
    }

    .category-image::after {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(to bottom, 
                  rgba(0, 0, 0, 0.1) 0%, 
                  rgba(26, 76, 139, 0.5) 40%,
                  rgba(26, 76, 139, 0.9) 100%);
      transition: all 0.4s ease;
    }

    .category-card:hover .category-image::after {
      background: linear-gradient(to bottom, 
                  rgba(0, 0, 0, 0.05) 0%, 
                  rgba(212, 166, 80, 0.6) 40%,
                  rgba(212, 166, 80, 0.95) 100%);
    }

    .category-info {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      padding: 25px;
      text-align: center;
      z-index: 2;
      transform: translateY(0);
      transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
    }

    .category-card:hover .category-info {
      transform: translateY(-5px);
    }

    .category-info h3 {
      font-family: 'Cairo', sans-serif;
      font-size: 1.5rem;
      font-weight: 800;
      color: #FFFFFF;
      margin: 0 0 8px;
      text-shadow: 0 3px 15px rgba(0,0,0,0.6),
                   0 1px 3px rgba(0,0,0,0.9);
      letter-spacing: 0.5px;
      animation: fadeInUp 0.6s ease-out 0.2s both;
    }

    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .category-card:hover .category-info h3 {
      transform: scale(1.05);
      text-shadow: 0 4px 20px rgba(0,0,0,0.7),
                   0 2px 5px rgba(0,0,0,1);
    }

    .category-info p {
      font-family: 'Poppins', sans-serif;
      color: #FFFFFF;
      font-size: 1rem;
      font-weight: 600;
      margin: 0;
      text-shadow: 0 2px 10px rgba(0,0,0,0.5),
                   0 1px 3px rgba(0,0,0,0.8);
      opacity: 0.95;
      animation: fadeInUp 0.6s ease-out 0.3s both;
    }

    .category-card:hover .category-info p {
      opacity: 1;
      transform: translateY(-2px);
    }

    /* Features Section */
    .features-section {
      padding: 80px 0;
      background: white;
    }

    .features-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 30px;
    }

    .feature-card {
      text-align: center;
      padding: 40px 30px;
      border-radius: 24px;
      background: #f8fafc;
      transition: all 0.3s ease;
      border: 1px solid rgba(0,0,0,0.03);
    }

    .feature-card:hover {
      background: white;
      box-shadow: 0 10px 40px rgba(0,0,0,0.05);
      border-color: rgba(212, 166, 80, 0.1);
      transform: translateY(-5px);
    }

    .feature-icon-box {
      width: 64px;
      height: 64px;
      background: #FDF4E3; /* Soft cream/gold background */
      color: #D4A650;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 16px;
      margin: 0 auto 20px;
      box-shadow: 0 8px 20px rgba(0,0,0,0.04);
      transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    }

    .feature-card:hover .feature-icon-box {
      background: #D4A650;
      color: white;
      transform: translateY(-5px) rotate(-3deg);
      box-shadow: 0 12px 25px rgba(212, 166, 80, 0.2);
    }

    .feature-card h3 {
      font-family: 'Cairo', sans-serif;
      font-size: 1.2rem;
      font-weight: 700;
      color: #1A4C8B;
      margin: 0 0 10px;
    }

    .feature-card p {
      font-family: 'Poppins', sans-serif;
      color: #64748b;
      font-size: 0.95rem;
      margin: 0;
      line-height: 1.5;
    }

    /* Responsive */
    @media (max-width: 768px) {
      .hero-title {
        font-size: 2.5rem;
      }

      .hero-subtitle {
        font-size: 1.1rem;
      }

      .section-title {
        font-size: 2rem;
      }

      .categories-grid,
      .products-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class HomeComponent implements OnInit {
  private sanitizer = inject(DomSanitizer);
  private productService = inject(ProductService);

  categories: any[] = [
    {
      slug: 'vetements',
      name: 'Caftans & Jellabas',
      count: 0,
      image: 'assets/images/categories/Caftans.png'
    },
    {
      slug: 'chaussures',
      name: 'Chaussures',
      count: 0,
      image: 'assets/images/categories/chaussures.png'
    },
    {
      slug: 'bijoux',
      name: 'Bijoux Artisanaux',
      count: 0,
      image: 'assets/images/categories/Bijoux.png'
    }
  ];

  featuredProducts: Product[] = [];

  features: any[] = [
    {
      icon: '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/></svg>',
      title: 'Livraison Gratuite',
      description: 'Pour toute commande supérieure à 500 DH'
    },
    {
      icon: '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>',
      title: 'Paiement Sécurisé',
      description: 'Transactions 100% sécurisées'
    },
    {
      icon: '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>',
      title: 'Authenticité Garantie',
      description: 'Produits artisanaux certifiés'
    },
    {
      icon: '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 12v10H4V12M2 7h20v5H2zM12 22V7M12 7H7.5a2.5 2.5 0 010-5C11 2 12 7 12 7zM12 7h4.5a2.5 2.5 0 000-5C13 2 12 7 12 7z"/></svg>',
      title: 'Emballage Cadeau',
      description: 'Offert sur tous les produits'
    }
  ];

  ngOnInit() {
    this.features = this.features.map(f => ({
      ...f,
      safeIcon: this.sanitizer.bypassSecurityTrustHtml(f.icon)
    }));

    this.updateCategoryCounts();
    this.loadFeaturedProducts();
  }

  loadFeaturedProducts() {
    this.productService.getProducts({}, { page: 1, size: 9 }).subscribe({
      next: (res) => {
        this.featuredProducts = res.content;
      },
      error: (err) => console.error('Error loading featured products:', err)
    });
  }

  updateCategoryCounts() {
    this.categories.forEach(cat => {
      this.productService.getProducts({ categorie: cat.slug }, { page: 1, size: 1 }).subscribe({
        next: (res) => {
          cat.count = res.totalElements;
        },
        error: (err) => console.error(`Error fetching count for ${cat.slug}:`, err)
      });
    });
  }
}
