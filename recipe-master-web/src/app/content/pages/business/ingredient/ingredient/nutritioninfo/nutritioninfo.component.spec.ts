import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NutritioninfoComponent } from './nutritioninfo.component';

describe('NutritioninfoComponent', () => {
  let component: NutritioninfoComponent;
  let fixture: ComponentFixture<NutritioninfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NutritioninfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NutritioninfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
