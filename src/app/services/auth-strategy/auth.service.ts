import { Inject, Injectable } from '@angular/core';
import { ILoginStrategy } from '../../interfaces/login-strategy';
import { Observable } from 'rxjs';
import { ILoginResponse } from '../../interfaces/login-reponse';

@Injectable({ providedIn: 'root' })
export class AuthService<T, R> {
    /** AuthService es la clase Contexto:
     * Debe tener un campo para almacenar una referencia a una de las estrategias. El contexto delega el trabajo a un objeto de estrategia vinculado en lugar de ejecutarlo por su cuenta.
     */
    /**Vamos a Definir 2 genericos
     * T = para la data que se enviá al backend ya que puede ser diferente
     * R = para la data que se retorna del backend ya que puede ser diferente
     */

    private strategy!: ILoginStrategy<T, R>;

    public setStrategy(strategy: ILoginStrategy<T, R>): void {
        this.strategy = strategy;
    }
    
    public signIn(data: T): Observable<R> {
        if (!this.strategy) {
            throw new Error('Auth strategy is not set');
        }

       return this.strategy.signIn(data);
    }
}