import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CpIngredientCurrentPriceComponent } from './cp-ingredient-current-price.component';

describe('CpIngredientCurrentPriceComponent', () => {
  let component: CpIngredientCurrentPriceComponent;
  let fixture: ComponentFixture<CpIngredientCurrentPriceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CpIngredientCurrentPriceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CpIngredientCurrentPriceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
