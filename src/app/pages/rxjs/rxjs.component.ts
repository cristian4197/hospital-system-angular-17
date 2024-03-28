import { Component, OnDestroy } from '@angular/core';
import { Observable, Subscription, interval } from 'rxjs';
import { filter, map, retry, take } from 'rxjs/operators';

@Component({
  selector: 'app-rxjs',
  standalone: true,
  imports: [],
  templateUrl: './rxjs.component.html',
  styleUrl: './rxjs.component.css'
})
export default class RxjsComponent implements OnDestroy {
  intervalSuscription!: Subscription;
  constructor() {
   

    // this.returnObservable().pipe(
    //   // Intenta 2 veces el proceso a pesar del error
    //   retry(2)
    // ).subscribe(
    //   {
    //     next(value) {
    //       console.log('Subs:',value);          
    //     },
    //     error(err) {
    //       console.warn('Error:',err);
    //     },
    //     complete() {
    //       console.info('Obs Terminado');
    //     }
    //   }
      
    // );

  //  this.intervalSuscription = this.returnInterval().subscribe({
  //     next(value) {
  //       console.log(value);
        
  //     },
  //   });
    
  }
  
  returnInterval(): Observable<number> {
    return interval(500).pipe(
      // Transforma el valor y le suma 1
      map( value => value + 1),
      // Filtra la informacion a solo pares
      filter(value => value % 2 ===0),
      // Emite solo 10 valores
      take(10)
      );
    }
    
    returnObservable(): Observable<number> {
      let i = -1;
      return new Observable<number>(observer => {
        const interval = setInterval(() => {
          
          i++;
          observer.next(i);
          if(i ===2) {
            observer.error('i llegó al Valor de 2');
          }
          
          if(i === 4) {
            //Limpiamos el interval
            clearInterval(interval);
            //concluimos la emision de valores en el observable
            observer.complete();
          }
        }, 1000);
        
      });
    }

    ngOnDestroy(): void {
      // this.intervalSuscription.unsubscribe();
    }

}
