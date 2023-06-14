import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalCostsEditComponent } from './modal-costs-edit.component';

describe('ModalCostsEditComponent', () => {
  let component: ModalCostsEditComponent;
  let fixture: ComponentFixture<ModalCostsEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalCostsEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalCostsEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
