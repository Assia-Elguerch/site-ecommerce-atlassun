import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

/**
 * Guard pour restreindre l'accès aux administrateurs
 * Redirige vers la page d'accueil si non admin
 */
export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Check if authenticated AND admin
  if (authService.isAuthenticated() && authService.isAdmin()) {
    return true;
  }

  // If authenticated but not admin, redirect to home
  if (authService.isAuthenticated()) {
    router.navigate(['/home']);
  } else {
    // If not authenticated, redirect to login
    router.navigate(['/auth/login'], {
      queryParams: { returnUrl: state.url }
    });
  }

  return false;
};
