import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { FooterComponent } from '../../shared/components/footer/footer.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent, FooterComponent],
  template: `
    <app-header></app-header>
    
    <div class="profile-page">
      <div class="container slide-up">
        <!-- Modern Header -->
        <div class="premium-header">
          <div class="header-content">
            <h1 class="premium-title">Mon Espace Personnel</h1>
            <p class="premium-subtitle">Gérez vos informations et vos préférences AtlasSun</p>
          </div>
          <div class="header-decoration"></div>
        </div>

        <div class="profile-layout">
          <!-- Sidebar -->
          <aside class="profile-sidebar">
            <div class="sidebar-card avatar-section">
              <div class="avatar-container">
                <div class="avatar-main">
                  <img *ngIf="userPhoto" [src]="userPhoto" class="user-img animate-fade-in" alt="Avatar">
                  <span *ngIf="!userPhoto" class="initials-large">{{ getInitials() }}</span>
                </div>
                <button class="upload-badge" (click)="triggerFileInput()" title="Changer la photo">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                    <circle cx="12" cy="13" r="4"/>
                  </svg>
                </button>
                <input type="file" #fileInput (change)="onFileSelected($event)" accept="image/*" hidden>
              </div>
              <div class="user-brief">
                <h3>{{ userData.prenom }} {{ userData.nom }}</h3>
                <p>{{ userData.email }}</p>
              </div>
            </div>

            <nav class="sidebar-card profile-menu">
              <button [class.active]="activeTab === 'info'" (click)="activeTab = 'info'">
                <div class="menu-icon"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg></div>
                Informations
              </button>
              <button [class.active]="activeTab === 'password'" (click)="activeTab = 'password'">
                <div class="menu-icon"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg></div>
                Sécurité
              </button>
              <button [class.active]="activeTab === 'addresses'" (click)="activeTab = 'addresses'">
                <div class="menu-icon"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg></div>
                Adresses
              </button>
            </nav>
          </aside>

          <!-- Main Content -->
          <main class="profile-content">
            <!-- Info Tab -->
            <div class="tab-pane animate-slide-up" *ngIf="activeTab === 'info'">
              <div class="premium-card">
                <div class="card-header">
                  <div>
                    <h2 class="card-title">Informations Personnelles</h2>
                    <p class="card-subtitle">Mettez à jour vos informations de contact</p>
                  </div>
                  <button class="edit-toggle-btn" [class.editing]="editMode" (click)="editMode ? saveProfile() : enableEdit()">
                    <ng-container *ngIf="!editMode">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                      Modifier
                    </ng-container>
                    <ng-container *ngIf="editMode">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
                      Enregistrer
                    </ng-container>
                  </button>
                </div>

                <form class="premium-form" (ngSubmit)="saveProfile()">
                  <div class="form-grid">
                    <div class="input-group">
                      <label>Prénom</label>
                      <div class="input-wrapper">
                        <input type="text" [(ngModel)]="userData.prenom" name="prenom" [disabled]="!editMode" required>
                        <div class="input-focus-border"></div>
                      </div>
                    </div>
                    <div class="input-group">
                      <label>Nom</label>
                      <div class="input-wrapper">
                        <input type="text" [(ngModel)]="userData.nom" name="nom" [disabled]="!editMode" required>
                        <div class="input-focus-border"></div>
                      </div>
                    </div>
                  </div>

                  <div class="form-grid">
                    <div class="input-group">
                      <label>Email</label>
                      <div class="input-wrapper">
                        <input type="email" [(ngModel)]="userData.email" name="email" disabled>
                        <div class="input-focus-border"></div>
                      </div>
                      <span class="form-hint">L'email ne peut pas être modifié</span>
                    </div>
                    <div class="input-group">
                      <label>Téléphone</label>
                      <div class="input-wrapper">
                        <input type="tel" [(ngModel)]="userData.telephone" name="telephone" [disabled]="!editMode" placeholder="+212 6XX-XXXXXX">
                        <div class="input-focus-border"></div>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>

            <!-- Password Tab -->
            <div class="tab-pane animate-slide-up" *ngIf="activeTab === 'password'">
              <div class="premium-card">
                <div class="card-header">
                  <div>
                    <h2 class="card-title">Changer le mot de passe</h2>
                    <p class="card-subtitle">Assurez la sécurité de votre compte</p>
                  </div>
                </div>

                <form class="premium-form" (ngSubmit)="changePassword()">
                  <div class="input-group full-width">
                    <label>Mot de passe actuel</label>
                    <div class="input-wrapper">
                      <input type="password" [(ngModel)]="passwordData.current" name="current" required>
                      <div class="input-focus-border"></div>
                    </div>
                  </div>

                  <div class="form-grid">
                    <div class="input-group">
                      <label>Nouveau mot de passe</label>
                      <div class="input-wrapper">
                        <input type="password" [(ngModel)]="passwordData.new" name="new" required>
                        <div class="input-focus-border"></div>
                      </div>
                      <span class="form-hint">Minimum 6 caractères</span>
                    </div>
                    <div class="input-group">
                      <label>Confirmer le nouveau</label>
                      <div class="input-wrapper">
                        <input type="password" [(ngModel)]="passwordData.confirm" name="confirm" required>
                        <div class="input-focus-border"></div>
                      </div>
                    </div>
                  </div>

                  <div class="form-actions">
                    <button type="submit" class="btn-primary-premium" [disabled]="saving">
                      {{ saving ? 'Mise à jour...' : 'Modifier le mot de passe' }}
                    </button>
                  </div>
                </form>
              </div>
            </div>

            <!-- Addresses Tab -->
            <div class="tab-pane animate-slide-up" *ngIf="activeTab === 'addresses'">
              <div class="premium-card">
                <div class="card-header">
                  <div>
                    <h2 class="card-title">Mes Adresses</h2>
                    <p class="card-subtitle">Gérez vos lieux de livraison</p>
                  </div>
                  <button class="btn-add-premium" (click)="addNewAddress()">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                    Ajouter
                  </button>
                </div>

                <div class="addresses-grid">
                  <div class="address-item-card" *ngFor="let address of addresses; let i = index">
                    <div class="address-card-header">
                      <span class="address-icon">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                      </span>
                      <span class="badge-default-premium" *ngIf="address.isDefault">Défaut</span>
                    </div>
                    <h3>{{ address.label }}</h3>
                    <p class="address-details">
                      {{ address.street }}<br>
                      {{ address.city }}, {{ address.postalCode }}
                    </p>
                    <div class="address-footer-actions">
                      <button (click)="editAddress(i)">Modifier</button>
                      <button class="danger" (click)="deleteAddress(i)">Supprimer</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>

    <app-footer></app-footer>
  `,
  styles: [`
    .profile-page {
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
    .profile-layout {
      display: grid;
      grid-template-columns: 320px 1fr;
      gap: 40px;
    }

    /* Cards - Glassmorphism */
    .sidebar-card, .premium-card {
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border-radius: 28px;
      border: 1px solid rgba(26, 76, 139, 0.15);
      box-shadow: 0 20px 50px rgba(0, 0, 0, 0.05),
                  0 0 0 1px rgba(255, 255, 255, 0.8) inset;
      padding: 35px;
      transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
    }

    .sidebar-card:hover, .premium-card:hover {
      transform: translateY(-6px) scale(1.01);
      box-shadow: 0 25px 60px rgba(26, 76, 139, 0.12),
                  0 0 0 1px rgba(212, 166, 80, 0.3) inset;
      border-color: rgba(212, 166, 80, 0.25);
    }

    /* Avatar Section */
    .avatar-section {
      text-align: center;
      margin-bottom: 25px;
    }

    .avatar-container {
      position: relative;
      width: 140px;
      height: 140px;
      margin: 0 auto 20px;
    }

    .avatar-main {
      width: 100%;
      height: 100%;
      background: linear-gradient(135deg, rgba(26, 76, 139, 0.1), rgba(212, 166, 80, 0.15));
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
      border: 5px solid white;
      box-shadow: 0 15px 40px rgba(26, 76, 139, 0.2),
                  0 0 0 3px rgba(212, 166, 80, 0.15);
      color: #1A4C8B;
      transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
    }

    .avatar-container:hover .avatar-main {
      transform: scale(1.05);
      box-shadow: 0 20px 50px rgba(212, 166, 80, 0.35),
                  0 0 0 3px rgba(212, 166, 80, 0.4);
    }

    .user-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .initials-large {
      font-family: 'Cairo', sans-serif;
      font-size: 3.5rem;
      font-weight: 800;
    }

    .upload-badge {
      position: absolute;
      bottom: 5px;
      right: 5px;
      width: 48px;
      height: 48px;
      background: linear-gradient(135deg, #1A4C8B, #D4A650);
      color: white;
      border: 3px solid white;
      border-radius: 14px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      box-shadow: 0 8px 20px rgba(212, 166, 80, 0.4);
      transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
    }

    .upload-badge:hover {
      background: linear-gradient(135deg, #D4A650, #E5B761);
      transform: scale(1.15) rotate(5deg);
      box-shadow: 0 12px 30px rgba(212, 166, 80, 0.6);
    }

    .user-brief h3 {
      font-family: 'Cairo', sans-serif;
      margin: 0;
      color: #1e293b;
      font-size: 1.2rem;
    }

    .user-brief p {
      color: #94a3b8;
      font-size: 0.9rem;
      margin: 4px 0 0;
    }

    /* Profile Menu */
    .profile-menu {
      padding: 15px;
    }

    .profile-menu button {
      width: 100%;
      padding: 18px 22px;
      border: none;
      background: transparent;
      border-radius: 20px;
      display: flex;
      align-items: center;
      gap: 16px;
      color: #64748b;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
      margin-bottom: 6px;
      font-family: 'Poppins', sans-serif;
      position: relative;
    }

    .profile-menu button::before {
      content: '';
      position: absolute;
      left: 0;
      top: 50%;
      transform: translateY(-50%);
      width: 4px;
      height: 0;
      background: linear-gradient(135deg, #1A4C8B, #D4A650);
      border-radius: 2px;
      transition: height 0.3s;
    }

    .profile-menu button:hover::before,
    .profile-menu button.active::before {
      height: 70%;
    }

    .menu-icon {
      width: 42px;
      height: 42px;
      background: linear-gradient(135deg, rgba(26, 76, 139, 0.1), rgba(212, 166, 80, 0.15));
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
      color: #1A4C8B;
    }

    .profile-menu button:hover {
      background: rgba(26, 76, 139, 0.05);
      color: #1A4C8B;
      transform: translateX(4px);
    }

    .profile-menu button:hover .menu-icon {
      background: linear-gradient(135deg, #1A4C8B, #D4A650);
      color: white;
      transform: scale(1.1) rotate(5deg);
    }

    .profile-menu button.active {
      background: linear-gradient(135deg, #1A4C8B 0%, #2A5C9B 50%, #D4A650 100%);
      color: white;
      box-shadow: 0 8px 25px rgba(212, 166, 80, 0.3);
    }

    .profile-menu button.active .menu-icon {
      background: rgba(255, 255, 255, 0.2);
      color: white;
    }

    /* Content Card */
    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 35px;
    }

    .card-title {
      font-family: 'Cairo', sans-serif;
      font-size: 1.8rem;
      font-weight: 800;
      background: linear-gradient(135deg, #1A4C8B, #D4A650);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      margin: 0;
      letter-spacing: -0.5px;
    }

    .card-subtitle {
      color: #94a3b8;
      font-size: 0.95rem;
      margin: 5px 0 0;
    }

    .edit-toggle-btn {
      padding: 12px 24px;
      background: linear-gradient(135deg, rgba(26, 76, 139, 0.1), rgba(212, 166, 80, 0.15));
      border: 2px solid rgba(26, 76, 139, 0.2);
      border-radius: 16px;
      color: #1A4C8B;
      font-weight: 800;
      display: flex;
      align-items: center;
      gap: 10px;
      cursor: pointer;
      transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
      font-family: 'Cairo', sans-serif;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
    }

    .edit-toggle-btn:hover {
      background: linear-gradient(135deg, #1A4C8B, #D4A650);
      color: white;
      border-color: transparent;
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(212, 166, 80, 0.3);
    }

    .edit-toggle-btn.editing {
      background: linear-gradient(135deg, #10B981, #14B8A6);
      color: white;
      border-color: transparent;
      box-shadow: 0 6px 20px rgba(16, 185, 129, 0.3);
    }

    /* Form Styles */
    .form-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 30px;
      margin-bottom: 25px;
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

    .input-wrapper input {
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

    .input-wrapper input:focus {
      outline: none;
      background: white;
      border-color: #D4A650;
      box-shadow: 0 0 0 4px rgba(212, 166, 80, 0.15),
                  0 8px 25px rgba(26, 76, 139, 0.15);
      transform: translateY(-2px);
    }

    .input-wrapper input:disabled {
      background: rgba(248, 250, 252, 0.5);
      color: #94a3b8;
      cursor: not-allowed;
      border-color: rgba(26, 76, 139, 0.05);
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

    .input-wrapper input:focus + .input-focus-border {
      width: 100%;
    }

    .form-hint {
      display: block;
      font-size: 0.8rem;
      color: #94a3b8;
      margin-top: 8px;
    }

    .form-actions {
      margin-top: 40px;
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

    /* Addresses */
    .btn-add-premium {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 24px;
      background: linear-gradient(135deg, #1A4C8B, #D4A650);
      color: white;
      border: none;
      border-radius: 16px;
      font-family: 'Cairo', sans-serif;
      font-weight: 800;
      cursor: pointer;
      transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
      box-shadow: 0 6px 20px rgba(212, 166, 80, 0.3);
    }

    .btn-add-premium:hover {
      background: linear-gradient(135deg, #D4A650, #E5B761);
      transform: translateY(-3px) scale(1.05);
      box-shadow: 0 10px 30px rgba(212, 166, 80, 0.4);
    }

    .addresses-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 25px;
    }

    .address-item-card {
      background: #f8fafc;
      border: 1px solid #f1f5f9;
      border-radius: 20px;
      padding: 25px;
      transition: all 0.3s;
    }

    .address-item-card:hover {
      background: white;
      border-color: #D4A650;
      box-shadow: 0 10px 25px rgba(0,0,0,0.05);
      transform: translateY(-5px);
    }

    .address-card-header {
      display: flex;
      justify-content: space-between;
      margin-bottom: 20px;
    }

    .address-icon {
      width: 44px;
      height: 44px;
      background: white;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #D4A650;
      box-shadow: 0 4px 10px rgba(0,0,0,0.05);
    }

    .badge-default-premium {
      padding: 4px 12px;
      background: rgba(39, 174, 96, 0.1);
      color: #27AE60;
      border-radius: 20px;
      font-size: 0.75rem;
      font-weight: 700;
      align-self: flex-start;
    }

    .address-item-card h3 {
      font-family: 'Cairo', sans-serif;
      font-size: 1.1rem;
      margin: 0 0 10px;
      color: #1e293b;
    }

    .address-details {
      color: #64748b;
      font-size: 0.95rem;
      line-height: 1.6;
      margin-bottom: 20px;
    }

    .address-footer-actions {
      display: flex;
      gap: 15px;
      border-top: 1px solid #f1f5f9;
      padding-top: 15px;
    }

    .address-footer-actions button {
      background: none;
      border: none;
      color: #1A4C8B;
      font-weight: 600;
      font-size: 0.85rem;
      cursor: pointer;
      transition: all 0.2s;
    }

    .address-footer-actions button:hover {
      color: #D4A650;
    }

    .address-footer-actions button.danger {
      color: #e11d48;
    }

    /* Animations */
    @keyframes slideUp {
      from { transform: translateY(30px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    .animate-slide-up {
      animation: slideUp 0.5s ease-out;
    }

    .animate-fade-in {
      animation: fadeIn 0.4s ease-out;
    }

    @media (max-width: 900px) {
      .profile-layout { grid-template-columns: 1fr; }
      .form-grid { grid-template-columns: 1fr; }
    }

    /* Responsive */
    @media (max-width: 1024px) {
      .profile-layout {
        grid-template-columns: 1fr;
      }

      .profile-sidebar {
        max-width: 100%;
      }
    }

    @media (max-width: 768px) {
      .form-row {
        grid-template-columns: 1fr;
      }

      .addresses-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class ProfileComponent implements OnInit {
  activeTab: 'info' | 'password' | 'addresses' = 'info';
  editMode = false;
  saving = false;
  showAddressForm = false;

  userData = {
    prenom: '',
    nom: '',
    email: '',
    telephone: ''
  };

  userPhoto: string | null = null;

  passwordData = {
    current: '',
    new: '',
    confirm: ''
  };

  addresses = [
    {
      label: 'Domicile',
      street: '123 Rue Mohammed V',
      city: 'Casablanca',
      postalCode: '20000',
      country: 'Maroc',
      isDefault: true
    }
  ];

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
    this.loadUserProfile();
  }

  loadUserProfile() {
    const user = this.authService.getCurrentUser();
    if (user) {
      this.userData = {
        prenom: user.prenom || '',
        nom: user.nom || '',
        email: user.email || '',
        telephone: user.telephone || ''
      };
      this.userPhoto = user.avatar || null;
    }
  }

  getInitials(): string {
    return ((this.userData.prenom?.charAt(0) || '') + (this.userData.nom?.charAt(0) || '')).toUpperCase() || '?';
  }

  enableEdit() {
    this.editMode = true;
  }

  cancelEdit() {
    this.editMode = false;
    this.loadUserProfile();
  }

  saveProfile() {
    if (!this.editMode) return;

    this.saving = true;
    this.authService.updateProfile(this.userData).subscribe({
      next: () => {
        this.saving = false;
        this.editMode = false;
        alert('Profil mis à jour avec succès !');
      },
      error: (err) => {
        this.saving = false;
        console.error('Save profile error:', err);
        alert('Erreur lors de la mise à jour du profil');
      }
    });
  }

  changePassword() {
    if (this.passwordData.new !== this.passwordData.confirm) {
      alert('Les mots de passe ne correspondent pas');
      return;
    }

    this.saving = true;
    this.authService.changePassword(this.passwordData.current, this.passwordData.new).subscribe({
      next: () => {
        this.saving = false;
        this.passwordData = { current: '', new: '', confirm: '' };
        alert('Mot de passe modifié avec succès !');
      },
      error: (err) => {
        this.saving = false;
        console.error('Change password error:', err);
        alert('Erreur: ' + (err.error?.message || 'Le mot de passe actuel est incorrect'));
      }
    });
  }

  triggerFileInput() {
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    fileInput?.click();
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.userPhoto = e.target.result;
        this.authService.updateProfileImage(this.userPhoto!).subscribe();
      };
      reader.readAsDataURL(file);
    }
  }

  addNewAddress() {
    alert('Formulaire d\'ajout d\'adresse à implémenter');
  }

  editAddress(index: number) {
    alert('Éditer adresse: ' + index);
  }

  deleteAddress(index: number) {
    if (confirm('Supprimer cette adresse ?')) {
      this.addresses.splice(index, 1);
    }
  }

  setDefaultAddress(index: number) {
    this.addresses.forEach((addr, i) => {
      addr.isDefault = i === index;
    });
  }
}
