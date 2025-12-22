import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="register-container">
      <!-- Animated Background -->
      <div class="animated-bg">
        <div class="circle circle-1"></div>
        <div class="circle circle-2"></div>
        <div class="circle circle-3"></div>
      </div>

      <!-- Register Card -->
      <div class="register-card">
        <!-- Logo & Title -->
        <div class="register-header">
          <img src="assets/logo.png" alt="AtlasSun Logo" class="logo-img">
          <h1 class="brand-name">
              {{ showTwoFactorStep ? 'Sécurisation' : 'Créer un compte' }}
          </h1>
          <p class="tagline">
              {{ showTwoFactorStep ? 'Configurez votre A2F' : 'Rejoignez AtlasSun aujourd\\'hui' }}
          </p>
        </div>

        <!-- Alert Message -->
        <div class="alert" *ngIf="errorMessage" [class.error]="true">
          {{ errorMessage }}
        </div>
        <div class="alert success" *ngIf="successMessage">
          {{ successMessage }}
        </div>

        <!-- STEP 1: Register Form -->
        <form class="register-form" (ngSubmit)="onRegister()" *ngIf="!showTwoFactorStep">
          <div class="form-row">
            <div class="form-group">
              <label for="firstName">Prénom *</label>
              <input 
                type="text" 
                id="firstName" 
                [(ngModel)]="formData.firstName" 
                name="firstName"
                placeholder="Votre prénom"
                required>
            </div>

            <div class="form-group">
              <label for="lastName">Nom *</label>
              <input 
                type="text" 
                id="lastName" 
                [(ngModel)]="formData.lastName"
                name="lastName"
                placeholder="Votre nom"
                required>
            </div>
          </div>

          <div class="form-group">
            <label for="email">Email *</label>
            <input 
              type="email" 
              id="email" 
              [(ngModel)]="formData.email" 
              name="email"
              placeholder="votre@email.com"
              required>
          </div>

          <div class="form-group">
            <label for="phone">Téléphone (optionnel)</label>
            <input 
              type="tel" 
              id="phone" 
              [(ngModel)]="formData.phone"
              name="phone"
              placeholder="+212 6XX-XXXXXX">
          </div>

          <div class="form-group">
            <label for="password">Mot de passe *</label>
            <div class="password-input">
              <input 
                [type]="showPassword ? 'text' : 'password'" 
                id="password" 
                [(ngModel)]="formData.password"
                name="password"
                placeholder="Minimum 8 caractères"
                required>
              <button type="button" class="toggle-password" (click)="showPassword = !showPassword">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path *ngIf="!showPassword" d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                  <circle *ngIf="!showPassword" cx="12" cy="12" r="3"/>
                  <path *ngIf="showPassword" d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                  <line *ngIf="showPassword" x1="1" y1="1" x2="23" y2="23"/>
                </svg>
              </button>
            </div>
            <div class="password-strength" [class]="passwordStrength">
              <div class="strength-bar"></div>
              <span class="strength-text">{{ passwordStrengthText }}</span>
            </div>
          </div>

          <div class="form-group">
            <label for="confirmPassword">Confirmer le mot de passe *</label>
            <input 
              type="password" 
              id="confirmPassword" 
              [(ngModel)]="formData.confirmPassword"
              name="confirmPassword"
              placeholder="Répétez votre mot de passe"
              required>
          </div>

          <div class="form-group checkbox-group">
            <label class="checkbox-label">
              <input type="checkbox" [(ngModel)]="formData.acceptTerms" name="acceptTerms" required>
              <span>J'accepte les <a routerLink="/terms">Conditions Générales</a> et la <a routerLink="/privacy">Politique de Confidentialité</a></span>
            </label>
          </div>

          <div class="form-group checkbox-group">
            <label class="checkbox-label">
              <input type="checkbox" [(ngModel)]="formData.newsletter" name="newsletter">
              <span>Je souhaite recevoir les offres et nouveautés par email</span>
            </label>
          </div>

          <button type="submit" class="btn-register" [disabled]="loading">
            <span *ngIf="!loading">Suivant (Configuration sécurité)</span>
            <span *ngIf="loading">
              <svg class="spinner" width="20" height="20" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none" opacity="0.25"/>
                <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" stroke-width="4" fill="none"/>
              </svg>
              Traitement...
            </span>
          </button>
        </form>

        <!-- STEP 2: 2FA QR Code & Verification -->
        <div class="two-factor-step" *ngIf="showTwoFactorStep">
            <div class="qr-container">
                <p class="instruction">
                    1. Installez Google Authenticator ou Authy sur votre téléphone.<br>
                    2. Scannez le QR code ci-dessous.<br>
                    3. Entrez le code à 6 chiffres généré.
                </p>
                <div class="qr-code-wrapper" *ngIf="qrCodeUrl">
                    <img [src]="qrCodeUrl" alt="QR Code 2FA">
                </div>
            </div>

            <div class="form-group">
                <label for="otpCode">Code de vérification</label>
                <input 
                    type="text" 
                    id="otpCode" 
                    [(ngModel)]="otpCode" 
                    name="otpCode"
                    placeholder="Ex: 123456"
                    maxlength="6"
                    class="otp-input"
                    (keyup.enter)="onVerifyOtp()">
            </div>

            <button type="button" class="btn-register" (click)="onVerifyOtp()" [disabled]="loading">
                <span *ngIf="!loading">Vérifier et Finaliser</span>
                <span *ngIf="loading">Vérification...</span>
            </button>
        </div>

        <!-- Footer -->
        <div class="register-footer" *ngIf="!showTwoFactorStep">
          <p>Déjà un compte ? <a routerLink="/auth/login">Se connecter</a></p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .register-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      overflow: hidden;
      padding: 40px 20px;
      
      /* Background Image - Same as Login */
      background-image: url('/assets/images/page login photo/login_page.png');
      background-size: cover;
      background-position: center;
      background-repeat: no-repeat;
      
      /* Dark Overlay Gradient */
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

    /* Particles - Same as Login */
    .animated-bg {
      position: absolute;
      width: 100%;
      height: 100%;
      overflow: hidden;
      z-index: 3;
      pointer-events: none;
    }

    .circle {
      position: absolute;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.08);
      box-shadow: 0 0 30px rgba(212, 166, 80, 0.3);
      animation: float 20s infinite ease-in-out;
    }

    .circle-1 {
      width: 300px;
      height: 300px;
      top: -150px;
      right: -150px;
    }

    .circle-2 {
      width: 200px;
      height: 200px;
      bottom: -100px;
      left: -100px;
      animation-delay: 1.5s;
    }

    .circle-3 {
      width: 150px;
      height: 150px;
      top: 50%;
      right: 20%;
      animation-delay: 3s;
    }

    @keyframes float {
      0%, 100% {
        transform: translate(0, 0) rotate(0deg) scale(1);
      }
      25% {
        transform: translate(30px, -30px) rotate(90deg) scale(1.1);
      }
      50% {
        transform: translate(-20px, 20px) rotate(180deg) scale(0.9);
      }
      75% {
        transform: translate(40px, 15px) rotate(270deg) scale(1.05);
      }
    }

    /* Glassmorphism Card - Same as Login */
    .register-card {
      background: rgba(255, 255, 255, 0.12);
      backdrop-filter: blur(25px) saturate(180%);
      -webkit-backdrop-filter: blur(25px) saturate(180%);
      border-radius: 32px;
      padding: 45px 40px;
      max-width: 550px;
      width: 100%;
      border: 2px solid rgba(255, 255, 255, 0.25);
      box-shadow: 0 40px 100px rgba(0, 0, 0, 0.5),
                  0 0 0 1px rgba(255, 255, 255, 0.1) inset,
                  0 0 80px rgba(212, 166, 80, 0.15);
      position: relative;
      z-index: 10;
      animation: glassReveal 1.2s cubic-bezier(0.34, 1.56, 0.64, 1);
    }

    @keyframes glassReveal {
      from {
        opacity: 0;
        transform: translateY(50px) scale(0.9);
        filter: blur(10px);
      }
      to {
        opacity: 1;
        transform: translateY(0) scale(1);
        filter: blur(0);
      }
    }

    .register-header {
      text-align: center;
      margin-bottom: 30px;
    }

    .logo-img {
      width: 90px;
      height: 90px;
      border-radius: 50%;
      object-fit: cover;
      margin: 0 auto 15px;
      display: block;
      border: 3px solid white;
      box-shadow: 0 8px 20px rgba(0,0,0,0.15);
      background: white;
    }

    .brand-name {
      font-family: 'Cairo', sans-serif;
      font-size: 28px;
      font-weight: 700;
      color: #1A4C8B;
      margin: 0;
    }

    .tagline {
      font-family: 'Poppins', sans-serif;
      font-size: 14px;
      color: #666;
      margin: 5px 0 0;
    }

    .alert {
      padding: 12px 16px;
      border-radius: 8px;
      margin-bottom: 20px;
      font-size: 14px;
    }

    .alert.error {
      background: #FEE;
      color: #C0392B;
      border: 1px solid #C0392B;
    }

    .alert.success {
      background: #DFF0D8;
      color: #27AE60;
      border: 1px solid #27AE60;
    }

    .register-form {
      margin-bottom: 25px;
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 15px;
    }

    .form-group {
      margin-bottom: 20px;
    }

    .form-group label {
      display: block;
      font-family: 'Cairo', sans-serif;
      font-size: 14px;
      font-weight: 600;
      color: #2A2A2A;
      margin-bottom: 8px;
    }

    .form-group input {
      width: 100%;
      padding: 12px 16px;
      font-family: 'Poppins', sans-serif;
      font-size: 15px;
      color: #2A2A2A;
      background: white;
      border: 2px solid #C8C2B5;
      border-radius: 10px;
      transition: all 0.3s ease;
    }

    .form-group input:focus {
      outline: none;
      border-color: #1A4C8B;
      box-shadow: 0 0 0 4px rgba(26, 76, 139, 0.1);
    }

    .password-input {
      position: relative;
    }

    .password-input input {
      padding-right: 45px;
    }

    .toggle-password {
      position: absolute;
      right: 12px;
      top: 50%;
      transform: translateY(-50%);
      background: none;
      border: none;
      cursor: pointer;
      color: #999;
      padding: 5px;
      display: flex;
      align-items: center;
    }

    .toggle-password:hover {
      color: #1A4C8B;
    }

    .password-strength {
      margin-top: 8px;
    }

    .strength-bar {
      height: 4px;
      background: #E0E0E0;
      border-radius: 2px;
      overflow: hidden;
      margin-bottom: 5px;
      position: relative;
    }

    .strength-bar::after {
      content: '';
      position: absolute;
      left: 0;
      top: 0;
      height: 100%;
      border-radius: 2px;
      transition: all 0.3s;
    }

    .password-strength.weak .strength-bar::after {
      width: 33%;
      background: #E74C3C;
    }

    .password-strength.medium .strength-bar::after {
      width: 66%;
      background: #F39C12;
    }

    .password-strength.strong .strength-bar::after {
      width: 100%;
      background: #27AE60;
    }

    .strength-text {
      font-size: 12px;
      font-weight: 500;
    }

    .password-strength.weak .strength-text {
      color: #E74C3C;
    }

    .password-strength.medium .strength-text {
      color: #F39C12;
    }

    .password-strength.strong .strength-text {
      color: #27AE60;
    }

    .checkbox-group {
      margin-bottom: 15px;
    }

    .checkbox-label {
      display: flex;
      align-items: flex-start;
      gap: 10px;
      cursor: pointer;
      font-size: 13px;
      color: #666;
    }

    .checkbox-label input[type="checkbox"] {
      width: 18px;
      height: 18px;
      cursor: pointer;
      flex-shrink: 0;
      margin-top: 2px;
    }

    .checkbox-label a {
      color: #1A4C8B;
      text-decoration: none;
      font-weight: 600;
    }

    .checkbox-label a:hover {
      text-decoration: underline;
    }

    .btn-register {
      width: 100%;
      padding: 16px;
      background: linear-gradient(135deg, #C0392B, #D4392B);
      color: white;
      border: none;
      border-radius: 12px;
      font-family: 'Cairo', sans-serif;
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      box-shadow: 0 4px 15px rgba(192, 57, 43, 0.3);
    }

    .btn-register:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(192, 57, 43, 0.4);
    }

    .btn-register:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .spinner {
      animation: spin 1s linear infinite;
      display: inline-block;
      margin-right: 8px;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    .register-footer {
      text-align: center;
      font-size: 14px;
      color: #666;
    }

    .register-footer a {
      color: #C0392B;
      font-weight: 600;
      text-decoration: none;
    }

    .register-footer a:hover {
      text-decoration: underline;
    }

    /* 2FA Styles */
    .two-factor-step {
        animation: slideIn 0.5s ease-out;
        text-align: center;
    }

    .qr-container {
        margin: 20px 0;
        padding: 25px;
        background: #f9f9f9;
        border-radius: 12px;
        border: 1px solid #ddd;
        text-align: center;
    }

    .instruction {
        font-size: 14px;
        color: #555;
        margin-bottom: 20px;
        line-height: 1.6;
        text-align: center;
    }

    .qr-code-wrapper {
        display: inline-block;
        padding: 15px;
        background: white;
        border-radius: 16px;
        box-shadow: 0 8px 25px rgba(0,0,0,0.1);
        margin: 10px auto 25px;
    }

    .qr-code-wrapper img {
        width: 200px;
        height: 200px;
        display: block;
    }

    .otp-input {
        text-align: center;
        letter-spacing: 5px;
        font-size: 24px !important;
        font-weight: bold;
    }

    @media (max-width: 600px) {
      .register-card {
        padding: 30px 25px;
      }

      .form-row {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class RegisterComponent {
  loading = false;
  showPassword = false;
  errorMessage = '';
  successMessage = '';

  // 2FA State
  showTwoFactorStep = false;
  qrCodeUrl = '';
  otpCode = '';

  formData = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false,
    newsletter: false
  };

  constructor(
    private router: Router,
    private authService: AuthService
  ) { }

  get passwordStrength(): string {
    const password = this.formData.password;
    if (password.length < 6) return 'weak';
    if (password.length < 10 || !/[A-Z]/.test(password) || !/[0-9]/.test(password)) return 'medium';
    return 'strong';
  }

  get passwordStrengthText(): string {
    switch (this.passwordStrength) {
      case 'weak': return 'Faible';
      case 'medium': return 'Moyen';
      case 'strong': return 'Fort';
      default: return '';
    }
  }

  onRegister() {
    this.errorMessage = '';
    this.successMessage = '';

    // Validation
    if (!this.formData.acceptTerms) {
      this.errorMessage = 'Vous devez accepter les conditions générales';
      return;
    }

    if (this.formData.password !== this.formData.confirmPassword) {
      this.errorMessage = 'Les mots de passe ne correspondent pas';
      return;
    }

    if (this.formData.password.length < 6) {
      this.errorMessage = 'Le mot de passe doit contenir au moins 6 caractères';
      return;
    }

    this.loading = true;

    // Appel API d'inscription
    const registerData = {
      nom: this.formData.lastName,
      prenom: this.formData.firstName,
      email: this.formData.email,
      motDePasse: this.formData.password,
      telephone: this.formData.phone
    };

    this.authService.inscription(registerData).subscribe({
      next: (response) => {
        this.loading = false;

        if (response.qrCodeUrl) {
          // Afficher l'étape 2FA
          this.showTwoFactorStep = true;
          this.qrCodeUrl = response.qrCodeUrl;
          this.successMessage = 'Compte pré-créé ! Veuillez scanner le QR code pour sécuriser votre compte.';
        } else {
          // Fallback si pas de 2FA (legacy)
          this.successMessage = 'Compte créé avec succès ! Redirection...';
          setTimeout(() => {
            this.router.navigate(['/home']);
          }, 1500);
        }
      },
      error: (error) => {
        this.loading = false;
        this.errorMessage = error.error?.message || 'Erreur lors de la création du compte';
        console.error('Registration error:', error);
      }
    });
  }

  onVerifyOtp() {
    if (!this.otpCode || this.otpCode.length < 6) {
      this.errorMessage = 'Veuillez entrer un code valide à 6 chiffres';
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    this.authService.verify2Fa(this.formData.email, this.otpCode, true).subscribe({
      next: () => {
        this.loading = false;
        this.successMessage = 'Compte vérifié et sécurisé ! Bienvenue.';
        setTimeout(() => {
          this.router.navigate(['/home']);
        }, 1500);
      },
      error: (error) => {
        this.loading = false;
        this.errorMessage = error.error?.message || 'Code invalide, veuillez réessayer.';
      }
    });
  }
}
