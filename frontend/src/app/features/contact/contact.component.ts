import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { FooterComponent } from '../../shared/components/footer/footer.component';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent, FooterComponent],
  template: `
    <app-header></app-header>
    
    <div class="contact-page">
      <div class="container slide-up">
        <!-- Premium Header -->
        <div class="premium-header">
          <div class="header-content">
            <h1 class="premium-title">Contactez l'Équipe AtlasSun</h1>
            <p class="premium-subtitle">Nous sommes à votre écoute pour vous accompagner dans votre voyage artisanal</p>
          </div>
          <div class="header-decoration"></div>
        </div>

        <div class="contact-layout">
          <!-- Info Section -->
          <div class="contact-info-section">
            <div class="premium-card info-card">
              <h2 class="section-title">Nos Coordonnées</h2>
              <p class="section-text">Retrouvez-nous ou contactez-nous via nos différents canaux.</p>
              
              <div class="info-items-list">
                <div class="info-item-premium">
                  <div class="item-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 1118 0z"/>
                      <circle cx="12" cy="10" r="3"/>
                    </svg>
                  </div>
                  <div class="item-details">
                    <label>Adresse du Showroom</label>
                    <p>45 Rue des Hôpitaux,<br>Maarif, Casablanca 20250</p>
                  </div>
                </div>

                <div class="info-item-premium">
                  <div class="item-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"/>
                    </svg>
                  </div>
                  <div class="item-details">
                    <label>Ligne Directe</label>
                    <p>+212 524 00 00 00</p>
                    <span class="availability">Lun - Ven : 09:00 - 18:00</span>
                  </div>
                </div>

                <div class="info-item-premium">
                  <div class="item-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                      <polyline points="22,6 12,13 2,6"/>
                    </svg>
                  </div>
                  <div class="item-details">
                    <label>Support Email</label>
                    <p>contact@atlassun.ma</p>
                    <span class="availability">Réponse sous 24h ouvrées</span>
                  </div>
                </div>
              </div>

              <div class="premium-divider"></div>

              <div class="social-connect">
                <span>Suivez notre actualité :</span>
                <div class="social-badges">
                  <a href="#" class="social-badge-item">Instagram</a>
                  <a href="#" class="social-badge-item">Facebook</a>
                </div>
              </div>
            </div>
          </div>

          <!-- Form Section -->
          <div class="contact-form-section">
            <div class="premium-card">
              <h2 class="section-title">Envoyez-nous un Message</h2>
              <form class="premium-form" (ngSubmit)="onSubmit()">
                <div class="form-grid">
                  <div class="input-group">
                    <label>Prénom</label>
                    <div class="input-wrapper">
                      <input type="text" [(ngModel)]="formData.firstName" name="firstName" required placeholder="Ex: Assia">
                      <div class="input-focus-border"></div>
                    </div>
                  </div>
                  <div class="input-group">
                    <label>Nom</label>
                    <div class="input-wrapper">
                      <input type="text" [(ngModel)]="formData.lastName" name="lastName" required placeholder="Ex: Fatiha">
                      <div class="input-focus-border"></div>
                    </div>
                  </div>
                </div>

                <div class="input-group full-width">
                  <label>Email</label>
                  <div class="input-wrapper">
                    <input type="email" [(ngModel)]="formData.email" name="email" required placeholder="contact@example.com">
                    <div class="input-focus-border"></div>
                  </div>
                </div>

                <div class="input-group full-width">
                  <label>Sujet</label>
                  <div class="input-wrapper">
                    <select [(ngModel)]="formData.subject" name="subject" required>
                      <option value="general">Informations Générales</option>
                      <option value="order">Suivi de Commande</option>
                      <option value="partnership">Devenir Artisan Partenaire</option>
                      <option value="other">Autre</option>
                    </select>
                    <div class="input-focus-border"></div>
                  </div>
                </div>

                <div class="input-group full-width">
                  <label>Message</label>
                  <div class="input-wrapper">
                    <textarea [(ngModel)]="formData.message" name="message" required rows="5" placeholder="Comment pouvons-nous vous aider ?"></textarea>
                    <div class="input-focus-border"></div>
                  </div>
                </div>

                <div class="form-actions">
                  <button type="submit" class="btn-primary-premium" [disabled]="loading">
                    {{ loading ? 'Envoi en cours...' : 'Envoyer mon message' }}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>

    <app-footer></app-footer>
  `,
  styles: [`
    .contact-page {
      background: #fdfdfd;
      min-height: calc(100vh - 200px);
      padding: 60px 0 100px;
      font-family: 'Poppins', sans-serif;
    }

    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 25px;
    }

    .slide-up {
      animation: slideUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) both;
    }

    /* Premium Header - Modern Blue-Gold Gradient */
    .premium-header {
      position: relative;
      background: linear-gradient(135deg, #1A4C8B 0%, #2A5C9B 50%, #D4A650 100%);
      color: white;
      padding: 50px;
      border-radius: 28px;
      margin-bottom: 50px;
      overflow: hidden;
      box-shadow: 0 20px 60px rgba(26, 76, 139, 0.25),
                  0 0 0 1px rgba(255, 255, 255, 0.1) inset;
      transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
    }

    .premium-header:hover {
      transform: translateY(-4px);
      box-shadow: 0 30px 80px rgba(26, 76, 139, 0.35),
                  0 0 0 1px rgba(255, 255, 255, 0.2) inset;
    }

    .header-decoration {
      position: absolute;
      top: -50%;
      right: -10%;
      width: 500px;
      height: 500px;
      background: linear-gradient(135deg, rgba(212, 166, 80, 0.4), rgba(42, 92, 155, 0.3));
      border-radius: 50%;
      filter: blur(80px);
      animation: float 8s ease-in-out infinite;
    }

    @keyframes float {
      0%, 100% { transform: translate(0, 0) rotate(0deg); }
      50% { transform: translate(-30px, 20px) rotate(180deg); }
    }

    .premium-title {
      font-family: 'Cairo', sans-serif;
      font-size: 2.2rem;
      font-weight: 800;
      color: white;
      margin: 0 0 8px;
    }

    .premium-subtitle {
      opacity: 0.8;
      font-size: 1rem;
      margin: 0;
    }

    /* Layout */
    .contact-layout {
      display: grid;
      grid-template-columns: 400px 1fr;
      gap: 40px;
    }

    /* Common Card Styles - Glassmorphism */
    .premium-card {
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border-radius: 28px;
      border: 1px solid rgba(26, 76, 139, 0.15);
      box-shadow: 0 20px 50px rgba(0, 0, 0, 0.05),
                  0 0 0 1px rgba(255, 255, 255, 0.8) inset;
      padding: 40px;
      height: 100%;
      transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
    }

    .premium-card:hover {
      transform: translateY(-8px) scale(1.02);
      box-shadow: 0 30px 70px rgba(26, 76, 139, 0.15),
                  0 0 0 1px rgba(212, 166, 80, 0.3) inset;
      border-color: rgba(212, 166, 80, 0.3);
    }

    .section-title {
      font-family: 'Cairo', sans-serif;
      font-size: 1.8rem;
      font-weight: 800;
      background: linear-gradient(135deg, #1A4C8B, #D4A650);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      margin: 0 0 12px;
      letter-spacing: -0.5px;
    }

    .section-text {
      color: #94a3b8;
      font-size: 0.95rem;
      margin-bottom: 30px;
    }

    /* Info Items */
    .info-items-list {
      display: flex;
      flex-direction: column;
      gap: 25px;
    }

    .info-item-premium {
      display: flex;
      gap: 20px;
      align-items: flex-start;
    }

    .item-icon {
      width: 60px;
      height: 60px;
      background: linear-gradient(135deg, rgba(26, 76, 139, 0.1), rgba(212, 166, 80, 0.15));
      color: #1A4C8B;
      border-radius: 18px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
      box-shadow: 0 4px 15px rgba(26, 76, 139, 0.1);
    }

    .info-item-premium:hover .item-icon {
      background: linear-gradient(135deg, #1A4C8B, #D4A650);
      color: white;
      transform: scale(1.15) rotate(5deg);
      box-shadow: 0 10px 30px rgba(212, 166, 80, 0.4);
      animation: pulse 1s ease-in-out infinite;
    }

    @keyframes pulse {
      0%, 100% { box-shadow: 0 10px 30px rgba(212, 166, 80, 0.4); }
      50% { box-shadow: 0 10px 40px rgba(212, 166, 80, 0.6); }
    }

    .item-details label {
      display: block;
      font-size: 0.75rem;
      text-transform: uppercase;
      letter-spacing: 1.5px;
      font-weight: 800;
      background: linear-gradient(135deg, #1A4C8B, #D4A650);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      margin-bottom: 6px;
    }

    .item-details p {
      margin: 0;
      color: #1e293b;
      font-weight: 600;
      font-size: 1rem;
      line-height: 1.5;
    }

    .availability {
      font-size: 0.85rem;
      color: #94a3b8;
      display: block;
      margin-top: 2px;
    }

    .premium-divider {
      height: 1px;
      background: linear-gradient(90deg, transparent, rgba(212, 166, 80, 0.2), transparent);
      margin: 35px 0;
    }

    .social-connect span {
      display: block;
      font-size: 0.85rem;
      color: #94a3b8;
      margin-bottom: 15px;
    }

    .social-badges {
      display: flex;
      gap: 12px;
    }

    .social-badge-item {
      padding: 10px 20px;
      background: linear-gradient(135deg, rgba(26, 76, 139, 0.1), rgba(212, 166, 80, 0.15));
      color: #1A4C8B;
      border-radius: 16px;
      font-size: 0.9rem;
      font-weight: 700;
      text-decoration: none;
      border: 1px solid rgba(26, 76, 139, 0.2);
      transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
    }

    .social-badge-item:hover {
      background: linear-gradient(135deg, #1A4C8B, #D4A650);
      color: white;
      transform: translateY(-3px) scale(1.05);
      box-shadow: 0 8px 20px rgba(212, 166, 80, 0.4);
      border-color: transparent;
    }

    /* Form Styles */
    .form-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 25px;
      margin-bottom: 25px;
    }

    .input-group {
      margin-bottom: 25px;
    }

    .input-group.full-width {
      grid-column: span 2;
    }

    .input-group label {
      display: block;
      font-weight: 700;
      font-size: 0.8rem;
      color: #1A4C8B;
      margin-bottom: 10px;
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    .input-wrapper {
      position: relative;
    }

    .input-wrapper input, 
    .input-wrapper select, 
    .input-wrapper textarea {
      width: 100%;
      padding: 18px 24px;
      background: rgba(248, 250, 252, 0.8);
      backdrop-filter: blur(10px);
      border: 2px solid rgba(26, 76, 139, 0.15);
      border-radius: 20px;
      font-size: 1rem;
      color: #1e293b;
      transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
      font-family: 'Poppins', sans-serif;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.02) inset;
    }

    .input-wrapper input:focus, 
    .input-wrapper select:focus, 
    .input-wrapper textarea:focus {
      outline: none;
      background: white;
      border-color: #D4A650;
      box-shadow: 0 0 0 4px rgba(212, 166, 80, 0.15),
                  0 8px 25px rgba(26, 76, 139, 0.15);
      transform: translateY(-2px);
    }

    .input-focus-border {
      position: absolute;
      bottom: 0;
      left: 50%;
      width: 0;
      height: 2px;
      background: #D4A650;
      transition: all 0.4s ease;
      transform: translateX(-50%);
    }

    .input-wrapper input:focus + .input-focus-border,
    .input-wrapper select:focus + .input-focus-border,
    .input-wrapper textarea:focus + .input-focus-border {
      width: 100%;
    }

    .btn-primary-premium {
      width: 100%;
      padding: 20px;
      background: linear-gradient(135deg, #1A4C8B 0%, #2A5C9B 50%, #D4A650 100%);
      color: white;
      border: none;
      border-radius: 20px;
      font-family: 'Cairo', sans-serif;
      font-weight: 800;
      font-size: 1.15rem;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
      box-shadow: 0 8px 25px rgba(26, 76, 139, 0.3),
                  0 0 0 1px rgba(255, 255, 255, 0.1) inset;
    }

    .btn-primary-premium::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
      transition: left 0.5s;
    }

    .btn-primary-premium:hover::before {
      left: 100%;
    }

    .btn-primary-premium:hover:not(:disabled) {
      background: linear-gradient(135deg, #D4A650 0%, #E5B761 50%, #1A4C8B 100%);
      transform: translateY(-4px) scale(1.02);
      box-shadow: 0 15px 40px rgba(212, 166, 80, 0.5),
                  0 0 0 1px rgba(255, 255, 255, 0.2) inset;
    }

    .btn-primary-premium:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }

    /* Animations */
    @keyframes slideUp {
      from { transform: translateY(30px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }

    @media (max-width: 900px) {
      .contact-layout { grid-template-columns: 1fr; }
      .form-grid { grid-template-columns: 1fr; }
      .input-group.full-width { grid-column: span 1; }
    }
  `]
})
export class ContactComponent {
  loading = false;
  formData = {
    firstName: '',
    lastName: '',
    email: '',
    subject: 'general',
    message: ''
  };

  onSubmit() {
    this.loading = true;

    // Simulate API call
    setTimeout(() => {
      this.loading = false;
      alert('Message envoyé avec succès ! Nous vous répondrons bientôt.');
      this.formData = {
        firstName: '',
        lastName: '',
        email: '',
        subject: 'general',
        message: ''
      };
    }, 1500);
  }
}
