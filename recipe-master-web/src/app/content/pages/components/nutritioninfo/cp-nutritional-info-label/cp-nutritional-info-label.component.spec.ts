import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CpNutritionalInfoLabelComponent } from './cp-nutritional-info-label.component';

describe('CpNutritionalInfoLabelComponent', () => {
  let component: CpNutritionalInfoLabelComponent;
  let fixture: ComponentFixture<CpNutritionalInfoLabelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CpNutritionalInfoLabelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CpNutritionalInfoLabelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
