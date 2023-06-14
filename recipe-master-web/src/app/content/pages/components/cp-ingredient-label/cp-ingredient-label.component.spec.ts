import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CpIngredientLabelComponent } from './cp-ingredient-label.component';

describe('CpIngredientLabelComponent', () => {
  let component: CpIngredientLabelComponent;
  let fixture: ComponentFixture<CpIngredientLabelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CpIngredientLabelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CpIngredientLabelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
