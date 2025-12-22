import { Injectable } from '@angular/core';

/**
 * Service de stockage local
 * Encapsule localStorage avec gestion des erreurs et typage
 */
@Injectable({
    providedIn: 'root'
})
export class StorageService {

    /**
     * Enregistrer un élément dans le stockage
     */
    setItem<T>(key: string, value: T): void {
        try {
            const serializedValue = JSON.stringify(value);
            localStorage.setItem(key, serializedValue);
        } catch (error) {
            console.error(`Erreur lors de l'enregistrement de ${key}:`, error);
        }
    }

    /**
     * Récupérer un élément du stockage
     */
    getItem<T>(key: string): T | null {
        try {
            const item = localStorage.getItem(key);
            if (item === null) {
                return null;
            }
            return JSON.parse(item) as T;
        } catch (error) {
            console.error(`Erreur lors de la récupération de ${key}:`, error);
            return null;
        }
    }

    /**
     * Supprimer un élément du stockage
     */
    removeItem(key: string): void {
        try {
            localStorage.removeItem(key);
        } catch (error) {
            console.error(`Erreur lors de la suppression de ${key}:`, error);
        }
    }

    /**
     * Vider tout le stockage
     */
    clear(): void {
        try {
            localStorage.clear();
        } catch (error) {
            console.error('Erreur lors du vidage du stockage:', error);
        }
    }

    /**
     * Vérifier si une clé existe
     */
    hasItem(key: string): boolean {
        return localStorage.getItem(key) !== null;
    }

    /**
     * Obtenir toutes les clés
     */
    getAllKeys(): string[] {
        const keys: string[] = [];
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key) {
                keys.push(key);
            }
        }
        return keys;
    }
}
