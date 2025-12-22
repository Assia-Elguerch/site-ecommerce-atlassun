import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { DashboardService, DashboardStats } from '../../../core/services/dashboard.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="dashboard fade-in">
      <!-- Header -->
      <div class="dashboard-header slide-down">
        <div class="header-left">
          <img src="assets/images/logo/Logo ATLASSUN.png" alt="AtlasSun Logo" class="dashboard-logo logo-spin">
          <div>
            <h1 class="gradient-text">Dashboard Admin</h1>
            <p>Vue d'ensemble de votre activité</p>
          </div>
        </div>
        <div class="header-actions">
          <button class="btn-refresh hover-lift" (click)="loadStats()" [disabled]="loading">
            <svg [class.spinning]="loading" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <polyline points="23 4 23 10 17 10"/>
              <polyline points="1 20 1 14 7 14"/>
              <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
            </svg>
            {{ loading ? 'Chargement...' : 'Actualiser' }}
          </button>
        </div>
      </div>

      <!-- Stats Cards -->
      <div class="stats-grid">
        <div class="stat-card revenue hover-scale slide-up-delay-1">
          <div class="stat-icon-wrapper">
            <div class="stat-icon pulse-slow">💰</div>
          </div>
          <div class="stat-content">
            <p class="stat-label">Chiffre d'Affaires</p>
            <h2 class="stat-value count-up">{{ stats?.stats?.revenue | number:'1.2-2' }} DH</h2>
            <span class="stat-trend positive">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>
              +12% cette semaine
            </span>
          </div>
        </div>

        <div class="stat-card orders hover-scale slide-up-delay-2">
          <div class="stat-icon-wrapper">
             <div class="stat-icon pulse-slow">📦</div>
          </div>
          <div class="stat-content">
            <p class="stat-label">Commandes</p>
            <h2 class="stat-value">{{ stats?.stats?.orders || 0 }}</h2>
            <span class="stat-trend neutral">Total commandes</span>
          </div>
        </div>

        <div class="stat-card customers hover-scale slide-up-delay-3">
          <div class="stat-icon-wrapper">
            <div class="stat-icon pulse-slow">👥</div>
          </div>
          <div class="stat-content">
            <p class="stat-label">Clients</p>
            <h2 class="stat-value">{{ stats?.stats?.customers || 0 }}</h2>
            <span class="stat-trend positive">+{{ stats?.stats?.customers }} nouveaux</span>
          </div>
        </div>

        <div class="stat-card products hover-scale slide-up-delay-4">
          <div class="stat-icon-wrapper">
            <div class="stat-icon pulse-slow">📊</div>
          </div>
          <div class="stat-content">
            <p class="stat-label">Produits</p>
            <h2 class="stat-value">{{ stats?.stats?.products || 0 }}</h2>
            <span class="stat-trend neutral">Au catalogue</span>
          </div>
        </div>
      </div>

      <!-- Main Content -->
      <div class="dashboard-content">
        <!-- Charts Section -->
        <div class="chart-section slide-up-delay-2">
          <!-- Revenue Bar Chart -->
          <div class="card chart-card">
            <div class="card-header">
              <h3>Revenus (7 derniers jours)</h3>
            </div>
            <div class="chart-placeholder">
              <div class="bars" *ngIf="stats?.chartData?.length; else noData">
                <div class="bar-group" *ngFor="let day of stats?.chartData">
                   <div class="bar-wrapper">
                     <div class="bar" 
                          [style.height.%]="getBarHeight(day.total)"
                          [title]="day.total + ' DH'">
                     </div>
                   </div>
                   <span class="bar-label">{{ day._id | date:'dd/MM' }}</span>
                </div>
              </div>
              <ng-template #noData>
                <div class="no-data">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#CBD5E1" stroke-width="1"><path d="M12 20V10M18 20V4M6 20v-4"/></svg>
                  <p>En attente de données...</p>
                </div>
              </ng-template>
            </div>
          </div>

          <!-- Top Categories (Pie Chart Visual) -->
          <div class="card">
            <div class="card-header">
              <h3>Top Catégories</h3>
            </div>
            <div class="categories-list">
              <div class="category-item slide-in-right" *ngFor="let cat of stats?.topCategories; let i = index" [style.animation-delay]="i * 0.1 + 's'">
                <div class="category-info">
                  <div class="cat-name-group">
                    <span class="cat-dot" [style.background-color]="getCategoryColor(i)"></span>
                    <span class="category-name">{{ cat._id || 'Inconnu' }}</span>
                  </div>
                  <span class="category-sales">{{ cat.totalSales }} ventes</span>
                </div>
                <div class="category-progress">
                  <div class="progress-bar" 
                       [style.width.%]="(cat.totalSales / getMaxSales()) * 100"
                       [style.background-color]="getCategoryColor(i)">
                  </div>
                </div>
              </div>
              <div *ngIf="!stats?.topCategories?.length" class="no-data">Aucune donnée de catégorie</div>
            </div>
          </div>
        </div>

        <!-- Latest Orders -->
        <div class="card orders-card slide-up-delay-3">
          <div class="card-header">
            <h3>Dernières Commandes</h3>
            <a routerLink="/admin/orders" class="link-view-all">Voir tout →</a>
          </div>
          <div class="table-responsive">
            <table class="orders-table">
              <thead>
                <tr>
                  <th>N° Commande</th>
                  <th>Client</th>
                  <th>Date</th>
                  <th>Montant</th>
                  <th>Statut</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let order of stats?.latestOrders" class="fade-in-row">
                  <td><strong>{{ order.numeroCommande }}</strong></td>
                  <td>
                    <div class="user-cell">
                      <span>{{ order.utilisateur?.prenom }} {{ order.utilisateur?.nom }}</span>
                      <small>{{ order.utilisateur?.email }}</small>
                    </div>
                  </td>
                  <td>{{ order.createdAt | date:'dd/MM/yyyy HH:mm' }}</td>
                  <td><strong>{{ order.montantTotal | number:'1.2-2' }} DH</strong></td>
                  <td><span class="status-badge" [ngClass]="getStatusClass(order.statutCommande)">{{ order.statutCommande }}</span></td>
                  <td>
                    <button class="btn-icon hover-glow" title="Voir détails" [routerLink]="['/admin/orders', order._id]">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                        <circle cx="12" cy="12" r="3"/>
                      </svg>
                    </button>
                  </td>
                </tr>
                <tr *ngIf="!stats?.latestOrders?.length">
                    <td colspan="6" class="text-center">Aucune commande récente</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    /* Animations */
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    @keyframes slideDown { from { transform: translateY(-30px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
    @keyframes slideUp { from { transform: translateY(30px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
    @keyframes slideInRight { from { transform: translateX(30px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
    @keyframes spin3D { 
        0% { transform: rotateY(0deg); } 
        50% { transform: rotateY(180deg); }
        100% { transform: rotateY(360deg); } 
    }
    @keyframes pulse { 0% { transform: scale(1); } 50% { transform: scale(1.05); } 100% { transform: scale(1); } }
    @keyframes growBar { from { height: 0; } to { height: 100%; } }
    @keyframes shimmer {
      0% { background-position: -200% 0; }
      100% { background-position: 200% 0; }
    }
    @keyframes float { 0% { transform: translateY(0px); } 50% { transform: translateY(-5px); } 100% { transform: translateY(0px); } }

    .fade-in { animation: fadeIn 0.8s cubic-bezier(0.2, 0.8, 0.2, 1); }
    .slide-down { animation: slideDown 0.8s cubic-bezier(0.2, 0.8, 0.2, 1); }
    .slide-up-delay-1 { animation: slideUp 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) 0.1s both; }
    .slide-up-delay-2 { animation: slideUp 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) 0.2s both; }
    .slide-up-delay-3 { animation: slideUp 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) 0.3s both; }
    .slide-up-delay-4 { animation: slideUp 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) 0.4s both; }
    .slide-in-right { animation: slideInRight 0.6s cubic-bezier(0.2, 0.8, 0.2, 1) both; }
    
    .logo-spin { animation: spin3D 8s infinite linear; filter: drop-shadow(0 4px 6px rgba(0,0,0,0.2)); }
    .spinning { animation: spin 1s linear infinite; }
    
    .hover-scale { transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1); }
    .hover-scale:hover { transform: translateY(-8px) scale(1.02); box-shadow: 0 15px 30px rgba(0,0,0,0.1) !important; z-index: 10; }
    
    .hover-lift { transition: all 0.2s ease; }
    .hover-lift:hover { transform: translateY(-2px); filter: brightness(1.1); }

    .pulse-slow { animation: pulse 3s infinite ease-in-out; }

    .dashboard {
      padding: 40px;
      padding-bottom: 80px;
      background: #F8F9FA;
      min-height: 100vh;
      font-family: 'Poppins', sans-serif;
      position: relative;
      overflow-x: hidden;
    }

    /* Subtle Pattern Background */
    .dashboard::before {
        content: '';
        position: absolute;
        top: 0; left: 0; right: 0; height: 400px;
        background: linear-gradient(135deg, rgba(26, 76, 139, 0.05) 0%, rgba(212, 166, 80, 0.05) 100%);
        z-index: 0;
        mask-image: linear-gradient(to bottom, black, transparent);
    }

    .dashboard-header {
      position: relative;
      z-index: 1;
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 40px;
      background: rgba(255, 255, 255, 0.8);
      backdrop-filter: blur(15px) saturate(180%);
      padding: 25px 35px;
      border-radius: 24px;
      box-shadow: 
        0 4px 6px rgba(0, 0, 0, 0.02),
        0 10px 15px rgba(0, 0, 0, 0.03),
        inset 0 0 0 1px rgba(255, 255, 255, 0.5);
      border: 1px solid rgba(255,255,255,0.6);
    }

    .header-left { display: flex; align-items: center; gap: 25px; }
    
    .dashboard-logo {
      width: 65px;
      height: 65px;
      border-radius: 50%;
      object-fit: cover;
      border: 3px solid white;
      outline: 2px solid #1A4C8B;
      box-shadow: 0 4px 15px rgba(26, 76, 139, 0.25);
    }

    .gradient-text {
        background: linear-gradient(135deg, #1A4C8B 0%, #2A5C9B 50%, #D4A650 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        font-family: 'Cairo', sans-serif;
        font-weight: 800;
        font-size: 2.2rem;
        letter-spacing: -0.5px;
        margin: 0;
        text-shadow: 0 2px 10px rgba(26, 76, 139, 0.1);
    }
    
    .dashboard-header p {
        color: #64748B;
        font-weight: 500;
        margin-top: 5px;
        font-size: 1rem;
    }

    .btn-refresh {
      padding: 12px 24px;
      background: linear-gradient(135deg, #1A4C8B, #2A5C9B);
      color: white;
      border: none;
      border-radius: 14px;
      font-weight: 600;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 12px;
      box-shadow: 0 4px 15px rgba(26, 76, 139, 0.3), inset 0 1px 0 rgba(255,255,255,0.2);
      transition: all 0.3s ease;
      position: relative;
      overflow: hidden;
    }
    
    .btn-refresh::after {
        content: '';
        position: absolute;
        top: 0; left: 0; width: 100%; height: 100%;
        background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
        transform: skewX(-20deg);
        animation: shimmer 3s infinite;
    }

    .stats-grid {
      position: relative;
      z-index: 1;
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
      gap: 30px;
      margin-bottom: 40px;
    }

    .stat-card {
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(20px);
      padding: 25px;
      border-radius: 24px;
      box-shadow: 0 15px 35px rgba(0,0,0,0.05);
      display: flex;
      gap: 20px;
      align-items: center;
      border: 1px solid rgba(255,255,255,0.8);
      position: relative;
      overflow: hidden;
    }
    
    .stat-card.revenue { color: #27AE60; }
    .stat-card.orders { color: #3498DB; }
    .stat-card.customers { color: #9B59B6; }
    .stat-card.products { color: #E67E22; }

    .stat-icon-wrapper {
        width: 70px; height: 70px;
        border-radius: 20px;
        display: flex; alignItems: center; justifyContent: center;
        background: #F8FAFC;
        box-shadow: inset 0 2px 5px rgba(0,0,0,0.05);
    }
    
    .stat-icon {
      font-size: 2.5rem;
      animation: float 6s ease-in-out infinite;
      filter: drop-shadow(0 4px 6px rgba(0,0,0,0.1));
    }

    .stat-content { flex: 1; display: flex; flex-direction: column; }
    .stat-label { color: #94A3B8; font-size: 0.85rem; margin: 0 0 5px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; }
    .stat-value { font-family: 'Cairo', sans-serif; font-size: 2.2rem; font-weight: 800; color: #1E293B; margin: 0; line-height: 1; }
    
    .stat-trend {
        display: flex; align-items: center; gap: 5px;
        font-size: 0.85rem; font-weight: 600; margin-top: 5px;
    }
    .stat-trend.positive { color: #10B981; }
    .stat-trend.neutral { color: #64748B; }
    .stat-trend.negative { color: #EF4444; }

    .chart-section {
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: 30px;
      margin-bottom: 30px;
    }

    .card {
      background: white;
      border-radius: 24px;
      padding: 30px;
      box-shadow: 0 10px 40px rgba(0,0,0,0.04);
      border: 1px solid rgba(255,255,255,0.5);
    }
    
    .card-header h3 {
        font-family: 'Cairo', sans-serif;
        font-weight: 700;
        font-size: 1.3rem;
        color: #1E293B;
        position: relative;
        padding-left: 15px;
    }
    
    .card-header h3::before {
        content: '';
        position: absolute;
        left: 0; top: 50%; transform: translateY(-50%);
        width: 4px; height: 24px;
        background: #1A4C8B;
        border-radius: 4px;
    }

    .chart-placeholder {
        height: 320px;
        display: flex;
        align-items: flex-end;
        padding-top: 30px;
        padding-bottom: 10px;
    }
    
    .bars {
        display: flex;
        justify-content: space-around;
        width: 100%;
        height: 100%;
        align-items: flex-end;
        gap: 15px;
    }
    
    .bar-group {
        display: flex;
        flex-direction: column;
        align-items: center;
        height: 100%;
        justify-content: flex-end;
        flex: 1;
        gap: 10px;
    }
    
    .bar-wrapper {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: flex-end;
        background: rgba(241, 245, 249, 0.4);
        border-radius: 12px;
        overflow: hidden;
    }
    
    .bar {
        width: 100%;
        background: linear-gradient(180deg, #3B82F6 0%, #1A4C8B 100%);
        border-radius: 12px 12px 0 0;
        transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        min-height: 4px;
        animation: growBar 1.2s ease-out backwards;
        box-shadow: 0 4px 15px rgba(59, 130, 246, 0.3);
    }
    
    .bar:hover { 
        filter: brightness(1.2);
        box-shadow: 0 8px 25px rgba(59, 130, 246, 0.5);
    }
    
    .bar-label { font-size: 0.8rem; color: #94A3B8; font-weight: 600; }
    
    .no-data {
        width: 100%; height: 100%;
        display: flex; flex-direction: column; align-items: center; justify-content: center;
        color: #CBD5E1; gap: 10px;
        background: #F8FAFC; border-radius: 16px; border: 2px dashed #E2E8F0;
    }

    .categories-list { display: flex; flex-direction: column; gap: 20px; padding-top: 10px; }
    .category-item { display: flex; flex-direction: column; gap: 8px; }
    .category-info { display: flex; justify-content: space-between; font-weight: 600; font-size: 0.95rem; color: #334155; }
    
    .cat-name-group { display: flex; align-items: center; gap: 10px; }
    .cat-dot { width: 10px; height: 10px; border-radius: 50%; display: inline-block; }
    
    .category-progress { 
        height: 8px; 
        background: #F1F5F9; 
        border-radius: 4px; 
        overflow: hidden; 
    }
    
    .progress-bar { 
        height: 100%; 
        background: linear-gradient(90deg, #1A4C8B, #2A5C9B); 
        border-radius: 6px; 
        transition: width 1.5s cubic-bezier(0.22, 1, 0.36, 1);
        position: relative;
    }
    
    .progress-bar::after {
        content: '';
        position: absolute;
        top: 0; left: 0; bottom: 0; right: 0;
        background-image: linear-gradient(
          45deg,
          rgba(255, 255, 255, 0.15) 25%,
          transparent 25%,
          transparent 50%,
          rgba(255, 255, 255, 0.15) 50%,
          rgba(255, 255, 255, 0.15) 75%,
          transparent 75%,
          transparent
        );
        background-size: 1rem 1rem;
    }

    .orders-card { border: none; overflow: hidden; }
    
    .orders-table { width: 100%; border-collapse: separate; border-spacing: 0 12px; }
    .orders-table th { text-align: left; padding: 20px; color: #94A3B8; font-weight: 600; font-size: 0.9rem; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: none; }
    .orders-table td { 
        background: white; 
        padding: 20px; 
        border-top: 1px solid #F1F5F9; 
        border-bottom: 1px solid #F1F5F9; 
        color: #334155;
        transition: all 0.2s;
    }
    .orders-table tr td:first-child { border-top-left-radius: 12px; border-bottom-left-radius: 12px; border-left: 1px solid #F1F5F9; }
    .orders-table tr td:last-child { border-top-right-radius: 12px; border-bottom-right-radius: 12px; border-right: 1px solid #F1F5F9; }
    
    .orders-table tr:hover td { 
        background: #F8FAFC; 
        transform: translateY(-2px);
        box-shadow: 0 4px 10px rgba(0,0,0,0.02);
    }
    
    .status-badge { 
        padding: 8px 18px; 
        border-radius: 30px; 
        font-size: 0.85rem; 
        font-weight: 700; 
        text-transform: uppercase; 
        letter-spacing: 0.5px;
        box-shadow: 0 2px 5px rgba(0,0,0,0.05);
    }
    .status-badge.en_attente { background: #FFF7ED; color: #C2410C; border: 1px solid #FFEDD5; }
    .status-badge.confirmee { background: #ECFEFF; color: #0E7490; border: 1px solid #CFFAFE; }
    .status-badge.expediee { background: #EFF6FF; color: #1D4ED8; border: 1px solid #DBEAFE; }
    .status-badge.livree { background: #F0FDF4; color: #15803D; border: 1px solid #DCFCE7; }
    .status-badge.annulee { background: #FEF2F2; color: #B91C1C; border: 1px solid #FEE2E2; }

    .user-cell { display: flex; flex-direction: column; gap: 4px; }
    .user-cell span { font-weight: 600; color: #1E293B; }
    .user-cell small { color: #64748B; font-size: 0.85rem; }
    
    .btn-icon {
        width: 36px; height: 36px;
        border-radius: 10px;
        border: 1px solid #E2E8F0;
        color: #64748B;
        display: flex; align-items: center; justify-content: center;
        transition: all 0.2s;
        background: white;
    }
    .btn-icon:hover {
        background: #1A4C8B; border-color: #1A4C8B; color: white;
        box-shadow: 0 4px 10px rgba(26, 76, 139, 0.3);
        transform: translateY(-2px);
    }
    
    .link-view-all {
        font-weight: 600; color: #1A4C8B; text-decoration: none;
        padding: 8px 16px; border-radius: 8px; background: #F1F5F9; transition: all 0.2s;
    }
    .link-view-all:hover { background: #E2E8F0; color: #0F172A; }
    
    @media (max-width: 1024px) { .chart-section { grid-template-columns: 1fr; } }
    @media (max-width: 768px) { 
        .dashboard { padding: 20px; padding-bottom: 80px; }
        .stats-grid { grid-template-columns: 1fr; } 
        .dashboard-header { flex-direction: column; align-items: flex-start; gap: 20px; }
        .header-actions { width: 100%; justify-content: flex-end; }
    }
  `]
})
export class DashboardComponent implements OnInit {
  stats: DashboardStats | null = null;
  loading = false;

  constructor(private dashboardService: DashboardService) { }

  ngOnInit() {
    this.loadStats();
  }

  loadStats() {
    this.loading = true;
    this.dashboardService.getStats().subscribe({
      next: (data) => {
        this.stats = data;
        this.loading = false;
        console.log('Stats loaded:', this.stats);
      },
      error: (err) => {
        console.error('Error loading stats:', err);
        this.loading = false;
      }
    });
  }

  getBarHeight(value: number): number {
    if (!this.stats?.chartData?.length) return 0;
    const max = Math.max(...this.stats.chartData.map(d => d.total));
    return max > 0 ? (value / max) * 100 : 0;
  }

  getMaxSales(): number {
    if (!this.stats?.topCategories?.length) return 1;
    return Math.max(...this.stats.topCategories.map(c => c.totalSales));
  }

  getStatusClass(status: string): string {
    return status?.toLowerCase().replace(' ', '_') || 'default';
  }

  getCategoryColor(index: number): string {
    const colors = ['#1A4C8B', '#D4A650', '#27AE60', '#E74C3C', '#9B59B6'];
    return colors[index % colors.length];
  }
}

