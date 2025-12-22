import { Pipe, PipeTransform } from '@angular/core';

/**
 * Pipe pour tronquer le texte
 * Usage: {{ texte | truncate:50 }}
 */
@Pipe({
    name: 'truncate',
    standalone: true
})
export class TruncatePipe implements PipeTransform {

    transform(value: string | null | undefined, limit: number = 100, trail: string = '...'): string {
        if (!value) {
            return '';
        }

        if (value.length <= limit) {
            return value;
        }

        return value.substring(0, limit) + trail;
    }
}
