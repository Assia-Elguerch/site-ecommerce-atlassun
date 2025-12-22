import { Routes } from '@angular/router';

export const CATALOGUE_ROUTES: Routes = [
    {
        path: '',
        loadComponent: () => import('./catalogue.component').then(m => m.CatalogueComponent)
    }
];
