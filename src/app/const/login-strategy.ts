import { InjectionToken } from "@angular/core";
import { ILoginStrategy } from "../interfaces/login-strategy";

export const AUTH_STRATEGY = new InjectionToken<ILoginStrategy>('AuthStrategy');
/**Explicación de esto */

// ¿Qué es un InjectionToken?
// Un InjectionToken es una forma de decirle a Angular qué tipo de objeto debe inyectar. Normalmente, cuando inyectas una clase en un constructor, Angular usa el tipo de la clase para identificar la dependencia. Sin embargo, para interfaces o tipos abstractos (como ILoginStrategy), Angular necesita un identificador explícito. Aquí es donde entra en juego InjectionToken.

// * new InjectionToken<AuthStrategy>('ILoginStrategy'): Estamos creando una nueva instancia de InjectionToken. El genérico <ILoginStrategy> especifica que este token es para algo que implementa la interfaz AuthStrategy.

// *'ILoginStrategy': Este es solo un nombre descriptivo para el token. Este nombre se usa principalmente para propósitos de depuración y desarrollo.

