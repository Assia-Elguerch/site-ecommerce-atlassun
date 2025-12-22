import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <footer class="footer">
      <!-- Main Footer -->
      <div class="footer-main">
        <div class="container">
          <div class="footer-grid">
            <!-- About -->
            <div class="footer-col">
              <div class="footer-logo">
                <img src="assets/images/logo/Logo ATLASSUN.png" alt="AtlasSun" class="logo-img">
                <span class="brand">AtlasSun</span>
              </div>
              <p class="footer-description">
                Votre destination premium pour l'artisanat marocain authentique. 
                Découvrez notre sélection exclusive de produits traditionnels de qualité.
              </p>
              <div class="social-links">
                <a href="#" class="social-btn"><svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg></a>
                <a href="#" class="social-btn"><svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg></a>
                <a href="#" class="social-btn"><svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg></a>
                <a href="#" class="social-btn"><svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M0 0h24v24H0z" fill="none"/><path d="M22,17.3c0,2.8-2.3,5.1-5.1,5.1H7.1C4.3,22.4,2,20.1,2,17.3V6.7C2,3.9,4.3,1.6,7.1,1.6h9.8c2.8,0,5.1,2.3,5.1,5.1V17.3z M9.7,9.7c0-1.2-1-2.2-2.2-2.2s-2.2,1-2.2,2.2v4.6c0,1.2,1,2.2,2.2,2.2s2.2-1,2.2-2.2V9.7z M19,11c0-1.2-1-2.2-2.2-2.2s-2.2,1-2.2,2.2v3.3c0,1.2,1,2.2,2.2,2.2s2.2-1,2.2-2.2V11z M15.6,6.5l-2.6,2.6l-2.6-2.6c-0.4-0.4-1.1-0.4-1.6,0s-0.4,1.1,0,1.6l3.4,3.4c0.4,0.4,1.1,0.4,1.6,0l3.4-3.4c0.4-0.4,0.4-1.1,0-1.6S16,6.1,15.6,6.5z"/></svg></a>
              </div>
            </div>

            <!-- Quick Links -->
            <div class="footer-col">
              <h3 class="footer-title">Liens Rapides</h3>
              <ul class="footer-links">
                <li><a routerLink="/catalogue">Catalogue</a></li>
                <li><a routerLink="/nouveautes">Nouveautés</a></li>
                <li><a routerLink="/promotions">Promotions</a></li>
                <li><a routerLink="/about">À Propos</a></li>
                <li><a href="https://les-tresors-du-maroc.fr/" target="_blank">Blog</a></li>
              </ul>
            </div>

            <!-- Customer Service -->
            <div class="footer-col">
              <h3 class="footer-title">Service Client</h3>
              <ul class="footer-links">
                <li><a routerLink="/contact">Contact</a></li>
                <li><a routerLink="/help">FAQ</a></li>
                <li><a routerLink="/order-tracking">Livraison</a></li>
                <li><a routerLink="/retours">Retours</a></li>
                <li><a href="https://intia.fr/fr/ressources/cgv-conditions-generales-de-ventes/" target="_blank">CGV</a></li>
              </ul>
            </div>

            <!-- Newsletter -->
            <div class="footer-col">
              <h3 class="footer-title">Newsletter</h3>
              <p class="newsletter-text">Inscrivez-vous pour recevoir nos offres exclusives</p>
              <form class="newsletter-form" (ngSubmit)="onNewsletterSubmit()">
                <input 
                  type="email" 
                  placeholder="Votre email"
                  [(ngModel)]="newsletterEmail"
                  name="email"
                  required>
                <button type="submit" class="btn-subscribe">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <line x1="22" y1="2" x2="11" y2="13"/>
                    <polygon points="22 2 15 22 11 13 2 9 22 2"/>
                  </svg>
                </button>
              </form>
              <div class="payment-methods">
                <span class="payment-label">Paiement sécurisé:</span>
                <div class="payment-icons">
                  <span class="payment-icon">💳</span>
                  <span class="payment-icon">🏦</span>
                  <span class="payment-icon">📱</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer Bottom -->
      <div class="footer-bottom">
        <div class="container">
          <div class="footer-bottom-content">
            <p class="copyright">© 2025 AtlasSun. Tous droits réservés.</p>


            <div class="footer-bottom-links">
              <a routerLink="/privacy">Confidentialité</a>
              <span>•</span>
              <a routerLink="/terms">Conditions</a>
              <span>•</span>
              <a routerLink="/cookies">Cookies</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    .footer {
      background: #2A2A2A;
      color: white;
      font-family: 'Poppins', sans-serif;
    }

    .footer-main {
      padding: 60px 0 40px;
    }

    .footer-grid {
      display: grid;
      grid-template-columns: 2fr 1fr 1fr 1.5fr;
      gap: 40px;
    }

    /* Footer Column */
    .footer-col {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    /* Logo */
    .footer-logo {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 10px;
    }

    .logo-img {
      width: 45px;
      height: 45px;
      border-radius: 50%;
      object-fit: cover;
      border: 2px solid #D4A650;
      background: white;
      box-shadow: 0 4px 8px rgba(0,0,0,0.2);
    }

    .brand {
      font-family: 'Cairo', sans-serif;
      font-size: 1.5rem;
      font-weight: 700;
    }

    .footer-description {
      font-size: 0.9rem;
      line-height: 1.6;
      color: rgba(255,255,255,0.7);
      margin: 0;
    }

    /* Social Links */
    .social-links {
      display: flex;
      gap: 10px;
    }

    .social-btn {
      width: 40px;
      height: 40px;
      background: rgba(255,255,255,0.1);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      transition: all 0.3s ease;
    }

    .social-btn:hover {
      background: #D4A650;
      transform: translateY(-3px);
    }

    /* Footer Title */
    .footer-title {
      font-family: 'Cairo', sans-serif;
      font-size: 1.2rem;
      font-weight: 600;
      margin: 0 0 15px;
      color: #D4A650;
    }

    /* Footer Links */
    .footer-links {
      list-style: none;
      padding: 0;
      margin: 0;
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .footer-links a {
      color: rgba(255,255,255,0.7);
      text-decoration: none;
      font-size: 0.9rem;
      transition: all 0.2s;
      display: inline-block;
    }

    .footer-links a:hover {
      color: #D4A650;
      padding-left: 5px;
    }

    /* Newsletter */
    .newsletter-text {
      font-size: 0.9rem;
      color: rgba(255,255,255,0.7);
      margin: 0;
    }

    .newsletter-form {
      display: flex;
      gap: 10px;
    }

    .newsletter-form input {
      flex: 1;
      padding: 12px 16px;
      background: rgba(255,255,255,0.1);
      border: 1px solid rgba(255,255,255,0.2);
      border-radius: 8px;
      color: white;
      font-family: 'Poppins', sans-serif;
      transition: all 0.3s;
    }

    .newsletter-form input::placeholder {
      color: rgba(255,255,255,0.5);
    }

    .newsletter-form input:focus {
      outline: none;
      background: rgba(255,255,255,0.15);
      border-color: #D4A650;
    }

    .btn-subscribe {
      width: 45px;
      height: 45px;
      background: #D4A650;
      border: none;
      border-radius: 8px;
      color: white;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s ease;
    }

    .btn-subscribe:hover {
      background: #C0392B;
      transform: scale(1.05);
    }

    /* Payment Methods */
    .payment-methods {
      margin-top: 10px;
    }

    .payment-label {
      font-size: 0.85rem;
      color: rgba(255,255,255,0.6);
      display: block;
      margin-bottom: 8px;
    }

    .payment-icons {
      display: flex;
      gap: 10px;
    }

    .payment-icon {
      font-size: 1.5rem;
      opacity: 0.7;
      transition: opacity 0.2s;
    }

    .payment-icon:hover {
      opacity: 1;
    }

    /* Footer Bottom */
    .footer-bottom {
      background: #1A1A1A;
      padding: 20px 0;
      border-top: 1px solid rgba(255,255,255,0.1);
    }

    .footer-bottom-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .copyright {
      margin: 0;
      font-size: 0.85rem;
      color: rgba(255,255,255,0.6);
    }

    .footer-bottom-links {
      display: flex;
      gap: 15px;
      align-items: center;
      font-size: 0.85rem;
    }

    .footer-bottom-links a {
      color: rgba(255,255,255,0.6);
      text-decoration: none;
      transition: color 0.2s;
    }

    .footer-bottom-links a:hover {
      color: #D4A650;
    }

    .footer-bottom-links span {
      color: rgba(255,255,255,0.3);
    }

    /* Container */
    .container {
      max-width: 1280px;
      margin: 0 auto;
      padding: 0 20px;
    }

    /* Responsive */
    @media (max-width: 1024px) {
      .footer-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    @media (max-width: 768px) {
      .footer-grid {
        grid-template-columns: 1fr;
        gap: 30px;
      }

      .footer-bottom-content {
        flex-direction: column;
        gap: 15px;
        text-align: center;
      }

      .footer-bottom-links {
        flex-wrap: wrap;
        justify-content: center;
      }
    }
  `]
})
export class FooterComponent {
  newsletterEmail = '';

  constructor(private http: HttpClient) { }

  onNewsletterSubmit() {
    console.log('Newsletter subscription:', this.newsletterEmail);
    // Handle newsletter subscription
    this.newsletterEmail = '';
  }
}
