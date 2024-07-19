import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { ModalDeleteHospitalPresenter } from './modal-delete-hospital.presenter';
import { Hospital } from '../../../../models/hospital.model';
import { Subscription } from 'rxjs';
import { IHospitalDeleteResponse } from '../../../../interfaces/hospital-user-delete-response';

@Component({
  selector: 'app-modal-delete-hospital',
  standalone: true,
  imports: [],
  templateUrl: './modal-delete-hospital.component.html',
  styleUrl: './modal-delete-hospital.component.css',
  providers: [ModalDeleteHospitalPresenter]
})
export default class ModalDeleteHospitalComponent {

  @Input() hospital!: Hospital;

  private currentHospital!: Hospital;

  private subscription: Subscription = new Subscription();

  @Output() refreshViewListHospitals = new EventEmitter<void>();

  constructor(private modalDeleteHospitalPresenter: ModalDeleteHospitalPresenter) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (!changes['hospital']) { return; }

    const currentValue = changes['hospital'].currentValue;
    if (currentValue) { this.currentHospital = currentValue as Hospital; }

  }

  deleteHospitalById(): void {
    this.subscription.add(
      this.modalDeleteHospitalPresenter.deleteHospital(this.currentHospital.uid as string).subscribe({
        next: (resp: IHospitalDeleteResponse) => {
          if (resp.ok) {
            this.modalDeleteHospitalPresenter.successfulDeletion();

            this.closeModal();

            this.refreshViewListHospital();
          }
        },
        error: (error: Error) => {
          this.modalDeleteHospitalPresenter.errorDeleting(error);
        }
      })
    );
  }

  private closeModal(): void {
      this.modalDeleteHospitalPresenter.closeModal('#deleteHospitalModal');
  }

  private refreshViewListHospital(): void {
    this.refreshViewListHospitals.emit();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
  
}
