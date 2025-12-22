import { Injectable } from '@angular/core';
import {
    HttpEvent,
    HttpInterceptor,
    HttpHandler,
    HttpRequest,
    HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { NotificationService } from '../services/notification.service';

/**
 * Interceptor pour gérer les erreurs HTTP globalement
 */
@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

    constructor(
        private router: Router,
        private authService: AuthService,
        private notificationService: NotificationService
    ) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(req).pipe(
            catchError((error: HttpErrorResponse) => {
                let errorMessage = 'Une erreur est survenue';

                if (error.error instanceof ErrorEvent) {
                    // Erreur côté client
                    errorMessage = `Erreur: ${error.error.message}`;
                } else {
                    // Erreur côté serveur
                    switch (error.status) {
                        case 0:
                            errorMessage = 'Impossible de contacter le serveur';
                            break;
                        case 401:
                            // UNAUTORIZED
                            errorMessage = 'Session expirée. Veuillez vous reconnecter.';
                            this.authService.logout();
                            this.router.navigate(['/unauthorized']); // Premium Page
                            break;
                        case 403:
                            // FORBIDDEN
                            errorMessage = 'Accès interdit';
                            this.router.navigate(['/unauthorized']); // Premium Page
                            break;
                        case 404:
                            // NOT FOUND
                            errorMessage = 'Ressource non trouvée';
                            this.router.navigate(['/error']); // Premium Page
                            break;
                        case 422:
                            errorMessage = error.error?.message || 'Données invalides';
                            break;
                        case 500:
                        case 502:
                        case 503:
                        case 504:
                            // SERVER ERROR
                            errorMessage = 'Erreur serveur interne';
                            this.router.navigate(['/server-error']); // Premium Page
                            break;
                        default:
                            errorMessage = error.error?.message || `Erreur ${error.status}`;
                    }
                }

                // Afficher notification d'erreur
                this.notificationService.error(errorMessage);

                return throwError(() => new Error(errorMessage));
            })
        );
    }
}
