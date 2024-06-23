import { Routes } from "@angular/router";
import { usersChildRoutes } from "./user.routes";

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
        path: 'profile',
        loadComponent: () => import('../pages/profile/profile.component'),
        data: {
            title: 'Profile'
        }
    },
    // CRUDS
    {
        path: 'users',
        loadComponent: () => import('../pages/cruds/user/user.component'),
        data: {
            title: 'Usuarios de Aplicación'
        },
        children: usersChildRoutes
    },
    {
        path: 'doctors',
        loadComponent: () => import('../pages/cruds/doctor/doctor.component'),
        data: {
            title: 'Doctores de Aplicación'
        }
    },
    {
        path: 'hospitals',
        loadComponent: () => import('../pages/cruds/hospital/hospital.component'),
        data: {
            title: 'Hospitales de aplicación'
        }
    },
    {
        path: '**',
        redirectTo: ''
    }
];