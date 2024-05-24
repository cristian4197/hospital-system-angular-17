import { Routes } from '@angular/router';
import { dashboardChildRoutes } from './routes/dashboard.routes';
import { authChildRoutes } from './routes/auth.routes';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
    {
        path: 'dashboard',
        canActivate: [authGuard],
        loadComponent: () => import('./pages/pages.component'),
        children: dashboardChildRoutes
        
    },
    {
        path: 'auth',
        
        loadComponent: () => import('./auth/auth.component'),
        children: authChildRoutes

    },
    {
        path: '',
        redirectTo: 'auth',
        pathMatch: 'full'
    },
    {
        path: '**',
        loadComponent: () => import('./pages/not-page-found/not-page-found.component')
    }
];
