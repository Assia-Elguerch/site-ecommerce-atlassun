import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { FooterComponent } from '../../shared/components/footer/footer.component';
import { OnInit } from '@angular/core';
import { OrderService } from '../../core/services/order.service';
import { Order } from '../../core/models';

interface TrackingStep {
  id: string;
  label: string;
  icon: string;
  description: string;
}

interface TrackingStatus {
  id: string;
  status: string;
  currentStepIndex: number;
  estimatedDate: string;
  history: { date: string; event: string }[];
}

@Component({
  selector: 'app-order-tracking',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, HeaderComponent, FooterComponent],
  template: `
    <app-header></app-header>

    <div class="tracking-page">
      <!-- Background Patterns -->
      <div class="bg-pattern pattern-1"></div>
      <div class="bg-pattern pattern-2"></div>

      <div class="container main-content">
        <div class="tracking-hero">
          <h1 class="animate-entrance">Suivez votre Trésor</h1>
          <p class="subtitle animate-entrance-delay">Entrez votre numéro de commande pour voyager avec votre colis.</p>
        </div>

        <div class="tracking-hub animate-card">
          <!-- Search Box -->
          <div class="search-section">
            <div class="input-wrapper">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" class="input-icon">
                <path d="M21 21l-4.35-4.35M16.5 10.5a6 6 0 11-12 0 6 6 0 0112 0z" stroke-width="2"/>
              </svg>
              <input 
                type="text" 
                [(ngModel)]="orderId" 
                placeholder="Ex: ORD-123, ORD-456..." 
                class="tracking-input"
                (keyup.enter)="trackOrder()"
              >
            </div>
            <button (click)="trackOrder()" class="tracking-btn" [disabled]="!orderId || isLoading">
              <span *ngIf="!isLoading">Rechercher</span>
              <div *ngIf="isLoading" class="spinner"></div>
            </button>
          </div>

          <!-- Error Message -->
          <div *ngIf="error" class="error-msg animate-fade-in">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <circle cx="12" cy="12" r="10" stroke-width="2"/>
              <path d="M12 8v4M12 16h.01" stroke-width="2" stroke-linecap="round"/>
            </svg>
            {{ error }}
          </div>

          <!-- Loading Result Skeleton -->
          <div *ngIf="isLoading" class="skeleton-loader">
            <div class="skeleton-line"></div>
            <div class="skeleton-steps">
              <div class="skeleton-circle" *ngFor="let i of [1,2,3,4,5]"></div>
            </div>
          </div>

          <!-- Tracking Result -->
          <div *ngIf="trackingResult && !isLoading" class="result-area animate-fade-in">
            <div class="order-header">
              <div class="id-tag">Commande #{{ trackingResult.id }}</div>
              <div class="status-badge" [class]="trackingResult.status">
                {{ getStatusLabel(trackingResult.status) }}
              </div>
            </div>

            <!-- Visual Stepper -->
            <div class="stepper-container">
              <div class="stepper-rail">
                <div class="progress-fill" [style.width.%]="(trackingResult.currentStepIndex / (steps.length - 1)) * 100"></div>
              </div>
              
              <div class="steps-wrapper">
                <div 
                  *ngFor="let step of steps; let i = index" 
                  class="step-item"
                  [class.active]="i <= trackingResult.currentStepIndex"
                  [class.current]="i === trackingResult.currentStepIndex"
                >
                  <div class="step-icon-box">
                    <span class="step-icon">{{ step.icon }}</span>
                    <div class="pulse-ring" *ngIf="i === trackingResult.currentStepIndex"></div>
                  </div>
                  <div class="step-info">
                    <span class="step-label">{{ step.label }}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Detailed Info -->
            <div class="info-grid">
              <div class="info-card">
                <h3>Estimation de livraison</h3>
                <p class="date">{{ trackingResult.estimatedDate }}</p>
                <p class="desc">Votre colis est en route via AtlasSun Priority</p>
              </div>
              <div class="info-card">
                <h3>Dernier événement</h3>
                <p class="event">{{ trackingResult.history[0].event }}</p>
                <p class="time">{{ trackingResult.history[0].date }}</p>
              </div>
            </div>

            <!-- History Summary -->
            <div class="history-list">
              <h4>Historique complet</h4>
              <div class="history-item" *ngFor="let h of trackingResult.history">
                <span class="h-date">{{ h.date }}</span>
                <span class="h-event">{{ h.event }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <app-footer></app-footer>
  `,
  styles: [`
    @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700&family=Poppins:wght@300;400;500;600&display=swap');

    .tracking-page {
      font-family: 'Poppins', sans-serif;
      background: #f0f2f5;
      min-height: 100vh;
      position: relative;
      overflow: hidden;
      padding-bottom: 100px;
    }

    .container {
      max-width: 1000px;
      margin: 0 auto;
      padding: 0 20px;
      position: relative;
      z-index: 2;
    }

    /* Background Patterns */
    .bg-pattern {
      position: absolute;
      border-radius: 50%;
      background: linear-gradient(135deg, #1A4C8B 0%, #D4A650 100%);
      opacity: 0.05;
      filter: blur(80px);
      z-index: 1;
    }

    .pattern-1 {
      width: 500px;
      height: 500px;
      top: -100px;
      right: -200px;
      animation: float 20s infinite ease-in-out;
    }

    .pattern-2 {
      width: 400px;
      height: 400px;
      bottom: -100px;
      left: -200px;
      animation: float 25s infinite ease-in-out reverse;
    }

    @keyframes float {
      0%, 100% { transform: translate(0, 0); }
      50% { transform: translate(50px, 50px); }
    }

    /* Hero Section */
    .tracking-hero {
      padding: 80px 0 40px;
      text-align: center;
    }

    .tracking-hero h1 {
      font-family: 'Cairo', sans-serif;
      font-size: clamp(2.5rem, 6vw, 4rem);
      font-weight: 800;
      color: #1A4C8B;
      margin-bottom: 15px;
    }

    .tracking-hero .subtitle {
      font-size: 1.2rem;
      color: #64748b;
      max-width: 600px;
      margin: 0 auto;
    }

    /* Tracking Hub Card */
    .tracking-hub {
      background: white;
      border-radius: 30px;
      padding: 60px 50px;
      box-shadow: 0 10px 40px rgba(0,0,0,0.03);
      border: 1px solid rgba(212, 166, 80, 0.08);
      position: relative;
      overflow: hidden;
    }

    .tracking-hub::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 6px;
      background: linear-gradient(90deg, #1A4C8B, #D4A650);
    }

    /* Search Section */
    .search-section {
      display: flex;
      gap: 20px;
      margin-bottom: 40px;
    }

    .input-wrapper {
      flex: 1;
      position: relative;
      display: flex;
      align-items: center;
    }

    .input-icon {
      position: absolute;
      left: 20px;
      color: #94a3b8;
    }

    .tracking-input {
      width: 100%;
      padding: 18px 20px 18px 60px;
      background: white;
      border: 2px solid #e2e8f0;
      border-radius: 20px;
      font-size: 1.1rem;
      outline: none;
      transition: all 0.3s ease;
      font-family: 'Poppins', sans-serif;
    }

    .tracking-input:focus {
      border-color: #1A4C8B;
      box-shadow: 0 0 0 4px rgba(26, 76, 139, 0.1);
    }

    .tracking-btn {
      padding: 0 45px;
      background: #D4A650;
      color: white;
      border: none;
      border-radius: 20px;
      font-weight: 700;
      font-size: 1.1rem;
      cursor: pointer;
      transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      font-family: 'Cairo', sans-serif;
      display: flex;
      align-items: center;
      justify-content: center;
      min-width: 180px;
    }

    .tracking-btn:hover:not(:disabled) {
      transform: translateY(-5px);
      box-shadow: 0 10px 25px rgba(212, 166, 80, 0.4);
      background: #E5B761;
    }

    .tracking-btn:disabled { opacity: 0.7; cursor: not-allowed; }

    /* Stepper */
    .stepper-container {
      margin: 60px 0;
      position: relative;
      padding: 0 20px;
    }

    .stepper-rail {
      position: absolute;
      top: 35px;
      left: 50px;
      right: 50px;
      height: 6px;
      background: #e2e8f0;
      border-radius: 10px;
      overflow: hidden;
    }

    .progress-fill {
      height: 100%;
      background: linear-gradient(90deg, #1A4C8B, #D4A650);
      transition: width 1s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .steps-wrapper {
      display: flex;
      justify-content: space-between;
      position: relative;
    }

    .step-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 100px;
      text-align: center;
      z-index: 2;
    }

    .step-icon-box {
      width: 70px;
      height: 70px;
      background: white;
      border: 4px solid #e2e8f0;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 15px;
      font-size: 1.8rem;
      transition: all 0.4s ease;
      position: relative;
    }

    .step-item.active .step-icon-box {
      border-color: #1A4C8B;
      color: #1A4C8B;
      transform: scale(1.1);
      box-shadow: 0 10px 20px rgba(26, 76, 139, 0.1);
    }

    .step-item.current .step-icon-box {
      border-color: #D4A650;
      background: #D4A650;
      color: white;
    }

    .step-label {
      font-size: 0.85rem;
      font-weight: 600;
      color: #94a3b8;
      transition: all 0.3s ease;
    }

    .step-item.active .step-label { color: #1A4C8B; }
    .step-item.current .step-label { color: #D4A650; font-weight: 700; }

    /* Pulse Animation */
    .pulse-ring {
      position: absolute;
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background: #D4A650;
      opacity: 0.6;
      animation: pulse 2s infinite;
    }

    @keyframes pulse {
      0% { transform: scale(1); opacity: 0.6; }
      100% { transform: scale(1.5); opacity: 0; }
    }

    /* Result Area */
    .order-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-bottom: 25px;
      border-bottom: 1px solid #e2e8f0;
    }

    .id-tag {
      font-family: 'Cairo', sans-serif;
      font-weight: 700;
      font-size: 1.4rem;
      color: #1A4C8B;
    }

    .status-badge {
      padding: 8px 20px;
      border-radius: 50px;
      font-weight: 700;
      font-size: 0.9rem;
      text-transform: uppercase;
    }

    .status-badge.delivered { background: #dcfce7; color: #166534; }
    .status-badge.pending { background: #fef9c3; color: #854d0e; }
    .status-badge.processing { background: #e0f2fe; color: #075985; }
    .status-badge.shipped { background: #fdf2f8; color: #9d174d; }

    /* Info Cards */
    .info-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 25px;
      margin-top: 40px;
    }

    .info-card {
      background: #f8fafc;
      padding: 30px;
      border-radius: 24px;
      border: 1px solid rgba(212, 166, 80, 0.05);
      transition: all 0.3s ease;
    }

    .info-card:hover {
      background: white;
      box-shadow: 0 10px 30px rgba(0,0,0,0.05);
      transform: translateY(-5px);
    }

    .info-card h3 {
      font-family: 'Cairo', sans-serif;
      font-size: 1.1rem;
      margin-bottom: 10px;
      color: #64748b;
    }

    .info-card p { font-weight: 700; color: #1e293b; }
    .info-card .desc, .info-card .time { font-weight: 400; font-size: 0.9rem; color: #94a3b8; }

    /* History List */
    .history-list {
      margin-top: 40px;
    }

    .history-list h4 {
      font-family: 'Cairo', sans-serif;
      margin-bottom: 20px;
      color: #1e293b;
    }

    .history-item {
      display: flex;
      gap: 30px;
      padding: 20px 0;
      border-bottom: 1px dashed #e2e8f0;
    }

    .h-date { color: #94a3b8; min-width: 150px; font-size: 0.9rem; }
    .h-event { font-weight: 500; color: #475569; }

    /* Animations */
    .animate-entrance { animation: slideDown 1s ease-out; }
    .animate-entrance-delay { animation: slideDown 1s ease-out 0.2s both; }
    .animate-card { animation: fadeInUp 1s cubic-bezier(0.23, 1, 0.32, 1) 0.4s both; }
    .animate-fade-in { animation: fadeIn 0.8s ease-out; }

    @keyframes slideDown {
      from { opacity: 0; transform: translateY(-30px); }
      to { opacity: 1; transform: translateY(0); }
    }

    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(50px); }
      to { opacity: 1; transform: translateY(0); }
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    /* Spinner */
    .spinner {
      width: 24px;
      height: 24px;
      border: 3px solid rgba(255,255,255,0.3);
      border-top-color: white;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    .error-msg {
      display: flex;
      align-items: center;
      gap: 10px;
      background: #fee2e2;
      color: #b91c1c;
      padding: 15px 20px;
      border-radius: 12px;
      margin-bottom: 30px;
      font-weight: 500;
    }

    /* Skeleton Loader */
    .skeleton-loader { padding: 40px 0; }
    .skeleton-line { height: 20px; background: #e2e8f0; border-radius: 10px; margin-bottom: 30px; animation: shine 2s infinite; }
    .skeleton-steps { display: flex; justify-content: space-between; }
    .skeleton-circle { width: 50px; height: 50px; background: #e2e8f0; border-radius: 50%; animation: shine 2s infinite; }

    @keyframes shine {
      0% { opacity: 0.5; }
      50% { opacity: 1; }
      100% { opacity: 0.5; }
    }

    @media (max-width: 768px) {
      .search-section { flex-direction: column; }
      .stepper-rail { display: none; }
      .steps-wrapper { flex-direction: column; align-items: flex-start; gap: 30px; }
      .step-item { flex-direction: row; width: 100%; gap: 20px; text-align: left; }
      .info-grid { grid-template-columns: 1fr; }
      .tracking-hub { padding: 30px 20px; }
    }
  `]
})
export class OrderTrackingComponent implements OnInit {
  orderId = '';
  trackingResult: TrackingStatus | null = null;
  error = '';
  isLoading = false;

  constructor(
    private route: ActivatedRoute,
    private orderService: OrderService
  ) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params['id']) {
        this.orderId = params['id'];
        this.trackOrder();
      }
    });
  }

  steps: TrackingStep[] = [
    { id: 'pending', label: 'Commandée', icon: '📝', description: 'Votre commande a été reçue.' },
    { id: 'processing', label: 'Préparation', icon: '⚙️', description: 'Nous préparons vos trésors.' },
    { id: 'shipped', label: 'Expédiée', icon: '📦', description: 'Votre colis est chez le transporteur.' },
    { id: 'out_for_delivery', label: 'En Livraison', icon: '🚚', description: 'Le livreur arrive bientôt.' },
    { id: 'delivered', label: 'Livrée', icon: '🏠', description: 'Colis livré avec succès.' }
  ];

  trackOrder() {
    if (!this.orderId.trim()) return;

    this.isLoading = true;
    this.error = '';
    this.trackingResult = null;

    this.orderService.getOrderByNumber(this.orderId.trim()).subscribe({
      next: (response: any) => {
        const order = response.data || response;
        this.mapOrderToTracking(order);
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Tracking error:', err);
        this.error = "Numéro de commande introuvable. Veuillez vérifier votre numéro (ex: CMD-202512-00001).";
        this.isLoading = false;
      }
    });
  }

  private mapOrderToTracking(order: any) {
    // Map backend status to frontend steps
    const statusMap: { [key: string]: { status: string, index: number } } = {
      'en_attente': { status: 'pending', index: 0 },
      'confirmee': { status: 'processing', index: 1 },
      'en_preparation': { status: 'processing', index: 1 },
      'expediee': { status: 'shipped', index: 2 },
      'en_livraison': { status: 'out_for_delivery', index: 3 },
      'livree': { status: 'delivered', index: 4 },
      'annulee': { status: 'pending', index: 0 } // Handle cancel as needed
    };

    const mapping = statusMap[order.statutCommande] || { status: 'pending', index: 0 };

    // Create history based on timestamps
    const history = [
      {
        date: new Date(order.updatedAt || order.dateModification || Date.now()).toLocaleString('fr-FR'),
        event: this.getEventDescription(order.statutCommande)
      }
    ];

    // Add creation date if it differs
    if (order.createdAt && order.updatedAt !== order.createdAt) {
      history.push({
        date: new Date(order.createdAt).toLocaleString('fr-FR'),
        event: 'Commande reçue et enregistrée'
      });
    }

    this.trackingResult = {
      id: order.numeroCommande,
      status: mapping.status,
      currentStepIndex: mapping.index,
      estimatedDate: this.calculateEstimatedDate(order.createdAt),
      history: history
    };
  }

  private getEventDescription(status: string): string {
    switch (status) {
      case 'en_attente': return 'Commande en attente de validation';
      case 'confirmee': return 'Paiement confirmé, commande validée';
      case 'en_preparation': return 'Vos articles sont en cours de préparation artisanale';
      case 'expediee': return 'Colis remis au transporteur';
      case 'en_livraison': return 'Livreur en route vers votre adresse';
      case 'livree': return 'Colis livré avec succès';
      case 'annulee': return 'Commande annulée';
      default: return 'Mise à jour du statut';
    }
  }

  private calculateEstimatedDate(creationDate: string): string {
    const date = new Date(creationDate || Date.now());
    date.setDate(date.getDate() + 5); // Default 5 days delivery
    return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
  }

  getStatusLabel(status: string): string {
    const step = this.steps.find(s => s.id === status);
    return step ? step.label : status;
  }
}

