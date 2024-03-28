import { Routes } from "@angular/router";

export const dashboardChildRoutes: Routes = [
    {
        path: '',
        loadComponent: () => import('../pages/dashboard/dashboard.component'),
        data: {
            title: 'Dashboard'
        }
    },
    {
        path: 'progress',
        loadComponent: () => import('../pages/progress/progress.component'),
        data: {
            title: 'Progress'
        }
    },
    {
        path: 'graph1',
        loadComponent: () => import('../pages/graph1/graph1.component'),
        data: {
            title: 'Gráficas'
        }
    },
    {
        path: 'account-settings',
        loadComponent: () => import('../pages/account-setting/account-setting.component'),
        data: {
            title: 'Ajustes de Cuenta'
        }
    },
    {
        path: 'promises',
        loadComponent: () => import('../pages/promises/promises.component'),
        data: {
            title: 'Promesas'
        }
    },
    {
        path: 'rxjs',
        loadComponent: () => import('../pages/rxjs/rxjs.component'),
        data: {
            title: 'RXJS'
        }
    },
    {
        path: '**',
        redirectTo: ''
    }
];