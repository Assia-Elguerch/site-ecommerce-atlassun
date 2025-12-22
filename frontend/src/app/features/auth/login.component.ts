import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { UserRole } from '../../core/models';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="login-container">
      <!-- Animated Background -->
      <div class="animated-bg">
        <div class="circle circle-1"></div>
        <div class="circle circle-2"></div>
        <div class="circle circle-3"></div>
      </div>

      <!-- Login Card -->
      <div class="login-card">
        <!-- Logo & Title -->
        <div class="login-header">
          <img src="assets/logo.png" alt="AtlasSun Logo" class="logo-img">
          <h1 class="brand-name">AtlasSun</h1>
          <p class="tagline">E-commerce Marocain Premium</p>
        </div>

        <!-- Alert -->
        <div class="alert error" *ngIf="errorMessage">
            {{ errorMessage }}
        </div>

        <!-- STEP 1: Login Form -->
        <form class="login-form" (ngSubmit)="onLogin()" *ngIf="!showTwoFactorStep">
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

          <div class="form-group">
            <label for="password">Mot de passe</label>
            <input 
              type="password" 
              id="password" 
              [(ngModel)]="password"
              name="password"
              placeholder="••••••••"
              required>
          </div>

          <div class="form-options">
            <label class="remember">
              <input type="checkbox"> Se souvenir de moi
            </label>
            <a routerLink="/auth/forgot-password" class="forgot-link">Mot de passe oublié?</a>
          </div>

          <button type="submit" class="btn-login" [disabled]="loading">
            <span *ngIf="!loading">Se connecter</span>
            <span *ngIf="loading">Connexion...</span>
            <svg *ngIf="!loading" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M5 12h14M12 5l7 7-7 7" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </button>

          <div class="divider">
            <span>OU</span>
          </div>

          <button type="button" class="btn-guest" (click)="continueAsGuest()">
            Continuer sans compte
          </button>
        </form>

        <!-- STEP 2: 2FA Verification -->
        <div class="two-factor-step" *ngIf="showTwoFactorStep">
            <h3 class="step-title">Vérification en deux étapes</h3>
            <p class="instruction">
                Veuillez entrer le code à 6 chiffres de votre application d'authentification pour <strong>{{ email }}</strong>.
            </p>

            <div class="form-group">
                <input 
                    type="text" 
                    [(ngModel)]="otpCode" 
                    name="otpCode"
                    placeholder="000 000"
                    maxlength="6"
                    class="otp-input"
                    (keyup.enter)="onVerifyOtp()">
            </div>

            <button type="button" class="btn-login" (click)="onVerifyOtp()" [disabled]="loading">
                <span *ngIf="!loading">Vérifier</span>
                <span *ngIf="loading">Vérification...</span>
            </button>
            
            <button type="button" class="btn-link" (click)="showTwoFactorStep = false">
                Retour à la connexion
            </button>
        </div>

        <!-- Footer -->
        <div class="login-footer" *ngIf="!showTwoFactorStep">
          <p>Pas encore de compte? <a routerLink="/auth/register">S'inscrire</a></p>
        </div>
      </div>

      <!-- Decorative Elements -->
      <div class="decorative-pattern"></div>
    </div>
  `,
  styles: [`
    @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800&family=Poppins:wght@300;400;500;600;700&display=swap');

    /* ============================================
       ULTRA-MODERN LOGIN - 2024/2025 DESIGN
       ============================================ */

    .login-container {
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

      /* Animated Gradient Overlay */
      &::after {
        content: '';
        position: absolute;
        inset: 0;
        background: radial-gradient(circle at 30% 50%, 
                    rgba(212, 166, 80, 0.15), 
                    transparent 50%);
        animation: moveGradient 15s ease-in-out infinite;
        z-index: 2;
      }
    }

    @keyframes moveGradient {
      0%, 100% {
        transform: translate(0, 0) scale(1);
        opacity: 0.5;
      }
      50% {
        transform: translate(30px, -30px) scale(1.1);
        opacity: 0.8;
      }
    }

    /* Floating Particles */
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
      width: 350px;
      height: 350px;
      top: -150px;
      left: -100px;
      animation-delay: 0s;
      animation-duration: 25s;
    }

    .circle-2 {
      width: 250px;
      height: 250px;
      bottom: -80px;
      right: -80px;
      animation-delay: 3s;
      animation-duration: 30s;
    }

    .circle-3 {
      width: 180px;
      height: 180px;
      top: 40%;
      right: 10%;
      animation-delay: 6s;
      animation-duration: 20s;
    }

    @keyframes float {
      0%, 100% {
        transform: translate(0, 0) rotate(0deg) scale(1);
      }
      25% {
        transform: translate(40px, -40px) rotate(90deg) scale(1.1);
      }
      50% {
        transform: translate(-30px, 30px) rotate(180deg) scale(0.9);
      }
      75% {
        transform: translate(50px, 20px) rotate(270deg) scale(1.05);
      }
    }

    /* ============================================
       GLASSMORPHISM CARD
       ============================================ */
    .login-card {
      background: rgba(255, 255, 255, 0.12);
      backdrop-filter: blur(25px) saturate(180%);
      -webkit-backdrop-filter: blur(25px) saturate(180%);
      border-radius: 32px;
      padding: 55px 45px;
      max-width: 480px;
      width: 100%;
      border: 2px solid rgba(255, 255, 255, 0.25);
      box-shadow: 0 40px 100px rgba(0, 0, 0, 0.5),
                  0 0 0 1px rgba(255, 255, 255, 0.1) inset,
                  0 0 80px rgba(212, 166, 80, 0.15);
      position: relative;
      z-index: 10;
      animation: glassReveal 1.2s cubic-bezier(0.34, 1.56, 0.64, 1);
      overflow: hidden;

      /* Glowing Border Animation */
      &::before {
        content: '';
        position: absolute;
        inset: -2px;
        border-radius: 32px;
        padding: 2px;
        background: linear-gradient(135deg, 
                    rgba(212, 166, 80, 0.6),
                    rgba(255, 255, 255, 0.3), 
                    rgba(212, 166, 80, 0.6));
        -webkit-mask: linear-gradient(#fff 0 0) content-box, 
                      linear-gradient(#fff 0 0);
        -webkit-mask-composite: xor;
        mask-composite: exclude;
        animation: rotateBorder 4s linear infinite;
        pointer-events: none;
      }
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

    @keyframes rotateBorder {
      from {
        transform: rotate(0deg);
      }
      to {
        transform: rotate(360deg);
      }
    }

    /* ============================================
       HEADER SECTION
       ============================================ */
    .login-header {
      text-align: center;
      margin-bottom: 45px;
    }

    .logo-img {
      width: 110px;
      height: 110px;
      border-radius: 50%;
      object-fit: cover;
      margin: 0 auto 25px;
      display: block;
      border: 5px solid rgba(255, 255, 255, 0.4);
      box-shadow: 0 15px 40px rgba(0, 0, 0, 0.3),
                  0 0 50px rgba(212, 166, 80, 0.4);
      background: white;
      animation: logo3DEntry 1.5s cubic-bezier(0.34, 1.56, 0.64, 1);
      transition: transform 0.4s ease;

      &:hover {
        transform: scale(1.08) rotate(5deg);
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4),
                    0 0 80px rgba(212, 166, 80, 0.6);
      }
    }

    @keyframes logo3DEntry {
      0% {
        opacity: 0;
        transform: perspective(800px) rotateY(-180deg) scale(0.3);
      }
      50% {
        opacity: 0.8;
        transform: perspective(800px) rotateY(-90deg) scale(0.7);
      }
      100% {
        opacity: 1;
        transform: perspective(800px) rotateY(0deg) scale(1);
      }
    }

    .brand-name {
      font-family: 'Cairo', sans-serif;
      font-size: 38px;
      font-weight: 800;
      color: #FFFFFF;
      margin: 0 0 10px;
      text-shadow: 0 4px 20px rgba(0, 0, 0, 0.5),
                   0 0 30px rgba(212, 166, 80, 0.5);
      letter-spacing: -1px;
      animation: slideDown 0.8s ease-out 0.3s both;
    }

    @keyframes slideDown {
      from {
        opacity: 0;
        transform: translateY(-30px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .tagline {
      font-family: 'Poppins', sans-serif;
      font-size: 15px;
      color: rgba(255, 255, 255, 0.9);
      margin: 0;
      font-weight: 500;
      text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
      animation: fadeIn 1s ease-out 0.5s both;
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    /* ============================================
       ALERTS
       ============================================ */
    .alert {
      padding: 14px 18px;
      border-radius: 14px;
      margin-bottom: 20px;
      text-align: center;
      font-size: 14px;
      font-weight: 500;
      animation: shake 0.5s ease;
    }

    .alert.error {
      background: rgba(255, 100, 100, 0.15);
      color: #ffffff;
      border: 2px solid rgba(255, 100, 100, 0.4);
      backdrop-filter: blur(10px);
      text-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
    }

    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
      20%, 40%, 60%, 80% { transform: translateX(5px); }
    }

    /* ============================================
       FORM ELEMENTS - ULTRA MODERN
       ============================================ */
    .login-form {
      margin-bottom: 30px;
      animation: fadeInUp 0.8s ease-out 0.6s both;
    }

    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(30px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .form-group {
      margin-bottom: 28px;
      position: relative;
    }

    .form-group label {
      display: block;
      font-family: 'Cairo', sans-serif;
      font-size: 14px;
      font-weight: 700;
      color: rgba(255, 255, 255, 0.95);
      margin-bottom: 10px;
      text-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
      letter-spacing: 0.5px;
    }

    .form-group input {
      width: 100%;
      padding: 16px 22px;
      font-family: 'Poppins', sans-serif;
      font-size: 15px;
      color: #FFFFFF;
      background: rgba(255, 255, 255, 0.12);
      border: 2px solid rgba(255, 255, 255, 0.25);
      border-radius: 16px;
      transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);

      &::placeholder {
        color: rgba(255, 255, 255, 0.5);
      }

      &:focus {
        outline: none;
        background: rgba(255, 255, 255, 0.18);
        border-color: #D4A650;
        box-shadow: 0 0 0 5px rgba(212, 166, 80, 0.25),
                    0 0 30px rgba(212, 166, 80, 0.4),
                    0 8px 25px rgba(0, 0, 0, 0.2);
        transform: translateY(-2px);
      }
    }

    .form-options {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 28px;
      font-size: 13px;
    }

    .remember {
      display: flex;
      align-items: center;
      gap: 8px;
      cursor: pointer;
      color: rgba(255, 255, 255, 0.9);
      font-weight: 500;
      text-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);

      input[type="checkbox"] {
        width: 18px;
        height: 18px;
        cursor: pointer;
      }
    }

    .forgot-link {
      color: #D4A650;
      text-decoration: none;
      font-weight: 600;
      text-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
      transition: all 0.3s ease;

      &:hover {
        color: #E5B761;
        text-decoration: underline;
        text-shadow: 0 0 10px rgba(212, 166, 80, 0.5);
      }
    }

    /* ============================================
       BUTTONS - ADVANCED EFFECTS
       ============================================ */
    .btn-login {
      width: 100%;\r\n      padding: 18px;
      background: linear-gradient(135deg, #D4A650 0%, #E5B761 100%);
      color: #1A4C8B;
      border: none;
      border-radius: 16px;
      font-family: 'Cairo', sans-serif;
      font-size: 17px;
      font-weight: 800;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 12px;
      transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
      box-shadow: 0 10px 30px rgba(212, 166, 80, 0.4),
                  0 0 0 1px rgba(255, 255, 255, 0.1) inset;
      position: relative;
      overflow: hidden;
      text-transform: uppercase;
      letter-spacing: 1px;

      /* Shimmer Effect */
      &::before {
        content: '';
        position: absolute;
        top: 0;
        left: -150%;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, 
                    transparent, 
                    rgba(255, 255, 255, 0.5), 
                    transparent);
        transition: left 0.7s;
      }

      /* Ripple Effect */
      &::after {
        content: '';
        position: absolute;
        inset: 0;
        background: radial-gradient(circle, transparent 1%, rgba(255, 255, 255, 0.3) 1%);
        background-size: 15000%;
        transition: background-size 0.8s;
      }

      &:hover:not(:disabled) {
        transform: translateY(-3px) scale(1.02);
        box-shadow: 0 15px 45px rgba(212, 166, 80, 0.6),
                    0 0 50px rgba(212, 166, 80, 0.4),
                    0 0 0 1px rgba(255, 255, 255, 0.2) inset;
        background: linear-gradient(135deg, #E5B761 0%, #F5C771 100%);
      }

      &:hover::before {
        left: 150%;
      }

      &:active::after {
        background-size: 100%;
        transition: 0s;
      }

      &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
        transform: none;
      }
    }

    /* Divider */
    .divider {
      text-align: center;
      margin: 30px 0;
      position: relative;

      &::before,
      &::after {
        content: '';
        position: absolute;
        top: 50%;
        width: 42%;
        height: 2px;
        background: linear-gradient(to right, 
                    transparent, 
                    rgba(255, 255, 255, 0.3), 
                    transparent);
      }

      &::before { left: 0; }
      &::after { right: 0; }

      span {
        background: rgba(255, 255, 255, 0.1);
        backdrop-filter: blur(10px);
        padding: 6px 18px;
        color: rgba(255, 255, 255, 0.8);
        font-size: 12px;
        font-weight: 600;
        border-radius: 20px;
        border: 1px solid rgba(255, 255, 255, 0.2);
        text-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
      }
    }

    .btn-guest {
      width: 100%;
      padding: 16px;
      background: transparent;
      color: #FFFFFF;
      border: 2px solid rgba(255, 255, 255, 0.4);
      border-radius: 16px;
      font-family: 'Poppins', sans-serif;
      font-size: 15px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
      backdrop-filter: blur(10px);
      position: relative;
      overflow: hidden;

      &::before {
        content: '';
        position: absolute;
        inset: 0;
        background: linear-gradient(135deg, 
                    rgba(255, 255, 255, 0.15), 
                    rgba(212, 166, 80, 0.15));
        transform: scaleX(0);
        transform-origin: left;
        transition: transform 0.5s ease;
      }

      &:hover {
        border-color: #D4A650;
        color: #D4A650;
        box-shadow: 0 8px 25px rgba(212, 166, 80, 0.3);
        transform: translateY(-2px);
      }

      &:hover::before {
        transform: scaleX(1);
      }
    }

    /* Footer */
    .login-footer {
      text-align: center;
      font-size: 14px;
      color: rgba(255, 255, 255, 0.85);
      text-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
      animation: fadeIn 1s ease-out 0.8s both;

      a {
        color: #D4A650;
        font-weight: 700;
        text-decoration: none;
        transition: all 0.3s ease;

        &:hover {
          color: #E5B761;
          text-decoration: underline;
          text-shadow: 0 0 10px rgba(212, 166, 80, 0.5);
        }
      }
    }

    /* 2FA Styles */
    .two-factor-step {
      animation: fadeInUp 0.6s ease-out;
      text-align: center;
    }

    .step-title {
      color: #FFFFFF;
      font-size: 22px;
      margin-bottom: 12px;
      text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
    }

    .instruction {
      color: rgba(255, 255, 255, 0.9);
      font-size: 14px;
      margin-bottom: 28px;
      text-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
    }

    .otp-input {
      text-align: center;
      letter-spacing: 10px;
      font-size: 28px !important;
      font-weight: 800;
    }

    .btn-link {
      background: none;
      border: none;
      color: rgba(255, 255, 255, 0.8);
      margin-top: 18px;
      cursor: pointer;
      text-decoration: underline;
      font-size: 14px;
      transition: all 0.3s ease;

      &:hover {
        color: #D4A650;
        text-shadow: 0 0 10px rgba(212, 166, 80, 0.5);
      }
    }

    /* Responsive */
    @media (max-width: 480px) {
      .login-card {
        padding: 45px 30px;
        border-radius: 28px;
      }

      .brand-name {
        font-size: 32px;
      }

      .logo-img {
        width: 95px;
        height: 95px;
      }

      .form-options {
        flex-direction: column;
        gap: 12px;
        align-items: flex-start;
      }
    }
  `]
})
export class LoginComponent {
  email = '';
  password = '';
  loading = false;
  errorMessage = '';

  // 2FA
  showTwoFactorStep = false;
  otpCode = '';

  constructor(
    private router: Router,
    private authService: AuthService
  ) { }

  onLogin() {
    this.loading = true;
    this.errorMessage = '';

    const credentials = {
      email: this.email,
      motDePasse: this.password
    };

    this.authService.login(credentials).subscribe({
      next: (response) => {
        this.loading = false;

        if (response.requiresTwoFactor) {
          this.showTwoFactorStep = true;
        } else {
          if (response.user.role === UserRole.ADMIN) {
            this.router.navigate(['/admin']);
          } else {
            this.router.navigate(['/home']);
          }
        }
      },
      error: (error) => {
        this.loading = false;
        this.errorMessage = error.error?.message || 'Email ou mot de passe incorrect';
        console.error('Login error:', error);
      }
    });
  }

  onVerifyOtp() {
    if (!this.otpCode || this.otpCode.length < 6) {
      this.errorMessage = 'Code invalide';
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    this.loading = false;
    // Check current user role from auth service or response if available
    // But verify2Fa returns AuthResponse which has user
    this.authService.verify2Fa(this.email, this.otpCode, false).subscribe({
      next: (resp) => { // Capture response
        if (resp.user.role === UserRole.ADMIN) {
          this.router.navigate(['/admin']);
        } else {
          this.router.navigate(['/home']);
        }
      },
      error: (error) => {
        this.loading = false;
        this.errorMessage = error.error?.message || 'Code invalide';
      }
    });
  }

  continueAsGuest() {
    this.router.navigate(['/home']);
  }
}
