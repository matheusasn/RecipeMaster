import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalCostsComponent } from './modal-fixed-costs.component';

describe('ModalCostsComponent', () => {
  let component: ModalCostsComponent;
  let fixture: ComponentFixture<ModalCostsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalCostsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalCostsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
