import { Routes } from "@angular/router";

export const authChildRoutes: Routes = [
    {
        path: 'login',
        loadComponent: () => import('../auth/login/login.component')
    },
    {
        path: 'register',
        loadComponent: () => import('../auth/register/register.component')
    },
    {
        path: '**',
        redirectTo: 'login'
    }
];