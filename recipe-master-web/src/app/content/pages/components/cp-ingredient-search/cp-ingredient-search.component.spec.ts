import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CpIngredientSearchComponent } from './cp-ingredient-search.component';

describe('CpIngredientSearchComponent', () => {
  let component: CpIngredientSearchComponent;
  let fixture: ComponentFixture<CpIngredientSearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CpIngredientSearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CpIngredientSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
