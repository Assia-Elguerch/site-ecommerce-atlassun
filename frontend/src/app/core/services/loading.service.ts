import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

/**
 * Service de gestion du loader global
 */
@Injectable({
    providedIn: 'root'
})
export class LoadingService {
    private loadingSubject = new BehaviorSubject<boolean>(false);
    public loading$: Observable<boolean> = this.loadingSubject.asObservable();

    /**
     * Afficher le loader
     */
    show(): void {
        this.loadingSubject.next(true);
    }

    /**
     * Cacher le loader
     */
    hide(): void {
        this.loadingSubject.next(false);
    }

    /**
     * Obtenir l'état actuel du loader
     */
    get isLoading(): boolean {
        return this.loadingSubject.value;
    }
}
