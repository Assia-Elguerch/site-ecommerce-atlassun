import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="reset-container">
      <div class="card">
        <img src="assets/logo.png" alt="AtlasSun Logo" class="logo">
        <h2>Réinitialisation</h2>
        <p class="desc">Entrez votre nouveau mot de passe pour sécuriser votre compte.</p>
 
        <div class="alert success" *ngIf="successMessage">
          {{ successMessage }}
        </div>
 
        <div class="alert error" *ngIf="errorMessage">
          {{ errorMessage }}
        </div>
 
        <form (ngSubmit)="onSubmit()" *ngIf="!successMessage">
          <div class="form-group">
            <label for="password">Nouveau mot de passe</label>
            <input 
              type="password" 
              id="password" 
              [(ngModel)]="password" 
              name="password" 
              placeholder="Minimum 6 caractères" 
              required>
          </div>
 
          <div class="form-group">
            <label for="confirm">Confirmer le mot de passe</label>
            <input 
              type="password" 
              id="confirm" 
              [(ngModel)]="confirmPassword" 
              name="confirm" 
              placeholder="Répétez le mot de passe" 
              required>
          </div>
 
          <button type="submit" class="btn-submit" [disabled]="loading">
            <span *ngIf="!loading">Mettre à jour le mot de passe</span>
            <span *ngIf="loading">Traitement en cours...</span>
          </button>
        </form>
 
        <div class="footer">
          <a routerLink="/auth/login">Retour à la connexion</a>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .reset-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      overflow: hidden;
      padding: 20px;
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
      box-shadow: 0 40px 100px rgba(0, 0, 0, 0.5);
      position: relative;
      z-index: 10;
      text-align: center;
      animation: glassReveal 1s cubic-bezier(0.34, 1.56, 0.64, 1);
    }
 
    @keyframes glassReveal {
      from { opacity: 0; transform: translateY(40px); }
      to { opacity: 1; transform: translateY(0); }
    }
 
    .logo {
      width: 90px;
      height: 90px;
      border-radius: 50%;
      object-fit: cover;
      margin: 0 auto 20px;
      display: block;
      border: 4px solid rgba(255, 255, 255, 0.4);
      background: white;
    }
 
    h2 {
      font-family: 'Cairo', sans-serif;
      font-size: 26px;
      font-weight: 800;
      color: #FFFFFF;
      margin-bottom: 12px;
    }
 
    .desc {
      color: rgba(255, 255, 255, 0.9);
      margin-bottom: 30px;
      font-size: 14px;
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
    }
 
    input {
      width: 100%;
      padding: 14px 18px;
      border: 2px solid rgba(255, 255, 255, 0.25);
      border-radius: 14px;
      background: rgba(255, 255, 255, 0.12);
      color: #FFFFFF;
      font-size: 15px;
      transition: all 0.4s ease;
 
      &:focus {
        outline: none;
        border-color: #D4A650;
        background: rgba(255, 255, 255, 0.18);
        box-shadow: 0 0 25px rgba(212, 166, 80, 0.4);
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
      transition: all 0.4s;
      box-shadow: 0 8px 25px rgba(212, 166, 80, 0.4);
 
      &:hover:not(:disabled) {
        transform: translateY(-3px);
        box-shadow: 0 12px 35px rgba(212, 166, 80, 0.6);
      }
 
      &:disabled { opacity: 0.7; }
    }
 
    .alert {
      padding: 14px 18px;
      border-radius: 12px;
      margin-bottom: 20px;
      font-size: 14px;
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
    }
  `]
})
export class ResetPasswordComponent implements OnInit {
  token = '';
  password = '';
  confirmPassword = '';
  loading = false;
  successMessage = '';
  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
    this.token = this.route.snapshot.paramMap.get('token') || '';
    if (!this.token) {
      this.errorMessage = 'Token manquant ou invalide.';
    }
  }

  onSubmit() {
    if (!this.password || this.password !== this.confirmPassword) {
      this.errorMessage = 'Les mots de passe ne correspondent pas';
      return;
    }
    if (this.password.length < 6) {
      this.errorMessage = 'Mot de passe trop court (min 6 car.)';
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.authService.resetPassword(this.token, this.password).subscribe({
      next: (res) => {
        this.loading = false;
        this.successMessage = 'Mot de passe réinitialisé ! Redirection...';
        setTimeout(() => this.router.navigate(['/auth/login']), 2000);
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = err.error?.message || 'Erreur lors de la réinitialisation';
      }
    });
  }
}
