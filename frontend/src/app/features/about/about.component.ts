import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { FooterComponent } from '../../shared/components/footer/footer.component';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, RouterLink, HeaderComponent, FooterComponent],
  template: `
    <app-header></app-header>
    
    <div class="about-page">
      <!-- Hero Section -->
      <section class="hero-section">
        <div class="hero-overlay"></div>
      </section>

      <div class="container">
        <!-- Mission & Values -->
        <section class="values-section">
          <div class="value-card">
            <div class="icon">🖐️</div>
            <h3>Fait Main</h3>
            <p>Chaque pièce est unique, façonnée avec passion et précision par des maîtres artisans.</p>
          </div>
          <div class="value-card">
            <div class="icon">🌿</div>
            <h3>Durable</h3>
            <p>Nous utilisons des matériaux naturels et écologiques, respectueux de l'environnement.</p>
          </div>
          <div class="value-card">
            <div class="icon">🤝</div>
            <h3>Éthique</h3>
            <p>Nous garantissons une rémunération juste et des conditions de travail dignes pour nos artisans.</p>
          </div>
        </section>

        <!-- Story Section -->
        <section class="story-section">
          <div class="story-content">
            <span class="section-tag">Depuis 2020</span>
            <h2>Notre Voyage</h2>
            <p>
              Née de la passion pour la richesse culturelle du Maroc, AtlasSun a débuté comme un petit projet visant à digitaliser les coopératives locales de l'Atlas.
            </p>
            <p>
              Aujourd'hui, nous sommes fiers de collaborer avec plus de 500 artisans à travers le royaume, de Fès à Marrakech, en passant par les montagnes de l'Atlas. Notre plateforme n'est pas seulement un site e-commerce, c'est un pont culturel.
            </p>
            <div class="stats">
              <div class="stat">
                <strong>500+</strong>
                <span>Artisans</span>
              </div>
              <div class="stat">
                <strong>2000+</strong>
                <span>Produits Uniques</span>
              </div>
              <div class="stat">
                <strong>10k+</strong>
                <span>Clients Heureux</span>
              </div>
            </div>
          </div>
          <div class="story-image">
            <img src="assets/images/about/about.jpg" alt="Notre Voyage" class="story-img">
          </div>
        </section>

        <!-- Artisans Section -->
        <section class="artisans-section">
          <h2>Nos Artisans</h2>
          <p class="section-desc">Les mains d'or derrière nos créations</p>
          
          <div class="artisans-grid">
            <div class="artisan-card">
              <img src="assets/images/Artisants/default-profile.jpg" alt="Ahmed El Idrissi" class="artisan-img">
              <h3>Ahmed El Idrissi</h3>
              <span>Maître Potier - Fès</span>
            </div>
            <div class="artisan-card">
              <img src="assets/images/Artisants/default-profile.jpg" alt="Fatima Oukacha" class="artisan-img">
              <h3>Fatima Oukacha</h3>
              <span>Tisseuse - Moyen Atlas</span>
            </div>
            <div class="artisan-card">
              <img src="assets/images/Artisants/default-profile.jpg" alt="Hassan Amrani" class="artisan-img">
              <h3>Hassan Amrani</h3>
              <span>Maroquinier - Marrakech</span>
            </div>
          </div>
        </section>
      </div>
    </div>

    <app-footer></app-footer>
  `,
  styles: [`
    .about-page {
      background: #FAF7F0;
      padding-bottom: 80px;
    }

    .container {
      max-width: 1280px;
      margin: 0 auto;
      padding: 0 20px;
    }

    /* Hero Section */
    .hero-section {
      height: 45vh;
      min-height: 350px;
      background-image: linear-gradient(rgba(0,0,0,0.2), rgba(0,0,0,0.2)), url("/assets/images/banner/banner_apropos_page.png");
      background-repeat: no-repeat;
      background-position: center center;
      background-size: cover;
      position: relative;
      margin-bottom: 60px;
      animation: kenBurns 20s infinite alternate ease-in-out;
      overflow: hidden;
    }

    @keyframes kenBurns {
      from { transform: scale(1); }
      to { transform: scale(1.1); }
    }

    .hero-content {
      position: relative;
      z-index: 2;
      max-width: 700px;
    }

    .subtitle {
      display: block;
      font-family: 'Poppins', sans-serif;
      font-size: 1rem;
      letter-spacing: 2px;
      text-transform: uppercase;
      margin-bottom: 15px;
      color: #D4A650;
    }

    .hero-content h1 {
      font-family: 'Cairo', sans-serif;
      font-size: 3rem;
      margin: 0 0 20px;
      line-height: 1.2;
    }

    .hero-content p {
      font-size: 1.1rem;
      opacity: 0.9;
    }

    /* Values Section - Animated */
    .values-section {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 30px;
      margin-top: -50px;
      position: relative;
      z-index: 5;
      margin-bottom: 80px;
    }

    .value-card {
      background: white;
      padding: 40px 30px;
      border-radius: 20px;
      text-align: center;
      box-shadow: 0 10px 30px rgba(0,0,0,0.08);
      transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
      animation: bounceInUp 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) both;
      border: 2px solid rgba(212, 166, 80, 0.1);
    }

    .value-card:nth-child(1) { animation-delay: 0s; }
    .value-card:nth-child(2) { animation-delay: 0.2s; }
    .value-card:nth-child(3) { animation-delay: 0.4s; }

    @keyframes bounceInUp {
      0% {
        opacity: 0;
        transform: translateY(100px) scale(0.8);
      }
      60% {
        opacity: 1;
        transform: translateY(-15px) scale(1.05);
      }
      80% {
        transform: translateY(5px) scale(0.98);
      }
      100% {
        transform: translateY(0) scale(1);
      }
    }

    .value-card:hover {
      transform: translateY(-15px) scale(1.03);
      box-shadow: 0 20px 50px rgba(26, 76, 139, 0.15);
      border-color: rgba(212, 166, 80, 0.4);
    }

    .icon {
      font-size: 3.5rem;
      margin-bottom: 20px;
      animation: iconFloat 3s ease-in-out infinite;
      display: inline-block;
    }

    @keyframes iconFloat {
      0%, 100% {
        transform: translateY(0) rotate(0deg);
      }
      50% {
        transform: translateY(-10px) rotate(5deg);
      }
    }

    .value-card h3 {
      font-family: 'Cairo', sans-serif;
      font-size: 1.5rem;
      font-weight: 800;
      background: linear-gradient(135deg, #1A4C8B, #D4A650);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      margin: 0 0 15px;
    }

    .value-card p {
      color: #666;
      line-height: 1.7;
      margin: 0;
      font-size: 1rem;
    }

    /* Story Section */
    .story-section {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 60px;
      align-items: center;
      margin-bottom: 100px;
    }

    .section-tag {
      color: #D4A650;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    .story-content h2 {
      font-family: 'Cairo', sans-serif;
      font-size: 2.5rem;
      color: #2A2A2A;
      margin: 10px 0 30px;
    }

    .story-content p {
      color: #666;
      line-height: 1.8;
      margin-bottom: 20px;
      font-size: 1.05rem;
    }

    .stats {
      display: flex;
      gap: 40px;
      margin-top: 40px;
      padding-top: 30px;
      border-top: 1px solid #E0E0E0;
    }

    .stat strong {
      display: block;
      font-family: 'Cairo', sans-serif;
      font-size: 2rem;
      color: #1A4C8B;
      line-height: 1;
      margin-bottom: 5px;
    }

    .stat span {
      color: #666;
      font-size: 0.9rem;
    }

    .story-image {
      height: 450px;
      border-radius: 20px;
      overflow: hidden;
      background: white;
      box-shadow: 20px 20px 0 #D4A650;
    }

    .story-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
      transition: transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
    }

    .story-image:hover .story-img {
      transform: scale(1.05);
    }

    /* Artisans Section */
    .artisans-section {
      text-align: center;
    }

    .artisans-section h2 {
      font-family: 'Cairo', sans-serif;
      font-size: 2.5rem;
      color: #2A2A2A;
      margin: 0 0 10px;
    }

    .section-desc {
      color: #666;
      margin-bottom: 50px;
    }

    .artisans-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 30px;
    }

    .artisan-card {
      background: white;
      border-radius: 12px;
      padding: 20px;
      box-shadow: 0 5px 15px rgba(0,0,0,0.03);
    }

    .artisan-img {
      width: 100%;
      height: 250px;
      object-fit: cover;
      border-radius: 8px;
      margin-bottom: 20px;
      background: #f0f0f0;
      transition: transform 0.4s ease;
    }

    .artisan-card:hover .artisan-img {
      transform: translateY(-5px);
    }

    .artisan-card h3 {
      font-family: 'Cairo', sans-serif;
      font-size: 1.2rem;
      color: #1A4C8B;
      margin: 0 0 5px;
    }

    .artisan-card span {
      color: #999;
      font-size: 0.9rem;
    }

    /* Responsive */
    @media (max-width: 1024px) {
      .values-section {
        grid-template-columns: 1fr;
        gap: 20px;
      }
      
      .story-section {
        grid-template-columns: 1fr;
      }

      .artisans-grid {
        grid-template-columns: 1fr 1fr;
      }
    }

    @media (max-width: 600px) {
      .artisans-grid {
        grid-template-columns: 1fr;
      }

      .hero-content h1 {
        font-size: 2rem;
      }
    }
  `]
})
export class AboutComponent { }
