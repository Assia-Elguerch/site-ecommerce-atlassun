# AtlasSun - E-commerce Marocain Premium

Application Angular moderne pour la vente en ligne de produits artisanaux marocains (Caftans, Jellabas, Bijoux, Chaussures traditionnelles).

## 🎨 Design

- **Palette Marocaine Premium** : Bleu Majorelle (#1A4C8B), Or Marocain (#D4A650), Rouge Marrakech (#C0392B)
- **Typographie** : Cairo (titres) & Poppins (corps)
- **Design System** : Variables SCSS complètes, mixins réutilisables
- **Responsive** : Mobile-first avec breakpoints adaptés

## 🏗️ Architecture

### Structure du Projet

```
src/
├── app/
│   ├── core/                    # Module core (singleton services)
│   │   ├── guards/              # Guards de navigation (auth, admin)
│   │   ├── interceptors/        # HTTP interceptors (auth, error, loading)
│   │   ├── services/            # Services d'infrastructure
│   │   │   ├── api.service.ts           # Service HTTP générique
│   │   │   ├── auth.service.ts          # Authentification
│   │   │   ├── storage.service.ts       # LocalStorage wrapper
│   │   │   ├── loading.service.ts       # Gestion du loader
│   │   │   ├── notification.service.ts  # Notifications toast
│   │   │   ├── product.service.ts       # Gestion des produits
│   │   │   ├── category.service.ts      # Gestion des catégories
│   │   │   ├── cart.service.ts          # Gestion du panier
│   │   │   ├── order.service.ts         # Gestion des commandes
│   │   │   └── user.service.ts          # Gestion des utilisateurs
│   │   ├── pipes/               # Pipes custom
│   │   │   ├── mad-currency.pipe.ts     # Format Dirhams (MAD)
│   │   │   ├── date-fr.pipe.ts          # Dates en français
│   │   │   └── truncate.pipe.ts         # Tronquer le texte
│   │   └── models/              # Interfaces TypeScript
│   │       └── index.ts                 # Tous les modèles
│   │
│   ├── shared/                  # Composants réutilisables
│   │   ├── components/          # Composants UI
│   │   ├── directives/          # Directives custom
│   │   └── pipes/              # Pipes partagés
│   │
│   ├── features/                # Features (lazy loaded)
│   │   ├── home/               # Page d'accueil
│   │   ├── catalogue/          # Liste de produits
│   │   ├── product-detail/     # Détail produit
│   │   ├── cart/               # Panier
│   │   ├── checkout/           # Commande
│   │   ├── auth/               # Connexion/Inscription
│   │   ├── profile/            # Profil utilisateur
│   │   └── admin/              # Section admin
│   │       ├── dashboard/      # Tableau de bord
│   │       ├── products/       # CRUD produits
│   │       ├── categories/     # CRUD catégories
│   │       ├── orders/         # Gestion commandes
│   │       ├── customers/      # Gestion clients
│   │       └── users/          # Gestion utilisateurs
│   │
│   ├── layouts/                 # Layouts
│   │   ├── client/             # Layout client
│   │   │   ├── header/         # Header navigation
│   │   │   └── footer/         # Footer
│   │   └── admin/              # Layout admin
│   │       ├── sidebar/        # Sidebar navigation
│   │       └── header/         # Header admin
│   │
│   ├── app.routes.ts           # Configuration routing
│   ├── app.config.ts           # Configuration app
│   └── app.ts                  # Composant racine
│
├── styles/                     # Styles globaux
│   ├── _variables.scss         # Variables SCSS
│   ├── _mixins.scss            # Mixins SCSS
│   └── styles.scss             # Styles principaux
│
├── assets/                     # Assets statiques
│   ├── images/                 # Images
│   └── mock-data/              # Données de test
│
└── environments/               # Environnements
    ├── environment.ts          # Développement
    └── environment.prod.ts     # Production
```

### Technologies

- **Angular 21** - Framework frontend
- **TypeScript** (Strict Mode) - Typage fort
- **SCSS** - Préprocesseur CSS
- **RxJS** - Programmation réactive
- **Standalone Components** - Architecture moderne Angular

### Patterns Architecturaux

- **Lazy Loading** : Tous les features sont chargés à la demande
- **Service-Based State** : Gestion d'état avec BehaviorSubject
- **Guards & Interceptors** : Sécurité et gestion centralisée
- **Repository Pattern** : Services métier séparés
- **Reactive Forms** : Formulaires avec validation

## 📦 Installation

### Prérequis

- Node.js 22.x ou supérieur
- npm 10.x ou supérieur
- Angular CLI 21.x

### Étapes

```bash
# Cloner le projet
cd C:\Users\Sia\OneDrive\Documents\Ecommrce\frontend

# Installer les dépendances
npm install

# Démarrer le serveur de développement
npm start

# Ouvrir dans le navigateur
# http://localhost:4200
```

## 🔧 Configuration

### Backend API

L'application se connecte au backend Spring Boot. Modifier l'URL de l'API dans :

**src/environments/environment.ts** (Développement)
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080/api',  // URL de votre backend
  appName: 'AtlasSun',
  appVersion: '1.0.0'
};
```

**src/environments/environment.prod.ts** (Production)
```typescript
export const environment = {
  production: true,
  apiUrl: 'https://api.atlassun.ma/api',  // URL production
  appName: 'AtlasSun',
  appVersion: '1.0.0'
};
```

## 🚀 Commandes Disponibles

```bash
# Développement
npm start              # Démarrer le serveur de dev (port 4200)
npm run build          # Build de production
npm run watch          # Build en mode watch
npm test               # Lancer les tests unitaires

# Production
npm run build -- --configuration=production    # Build optimisé pour production
```

## 🎯 Features Implémentées

### Core Architecture ✅

- [x] Design System complet (Palette marocaine, typographie, mixins)
- [x] Services d'infrastructure (API, Auth, Storage, Loading, Notification)
- [x] Guards de navigation (Auth, Admin)
- [x] HTTP Interceptors (Auth token, Error handling, Loading)
- [x] Services métier (Product, Category, Cart, Order, User)
- [x] Pipes custom (MAD Currency, Date FR, Truncate)
- [x] Modèles TypeScript complets
- [x] Routing avec lazy loading
- [x] Configuration environnements

### À Développer

- [ ] Layouts Client et Admin complets
- [ ] Composants UI réutilisables (Buttons, Cards, Forms)
- [ ] Pages Client (Home, Catalogue, Product Detail, Cart, Checkout)
- [ ] Pages Admin (Dashboard, CRUD Products/Categories/Orders/Users)
- [ ] Formulaires avec validation
- [ ] Gestion des images produits
- [ ] Système de recherche et filtres
- [ ] Pagination des listes
- [ ] Notifications toast visuelles
- [ ] Loader global
- [ ] Tests unitaires

## 🔐 Authentification

### Rôles Utilisateurs

1. **CLIENT** : Accès catalogue, panier, commandes
2. **VENDEUR** : Gestion limitée admin
3. **ADMIN** : Accès complet administration

### Connexion

L'authentification utilise JWT (JSON Web Tokens) :

1. Login → Récupération du token
2. Token stocké dans localStorage
3. Token ajouté automatiquement aux requêtes HTTP
4. Déconnexion automatique si token expiré (401)

## 🛍️ Fonctionnalités E-commerce

### Panier

- Ajout/Suppression de produits
- Modification des quantités
- Calcul automatique du total
- Frais de livraison : 30 DH (gratuit si > 500 DH)
- Persistance dans localStorage

### Produits

- Catégories : Caftans, Jellabas, Bijoux, Chaussures traditionnelles
- Filtres : Prix, Catégorie, Nouveautés, Promotions
- Tri : Prix, Popularité, Date
- Pagination
- Recherche fulltext

### Commandes

- Processus de checkout guidé
- Statuts : EN_ATTENTE, CONFIRMEE, EN_PREPARATION, EXPEDIEE, LIVREE, ANNULEE
- Historique des commandes
- Détail de commande
- Gestion admin (mise à jour statuts)

## 🎨 Design System

### Palette de Couleurs

```scss
$bleu-majorelle: #1A4C8B;      // Couleur principale
$or-marocain: #D4A650;          // Couleur secondaire
$blanc-casse: #FAF7F0;          // Fond clair
$noir-cafe: #2A2A2A;            // Titres
$rouge-marrakech: #C0392B;      // Boutons/Actions
$gris-sable: #C8C2B5;           // Bordures
```

### Typographie

- **Titres (H1-H6)** : Cairo (Semi-Bold, Bold)
- **Corps de texte** : Poppins (Regular, Medium)
- **Boutons** : Cairo (Semi-Bold)

### Breakpoints

```scss
$breakpoint-xs: 480px;
$breakpoint-sm: 640px;
$breakpoint-md: 768px;
$breakpoint-lg: 1024px;
$breakpoint-xl: 1280px;
$breakpoint-2xl: 1536px;
```

## 📱 Responsive Design

L'application est entièrement responsive avec :

- Layout mobile-first
- Navigation adaptative
- Grilles flexibles
- Images responsive
- Touch-friendly sur mobile

## 🔄 State Management

Approche **Service-Based** avec RxJS :

- `BehaviorSubject` pour les états partagés
- Observables pour la réactivité
- LocalStorage pour la persistance
- Pattern Observable Service

Exemple :
```typescript
// Service
private cartSubject = new BehaviorSubject<Cart>({ items: [], total: 0 });
public cart$ = this.cartSubject.asObservable();

// Component
this.cartService.cart$.subscribe(cart => {
  this.cart = cart;
});
```

## 🧪 Tests

Tests unitaires avec Jasmine et Karma :

```bash
npm test              # Lancer tous les tests
npm run test:watch    # Mode watch
```

## 📚 Documentation des Services

### ApiService

Service HTTP générique pour toutes les requêtes API.

```typescript
this.apiService.get<Product[]>('produits');
this.apiService.post<Product>('produits', productData);
this.apiService.put<Product>(`produits/${id}`, productData);
this.apiService.delete(`produits/${id}`);
```

### AuthService

Gestion de l'authentification.

```typescript
this.authService.login({ email, password });
this.authService.register(userData);
this.authService.logout();
this.authService.isAuthenticated();
this.authService.isAdmin();
```

### CartService

Gestion du panier d'achat.

```typescript
this.cartService.addToCart(product, quantity);
this.cartService.removeFromCart(index);
this.cartService.updateQuantity(index, quantity);
this.cartService.clearCart();
```

## 🌐 Internationalisation

Application en **Français** :

- Dates formatées en français
- Devise : Dirhams Marocains (DH)
- Interface et messages en français

## 📝 Conventions de Code

- **TypeScript Strict Mode** activé
- **ESLint** pour la qualité du code
- **Prettier** pour le formatage
- Nommage : camelCase (variables), PascalCase (classes)
- Fichiers : kebab-case

## 🚧 Roadmap

### Phase 1 (En cours)
- ✅ Architecture et configuration de base
- ✅ Design system
- ✅ Services core

### Phase 2 (Prochain)
- Layouts Client et Admin
- Composants UI de base
- Page Home avec carouselproducts

### Phase 3
- Pages Catalogue et Product Detail
- Panier fonctionnel
- Processus Checkout

### Phase 4
- Dashboard Admin
- CRUD Produits et Catégories
- Gestion des commandes

### Phase 5
- Tests et optimisations
- Documentation finale
- Déploiement

## 🤝 Contribution

Ce projet est développé pour AtlasSun. Pour contribuer :

1. Suivre les conventions de code
2. Tester localement avant commit
3. Documenter les nouvelles features
4. Créer des tests unitaires

## 📄 Licence

Propriétaire - AtlasSun © 2025

## 👨‍💻 Support

Pour toute question technique :
- Email : support@atlassun.ma
- Documentation : [À venir]

---

**Version** : 1.0.0  
**Date** : Décembre 2025  
**Développé avec** ❤️ pour AtlasSun
