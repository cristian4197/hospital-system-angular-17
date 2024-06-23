import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { User } from '../../../../models/user.model';
import { Observable, Subscription, debounceTime, distinctUntilChanged, of, switchMap } from 'rxjs';
import { IResponseDataUser } from '../../../../interfaces/reponse-get-user';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import UserDeleteComponent from '../user-delete/user-delete.component';
import { CommonModule } from '@angular/common';
import { UserListPresenter } from './user-list.presenter';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, UserDeleteComponent],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.css',
  providers: [UserListPresenter]
})
export default class UserComponent implements OnInit, OnDestroy, AfterViewInit {
  public users: User[] = [];

  public currentUserSession!: User;

  public totalUsers: number = 0;

  private from: number = 0;

  private subscriptions: Subscription = new Subscription();

  public load: boolean = false;

  searchControl: FormControl = new FormControl();

  private tooltipElement!: HTMLElement | null;

  public currentUserSelected!: User;

  constructor(private userListPresenter: UserListPresenter) { }

  ngOnInit(): void {
    this.setUsers();
    this.searchUser();
    this.getCurrentUserSession();
  }

  getCurrentUserSession(): void {
    this.subscriptions.add(
      this.userListPresenter.getCurrentUserSession().subscribe({
        next: (user: User) => {
          this.currentUserSession = user;
        },
        error: (error) => { console.error(error); }
      })
    );
  }

  // Aquí inicializamos los tooltips por primera vez
  ngAfterViewInit() {
    this.initTooltips();
  }

  // Este hook se ejecuta después de que la vista del componente ha sido verificada y actualizada. Aquí reinicializamos los tooltips para asegurarnos de que estén activos en los nuevos elementos que hayan sido creados dinámicamente
  ngAfterViewChecked() {
    this.initTooltips();
  }

  initTooltips(): void {
    this.userListPresenter.initTooltips();
  }

  private setUsers(): void {
    this.subscriptions.add(
      this.userListPresenter.getUsers(this.from).subscribe({
        next: (resp: IResponseDataUser) => {
          this.reloadViewData(resp);
        },
        error: (error) => {
          this.userListPresenter.errorGeneric();
        },
        complete: () => { }
      })
    );
  }

  private reloadViewData(resp: IResponseDataUser): void {
    this.users = resp.users;
    this.totalUsers = resp.total;
    this.load = true;
  }

  public nextOrPreviusPage(value: number): void {
    // Guardamos el from actual
    const currentFrom = this.from;
    this.from = this.from + value;

    if (this.from < 0) {
      // Lo ponemos en cero para inabilitar
      this.from = 0;
      return;
    };

    if (this.from > 0 && this.from > this.totalUsers) {
      // Si el from se paso lo dejamos en la pagina actual
      this.from = currentFrom;
      return;
    }

    this.setUsers();
  }

  private searchUser(): void {
    this.subscriptions.add(
      this.searchControl.valueChanges.pipe(
        debounceTime(300), // Espera 300ms después del último evento
        distinctUntilChanged(), // Emite solo si el valor es diferente del anterior
        switchMap((value: string) => {
          return this.getResponseSearchUsers(value);
        }
        )
      ).subscribe({
        next: (users: User[]) => { this.users = users; },
        error: (err) => { console.error(err); }
      })
    );
  }

  private getResponseSearchUsers(value: string): Observable<User[]> {
    if (!value) {
      this.resetCurrentView();
      return of(this.users);
    }
    return this.userListPresenter.searchUserByName(value);
  }

  private resetCurrentView(): void {
    this.from = 0; //Seteamos el from a 0 para la primera vista
    this.setUsers();//Regresamos a la primera vista
  }

  private clearTooltip(): void {
    // Encuentra el tooltip por su clase, id u otro selector
    this.tooltipElement = document.querySelector('.tooltip');
    this.userListPresenter.clearTooltip(this.tooltipElement);
  }


  openModalDeleteUser(event: Event, user: User) {
    this.userListPresenter.openModal('#deleteUserModal');

    this.currentUserSelected = user;

  }


  refreshListUser(): void {
    this.setUsers();
  }


  ngOnDestroy(): void {
    this.clearTooltip();
    this.subscriptions.unsubscribe();
  }
}
