import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { ApiService } from './api.service';
import { StorageService } from './storage.service';
import {
    User,
    LoginRequest,
    LoginResponse,
    RegisterRequest,
    LoginResponse as AuthResponse,
    UserRole
} from '../models';

/**
 * Service d'authentification avec JWT et OTP
 * Gère connexion, inscription, vérification OTP et sessions
 */
@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private readonly TOKEN_KEY = 'access_token';
    private readonly USER_KEY = 'user';

    private currentUserSubject: BehaviorSubject<User | null>;
    public currentUser$: Observable<User | null>;

    constructor(
        private apiService: ApiService,
        private storageService: StorageService
    ) {
        const storedUser = this.getCurrentUser();
        this.currentUserSubject = new BehaviorSubject<User | null>(storedUser);
        this.currentUser$ = this.currentUserSubject.asObservable();
    }



    /**
     * Login with email/password
     */
    login(credentials: LoginRequest): Observable<AuthResponse> {
        return this.apiService.post<AuthResponse>('/auth/login', credentials)
            .pipe(
                tap(response => this.setSession(response)),
                catchError(error => {
                    console.error('Login error:', error);
                    return throwError(() => error);
                })
            );
    }

    /**
     * Inscription user
     */
    inscription(data: RegisterRequest): Observable<AuthResponse> {
        return this.apiService.post<AuthResponse>('/auth/register', data)
            .pipe(
                // Pour l'inscription, on ne set pas la session tout de suite
                // car on attend la validation 2FA (QR Code)
                // Mais si pas de 2FA, le backend pourrait renvoyer un token directement ?
                // Actuellement le backend renvoie qrCodeUrl et pas de token si 2FA activé
                tap(response => {
                    if (response.token) {
                        this.setSession(response);
                    }
                })
            );
    }

    /**
     * Set authentication session
     */
    private setSession(authResult: AuthResponse): void {
        if (authResult.token) {
            this.storageService.setItem(this.TOKEN_KEY, authResult.token);
            this.storageService.setItem(this.USER_KEY, authResult.user);
            this.currentUserSubject.next(authResult.user);
        }
    }

    /**
     * Logout user
     */
    logout(): void {
        this.storageService.removeItem(this.TOKEN_KEY);
        this.storageService.removeItem(this.USER_KEY);
        this.currentUserSubject.next(null);
    }

    /**
     * Get JWT token
     */
    getToken(): string | null {
        return this.storageService.getItem(this.TOKEN_KEY);
    }

    /**
     * Check if authenticated
     */
    isAuthenticated(): boolean {
        const token = this.getToken();
        if (!token) return false;

        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            const expiration = payload.exp * 1000;
            return Date.now() < expiration;
        } catch {
            return false;
        }
    }

    /**
     * Get current user
     */
    getCurrentUser(): User | null {
        return this.storageService.getItem<User>(this.USER_KEY);
    }

    /**
     * Check if admin
     */
    isAdmin(): boolean {
        const user = this.getCurrentUser();
        return user?.role === UserRole.ADMIN;
    }

    /**
     * Check if vendeur
     */
    isVendeur(): boolean {
        const user = this.getCurrentUser();
        return user?.role === UserRole.VENDEUR;
    }

    /**
     * Check if client
     */
    isClient(): boolean {
        const user = this.getCurrentUser();
        return user?.role === UserRole.CLIENT;
    }

    /**
     * Update user profile
     */
    updateProfile(userData: Partial<User>): Observable<User> {
        return this.apiService.patch<any>('/auth/profile', userData)
            .pipe(
                tap(res => {
                    const user = res.data.user || res.data; // Handle different backend response formats
                    this.storageService.setItem(this.USER_KEY, user);
                    this.currentUserSubject.next(user);
                }),
                catchError(error => {
                    console.error('Update profile error:', error);
                    return throwError(() => error);
                })
            );
    }

    /**
     * Update user profile image
     */
    updateProfileImage(avatar: string): Observable<User> {
        return this.updateProfile({ avatar });
    }

    /**
     * Change password
     */
    changePassword(oldPassword: string, newPassword: string): Observable<{ message: string }> {
        return this.apiService.post<{ message: string }>('/auth/change-password', {
            oldPassword,
            newPassword
        });
    }

    /**
     * Verify 2FA code
     */
    verify2Fa(email: string, token: string, isSetup: boolean): Observable<AuthResponse> {
        return this.apiService.post<AuthResponse>('/auth/verify-2fa', { email, token, isSetup })
            .pipe(
                tap(response => this.setSession(response))
            );
    }

    /**
     * Request password reset
     */
    forgotPassword(email: string): Observable<any> {
        return this.apiService.post('/auth/forgot-password', { email });
    }

    /**
     * Reset password with token
     */
    resetPassword(token: string, password: string): Observable<any> {
        return this.apiService.post(`/auth/reset-password/${token}`, { password });
    }



    /**
     * Refresh JWT token
     */
    refreshToken(): Observable<{ token: string }> {
        return this.apiService.post<{ token: string }>('/auth/refresh', {})
            .pipe(
                tap(response => {
                    this.storageService.setItem(this.TOKEN_KEY, response.token);
                })
            );
    }



    /**
     * Get observable of current user
     */
    get currentUser(): User | null {
        return this.currentUserSubject.value;
    }
}
