import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CpNutritionalInfoComponent } from './cp-nutritional-info.component';

describe('CpNutritionalInfoComponent', () => {
  let component: CpNutritionalInfoComponent;
  let fixture: ComponentFixture<CpNutritionalInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CpNutritionalInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CpNutritionalInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
