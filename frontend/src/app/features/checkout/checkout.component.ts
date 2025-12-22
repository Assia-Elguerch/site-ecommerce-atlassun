import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { FooterComponent } from '../../shared/components/footer/footer.component';
import { CartService } from '../../core/services/cart.service';
import { OrderService } from '../../core/services/order.service';
import { Cart } from '../../core/models';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, HeaderComponent, FooterComponent],
  template: `
    <app-header></app-header>

    <div class="checkout-page">
      <div class="container">
        <div class="checkout-layout">
          <!-- Form Section -->
          <div class="checkout-form-container">
            <h1 class="section-title">Informations de livraison</h1>
            
            <form (ngSubmit)="onSubmit()" #checkoutForm="ngForm" class="checkout-form">
              <div class="form-grid">
                <div class="form-group full">
                  <label for="fullName">Nom complet</label>
                  <input type="text" id="fullName" name="fullName" [(ngModel)]="shippingData.fullName" required placeholder="Ex: Assia Fatiha">
                </div>
                
                <div class="form-group">
                  <label for="email">Email</label>
                  <input type="email" id="email" name="email" [(ngModel)]="shippingData.email" required placeholder="votre@email.com">
                </div>

                <div class="form-group">
                  <label for="phone">Téléphone</label>
                  <input type="tel" id="phone" name="phone" [(ngModel)]="shippingData.phone" required placeholder="+212 6XX-XXXXXX">
                </div>

                <div class="form-group full">
                  <label for="address">Adresse</label>
                  <input type="text" id="address" name="address" [(ngModel)]="shippingData.address" required placeholder="Rue, Quartier, N°">
                </div>

                <div class="form-group">
                  <label for="city">Ville</label>
                  <select id="city" name="city" [(ngModel)]="shippingData.city" required>
                    <option value="">Sélectionnez votre ville</option>
                    <option value="Casablanca">Casablanca</option>
                    <option value="Rabat">Rabat</option>
                    <option value="Marrakech">Marrakech</option>
                    <option value="Tanger">Tanger</option>
                    <option value="Fès">Fès</option>
                  </select>
                </div>

                <div class="form-group">
                  <label for="zipCode">Code Postal</label>
                  <input type="text" id="zipCode" name="zipCode" [(ngModel)]="shippingData.zipCode" required placeholder="Ex: 20250">
                </div>
              </div>

              <h2 class="section-title mt-4">Paiement</h2>
              <div class="payment-options">
                <label class="payment-option selected">
                  <input type="radio" name="payment" value="cod" [(ngModel)]="paymentMethod" checked>
                  <div class="payment-info">
                    <strong>Paiement à la livraison</strong>
                    <p>Payez en espèces dès réception de votre colis</p>
                  </div>
                  <span class="payment-icon">💵</span>
                </label>
              </div>

              <button type="submit" class="btn-submit" [disabled]="!checkoutForm.form.valid || isProcessing">
                <span *ngIf="!isProcessing">Confirmer la commande ({{ cart.total }} MAD)</span>
                <span *ngIf="isProcessing">Traitement en cours...</span>
              </button>
            </form>
          </div>

          <!-- Summary Section -->
          <aside class="order-summary-sidebar">
            <div class="summary-card">
              <h3>Votre Panier</h3>
              <div class="items-list">
                <div class="summary-item" *ngFor="let item of cart.items">
                  <img [src]="item.produit.imagePrincipale || 'assets/placeholder-product.png'" [alt]="item.produit.nom">
                  <div class="item-info">
                    <p class="name">{{ item.produit.nom }}</p>
                    <p class="qty">Quantité: {{ item.quantite }}</p>
                  </div>
                  <span class="price">{{ (item.produit.prixPromo || item.produit.prix) * item.quantite }} MAD</span>
                </div>
              </div>

              <div class="summary-totals">
                <div class="total-row">
                  <span>Sous-total</span>
                  <span>{{ cart.sousTotal }} MAD</span>
                </div>
                <div class="total-row">
                  <span>Livraison</span>
                  <span [class.free]="cart.fraisLivraison === 0">{{ cart.fraisLivraison === 0 ? 'Gratuit' : cart.fraisLivraison + ' MAD' }}</span>
                </div>
                <div class="total-row final">
                  <span>Total</span>
                  <span>{{ cart.total }} MAD</span>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>

    <app-footer></app-footer>
  `,
  styles: [`
    .checkout-page {
      background: #FAF7F0;
      padding: 60px 0 100px;
      min-height: 100vh;
    }

    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 20px;
    }

    .checkout-layout {
      display: grid;
      grid-template-columns: 1fr 400px;
      gap: 40px;
    }

    .section-title {
      font-family: 'Cairo', sans-serif;
      font-size: 1.8rem;
      color: #1A4C8B;
      margin-bottom: 30px;
    }

    .mt-4 { margin-top: 40px; }

    /* Form Styles */
    .checkout-form {
      background: white;
      padding: 50px 40px;
      border-radius: 20px;
      box-shadow: 0 10px 40px rgba(0,0,0,0.03);
      border: 1px solid rgba(212, 166, 80, 0.08);
      position: relative;
      overflow: hidden;
    }

    .checkout-form::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 6px;
      background: linear-gradient(90deg, #1A4C8B, #D4A650);
    }

    .form-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
    }

    .form-group.full {
      grid-column: span 2;
    }

    .form-group label {
      display: block;
      font-size: 0.9rem;
      font-weight: 500;
      color: #666;
      margin-bottom: 8px;
    }

    .form-group input, .form-group select {
      width: 100%;
      padding: 14px 18px;
      border: 2px solid #e2e8f0;
      border-radius: 12px;
      font-family: 'Poppins', sans-serif;
      transition: all 0.3s;
      background: #f8fafc;
    }

    .form-group input:focus, .form-group select:focus {
      outline: none;
      border-color: #1A4C8B;
      background: white;
      box-shadow: 0 0 0 4px rgba(26, 76, 139, 0.05);
    }

    /* Payment Options */
    .payment-options {
      display: flex;
      flex-direction: column;
      gap: 15px;
      margin-bottom: 40px;
    }

    .payment-option {
      display: flex;
      align-items: center;
      padding: 20px;
      border: 2px solid #F0F0F0;
      border-radius: 12px;
      cursor: pointer;
      transition: all 0.2s;
      position: relative;
    }

    .payment-option:hover {
      background: #FAFAFA;
    }

    .payment-option.selected {
      border-color: #1A4C8B;
      background: #F0F7FF;
    }

    .payment-option input {
      margin-right: 20px;
      width: 20px;
      height: 20px;
    }

    .payment-info {
      flex: 1;
    }

    .payment-info strong {
      display: block;
      font-family: 'Cairo', sans-serif;
      color: #2A2A2A;
    }

    .payment-info p {
      margin: 0;
      font-size: 0.85rem;
      color: #666;
    }

    .payment-icon {
      font-size: 1.5rem;
    }

    .btn-submit {
      width: 100%;
      padding: 18px;
      background: #1A4C8B;
      color: white;
      border: none;
      border-radius: 12px;
      font-family: 'Cairo', sans-serif;
      font-size: 1.2rem;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.3s;
    }

    .btn-submit:hover:not(:disabled) {
      background: #D4A650;
      transform: translateY(-2px);
      box-shadow: 0 10px 20px rgba(0,0,0,0.1);
    }

    .btn-submit:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    /* Summary Sidebar */
    .summary-card {
      background: #f8fafc;
      padding: 35px 25px;
      border-radius: 24px;
      border: 1px solid rgba(212, 166, 80, 0.1);
      position: sticky;
      top: 150px;
    }

    .summary-card h3 {
      font-family: 'Cairo', sans-serif;
      margin-bottom: 25px;
      padding-bottom: 15px;
      border-bottom: 1px solid #F0F0F0;
    }

    .items-list {
      display: flex;
      flex-direction: column;
      gap: 15px;
      margin-bottom: 25px;
    }

    .summary-item {
      display: flex;
      align-items: center;
      gap: 15px;
    }

    .summary-item img {
      width: 60px;
      height: 60px;
      border-radius: 8px;
      object-fit: cover;
    }

    .summary-item .name {
      margin: 0;
      font-size: 0.95rem;
      font-weight: 500;
      color: #2A2A2A;
    }

    .summary-item .qty {
      margin: 0;
      font-size: 0.8rem;
      color: #999;
    }

    .summary-item .price {
      margin-left: auto;
      font-weight: 600;
      color: #1A4C8B;
    }

    .summary-totals {
      border-top: 2px dashed #F0F0F0;
      padding-top: 20px;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .total-row {
      display: flex;
      justify-content: space-between;
      color: #666;
    }

    .total-row.final {
      color: #1A4C8B;
      font-size: 1.4rem;
      font-weight: 800;
      margin-top: 10px;
      padding-top: 15px;
      border-top: 1px solid #F0F0F0;
    }

    .free { color: #27AE60; font-weight: 600; }

    @media (max-width: 1024px) {
      .checkout-layout { grid-template-columns: 1fr; }
      .order-summary-sidebar { order: -1; }
      .summary-card { position: static; }
    }
  `]
})
export class CheckoutComponent implements OnInit {
  cart: Cart = { items: [], sousTotal: 0, fraisLivraison: 0, total: 0 };
  shippingData = {
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    zipCode: ''
  };
  paymentMethod = 'cod';
  isProcessing = false;

  constructor(
    private cartService: CartService,
    private orderService: OrderService,
    private router: Router
  ) { }

  ngOnInit() {
    this.cartService.cart$.subscribe(cart => {
      this.cart = cart;
      if (cart.items.length === 0) {
        this.router.navigate(['/cart']);
      }
    });
  }

  onSubmit() {
    this.isProcessing = true;

    const orderData: any = {
      email: this.shippingData.email, // Send email for user lookup/creation
      adresseLivraison: {
        nom: this.shippingData.fullName,
        rue: this.shippingData.address,
        ville: this.shippingData.city,
        codePostal: this.shippingData.zipCode,
        pays: 'Maroc',
        telephone: this.shippingData.phone
      },
      articles: this.cart.items.map(item => {
        const produitId = item.produit.id || (item.produit as any)._id || (item.produit as any).produitId;
        return {
          produit: produitId,
          nom: item.produit.nom,
          quantite: item.quantite,
          prix: item.produit.prixPromo || item.produit.prix,
          image: item.produit.imagePrincipale
        };
      }),
      montantArticles: this.cart.items.reduce((acc, item) => acc + ((item.produit.prixPromo || item.produit.prix) * item.quantite), 0),
      fraisLivraison: this.cart.fraisLivraison,
      montantTotal: this.cart.total,
      methodePaiement: this.paymentMethod
    };

    // Use OrderService to send to backend
    this.orderService.createOrder(orderData).subscribe({
      next: (response: any) => {
        // Clear Cart
        this.cartService.clearCart();

        // Navigate to tracking with REAL ID from database
        const orderId = response.data?.numeroCommande || response.numeroCommande;
        this.router.navigate(['/order-tracking'], { queryParams: { id: orderId } });
        this.isProcessing = false;
      },
      error: (err) => {
        console.error('Order creation failed', err);
        alert('Une erreur est survenue lors de la commande. Veuillez réessayer.');
        this.isProcessing = false;
      }
    });
  }
}
