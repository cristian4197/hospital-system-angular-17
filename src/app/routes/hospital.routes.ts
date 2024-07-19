import { Routes } from "@angular/router";

export const hospitalChildRoutes: Routes = [
    {
        path: 'hospital-list',
        loadComponent: () => import('../pages/cruds/hospital/hospital-list/hospital-list.component'),
        data: {
            title: 'lista de Hospitales'
        }
    },
    {
        path: 'hospital-update',
        loadComponent: () => import('../pages/cruds/hospital/hospital-update/hospital-update.component'),
        data: {
            title: 'Actualización de Hospitales'
        }
    },
    {
        path: 'hospital-delete',
        loadComponent: () => import('../pages/cruds/hospital/modal-delete-hospital/modal-delete-hospital.component'),
        data: {
            title: 'Borrado de Hospitales'
        }
    },
    {
        path: '**',
        redirectTo: 'hospital-list'
    }
]