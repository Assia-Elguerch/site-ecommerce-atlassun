import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="error-page">
      <div class="glass-container">
        <div class="icon-wrapper">
          <span class="error-icon">🕵️</span>
        </div>
        
        <h1 class="error-code">404</h1>
        <h2 class="title">Page Introuvable</h2>
        <p class="message">
          Désolé, la page que vous recherchez semble n'avoir jamais existé ou a été déplacée.
        </p>
        
        <div class="actions">
          <a routerLink="/home" class="btn-primary">
            Retour à l'accueil
          </a>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .error-page {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
      position: relative;
      overflow: hidden;
    }

    /* Ambient Background Effects (Matches Login) */
    .error-page::before, .error-page::after {
      content: '';
      position: absolute;
      width: 600px;
      height: 600px;
      border-radius: 50%;
      filter: blur(100px);
      z-index: 0;
    }

    .error-page::before {
      background: rgba(26, 76, 139, 0.2);
      top: -200px;
      left: -200px;
    }

    .error-page::after {
      background: rgba(212, 166, 80, 0.15);
      bottom: -200px;
      right: -200px;
    }

    .glass-container {
      background: rgba(255, 255, 255, 0.03);
      backdrop-filter: blur(20px);
      border: 1px solid rgba(255, 255, 255, 0.05);
      padding: 3rem 4rem;
      border-radius: 24px;
      text-align: center;
      max-width: 500px;
      width: 90%;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
      position: relative;
      z-index: 1;
      animation: fadeInUp 0.8s ease-out;
    }

    .icon-wrapper {
      width: 80px;
      height: 80px;
      background: rgba(59, 130, 246, 0.1); /* Blue for Info/404 */
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 2rem;
      border: 1px solid rgba(59, 130, 246, 0.2);
    }

    .error-icon {
      font-size: 2.5rem;
    }

    .error-code {
      font-size: 6rem;
      font-weight: 800;
      line-height: 1;
      margin: 0;
      background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      font-family: 'Cairo', sans-serif;
    }

    .title {
      font-size: 2rem;
      color: white;
      margin: 0.5rem 0 1.5rem;
      font-family: 'Cairo', sans-serif;
      font-weight: 700;
    }

    .message {
      color: #94a3b8;
      font-size: 1.1rem;
      line-height: 1.6;
      margin-bottom: 2.5rem;
    }

    .btn-primary {
      display: inline-block;
      padding: 16px 40px;
      background: linear-gradient(90deg, #1A4C8B 0%, #2a62a9 100%);
      color: white;
      text-decoration: none;
      border-radius: 12px;
      font-weight: 600;
      transition: all 0.3s ease;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    }

    .btn-primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 10px 15px -3px rgba(26, 76, 139, 0.4);
      background: linear-gradient(90deg, #2a62a9 0%, #1A4C8B 100%);
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
  `]
})
export class NotFoundComponent { }
