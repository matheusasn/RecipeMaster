import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NutritioninfoCustomComponent } from './nutritioninfo-custom.component';

describe('NutritioninfoCustomComponent', () => {
  let component: NutritioninfoCustomComponent;
  let fixture: ComponentFixture<NutritioninfoCustomComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NutritioninfoCustomComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NutritioninfoCustomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
