import { Component, EventEmitter, Input, OnChanges, OnDestroy, Output, SimpleChanges } from '@angular/core';
import { User } from '../../../../models/user.model';
import { Subscription } from 'rxjs';
import { IDeleteUser } from '../../../../interfaces/user';
import Swal from 'sweetalert2';
import { UserDeletePresenter } from './user-delete.presenter';
declare var $: any;

@Component({
  selector: 'app-user-delete',
  standalone: true,
  imports: [],
  templateUrl: './user-delete.component.html',
  styleUrl: './user-delete.component.css',
  providers: [UserDeletePresenter]
})
export default class UserDeleteComponent implements OnChanges, OnDestroy {

  @Input() user!: User;

  @Output() refreshViewListUsers = new EventEmitter<void>();

  private currentUser!: User;

  private subscription: Subscription = new Subscription();

  constructor(private userDeletePresenter: UserDeletePresenter) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (!changes['user']) { return; }

    const currentValue = changes['user'].currentValue;
    if (currentValue) { this.currentUser = currentValue as User; }

  }


  deleteUserById(): void {
    this.subscription.add(
      this.userDeletePresenter.deleteUser(this.currentUser.uid as string).subscribe({
        next: (resp: IDeleteUser) => {
          if (resp.ok) {
            this.userDeletePresenter.successfulDeletion();

            this.closeModal();

            this.refreshViewListUser();
          }
        },
        error: (error: Error) => {
          this.userDeletePresenter.errorDeleting(error);
        }
      })
    );
  }

  private closeModal(): void {
      this.userDeletePresenter.closeModal('#deleteUserModal');
  }

  private refreshViewListUser(): void {
    this.refreshViewListUsers.emit();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
