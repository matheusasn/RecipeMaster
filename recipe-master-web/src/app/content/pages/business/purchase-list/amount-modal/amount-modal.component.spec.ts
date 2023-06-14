import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AmountModalComponent } from './amount-modal.component';

describe('AmountModalComponent', () => {
  let component: AmountModalComponent;
  let fixture: ComponentFixture<AmountModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AmountModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AmountModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
