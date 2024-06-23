import { ApplicationConfig } from '@angular/core';
import { provideRouter, withViewTransitions } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { AUTH_STRATEGY } from './const/login-strategy';
import { UserNameStrategyService } from './services/auth-strategy/username-auth-strategy.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(
      routes,
      // Para mejorar las transiciones entre rutas
      withViewTransitions()
    ),
    // Para manejo de peticiones HTPP
    provideHttpClient(),

    // Definimos que la estrategia por defecto para login es usuario y password
    // Esto debido a que utilizamos el patron Strategy para diferentes tipos de autenticacion
    { provide: AUTH_STRATEGY, useClass: UserNameStrategyService },
    /**
    **¿Por Qué No Funciona Solo en el Componente Login a pesar de que es un StandAlone?
    Cuando defines el proveedor AUTH_STRATEGY solo en el LoginComponent, la inyección de AuthService falla porque:

    **Alcance del Proveedor: El AuthService se inyecta a nivel de raíz (global) y espera que AUTH_STRATEGY también esté disponible a nivel de raíz. Definir AUTH_STRATEGY solo en el LoginComponent limita su disponibilidad solo a ese componente y sus hijos.
    **Árbol de Inyección de Dependencias: Angular busca dependencias en el árbol de inyección de dependencias. Si AUTH_STRATEGY no está disponible en el árbol raíz cuando AuthService es instanciado, obtendrás un error de inyección.

    **Por este motivo no lo puse a nivel de loginComponent
     */
  ]
};
