import { ApplicationConfig } from '@angular/core';
import { provideRouter, withViewTransitions } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { UserNameStrategyService } from './services/auth-strategy/username-auth-strategy.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(
      routes,
      // Para mejorar las transiciones entre rutas
      withViewTransitions()
    ),
    // Para manejo de peticiones HTPP
    provideHttpClient()
  ]
};
