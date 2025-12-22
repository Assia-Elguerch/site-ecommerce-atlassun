import { Pipe, PipeTransform } from '@angular/core';

/**
 * Pipe pour formater les prix en Dirhams marocains (MAD)
 * Usage: {{ prix | madCurrency }}
 * Sortie: "150,00 DH"
 */
@Pipe({
    name: 'madCurrency',
    standalone: true
})
export class MadCurrencyPipe implements PipeTransform {

    transform(value: number | null | undefined): string {
        if (value === null || value === undefined) {
            return '0,00 DH';
        }

        // Formater le nombre avec 2 décimales et virgule comme séparateur décimal
        const formatted = value.toFixed(2).replace('.', ',');

        // Ajouter des espaces pour les milliers
        const parts = formatted.split(',');
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ' ');

        return `${parts.join(',')} DH`;
    }
}
