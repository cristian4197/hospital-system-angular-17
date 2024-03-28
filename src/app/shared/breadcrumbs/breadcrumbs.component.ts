import { Component, OnDestroy, inject } from '@angular/core';
import { ActivationEnd, Data, Router } from '@angular/router';
import { Observable, Subscription, filter, map } from 'rxjs';

@Component({
  selector: 'app-breadcrumbs',
  standalone: true,
  imports: [],
  templateUrl: './breadcrumbs.component.html',
  styles: ``
})
export class BreadcrumbsComponent implements OnDestroy {
  public router = inject(Router);
  public title = '';
  private suscription!: Subscription;

  constructor() {
    this.addSuscriptionRoutes();
  }

  addSuscriptionRoutes(): void {
    this.suscription = this.getDataRoutes().subscribe({
      next: (value) => {
        console.log(value['title']);
        this.title = value['title'];
        document.title = `AdminPro - ${value['title']}`;
      }
    });
  }

  getDataRoutes():Observable<Data> {
    return this.router.events.
      pipe(
        filter((event): event is ActivationEnd => event instanceof ActivationEnd),
        filter((event: ActivationEnd) => event.snapshot.firstChild === null),
        map((event: ActivationEnd) => event.snapshot.data)
      );
  }

  ngOnDestroy(): void {
    this.deleteSuscriptionRoutes();
  }

  deleteSuscriptionRoutes(): void{
    this.suscription.unsubscribe();
  }

}
