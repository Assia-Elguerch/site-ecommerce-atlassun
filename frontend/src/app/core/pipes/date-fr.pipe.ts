import { Pipe, PipeTransform } from '@angular/core';

/**
 * Pipe pour formater les dates en français
 * Usage: {{ date | dateFr }}
 * Sortie: "15 décembre 2025"
 */
@Pipe({
    name: 'dateFr',
    standalone: true
})
export class DateFrPipe implements PipeTransform {

    private readonly mois = [
        'janvier', 'février', 'mars', 'avril', 'mai', 'juin',
        'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'
    ];

    transform(value: Date | string | null | undefined, format: 'short' | 'long' = 'long'): string {
        if (!value) {
            return '';
        }

        const date = typeof value === 'string' ? new Date(value) : value;

        if (isNaN(date.getTime())) {
            return '';
        }

        const jour = date.getDate();
        const moisIndex = date.getMonth();
        const annee = date.getFullYear();

        if (format === 'short') {
            return `${jour.toString().padStart(2, '0')}/${(moisIndex + 1).toString().padStart(2, '0')}/${annee}`;
        }

        return `${jour} ${this.mois[moisIndex]} ${annee}`;
    }
}
