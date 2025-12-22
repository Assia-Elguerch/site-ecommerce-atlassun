import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-unauthorized',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="error-page">
      <div class="glass-container">
        <div class="icon-wrapper">
          <span class="lock-icon">🔒</span>
        </div>
        
        <h1 class="title">Accès Restreint</h1>
        <p class="message">
          Cette zone est réservée. Veuillez vous connecter avec un compte autorisé pour continuer.
        </p>
        
        <div class="actions">
          <a routerLink="/auth/login" class="btn-primary">
            Se Connecter
          </a>
          <a routerLink="/home" class="btn-secondary">
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
      background: rgba(220, 38, 38, 0.15); /* Red hint for unauthorized */
      top: -200px;
      left: -200px;
    }

    .error-page::after {
      background: rgba(212, 166, 80, 0.1);
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
      max-width: 480px;
      width: 90%;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
      position: relative;
      z-index: 1;
      animation: fadeInUp 0.8s ease-out;
    }

    .icon-wrapper {
      width: 80px;
      height: 80px;
      background: rgba(220, 38, 38, 0.1);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 2rem;
      border: 1px solid rgba(220, 38, 38, 0.2);
    }

    .lock-icon {
      font-size: 2.5rem;
    }

    .title {
      font-size: 2rem;
      color: white;
      margin-bottom: 1rem;
      font-family: 'Cairo', sans-serif;
      font-weight: 700;
    }

    .message {
      color: #94a3b8;
      font-size: 1.1rem;
      line-height: 1.6;
      margin-bottom: 2.5rem;
    }

    .actions {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .btn-primary {
      padding: 16px 30px;
      background: linear-gradient(90deg, #dc2626 0%, #b91c1c 100%);
      color: white;
      text-decoration: none;
      border-radius: 12px;
      font-weight: 600;
      transition: all 0.3s ease;
    }

    .btn-primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 10px 20px -5px rgba(220, 38, 38, 0.4);
    }

    .btn-secondary {
      padding: 16px 30px;
      background: transparent;
      color: #94a3b8;
      text-decoration: none;
      font-weight: 500;
      transition: all 0.3s;
      border: 1px solid rgba(255,255,255,0.1);
      border-radius: 12px;
    }

    .btn-secondary:hover {
      background: rgba(255,255,255,0.05);
      color: white;
    }

    @keyframes fadeInUp {
      from { transform: translateY(20px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }
  `]
})
export class UnauthorizedComponent { }
