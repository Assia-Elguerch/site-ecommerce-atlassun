# Guide de Développement AtlasSun

## Architecture Détaillée

### Flux de Données

```
User Action
    ↓
Component
    ↓
Service (Business Logic)
    ↓
API Service
    ↓
HTTP Interceptors (Auth, Loading)
    ↓
Backend API
    ↓
Response
    ↓
Error Interceptor (if error)
    ↓
Component (update UI)
```

### État de l'Application

L'état est géré via des **BehaviorSubjects** dans les services :

**AuthService**
```typescript
private currentUserSubject: BehaviorSubject<User | null>;
public currentUser$: Observable<User | null>;
```

**CartService**
```typescript
private cartSubject: BehaviorSubject<Cart>;
public cart$: Observable<Cart>;
```

**LoadingService**
```typescript
private loadingSubject: BehaviorSubject<boolean>;
public loading$: Observable<boolean>;
```

## Patterns Utilisés

### 1. Repository Pattern
Chaque entité a son service dédié qui encapsule la logique métier et les appels API.

### 2. Singleton Services
Tous les services utilisent `providedIn: 'root'` pour garantir une seule instance.

### 3. Guard Pattern
Protection des routes avec vérification d'authentification et de rôles.

### 4. Interceptor Pattern
Transformation globale des requêtes/réponses HTTP.

### 5. Observer Pattern
Communication réactive entre composants via Observables.

## Utilisation des Services

### ProductService

```typescript
// Dans un composant
constructor(private productService: ProductService) {}

ngOnInit() {
  // Obtenir tous les produits
  this.productService.getProducts().subscribe(
    products => this.products = products.content
  );

  // Produits en vedette
  this.productService.getFeaturedProducts().subscribe(
    featured => this.featured = featured
  );

  // Recherche
  this.productService.searchProducts('caftan').subscribe(
    results => this.searchResults = results.content
  );
}
```

### CartService

```typescript
// Ajouter au panier
addToCart(product: Product) {
  this.cartService.addToCart(product, 1);
  this.notificationService.success('Produit ajouté au panier');
}

// Observer le panier
ngOnInit() {
  this.cartService.cart$.subscribe(cart => {
    this.cart = cart;
    this.itemCount = this.cartService.getItemCount();
  });
}
```

### AuthService

```typescript
// Connexion
login() {
  this.authService.login({ email, password }).subscribe({
    next: (response) => {
      this.router.navigate(['/']);
      this.notificationService.success('Connexion réussie');
    },
    error: (error) => {
      this.notificationService.error(error.message);
    }
  });
}

// Vérifier le rôle
ngOnInit() {
  this.isAdmin = this.authService.isAdmin();
}
```

## Composants à Créer

### Button Component

```typescript
@Component({
  selector: 'app-button',
  standalone: true,
  template: `
    <button 
      [class]="buttonClass"
      [disabled]="disabled || loading"
      (click)="onClick.emit($event)">
      <span *ngIf="loading">⏳</span>
      <ng-content></ng-content>
    </button>
  `
})
export class ButtonComponent {
  @Input() variant: 'primary' | 'secondary' | 'outline' = 'primary';
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  @Input() disabled = false;
  @Input() loading = false;
  @Output() onClick = new EventEmitter();

  get buttonClass() {
    return `btn btn-${this.variant} btn-${this.size}`;
  }
}
```

Usage :
```html
<app-button 
  variant="primary" 
  [loading]="isLoading"
  (onClick)="submit()">
  Ajouter au panier
</app-button>
```

### Card Component

```typescript
@Component({
  selector: 'app-card',
  standalone: true,
  template: `
    <div [class]="cardClass">
      <ng-content></ng-content>
    </div>
  `
})
export class CardComponent {
  @Input() hover = false;
  @Input() padding: 'sm' | 'md' | 'lg' = 'md';

  get cardClass() {
    return `card p-${this.padding} ${this.hover ? 'card-hover' : ''}`;
  }
}
```

## Best Practices

### 1. OnPush Change Detection

```typescript
@Component({
  selector: 'app-product-list',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductListComponent {}
```

### 2. TrackBy pour *ngFor

```typescript
trackByProductId(index: number, product: Product): number {
  return product.id;
}
```

Template :
```html
<div *ngFor="let product of products; trackBy: trackByProductId">
  {{ product.nom }}
</div>
```

### 3. Async Pipe

```html
<!-- Éviter les subscriptions manuelles -->
<div *ngIf="products$ | async as products">
  <div *ngFor="let product of products">
    {{ product.nom }}
  </div>
</div>
```

### 4. Unsubscribe

```typescript
export class MyComponent implements OnDestroy {
  private destroy$ = new Subject<void>();

  ngOnInit() {
    this.service.getData()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => this.data = data);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
```

### 5. Type Safety

```typescript
// Toujours typer les variables
products: Product[] = [];
loading: boolean = false;
cart$: Observable<Cart>;

// Éviter 'any'
getData(): Observable<Product[]> { // ✅
getData(): Observable<any> { // ❌
```

## Gestion des Erreurs

### Dans les Services

```typescript
getProducts(): Observable<Product[]> {
  return this.apiService.get<Product[]>('produits').pipe(
    catchError(error => {
      console.error('Erreur lors du chargement des produits', error);
      this.notificationService.error('Impossible de charger les produits');
      return of([]); // Retourner un tableau vide
    })
  );
}
```

### Dans les Composants

```typescript
loadProducts() {
  this.loading = true;
  this.productService.getProducts().subscribe({
    next: (products) => {
      this.products = products.content;
      this.loading = false;
    },
    error: (error) => {
      this.loading = false;
      this.errorMessage = error.message;
    }
  });
}
```

## Performance

### Lazy Loading Images

```typescript
// Directive à créer
@Directive({
  selector: 'img[appLazyLoad]'
})
export class LazyLoadDirective {
  @HostBinding('attr.src') srcAttr = null;
  @Input() src: string;

  ngOnInit() {
    // Utiliser IntersectionObserver
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.srcAttr = this.src;
          observer.unobscribe();
        }
      });
    });
    observer.observe(this.el.nativeElement);
  }
}
```

### Préchargement

```typescript
// Dans app.config.ts
provideRouter(
  routes,
  withPreloading(PreloadAllModules) // Précharger tous les modules
)
```

## Tests Unitaires

### Service

```typescript
describe('CartService', () => {
  let service: CartService;
  let storageService: jasmine.SpyObj<StorageService>;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('StorageService', ['getItem', 'setItem']);
    
    TestBed.configureTestingModule({
      providers: [
        CartService,
        { provide: StorageService, useValue: spy }
      ]
    });
    
    service = TestBed.inject(CartService);
    storageService = TestBed.inject(StorageService) as jasmine.SpyObj<StorageService>;
  });

  it('should add item to cart', () => {
    const product: Product = { id: 1, nom: 'Test', prix: 100, ... };
    service.addToCart(product, 1);
    
    expect(service.cart.items.length).toBe(1);
    expect(service.cart.items[0].produit).toEqual(product);
  });
});
```

### Component

```typescript
describe('ProductListComponent', () => {
  let component: ProductListComponent;
  let fixture: ComponentFixture<ProductListComponent>;
  let productService: jasmine.SpyObj<ProductService>;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('ProductService', ['getProducts']);
    
    TestBed.configureTestingModule({
      imports: [ProductListComponent],
      providers: [
        { provide: ProductService, useValue: spy }
      ]
    });
    
    fixture = TestBed.createComponent(ProductListComponent);
    component = fixture.componentInstance;
    productService = TestBed.inject(ProductService) as jasmine.SpyObj<ProductService>;
  });

  it('should load products on init', () => {
    const mockProducts: Product[] = [{ id: 1, ... }];
    productService.getProducts.and.returnValue(of({ content: mockProducts }));
    
    component.ngOnInit();
    
    expect(component.products.length).toBe(1);
  });
});
```

## Déploiement

### Build de Production

```bash
npm run build -- --configuration=production
```

### Optimisations Automatiques

- Minification JavaScript/CSS
- Tree-shaking (suppression code inutilisé)
- AOT Compilation
- Lazy loading des routes
- Service worker (si configuré)

### Variables d'Environnement

Créer `.env` pour les secrets :
```
API_URL=https://api.atlassun.ma/api
API_KEY=votre_cle_secrete
```

Utiliser dans `environment.prod.ts` sans commiter les secrets.

## Conseils de Développement

1. **Commencer petit** : Créer d'abord le layout, puis ajouter les features une par une
2. **Tester régulièrement** : `npm start` et vérifier dans le navigateur
3. **Utiliser les DevTools** : Angular DevTools pour débugger
4. **Console propre** : Pas d'erreurs dans la console
5. **Mobile-first** : Développer d'abord pour mobile
6. **Accessibilité** : Utiliser les balises sémantiques
7. **SEO** : Meta tags, h1 unique par page
8. **Performance** : Lazy loading, trackBy, OnPush

## Ressources

- [Documentation Angular](https://angular.dev)
- [RxJS Documentation](https://rxjs.dev)
- [SCSS Documentation](https://sass-lang.com)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

---

**Bonne continuation sur AtlasSun !** 🚀
