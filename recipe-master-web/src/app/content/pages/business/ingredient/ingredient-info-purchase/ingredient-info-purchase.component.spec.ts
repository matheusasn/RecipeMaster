import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IngredientInfoPurchaseComponent } from './ingredient-info-purchase.component';

describe('IngredientInfoPurchaseComponent', () => {
  let component: IngredientInfoPurchaseComponent;
  let fixture: ComponentFixture<IngredientInfoPurchaseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IngredientInfoPurchaseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IngredientInfoPurchaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
