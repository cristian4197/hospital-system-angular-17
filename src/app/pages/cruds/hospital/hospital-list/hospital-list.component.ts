import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HospitalPresenter } from './hospital-list.presenter';
import { debounceTime, distinctUntilChanged, Observable, of, Subscription, switchMap } from 'rxjs';
import { User } from '../../../../models/user.model';
import { InputSearchComponent } from '../../../../components/input-search/input-search.component';
import { SpinnerComponent } from '../../../../components/spinner/spinner.component';
import { Hospital } from '../../../../models/hospital.model';
import ModalDeleteHospitalComponent from '../modal-delete-hospital/modal-delete-hospital.component';
import { ModalCreateHospitalComponent } from '../modal-create-hospital/modal-create-hospital.component';
import { IResponseDataHospital } from '../../../../interfaces/response-get-hospitals';

@Component({
  selector: 'app-hospital-list',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, InputSearchComponent, SpinnerComponent, ModalDeleteHospitalComponent, ModalCreateHospitalComponent],
  templateUrl: './hospital-list.component.html',
  styleUrl: './hospital-list.component.css',
  providers: [HospitalPresenter]
})
export default class ListHospitalComponent implements OnInit, OnDestroy, AfterViewInit {

  public form = this.fb.group({
    searchControl: ['']
  });

  private from: number = 0;

  private subscriptions: Subscription = new Subscription();

  public load: boolean = false;

  placeHolderSearchInput = 'Buscando Hospitales...'

  private tooltipElement!: HTMLElement | null;

  public currentHospitalSelected!: Hospital;

  public currentUserSession!: User;

  public hospitals: Hospital[] = [];

  public totalHospitals: number = 0;

  private currentUser!: User;

  showModalAddHospital = false;

  constructor(private hospitalPresenter: HospitalPresenter, private fb: FormBuilder) { }

  ngOnInit(): void {
    this.setHospitals();
    this.searchHospital();
    this.getCurrentUserSession();
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
    this.hospitalPresenter.initTooltips();
  }

  get searchControl(): FormControl {
    return this.form.get('searchControl') as FormControl;
  }

  private clearTooltip(): void {
    // Encuentra el tooltip por su clase, id u otro selector
    this.tooltipElement = document.querySelector('.tooltip');
    this.hospitalPresenter.clearTooltip(this.tooltipElement);
  }

  private getCurrentUserSession(): void {
    this.subscriptions.add(
      this.hospitalPresenter.getCurrentUserSession().subscribe({
        next: (user: User) => {
          this.currentUserSession = user;
        },
        error: (error) => { console.error(error); }
      })
    );
  }

  private setHospitals(): void {
    this.subscriptions.add(
      this.hospitalPresenter.getHospitals(this.from).subscribe({
        next: (resp: IResponseDataHospital) => {
          
          this.reloadViewData(resp);
        },
        error: (error) => {
          this.hospitalPresenter.errorGeneric();
        },
        complete: () => { }
      })
    );
  }

  private reloadViewData(resp: IResponseDataHospital): void {
    this.hospitals = resp.hospitals;
    this.totalHospitals = resp.total;
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

    if (this.from > 0 && this.from > this.totalHospitals - 1) {
      // Si el from se paso lo dejamos en la pagina actual
      this.from = currentFrom;
      return;
    }

    this.setHospitals();
  }

  private searchHospital(): void {
    this.subscriptions.add(
      this.searchControl.valueChanges.pipe(
        debounceTime(300), // Espera 300ms después del último evento
        distinctUntilChanged(), // Emite solo si el valor es diferente del anterior
        switchMap((value: string) => {
          return this.getResponseSearchHospitals(value);
        }
        )
      ).subscribe({
        next: (hospitals: Hospital[]) => { this.hospitals = hospitals; },
        error: (err) => { console.error(err); }
      })
    );
  }

  private getResponseSearchHospitals(value: string): Observable<Hospital[]> {
    if (!value) {
      this.resetCurrentView();
      return of(this.hospitals);
    }
    return this.hospitalPresenter.searchUserByName(value);
  }


  private resetCurrentView(): void {
    this.from = 0; //Seteamos el from a 0 para la primera vista
    this.setHospitals();//Regresamos a la primera vista
  }



  showModalAddhospital(): void {
    this.showModalAddHospital = true;
  }

  closeModalAddUsers(): void {
    this.showModalAddHospital = false;
  }

  openModalDeleteHospital(event: Event, hospital: Hospital) {
    //Abrir modal de eliminación de hospital
    this.hospitalPresenter.openModal('#deleteHospitalModal');

    this.currentHospitalSelected = hospital;

  }

  refreshListHospitals(): void {
    this.setHospitals();
  }

  ngOnDestroy(): void {
    this.clearTooltip();
    this.subscriptions.unsubscribe();
  }

}
