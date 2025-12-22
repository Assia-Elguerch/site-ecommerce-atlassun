import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { adminGuard } from './core/guards/admin.guard';

export const routes: Routes = [
    // Redirect root to login
    {
        path: '',
        redirectTo: 'auth/login',
        pathMatch: 'full'
    },

    // Auth routes
    {
        path: 'auth',
        children: [
            {
                path: 'login',
                loadComponent: () => import('./features/auth/login.component').then(m => m.LoginComponent)
            },
            {
                path: 'register',
                loadComponent: () => import('./features/auth/register.component').then(m => m.RegisterComponent)
            },
            {
                path: 'forgot-password',
                loadComponent: () => import('./features/auth/forgot-password.component').then(m => m.ForgotPasswordComponent)
            },
            {
                path: 'reset-password/:token',
                loadComponent: () => import('./features/auth/reset-password.component').then(m => m.ResetPasswordComponent)
            }
        ]
    },

    // Client routes (after login)
    {
        path: 'home',
        loadComponent: () => import('./features/home/home.component').then(m => m.HomeComponent)
    },
    {
        path: 'catalogue',
        loadComponent: () => import('./features/catalogue/catalogue.component').then(m => m.CatalogueComponent)
    },
    {
        path: 'product/:id',
        loadComponent: () => import('./features/product-details/product-details.component').then(m => m.ProductDetailsComponent)
    },
    {
        path: 'panier',
        loadComponent: () => import('./features/cart/cart.component').then(m => m.CartComponent)
    },
    {
        path: 'nouveautes',
        loadComponent: () => import('./features/new-arrivals/new-arrivals.component').then(m => m.NewArrivalsComponent)
    },
    {
        path: 'promotions',
        loadComponent: () => import('./features/promotions/promotions.component').then(m => m.PromotionsComponent)
    },
    {
        path: 'about',
        loadComponent: () => import('./features/about/about.component').then(m => m.AboutComponent)
    },
    {
        path: 'contact',
        loadComponent: () => import('./features/contact/contact.component').then(m => m.ContactComponent)
    },
    {
        path: 'wishlist',
        loadComponent: () => import('./features/wishlist/wishlist.component').then(m => m.WishlistComponent),
        canActivate: [authGuard]
    },
    {
        path: 'order-tracking',
        loadComponent: () => import('./features/order-tracking/order-tracking.component').then(m => m.OrderTrackingComponent)
    },
    {
        path: 'help',
        loadComponent: () => import('./features/help/help.component').then(m => m.HelpComponent)
    },
    {
        path: 'profil',
        loadComponent: () => import('./features/profile/profile.component').then(m => m.ProfileComponent),
        canActivate: [authGuard]
    },

    // Protected routes (auth required)
    {
        path: 'checkout',
        loadComponent: () => import('./features/checkout/checkout.component').then(m => m.CheckoutComponent),
        canActivate: [authGuard]
    },
    {
        path: 'profil',
        loadComponent: () => import('./features/profile/profile.component').then(m => m.ProfileComponent),
        canActivate: [authGuard]
    },

    // Admin routes (admin only)
    {
        path: 'admin',
        loadChildren: () => import('./features/admin/admin.routes').then(m => m.ADMIN_ROUTES),
        canActivate: [authGuard, adminGuard]
    },

    // Error Routes
    {
        path: 'error',
        loadComponent: () => import('./features/errors/not-found/not-found.component').then(m => m.NotFoundComponent)
    },
    {
        path: 'unauthorized',
        loadComponent: () => import('./features/errors/unauthorized/unauthorized.component').then(m => m.UnauthorizedComponent)
    },
    {
        path: 'server-error',
        loadComponent: () => import('./features/errors/server-error/server-error.component').then(m => m.ServerErrorComponent)
    },

    // 404 (Must be last)
    {
        path: '**',
        redirectTo: 'error'
    }
];
