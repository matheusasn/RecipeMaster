import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LabelIngredientFormComponent } from './label-ingredient-form.component';

describe('LabelIngredientFormComponent', () => {
  let component: LabelIngredientFormComponent;
  let fixture: ComponentFixture<LabelIngredientFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LabelIngredientFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LabelIngredientFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
