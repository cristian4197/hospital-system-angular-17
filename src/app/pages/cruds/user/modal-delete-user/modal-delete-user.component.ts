import { Component, EventEmitter, Input, OnChanges, OnDestroy, Output, SimpleChanges } from '@angular/core';
import { User } from '../../../../models/user.model';
import { Subscription } from 'rxjs';
import { IDeleteUser } from '../../../../interfaces/user';
import Swal from 'sweetalert2';
import { ModalDeleteUserPresenter } from './modal-delete-user.presenter';
declare var $: any;

@Component({
  selector: 'app-modal-delete-user',
  standalone: true,
  imports: [],
  templateUrl: './modal-delete-user.component.html',
  styleUrl: './modal-delete-user.component.css',
  providers: [ModalDeleteUserPresenter]
})
export default class ModalDeleteUserComponent implements OnChanges, OnDestroy {

  @Input() user!: User;

  @Output() refreshViewListUsers = new EventEmitter<void>();

  private currentUser!: User;

  private subscription: Subscription = new Subscription();

  constructor(private modalDeleteUserPresenter: ModalDeleteUserPresenter) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (!changes['user']) { return; }

    const currentValue = changes['user'].currentValue;
    if (currentValue) { this.currentUser = currentValue as User; }

  }


  deleteUserById(): void {
    this.subscription.add(
      this.modalDeleteUserPresenter.deleteUser(this.currentUser.uid as string).subscribe({
        next: (resp: IDeleteUser) => {
          if (resp.ok) {
            this.modalDeleteUserPresenter.successfulDeletion();

            this.closeModal();

            this.refreshViewListUser();
          }
        },
        error: (error: Error) => {
          this.modalDeleteUserPresenter.errorDeleting(error);
        }
      })
    );
  }

  private closeModal(): void {
      this.modalDeleteUserPresenter.closeModal('#deleteUserModal');
  }

  private refreshViewListUser(): void {
    this.refreshViewListUsers.emit();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
