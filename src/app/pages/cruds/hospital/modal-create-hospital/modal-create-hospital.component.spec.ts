import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalCreateHospitalComponent } from './modal-create-hospital.component';

describe('ModalCreateHospitalComponent', () => {
  let component: ModalCreateHospitalComponent;
  let fixture: ComponentFixture<ModalCreateHospitalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalCreateHospitalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ModalCreateHospitalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
