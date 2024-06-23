import { Routes } from "@angular/router";

export const usersChildRoutes: Routes = [
    {
        path: 'user-list',
        loadComponent: () => import('../pages/cruds/user/user-list/user-list.component'),
        data: {
            title: 'lista de Usuarios'
        }
    },
    {
        path: 'user-update',
        loadComponent: () => import('../pages/cruds/user/user-update/user-update.component'),
        data: {
            title: 'Actualización de Usuarios'
        }
    },
    {
        path: 'user-delete',
        loadComponent: () => import('../pages/cruds/user/user-delete/user-delete.component'),
        data: {
            title: 'Borrado de Usuarios'
        }
    },
    {
        path: '**',
        redirectTo: 'user-list'
    }
]