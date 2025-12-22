import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { FooterComponent } from '../../shared/components/footer/footer.component';
import { ProductCardComponent } from '../../shared/components/product-card/product-card.component';
import { Product } from '../../core/models';
import { ProductService } from '../../core/services/product.service';

interface CategoryFilter {
  name: string;
  slug: string;
  selected: boolean;
  count: number;
}

@Component({
  selector: 'app-catalogue',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, HeaderComponent, FooterComponent, ProductCardComponent],
  template: `
    <app-header></app-header>
    
    <div class="catalogue-page">
      <div class="container">
        <!-- Breadcrumb -->
        <div class="breadcrumb">
          <a routerLink="/home">Accueil</a>
          <span>›</span>
          <span>Catalogue</span>
        </div>

        <!-- Page Header -->
        <div class="page-header">
          <div>
            <h1>Notre Catalogue</h1>
            <p>{{ filteredProducts.length }} produits disponibles</p>
          </div>
        </div>

        <div class="catalogue-content">
          <!-- Sidebar Filters -->
          <aside class="filters-sidebar">
            <div class="filter-section">
              <h3>Catégories</h3>
              <div class="filter-options">
                <label class="checkbox-label" *ngFor="let cat of categories">
                  <input type="checkbox" [(ngModel)]="cat.selected" (change)="applyFilters()">
                  <span>{{ cat.name }}</span>
                  <span class="count">({{ cat.count }})</span>
                </label>
              </div>
            </div>

            <div class="filter-section">
              <h3>Prix</h3>
              <div class="price-range">
                <input type="number" [(ngModel)]="priceMin" (change)="applyFilters()" placeholder="Min">
                <span>-</span>
                <input type="number" [(ngModel)]="priceMax" (change)="applyFilters()" placeholder="Max">
              </div>
              <div class="price-presets">
                <button class="preset-btn" (click)="setPriceRange(0, 500)">< 500 DH</button>
                <button class="preset-btn" (click)="setPriceRange(500, 1000)">500-1000 DH</button>
                <button class="preset-btn" (click)="setPriceRange(1000, null)">> 1000 DH</button>
              </div>
            </div>

            <div class="filter-section">
              <h3>Disponibilité</h3>
              <div class="filter-options">
                <label class="checkbox-label">
                  <input type="checkbox" [(ngModel)]="filters.inStock" (change)="applyFilters()">
                  <span>En stock uniquement</span>
                </label>
                <label class="checkbox-label">
                  <input type="checkbox" [(ngModel)]="filters.onSale" (change)="applyFilters()">
                  <span>En promotion</span>
                </label>
                <label class="checkbox-label">
                  <input type="checkbox" [(ngModel)]="filters.newProducts" (change)="applyFilters()">
                  <span>Nouveautés</span>
                </label>
              </div>
            </div>

            <button class="btn-reset" (click)="resetFilters()">
              Réinit ialiser les filtres
            </button>
          </aside>

          <!-- Products Grid -->
          <div class="products-container">
            <!-- Sort Bar -->
            <div class="sort-bar">
              <div class="active-filters" *ngIf="hasActiveFilters()">
                <span class="filter-tag" *ngFor="let cat of getActiveCategories()">
                  {{ cat.name }}
                  <button (click)="cat.selected = false; applyFilters()">×</button>
                </span>
                <button class="clear-all" (click)="resetFilters()">Tout effacer</button>
              </div>

              <select class="sort-select" [(ngModel)]="sortBy" (change)="applySort()">
                <option value="">Trier par...</option>
                <option value="name-asc">Nom (A-Z)</option>
                <option value="name-desc">Nom (Z-A)</option>
                <option value="price-asc">Prix croissant</option>
                <option value="price-desc">Prix décroissant</option>
                <option value="newest">Nouveautés</option>
              </select>
            </div>

            <!-- Products Grid/List -->
            <div class="products-grid" *ngIf="filteredProducts.length > 0">
              <app-product-card 
                *ngFor="let product of paginatedProducts" 
                [product]="product"
              ></app-product-card>
            </div>

            <!-- Empty State -->
            <div class="no-products" *ngIf="filteredProducts.length === 0">
              <div class="no-results-box">
                <div class="premium-icon-box">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <circle cx="11" cy="11" r="8"/>
                    <path d="M21 21l-4.35-4.35"/>
                  </svg>
                </div>
                <h2>Aucun produit trouvé</h2>
                <p>Nous n'avons trouvé aucun résultat pour vos critères de recherche.</p>
                <button class="premium-btn" (click)="resetFilters()">Voir tous les produits</button>
              </div>
            </div>

            <!-- Pagination -->
            <div class="pagination" *ngIf="totalPages > 1">
              <button 
                class="page-btn" 
                [disabled]="currentPage === 1"
                (click)="setPage(currentPage - 1)">
                ‹ Précédent
              </button>
              
              <button 
                *ngFor="let page of getPages()"
                class="page-btn" 
                [class.active]="page === currentPage"
                (click)="setPage(page)">
                {{ page }}
              </button>

              <button 
                class="page-btn" 
                [disabled]="currentPage === totalPages"
                (click)="setPage(currentPage + 1)">
                Suivant ›
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <app-footer></app-footer>
  `,
  styles: [`
    .catalogue-page {
      background: #FAF7F0;
      padding: 40px 0 80px;
      min-height: 100vh;
    }

    .container {
      max-width: 1280px;
      margin: 0 auto;
      padding: 0 20px;
    }



    .view-controls {
      display: flex;
      gap: 10px;
    }

    .view-btn {
      width: 40px;
      height: 40px;
      background: white;
      border: 2px solid #E0E0E0;
      border-radius: 8px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s;
      color: #666;
    }

    .view-btn.active {
      background: #1A4C8B;
      border-color: #1A4C8B;
      color: white;
    }

    /* Catalogue Content */
    .catalogue-content {
      display: grid;
      grid-template-columns: 280px 1fr;
      gap: 30px;
    }

    /* Filters Sidebar */
    .filters-sidebar {
      background: white;
      padding: 35px 25px;
      border-radius: 24px;
      height: fit-content;
      position: sticky;
      top: 20px;
      box-shadow: 0 10px 40px rgba(0,0,0,0.03);
      border: 1px solid rgba(212, 166, 80, 0.08);
    }

    .filter-section {
      padding: 20px 0;
      border-bottom: 1px solid #F0F0F0;
    }

    .filter-section:first-child {
      padding-top: 0;
    }

    .filter-section:last-of-type {
      border-bottom: none;
    }

    .filter-section h3 {
      font-family: 'Cairo', sans-serif;
      font-size: 1.1rem;
      color: #2A2A2A;
      margin: 0 0 15px;
    }

    .filter-options {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .checkbox-label {
      display: flex;
      align-items: center;
      gap: 10px;
      cursor: pointer;
      font-size: 0.95rem;
      color: #666;
    }

    .checkbox-label input[type="checkbox"] {
      width: 18px;
      height: 18px;
      cursor: pointer;
    }

    .checkbox-label .count {
      margin-left: auto;
      color: #999;
      font-size: 0.85rem;
    }

    /* Price Range */
    .price-range {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 15px;
    }

    .price-range input {
      width: 0;
      flex: 1;
      padding: 10px 12px;
      border: 2px solid #E0E0E0;
      border-radius: 8px;
      font-family: 'Poppins', sans-serif;
      font-size: 0.9rem;
      transition: border-color 0.2s;
    }

    .price-range span {
      color: #999;
      font-weight: bold;
    }

    .price-presets {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .preset-btn {
      padding: 8px 12px;
      background: #F5F5F5;
      border: none;
      border-radius: 6px;
      font-family: 'Poppins', sans-serif;
      font-size: 0.85rem;
      cursor: pointer;
      transition: background 0.2s;
    }

    .preset-btn:hover {
      background: #1A4C8B;
      color: white;
    }

    .btn-reset {
      width: 100%;
      padding: 14px;
      background: #f1f5f9;
      color: #1A4C8B;
      border: none;
      border-radius: 12px;
      font-family: 'Cairo', sans-serif;
      font-weight: 700;
      cursor: pointer;
      margin-top: 25px;
      transition: all 0.3s;
    }

    .btn-reset:hover {
      background: #1A4C8B;
      color: white;
      transform: translateY(-2px);
    }

    /* Products Container */
    .products-container {
      display: flex;
      flex-direction: column;
      gap: 25px;
    }

    /* Sort Bar */
    .sort-bar {
      background: white;
      padding: 15px 25px;
      border-radius: 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 20px;
      flex-wrap: wrap;
      box-shadow: 0 4px 20px rgba(0,0,0,0.03);
      border: 1px solid rgba(212, 166, 80, 0.08);
    }

    .active-filters {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
      align-items: center;
    }

    .filter-tag {
      padding: 6px 12px;
      background: #1A4C8B;
      color: white;
      border-radius: 20px;
      font-size: 0.85rem;
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .filter-tag button {
      background: none;
      border: none;
      color: white;
      font-size: 1.2rem;
      cursor: pointer;
      padding: 0;
      line-height: 1;
    }

    .clear-all {
      padding: 6px 14px;
      background: transparent;
      border: 1px solid #E0E0E0;
      border-radius: 20px;
      font-size: 0.85rem;
      cursor: pointer;
      color: #C0392B;
    }

    .sort-select {
      padding: 10px 16px;
      border: 2px solid #E0E0E0;
      border-radius: 8px;
      font-family: 'Poppins', sans-serif;
      cursor: pointer;
      min-width: 200px;
    }

    /* Products Grid */
    .products-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
      gap: 25px;
    }

    /* Pagination */
    .pagination {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 10px;
      margin-top: 50px;
    }

    .page-btn {
      min-width: 45px;
      height: 45px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: white;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      color: #64748b;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
    }

    .page-btn:hover:not(:disabled) {
      border-color: #1A4C8B;
      color: #1A4C8B;
      background: #f8fafc;
    }

    .page-btn.active {
      background: #1A4C8B;
      border-color: #1A4C8B;
      color: white;
      box-shadow: 0 4px 12px rgba(26, 76, 139, 0.2);
    }

    .page-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    /* No Products Found */
    .no-products {
      padding: 100px 20px;
      text-align: center;
      display: flex;
      justify-content: center;
    }

    .no-results-box {
      max-width: 400px;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 20px;
    }

    .premium-icon-box {
      width: 80px;
      height: 80px;
      background: #f1f5f9;
      color: #94a3b8;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 24px;
      margin-bottom: 10px;
    }

    .premium-btn {
      padding: 14px 30px;
      background: #1A4C8B;
      color: white;
      border: none;
      border-radius: 12px;
      font-family: 'Cairo', sans-serif;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.3s;
    }

    .premium-btn:hover {
      background: #D4A650;
      transform: translateY(-2px);
      box-shadow: 0 5px 15px rgba(212, 166, 80, 0.3);
    }

    /* Responsive */
    @media (max-width: 1024px) {
      .catalogue-content {
        grid-template-columns: 1fr;
      }

      .filters-sidebar {
        position: static;
      }
    }

    @media (max-width: 768px) {
      .products-grid,
      .products-grid.list-view {
        grid-template-columns: 1fr;
      }

      .list-view .product-card {
        grid-template-columns: 1fr;
      }

      .page-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 20px;
      }

      .sort-bar {
        flex-direction: column;
        align-items: stretch;
      }

      .sort-select {
        width: 100%;
      }
    }
  `]
})
export class CatalogueComponent implements OnInit {
  viewMode: 'grid' | 'list' = 'grid';
  sortBy = '';
  priceMin: number | null = null;
  priceMax: number | null = null;
  searchQuery = '';

  // Pagination
  currentPage = 1;
  pageSize = 6; // Reduced for demo visibility of pagination
  totalPages = 1;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService
  ) { }

  private categorySlugMap: { [key: string]: string } = {
    'vetements': 'Caftans & Jellabas',
    'chaussures': 'Chaussures Traditionnelles',
    'bijoux': 'Bijoux Artisanaux'
  };

  filters = {
    inStock: false,
    onSale: false,
    newProducts: false
  };

  categories: CategoryFilter[] = [
    { name: 'Caftans & Jellabas', slug: 'vetements', selected: false, count: 0 },
    { name: 'Chaussures Traditionnelles', slug: 'chaussures', selected: false, count: 0 },
    { name: 'Bijoux Artisanaux', slug: 'bijoux', selected: false, count: 0 }
  ];

  allProducts: Product[] = [];
  filteredProducts: Product[] = [];

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      // Handle Search
      this.searchQuery = params['search'] || '';

      // Handle Category from URL
      const catSlug = params['category'];
      if (catSlug && this.categorySlugMap[catSlug]) {
        const targetName = this.categorySlugMap[catSlug];
        this.categories.forEach(c => {
          c.selected = (c.name === targetName);
        });
      }

      this.updateCategoryCounts();
      this.applyFilters();
    });
  }

  updateCategoryCounts() {
    this.categories.forEach(cat => {
      this.productService.getProducts({ categorie: cat.slug }, { page: 0, size: 1 }).subscribe({
        next: (res) => {
          cat.count = res.totalElements;
        },
        error: (err) => console.error(`Error fetching count for ${cat.slug}:`, err)
      });
    });
  }

  applyFilters() {
    this.currentPage = 1;
    this.fetchProducts();
  }

  fetchProducts() {
    const filters: any = {};

    // Search
    if (this.searchQuery) {
      filters.search = this.searchQuery;
    }

    // Categories
    const selectedCategories = this.categories.filter(c => c.selected).map(c => c.name);
    // Reverse map filtering if needed, but for now simple keyword match or we can rely on backend text search
    // Better: backend expects specific category slugs or names. 
    // Let's use the slugs we know: 'vetements', 'chaussures', 'bijoux'
    // But the UI filter uses Display Names.

    // Quick fix: Map UI names back to backend values or modify backend.
    // Backend Product model uses: 'vetements', 'bijoux', 'chaussures'.

    if (selectedCategories.length > 0) {
      // Map display names to backend slugs if needed, but now we have slugs in the objects
      const selectedSlugs = this.categories
        .filter(c => c.selected)
        .map(c => c.slug);

      if (selectedSlugs.length > 0) {
        filters.categorie = selectedSlugs[0]; // Backend currently supports one category filter
      }
    }

    // Price
    if (this.priceMin) filters.prixMin = this.priceMin;
    if (this.priceMax) filters.prixMax = this.priceMax;

    // Flags
    if (this.filters.onSale) filters.enPromotion = true;
    if (this.filters.newProducts) filters.nouveaute = true;
    if (this.filters.inStock) filters.enStock = true;

    // Sort
    const pageRequest: any = {
      page: this.currentPage - 1, // API is 0-indexed
      size: this.pageSize
    };

    if (this.sortBy) {
      if (this.sortBy === 'name-asc') pageRequest.sort = { field: 'nom', direction: 'asc' };
      if (this.sortBy === 'name-desc') pageRequest.sort = { field: 'nom', direction: 'desc' };
      if (this.sortBy === 'price-asc') pageRequest.sort = { field: 'prix', direction: 'asc' };
      if (this.sortBy === 'price-desc') pageRequest.sort = { field: 'prix', direction: 'desc' };
      if (this.sortBy === 'newest') pageRequest.sort = { field: 'createdAt', direction: 'desc' };
    }

    this.productService.getProducts(filters, pageRequest).subscribe({
      next: (res) => {
        this.filteredProducts = res.content;
        this.totalPages = res.totalPages;
        // Scroll top handled by setPage
      },
      error: (err) => console.error('Error fetching products:', err)
    });
  }

  get paginatedProducts(): Product[] {
    return this.filteredProducts;
  }

  getPages(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  setPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.fetchProducts();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  applySort() {
    this.fetchProducts();
  }

  setPriceRange(min: number | null, max: number | null) {
    this.priceMin = min;
    this.priceMax = max;
    this.applyFilters();
  }

  resetFilters() {
    this.categories.forEach(c => c.selected = false);
    this.priceMin = null;
    this.priceMax = null;
    this.filters = {
      inStock: false,
      onSale: false,
      newProducts: false
    };
    this.sortBy = '';
    this.searchQuery = '';
    this.currentPage = 1;
    this.fetchProducts();
  }

  hasActiveFilters(): boolean {
    return this.categories.some(c => c.selected) ||
      this.filters.inStock ||
      this.filters.onSale ||
      this.filters.newProducts;
  }

  getActiveCategories() {
    return this.categories.filter(c => c.selected);
  }
}
