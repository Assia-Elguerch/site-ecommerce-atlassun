import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export interface Notification {
    type: 'success' | 'error' | 'warning' | 'info';
    message: string;
    duration?: number;
}

/**
 * Service de notifications toast
 */
@Injectable({
    providedIn: 'root'
})
export class NotificationService {
    private notificationSubject = new Subject<Notification>();
    public notification$ = this.notificationSubject.asObservable();

    /**
     * Afficher une notification de succès
     */
    success(message: string, duration: number = 3000): void {
        this.show({ type: 'success', message, duration });
    }

    /**
     * Afficher une notification d'erreur
     */
    error(message: string, duration: number = 5000): void {
        this.show({ type: 'error', message, duration });
    }

    /**
     * Afficher une notification d'avertissement
     */
    warning(message: string, duration: number = 4000): void {
        this.show({ type: 'warning', message, duration });
    }

    /**
     * Afficher une notification d'information
     */
    info(message: string, duration: number = 3000): void {
        this.show({ type: 'info', message, duration });
    }

    /**
     * Afficher une notification
     */
    private show(notification: Notification): void {
        this.notificationSubject.next(notification);
    }
}
