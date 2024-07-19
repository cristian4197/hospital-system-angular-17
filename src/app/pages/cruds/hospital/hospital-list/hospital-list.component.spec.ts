import { ComponentFixture, TestBed } from '@angular/core/testing';
import ListHospitalComponent from './hospital-list.component';

describe('ListHospitalComponent', () => {
  let component: ListHospitalComponent;
  let fixture: ComponentFixture<ListHospitalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListHospitalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ListHospitalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
