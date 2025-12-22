import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="forgot-container">
      <div class="card">
        <img src="assets/logo.png" alt="AtlasSun Logo" class="logo">
        <h2>Mot de passe oublié</h2>
        <p class="desc">Entrez votre email pour recevoir un lien de réinitialisation.</p>

        <div class="alert success" *ngIf="successMessage">
          {{ successMessage }}
          <div *ngIf="debugLink" style="margin-top: 10px; padding-top: 10px; border-top: 1px dashed green;">
             <strong>Mode débug :</strong><br>
             <a [href]="debugLink" style="word-break: break-all; color: #155724; font-weight: bold;">Cliquez ici pour réinitialiser</a>
          </div>
        </div>

        <div class="alert error" *ngIf="errorMessage">
          {{ errorMessage }}
        </div>

        <form (ngSubmit)="onSubmit()" *ngIf="!successMessage">
          <div class="form-group">
            <label for="email">Email</label>
            <input 
              type="email" 
              id="email" 
              [(ngModel)]="email" 
              name="email" 
              placeholder="votre@email.com" 
              required>
          </div>

          <button type="submit" class="btn-submit" [disabled]="loading">
            <span *ngIf="!loading">Envoyer le lien</span>
            <span *ngIf="loading">Envoi en cours...</span>
          </button>
        </form>

        <div class="footer">
          <a routerLink="/auth/login">Retour à la connexion</a>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .forgot-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      overflow: hidden;
      padding: 20px;
      
      /* Background Image */
      background-image: url('/assets/images/page login photo/login_page.png');
      background-size: cover;
      background-position: center;
      
      &::before {
        content: '';
        position: absolute;
        inset: 0;
        background: linear-gradient(135deg, 
                    rgba(26, 76, 139, 0.88) 0%,
                    rgba(42, 92, 155, 0.85) 50%,
                    rgba(212, 166, 80, 0.82) 100%);
        backdrop-filter: blur(3px);
        z-index: 1;
      }
    }

    .card {
      background: rgba(255, 255, 255, 0.12);
      backdrop-filter: blur(25px) saturate(180%);
      border-radius: 28px;
      padding: 45px 35px;
      width: 100%;
      max-width: 450px;
      border: 2px solid rgba(255, 255, 255, 0.25);
      box-shadow: 0 40px 100px rgba(0, 0, 0, 0.5),
                  0 0 0 1px rgba(255, 255, 255, 0.1) inset;
      position: relative;
      z-index: 10;
      text-align: center;
      animation: glassReveal 1s cubic-bezier(0.34, 1.56, 0.64, 1);
    }

    @keyframes glassReveal {
      from {
        opacity: 0;
        transform: translateY(40px) scale(0.95);
        filter: blur(8px);
      }
      to {
        opacity: 1;
        transform: translateY(0) scale(1);
        filter: blur(0);
      }
    }

    .logo {
      width: 90px;
      height: 90px;
      border-radius: 50%;
      object-fit: cover;
      margin: 0 auto 20px;
      display: block;
      border: 4px solid rgba(255, 255, 255, 0.4);
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
      background: white;
      animation: pulse 2s infinite;
    }

    @keyframes pulse {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.05); }
    }

    h2 {
      font-family: 'Cairo', sans-serif;
      font-size: 26px;
      font-weight: 800;
      color: #FFFFFF;
      margin-bottom: 12px;
      text-shadow: 0 2px 15px rgba(0, 0, 0, 0.5);
    }

    .desc {
      color: rgba(255, 255, 255, 0.9);
      margin-bottom: 30px;
      font-size: 14px;
      line-height: 1.6;
      text-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
    }

    .form-group {
      margin-bottom: 25px;
      text-align: left;
    }

    label {
      display: block;
      margin-bottom: 10px;
      font-weight: 700;
      color: rgba(255, 255, 255, 0.95);
      font-size: 14px;
      font-family: 'Cairo', sans-serif;
      text-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
    }

    input {
      width: 100%;
      padding: 14px 18px;
      border: 2px solid rgba(255, 255, 255, 0.25);
      border-radius: 14px;
      background: rgba(255, 255, 255, 0.12);
      backdrop-filter: blur(10px);
      color: #FFFFFF;
      font-size: 15px;
      transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);

      &::placeholder {
        color: rgba(255, 255, 255, 0.5);
      }

      &:focus {
        outline: none;
        border-color: #D4A650;
        background: rgba(255, 255, 255, 0.18);
        box-shadow: 0 0 0 4px rgba(212, 166, 80, 0.25),
                    0 0 25px rgba(212, 166, 80, 0.4);
        transform: translateY(-2px);
      }
    }

    .btn-submit {
      width: 100%;
      padding: 16px;
      background: linear-gradient(135deg, #D4A650 0%, #E5B761 100%);
      color: #1A4C8B;
      border: none;
      border-radius: 14px;
      font-weight: 800;
      font-size: 16px;
      cursor: pointer;
      transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
      box-shadow: 0 8px 25px rgba(212, 166, 80, 0.4);
      text-transform: uppercase;
      letter-spacing: 0.5px;
      position: relative;
      overflow: hidden;

      &::before {
        content: '';
        position: absolute;
        inset: 0;
        background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
        transform: translateX(-100%);
        transition: transform 0.6s;
      }

      &:hover:not(:disabled) {
        transform: translateY(-3px) scale(1.02);
        box-shadow: 0 12px 35px rgba(212, 166, 80, 0.6);
        background: linear-gradient(135deg, #E5B761 0%, #F5C771 100%);

        &::before {
          transform: translateX(100%);
        }
      }

      &:disabled {
        opacity: 0.7;
        cursor: not-allowed;
      }
    }

    .alert {
      padding: 14px 18px;
      border-radius: 12px;
      margin-bottom: 20px;
      font-size: 14px;
      font-weight: 500;
      backdrop-filter: blur(10px);
      animation: slideDown 0.5s ease-out;
    }

    @keyframes slideDown {
      from {
        opacity: 0;
        transform: translateY(-10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .alert.success {
      background: rgba(76, 175, 80, 0.2);
      color: #FFFFFF;
      border: 2px solid rgba(76, 175, 80, 0.4);
    }

    .alert.error {
      background: rgba(244, 67, 54, 0.2);
      color: #FFFFFF;
      border: 2px solid rgba(244, 67, 54, 0.4);
    }

    .footer {
      margin-top: 25px;
      font-size: 14px;
    }

    .footer a {
      color: #D4A650;
      text-decoration: none;
      font-weight: 700;
      text-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
      transition: all 0.3s ease;

      &:hover {
        color: #E5B761;
        text-decoration: underline;
        text-shadow: 0 0 10px rgba(212, 166, 80, 0.6);
      }
    }
  `]
})
export class ForgotPasswordComponent {
  email = '';
  loading = false;
  successMessage = '';
  errorMessage = '';
  debugLink = '';

  constructor(private authService: AuthService) { }

  onSubmit() {
    if (!this.email) return;

    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.authService.forgotPassword(this.email).subscribe({
      next: (res) => {
        this.loading = false;
        this.successMessage = res.message || 'Email envoyé avec succès !';
        if (res.debug_resetLink) {
          this.debugLink = res.debug_resetLink;
        }
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = err.error?.message || 'Erreur lors de l\'envoi';
      }
    });
  }
}
