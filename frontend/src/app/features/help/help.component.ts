import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { FooterComponent } from '../../shared/components/footer/footer.component';

interface FAQItem {
  question: string;
  answer: string;
  isOpen?: boolean;
}

interface FAQCategory {
  title: string;
  icon: string;
  svgIcon: string;
  items: FAQItem[];
}

@Component({
  selector: 'app-help',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent, FooterComponent],
  template: `
    <app-header></app-header>

    <div class="help-page">
      <div class="container slide-up">
        <!-- Premium Header -->
        <div class="premium-header">
          <div class="header-content">
            <h1 class="premium-title">Centre d'Aide AtlasSun 🏺</h1>
            <p class="premium-subtitle">Comment pouvons-nous vous aider aujourd'hui ? Recherchez une réponse ou parcourez nos catégories.</p>
          </div>
          
          <div class="search-box-wrapper">
            <div class="premium-search">
              <span class="search-icon">🔍</span>
              <input 
                type="text" 
                [(ngModel)]="searchQuery" 
                (input)="filterFAQ()" 
                placeholder="Ex: Suivi de ma livraison..."
              >
            </div>
          </div>
          <div class="header-decoration"></div>
        </div>

        <div class="faq-layout">
          <!-- Sidebar -->
          <aside class="categories-sidebar">
            <div class="premium-card sidebar-card">
              <h3 class="sidebar-title">Catégories d'aide</h3>
              <nav class="cat-nav">
                <button 
                  *ngFor="let cat of filteredData" 
                  (click)="scrollToCategory(cat.title)"
                  class="cat-link"
                >
                  <span class="cat-emoji">{{ cat.icon }}</span>
                  <span class="cat-text">{{ cat.title }}</span>
                  <span class="cat-count">{{ cat.items.length }}</span>
                </button>
              </nav>
            </div>
          </aside>

          <!-- Content -->
          <main class="faq-sections">
            <div *ngIf="filteredData.length === 0" class="no-results premium-card">
              <div class="no-results-icon">🤷‍♂️</div>
              <h3>Aucune réponse trouvée pour votre recherche</h3>
              <p>Essayez de simplifier vos mots-clés ou consultez les catégories à gauche.</p>
              <button (click)="resetSearch()" class="btn-reset">Réinitialiser la recherche</button>
            </div>

            <div *ngFor="let cat of filteredData" [id]="cat.title" class="category-block">
              <div class="category-header">
                <span class="category-emoji">{{ cat.icon }}</span>
                <h2 class="category-title">{{ cat.title }}</h2>
              </div>
              
              <div class="accordion">
                <div 
                  *ngFor="let item of cat.items" 
                  class="accordion-item premium-card"
                  [class.active]="item.isOpen"
                >
                  <button class="accordion-header" (click)="toggleItem(item)">
                    <span class="q-text">{{ item.question }}</span>
                    <span class="chevron" [class.rotated]="item.isOpen">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path d="M6 9l6 6 6-6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      </svg>
                    </span>
                  </button>
                  <div class="accordion-content" [style.max-height]="item.isOpen ? '500px' : '0'">
                    <div class="content-inner">
                      {{ item.answer }}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Support Card - PREMIUM REDESIGNED -->
            <div class="support-cta">
              <div class="cta-glass-effect"></div>
              <div class="cta-decoration"></div>
              <div class="cta-content">
                <h3>Toujours besoin d'assistance ? 🤝</h3>
                <p>Nos conseillers sont disponibles pour répondre à toutes vos interrogations spécifiques.</p>
              </div>
              <div class="cta-actions">
                <a href="/contact" class="btn-cta-premium">Nous contacter</a>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>

    <app-footer></app-footer>
  `,
  styles: [`
    .help-page {
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

    /* Premium Header */
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
      display: flex;
      flex-direction: column;
      gap: 30px;
    }

    .header-content {
      position: relative;
      z-index: 2;
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
      max-width: 600px;
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
      z-index: 1;
    }

    @keyframes float {
      0%, 100% { transform: translate(0, 0) rotate(0deg); }
      50% { transform: translate(-30px, 20px) rotate(180deg); }
    }

    /* Search Box */
    .search-box-wrapper {
      position: relative;
      z-index: 2;
      max-width: 500px;
    }

    .premium-search {
      display: flex;
      align-items: center;
      background: rgba(255, 255, 255, 0.15);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.3);
      border-radius: 18px;
      padding: 12px 20px;
      transition: all 0.3s ease;
    }

    .premium-search:focus-within {
      background: white;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
    }

    .premium-search input {
      background: none;
      border: none;
      color: white;
      padding: 8px 12px;
      width: 100%;
      font-size: 1rem;
      font-family: 'Poppins', sans-serif;
      outline: none;
    }

    .premium-search:focus-within input {
      color: #1a4c8b;
    }

    .premium-search input::placeholder {
      color: rgba(255, 255, 255, 0.7);
    }

    .premium-search:focus-within input::placeholder {
      color: #94a3b8;
    }

    /* Layout */
    .faq-layout {
      display: grid;
      grid-template-columns: 350px 1fr;
      gap: 40px;
    }

    /* Premium Card Base */
    .premium-card {
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(20px);
      border-radius: 28px;
      border: 1px solid rgba(26, 76, 139, 0.1);
      box-shadow: 0 15px 40px rgba(0, 0, 0, 0.04),
                  0 0 0 1px rgba(255, 255, 255, 0.8) inset;
      transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    }

    /* Sidebar */
    .categories-sidebar {
      position: sticky;
      top: 100px;
      height: fit-content;
    }

    .sidebar-card {
      padding: 35px;
    }

    .sidebar-title {
      font-family: 'Cairo', sans-serif;
      font-size: 1.4rem;
      font-weight: 800;
      background: linear-gradient(135deg, #1A4C8B, #D4A650);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      margin-bottom: 25px;
    }

    .cat-nav {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .cat-link {
      display: flex;
      align-items: center;
      gap: 15px;
      padding: 15px 20px;
      background: #f8fafc;
      border: 1px solid #edf2f7;
      border-radius: 20px;
      cursor: pointer;
      transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      width: 100%;
    }

    .cat-link:hover {
      transform: translateX(8px);
      background: white;
      border-color: #D4A650;
      box-shadow: 0 10px 20px rgba(212, 166, 80, 0.1);
    }

    .cat-emoji { font-size: 1.5rem; }
    .cat-text {
      font-family: 'Cairo', sans-serif;
      font-weight: 700;
      color: #1e293b;
      flex: 1;
      text-align: left;
    }
    .cat-count {
      font-size: 0.85rem;
      background: #1a4c8b;
      color: white;
      padding: 2px 10px;
      border-radius: 10px;
      font-weight: 700;
    }

    /* Content Area */
    .category-block {
      margin-bottom: 50px;
    }

    .category-header {
      display: flex;
      align-items: center;
      gap: 20px;
      margin-bottom: 25px;
    }

    .category-emoji {
      width: 60px;
      height: 60px;
      background: linear-gradient(135deg, rgba(26, 76, 139, 0.1), rgba(212, 166, 80, 0.15));
      border-radius: 18px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.8rem;
    }

    .category-title {
      font-family: 'Cairo', sans-serif;
      font-size: 1.8rem;
      font-weight: 800;
      color: #1e293b;
    }

    /* Accordion */
    .accordion-item {
      margin-bottom: 15px;
      overflow: hidden;
    }

    .accordion-item:hover {
      transform: translateY(-4px);
      border-color: rgba(212, 166, 80, 0.3);
    }

    .accordion-item.active {
      border-color: #D4A650;
      box-shadow: 0 15px 35px rgba(212, 166, 80, 0.15);
    }

    .accordion-header {
      width: 100%;
      padding: 25px 35px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      background: none;
      border: none;
      cursor: pointer;
      text-align: left;
    }

    .q-text {
      font-family: 'Cairo', sans-serif;
      font-weight: 700;
      color: #1e293b;
      font-size: 1.1rem;
    }

    .chevron {
      color: #94a3b8;
      transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    }

    .accordion-item.active .chevron {
      transform: rotate(180deg);
      color: #D4A650;
    }

    .content-inner {
      padding: 0 35px 30px;
      color: #64748b;
      line-height: 1.8;
      font-size: 1rem;
    }

    /* Support CTA - PREMIUM REDESIGNED */
    .support-cta {
      position: relative;
      margin-top: 80px;
      padding: 60px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: linear-gradient(135deg, #1A4C8B 0%, #2A5C9B 50%, #D4A650 100%);
      color: white;
      border-radius: 35px;
      overflow: hidden;
      box-shadow: 0 25px 60px rgba(26, 76, 139, 0.3),
                  0 0 0 1px rgba(255, 255, 255, 0.1) inset;
      transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
    }

    .support-cta:hover {
      transform: translateY(-5px);
      box-shadow: 0 35px 80px rgba(26, 76, 139, 0.4),
                  0 0 0 1px rgba(255, 255, 255, 0.2) inset;
    }

    .cta-glass-effect {
      position: absolute;
      inset: 0;
      background: linear-gradient(135deg, rgba(255, 255, 255, 0.1), transparent);
      backdrop-filter: blur(5px);
      pointer-events: none;
      z-index: 1;
    }

    .cta-decoration {
      position: absolute;
      top: -100%;
      right: -10%;
      width: 400px;
      height: 400px;
      background: linear-gradient(135deg, rgba(212, 166, 80, 0.4), rgba(42, 92, 155, 0.3));
      border-radius: 50%;
      filter: blur(80px);
      animation: float 8s ease-in-out infinite;
      z-index: 1;
    }

    .cta-content {
      position: relative;
      z-index: 2;
    }

    .cta-content h3 {
      font-family: 'Cairo', sans-serif;
      font-size: 1.8rem;
      font-weight: 800;
      margin-bottom: 12px;
      color: white;
    }

    .cta-content p {
      color: rgba(255, 255, 255, 0.95);
      max-width: 480px;
      font-size: 1.05rem;
    }

    .cta-actions {
      position: relative;
      z-index: 2;
    }

    .btn-cta-premium {
      display: inline-block;
      padding: 18px 40px;
      background: #D4A650;
      color: white;
      text-decoration: none;
      font-family: 'Cairo', sans-serif;
      font-weight: 800;
      border-radius: 20px;
      transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
      box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
      font-size: 1.1rem;
    }

    .btn-cta-premium:hover {
      background: white;
      color: #1a4c8b;
      transform: translateY(-5px);
      box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2);
    }

    @keyframes slideUp {
      from { transform: translateY(30px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }

    @media (max-width: 1000px) {
      .faq-layout { grid-template-columns: 1fr; }
      .categories-sidebar { display: none; }
      .support-cta { flex-direction: column; text-align: center; gap: 30px; padding: 40px; }
      .btn-cta-premium { width: 100%; }
    }
  `]
})
export class HelpComponent {
  searchQuery: string = '';
  filteredData: FAQCategory[] = [];

  faqData: FAQCategory[] = [
    {
      title: 'Commandes & Paiement',
      icon: '🛍️',
      svgIcon: '',
      items: [
        {
          question: 'Comment suivre ma commande ?',
          answer: 'Dès que votre commande est expédiée, vous recevez un e-mail avec un numéro de suivi. Vous pouvez également consulter l\'état de votre commande directement dans votre espace client, rubrique "Mes Commandes".'
        },
        {
          question: 'Quels sont les modes de paiement acceptés ?',
          answer: 'Nous acceptons les cartes bancaires (Visa, Mastercard, CMI), les virements bancaires et le paiement à la livraison partout au Maroc.'
        },
        {
          question: 'Puis-je modifier ou annuler ma commande ?',
          answer: 'Il est possible de modifier ou annuler votre commande dans l\'heure suivant votre achat. Contactez-nous rapidement via notre chat ou par téléphone.'
        }
      ]
    },
    {
      title: 'Livraison',
      icon: '🚚',
      svgIcon: '',
      items: [
        {
          question: 'Quels sont les délais de livraison ?',
          answer: 'Comptez 2 à 3 jours ouvrés pour les grandes villes (Casablanca, Rabat, Marrakech) et 3 à 5 jours pour le reste du Maroc. Pour l\'international, les délais varient entre 7 et 12 jours.'
        },
        {
          question: 'Combien coûte la livraison ?',
          answer: 'La livraison est GRATUITE dès 500 DH d\'achat au Maroc. Pour les commandes inférieures, le tarif fixe est de 30 DH.'
        },
        {
          question: 'Où livrez-vous ?',
          answer: 'Nous livrons dans toutes les villes du Royaume du Maroc et proposons également une expédition internationale vers l\'Europe et l\'Amérique du Nord.'
        }
      ]
    },
    {
      title: 'Retours & Remboursements',
      icon: '🔄',
      svgIcon: '',
      items: [
        {
          question: 'Quelle est votre politique de retour ?',
          answer: 'Vous disposez de 14 jours après réception de votre colis pour nous retourner un article s\'il ne vous convient pas. L\'article doit être dans son état d\'origine.'
        },
        {
          question: 'Comment effectuer un retour ?',
          answer: 'Contactez notre service client pour obtenir un bon de retour. Vous pourrez ensuite déposer votre colis dans l\'un de nos points relais partenaires.'
        },
        {
          question: 'Quand serai-je remboursé ?',
          answer: 'Le remboursement est effectué sous 5 à 7 jours ouvrés après réception et vérification de votre retour. Il sera crédité sur le mode de paiement utilisé lors de l\'achat.'
        }
      ]
    },
    {
      title: 'Mon Compte',
      icon: '👤',
      svgIcon: '',
      items: [
        {
          question: 'J\'ai oublié mon mot de passe. Que faire ?',
          answer: 'Cliquez sur "Mot de passe oublié" sur la page de connexion. Un e-mail de réinitialisation vous sera envoyé instantanément.'
        },
        {
          question: 'Comment modifier mes informations personnelles ?',
          answer: 'Rendez-vous dans la rubrique "Mon Profil" pour mettre à jour votre adresse, votre numéro de téléphone ou vos préférences de communication.'
        }
      ]
    }
  ];

  constructor() {
    this.filteredData = [...this.faqData];
  }

  filterFAQ() {
    if (!this.searchQuery.trim()) {
      this.filteredData = [...this.faqData];
      return;
    }

    const query = this.searchQuery.toLowerCase();
    this.filteredData = this.faqData.map(cat => ({
      ...cat,
      items: cat.items.filter(item =>
        item.question.toLowerCase().includes(query) ||
        item.answer.toLowerCase().includes(query)
      )
    })).filter(cat => cat.items.length > 0);
  }

  resetSearch() {
    this.searchQuery = '';
    this.filterFAQ();
  }

  toggleItem(item: FAQItem) {
    item.isOpen = !item.isOpen;
  }

  scrollToCategory(id: string) {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
}
