import { Routes } from "@angular/router";

export const dashboardChildRoutes: Routes = [
    {
        path: '',
        loadComponent: () => import('../pages/dashboard/dashboard.component')
    },
    {
        path: 'progress',
        loadComponent: () => import('../pages/progress/progress.component')
    },
    {
        path: 'graph1',
        loadComponent: () => import('../pages/graph1/graph1.component')
    },
    {
        path: '**',
        redirectTo: ''
    }
];