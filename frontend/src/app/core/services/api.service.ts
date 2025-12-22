import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

/**
 * Service API de base
 * Fournit des méthodes génériques pour les requêtes HTTP
 */
@Injectable({
    providedIn: 'root'
})
export class ApiService {
    private baseUrl = environment.apiUrl;

    constructor(private http: HttpClient) { }

    /**
     * Requête GET
     */
    get<T>(endpoint: string, params?: any): Observable<T> {
        const httpParams = this.buildHttpParams(params);
        return this.http.get<T>(`${this.baseUrl}${this.normalizeEndpoint(endpoint)}`, { params: httpParams })
            .pipe(catchError(this.handleError));
    }

    /**
     * Requête POST
     */
    post<T>(endpoint: string, body: any): Observable<T> {
        return this.http.post<T>(`${this.baseUrl}${this.normalizeEndpoint(endpoint)}`, body)
            .pipe(catchError(this.handleError));
    }

    /**
     * Requête PUT
     */
    put<T>(endpoint: string, body: any): Observable<T> {
        return this.http.put<T>(`${this.baseUrl}${this.normalizeEndpoint(endpoint)}`, body)
            .pipe(catchError(this.handleError));
    }

    /**
     * Requête PATCH
     */
    patch<T>(endpoint: string, body: any): Observable<T> {
        return this.http.patch<T>(`${this.baseUrl}${this.normalizeEndpoint(endpoint)}`, body)
            .pipe(catchError(this.handleError));
    }

    /**
     * Requête DELETE
     */
    delete<T>(endpoint: string): Observable<T> {
        return this.http.delete<T>(`${this.baseUrl}${this.normalizeEndpoint(endpoint)}`)
            .pipe(catchError(this.handleError));
    }

    /**
     * Normalize endpoint to ensure it starts with /
     */
    private normalizeEndpoint(endpoint: string): string {
        return endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    }

    /**
     * Upload de fichier
     */
    uploadFile<T>(endpoint: string, file: File, additionalData?: any): Observable<T> {
        const formData = new FormData();
        formData.append('file', file);

        if (additionalData) {
            Object.keys(additionalData).forEach(key => {
                formData.append(key, additionalData[key]);
            });
        }

        return this.http.post<T>(`${this.baseUrl}${this.normalizeEndpoint(endpoint)}`, formData)
            .pipe(catchError(this.handleError));
    }

    /**
     * Upload multiple fichiers
     */
    uploadFiles<T>(endpoint: string, files: File[], additionalData?: any): Observable<T> {
        const formData = new FormData();

        files.forEach((file, index) => {
            formData.append(`files[${index}]`, file);
        });

        if (additionalData) {
            Object.keys(additionalData).forEach(key => {
                formData.append(key, additionalData[key]);
            });
        }

        return this.http.post<T>(`${this.baseUrl}${this.normalizeEndpoint(endpoint)}`, formData)
            .pipe(catchError(this.handleError));
    }

    /**
     * Construction des HttpParams depuis un objet
     */
    private buildHttpParams(params?: any): HttpParams {
        let httpParams = new HttpParams();

        if (params) {
            Object.keys(params).forEach(key => {
                if (params[key] !== null && params[key] !== undefined) {
                    if (Array.isArray(params[key])) {
                        params[key].forEach((value: any) => {
                            httpParams = httpParams.append(key, value.toString());
                        });
                    } else {
                        httpParams = httpParams.append(key, params[key].toString());
                    }
                }
            });
        }

        return httpParams;
    }

    /**
     * Gestion globale des erreurs
     */
    private handleError(error: any): Observable<never> {
        console.error('Erreur API:', error);

        let errorMessage = 'Une erreur est survenue';

        if (error.error instanceof ErrorEvent) {
            // Erreur côté client
            errorMessage = `Erreur: ${error.error.message}`;
        } else {
            // Erreur côté serveur
            if (error.status === 0) {
                errorMessage = 'Impossible de contacter le serveur';
            } else if (error.status === 401) {
                errorMessage = 'Non autorisé';
            } else if (error.status === 403) {
                errorMessage = 'Accès interdit';
            } else if (error.status === 404) {
                errorMessage = 'Ressource non trouvée';
            } else if (error.status === 500) {
                errorMessage = 'Erreur serveur interne';
            } else if (error.error?.message) {
                errorMessage = error.error.message;
            } else {
                errorMessage = `Erreur ${error.status}: ${error.statusText}`;
            }
        }

        return throwError(() => new Error(errorMessage));
    }
}
