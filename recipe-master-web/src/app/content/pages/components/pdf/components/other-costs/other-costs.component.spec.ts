import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OtherCostsComponent } from './other-costs.component';

describe('OtherCostsComponent', () => {
  let component: OtherCostsComponent;
  let fixture: ComponentFixture<OtherCostsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OtherCostsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OtherCostsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
