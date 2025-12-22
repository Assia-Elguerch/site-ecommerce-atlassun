import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { WishlistService } from '../../../core/services/wishlist.service';
import { CartService } from '../../../core/services/cart.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, FormsModule],
  template: `
    <header class="header">
      <!-- Top Bar -->
      <div class="top-bar">
        <div class="container">
          <div class="top-bar-content">
            <div class="contact-info">
              <span class="info-item">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l2.27-2.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"/>
                </svg>
                +212 524 00 00 00
              </span>
              <span class="info-item">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
                contact@atlassun.ma
              </span>
            </div>
            <div class="top-bar-actions">
              <a routerLink="/order-tracking" class="top-link">Suivre ma commande</a>
              <a routerLink="/help" class="top-link">Aide</a>
              <select class="lang-select">
                <option>🇫🇷 FR</option>
                <option>🇬🇧 EN</option>
                <option>🇲🇦 AR</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <!-- Main Header -->
      <div class="main-header">
        <div class="container">
          <div class="header-content">
            <!-- Logo -->
            <a routerLink="/home" class="logo">
              <img src="assets/logo.png" alt="AtlasSun" class="logo-img">
              <div class="logo-text">
                <span class="brand">AtlasSun</span>
                <span class="tagline">Artisanat Marocain</span>
              </div>
            </a>

            <!-- Search Bar -->
            <div class="search-bar">
              <input 
                type="text" 
                placeholder="Rechercher un produit..."
                [(ngModel)]="searchQuery"
                (keyup.enter)="onSearch()">
              <button class="btn-search" (click)="onSearch()">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <circle cx="11" cy="11" r="8"/>
                  <path d="m21 21-4.35-4.35"/>
                </svg>
              </button>
            </div>

            <!-- Actions -->
            <div class="header-actions">
              <button class="action-btn" title="Favoris" routerLink="/wishlist">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                </svg>
                <span class="badge" *ngIf="wishlistCount > 0">{{ wishlistCount }}</span>
              </button>

              <button class="action-btn" routerLink="/panier" title="Panier">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <circle cx="9" cy="21" r="1"/>
                  <circle cx="20" cy="21" r="1"/>
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
                </svg>
                <span class="badge cart-badge" *ngIf="cartCount > 0">{{ cartCount }}</span>
              </button>

              <!-- Profile / Login -->
              <ng-container *ngIf="authService.currentUser$ | async as user; else loginBtn">
                <button class="action-btn avatar-btn" routerLink="/profil" [title]="user.prenom">
                  <img *ngIf="user.avatar" [src]="user.avatar" class="user-avatar" [alt]="user.prenom">
                  <span *ngIf="!user.avatar" class="user-initials">{{ getInitials(user) }}</span>
                </button>
              </ng-container>

              <ng-template #loginBtn>
                <button class="action-btn" routerLink="/auth/login" title="Connexion">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                     <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/>
                     <polyline points="10 17 15 12 10 7"/>
                     <line x1="15" y1="12" x2="3" y2="12"/>
                  </svg>
                </button>
              </ng-template>

              <button class="action-btn logout-btn" *ngIf="authService.isAuthenticated()" (click)="logout()" title="Déconnexion">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                  <polyline points="16 17 21 12 16 7"/>
                  <line x1="21" y1="12" x2="9" y2="12"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Navigation -->
      <nav class="nav-bar">
        <div class="container">
          <ul class="nav-menu">
            <li><a routerLink="/home" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">Accueil</a></li>
            <li class="dropdown">
              <a routerLink="/catalogue" routerLinkActive="active">
                Catalogue
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <polyline points="6 9 12 15 18 9"/>
                </svg>
              </a>
              <div class="dropdown-menu">
                <a routerLink="/catalogue" [queryParams]="{category: 'caftans'}">Caftans & Jellabas</a>
                <a routerLink="/catalogue" [queryParams]="{category: 'chaussures'}">Chaussures</a>
                <a routerLink="/catalogue" [queryParams]="{category: 'bijoux'}">Bijoux</a>
              </div>
            </li>
            <li><a routerLink="/nouveautes">Nouveautés</a></li>
            <li><a routerLink="/promotions">Promotions</a></li>
            <li *ngIf="isAdmin"><a routerLink="/admin/dashboard" class="admin-link">Admin Dashboard</a></li>
            <li><a routerLink="/about">À Propos</a></li>
            <li><a routerLink="/contact">Contact</a></li>
          </ul>
        </div>
      </nav>
    </header>
  `,
  styles: [`
    .header {
      position: sticky;
      top: 0;
      z-index: 1000;
      background: white;
      box-shadow: 0 2px 10px rgba(0,0,0,0.05);
    }

    /* Top Bar */
    .top-bar {
      background: #1A4C8B;
      color: white;
      font-size: 0.85rem;
      padding: 8px 0;
    }

    .top-bar-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .contact-info {
      display: flex;
      gap: 25px;
    }

    .info-item {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .top-bar-actions {
      display: flex;
      align-items: center;
      gap: 20px;
    }

    .top-link {
      color: white;
      text-decoration: none;
      transition: opacity 0.2s;
    }

    .top-link:hover {
      opacity: 0.8;
    }

    .lang-select {
      background: rgba(255,255,255,0.1);
      border: 1px solid rgba(255,255,255,0.2);
      color: white;
      padding: 4px 8px;
      border-radius: 4px;
      cursor: pointer;
    }

    /* Main Header */
    .main-header {
      padding: 20px 0;
    }

    .header-content {
      display: flex;
      align-items: center;
      gap: 40px;
    }

    /* Logo */
    .logo {
      display: flex;
      align-items: center;
      gap: 12px;
      text-decoration: none;
      flex-shrink: 0;
    }

    .logo-img {
      width: 55px;
      height: 55px;
      border-radius: 50%;
      object-fit: cover;
      border: 3px solid #1A4C8B;
      background: white;
      box-shadow: 0 4px 10px rgba(0,0,0,0.1);
      transition: all 0.3s ease;
    }

    .logo:hover .logo-img {
      transform: scale(1.05) rotate(5deg);
      border-color: #D4A650;
      box-shadow: 0 6px 15px rgba(0,0,0,0.15);
    }

    .logo-text {
      display: flex;
      flex-direction: column;
    }

    .brand {
      font-family: 'Cairo', sans-serif;
      font-size: 1.5rem;
      font-weight: 700;
      color: #1A4C8B;
      line-height: 1;
    }

    .tagline {
      font-family: 'Poppins', sans-serif;
      font-size: 0.7rem;
      color: #D4A650;
    }

    /* Search Bar */
    .search-bar {
      flex: 1;
      max-width: 600px;
      position: relative;
    }

    .search-bar input {
      width: 100%;
      padding: 14px 50px 14px 20px;
      border: 2px solid #E0E0E0;
      border-radius: 50px;
      font-family: 'Poppins', sans-serif;
      font-size: 0.95rem;
      transition: all 0.3s ease;
    }

    .search-bar input:focus {
      outline: none;
      border-color: #1A4C8B;
      box-shadow: 0 0 0 4px rgba(26, 76, 139, 0.1);
    }

    .btn-search {
      position: absolute;
      right: 5px;
      top: 50%;
      transform: translateY(-50%);
      width: 40px;
      height: 40px;
      background: #1A4C8B;
      border: none;
      border-radius: 50%;
      color: white;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background 0.2s;
    }

    .btn-search:hover {
      background: #C0392B;
    }

    /* Header Actions */
    .header-actions {
      display: flex;
      gap: 15px;
    }

    .action-btn {
      position: relative;
      width: 45px;
      height: 45px;
      background: #F5F5F5;
      border: none;
      border-radius: 50%;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s ease;
      color: #2A2A2A;
    }

    .action-btn:hover {
      background: #1A4C8B;
      color: white;
      transform: scale(1.1);
    }

    .badge {
      position: absolute;
      top: -5px;
      right: -5px;
      background: #C0392B;
      color: white;
      font-size: 0.7rem;
      font-weight: 600;
      padding: 2px 6px;
      border-radius: 10px;
      min-width: 20px;
      text-align: center;
    }

    .cart-badge {
      background: #D4A650;
    }

    .avatar-btn {
      padding: 0;
      overflow: hidden;
      background: #F0F4F8;
      border: 1.5px solid #1A4C8B;
    }

    .user-avatar {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .user-initials {
      font-family: 'Cairo', sans-serif;
      font-weight: 700;
      color: #1A4C8B;
      font-size: 0.9rem;
    }

    /* Navigation */
    .nav-bar {
      background: #FAF7F0;
      border-top: 1px solid #E0E0E0;
    }

    .nav-menu {
      display: flex;
      list-style: none;
      margin: 0;
      padding: 0;
      gap: 5px;
      align-items: center; /* Ensure alignment */
    }

    .nav-menu li {
      position: relative;
    }

    .nav-menu a {
      display: flex;
      align-items: center;
      gap: 5px;
      padding: 15px 20px;
      color: #2A2A2A;
      text-decoration: none;
      font-family: 'Cairo', sans-serif;
      font-weight: 500;
      transition: all 0.2s;
    }

    .nav-menu a:hover,
    .nav-menu a.active {
      color: #1A4C8B;
      background: rgba(26, 76, 139, 0.05);
    }

    /* Dropdown */
    .dropdown:hover .dropdown-menu {
      opacity: 1;
      visibility: visible;
      transform: translateY(0);
    }

    .dropdown-menu {
      position: absolute;
      top: 100%;
      left: 0;
      background: white;
      min-width: 200px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.1);
      border-radius: 8px;
      opacity: 0;
      visibility: hidden;
      transform: translateY(-10px);
      transition: all 0.3s ease;
      overflow: hidden;
    }

    .dropdown-menu a {
      display: block;
      padding: 12px 20px;
      border-bottom: 1px solid #F0F0F0;
    }

    .dropdown-menu a:last-child {
      border-bottom: none;
    }

    /* Container */
    .container {
      max-width: 1280px;
      margin: 0 auto;
      padding: 0 20px;
    }

    /* Responsive */
    @media (max-width: 1024px) {
      .search-bar {
        max-width: 400px;
      }
    }

    @media (max-width: 768px) {
      .top-bar {
        display: none;
      }

      .header-content {
        gap: 15px;
      }

      .search-bar {
        display: none;
      }

      .nav-menu {
        overflow-x: auto;
        gap: 0;
      }

      .nav-menu a {
        padding: 12px 15px;
        font-size: 0.9rem;
        white-space: nowrap;
      }
    }
  `]
})
export class HeaderComponent {
  searchQuery = '';
  cartCount = 0;
  wishlistCount = 0;

  constructor(
    public authService: AuthService,
    private wishlistService: WishlistService,
    private cartService: CartService,
    private router: Router
  ) {
    this.wishlistService.wishlist$.subscribe(products => {
      this.wishlistCount = products.length;
    });

    this.cartService.cart$.subscribe(cart => {
      this.cartCount = cart.items.reduce((count, item) => count + item.quantite, 0);
    });
  }

  get isAdmin(): boolean {
    return this.authService.isAdmin();
  }

  getInitials(user: any): string {
    if (!user) return '?';
    return (user.prenom?.charAt(0) || '') + (user.nom?.charAt(0) || '');
  }

  onSearch() {
    if (this.searchQuery.trim()) {
      this.router.navigate(['/catalogue'], { queryParams: { search: this.searchQuery } });
    }
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }
}
