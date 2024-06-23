import { Inject, Injectable } from '@angular/core';
import { IDataLoginStrategy, ILoginStrategy } from '../../interfaces/login-strategy';
import { AUTH_STRATEGY } from '../../const/login-strategy';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
    /** AuthService es la clase Contexto:
     * Debe tener un campo para almacenar una referencia a una de las estrategias. El contexto delega el trabajo a un objeto de estrategia vinculado en lugar de ejecutarlo por su cuenta.
     */

    private strategy!: ILoginStrategy;

    // Es necesario inyectar este token debido a que es una interfaz y angular no sabe que clase inyectar debido a que 
    // la clase se dara de manera dinamica al setear una estrategia
    constructor(@Inject(AUTH_STRATEGY) strategy: ILoginStrategy) {
        this.strategy = strategy;
     }

    public setStrategy(strategy: ILoginStrategy) {
        this.strategy = strategy;
    }

    public signIn(data: IDataLoginStrategy): Observable<any> {
        if (!this.strategy) {
            throw new Error('Auth strategy is not set');
        }

       return this.strategy.signIn(data);
    }
}