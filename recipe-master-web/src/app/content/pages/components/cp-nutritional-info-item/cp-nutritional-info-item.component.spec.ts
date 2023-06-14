import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CpNutritionalInfoItemComponent } from './cp-nutritional-info-item.component';

describe('CpNutritionalInfoItemComponent', () => {
  let component: CpNutritionalInfoItemComponent;
  let fixture: ComponentFixture<CpNutritionalInfoItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CpNutritionalInfoItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CpNutritionalInfoItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
