import { Injectable } from '@angular/core';
import {
    HttpEvent,
    HttpInterceptor,
    HttpHandler,
    HttpRequest
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { LoadingService } from '../services/loading.service';

/**
 * Interceptor pour afficher un loader pendant les requêtes HTTP
 */
@Injectable()
export class LoadingInterceptor implements HttpInterceptor {
    private activeRequests = 0;

    constructor(private loadingService: LoadingService) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // Incrémenter le compteur de requêtes et afficher le loader
        if (this.activeRequests === 0) {
            this.loadingService.show();
        }
        this.activeRequests++;

        return next.handle(req).pipe(
            finalize(() => {
                // Décrémenter le compteur et cacher le loader si aucune requête en cours
                this.activeRequests--;
                if (this.activeRequests === 0) {
                    this.loadingService.hide();
                }
            })
        );
    }
}
