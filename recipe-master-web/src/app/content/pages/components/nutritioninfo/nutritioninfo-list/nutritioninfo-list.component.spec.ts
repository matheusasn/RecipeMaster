import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NutritioninfoListComponent } from './nutritioninfo-list.component';

describe('NutritioninfoListComponent', () => {
  let component: NutritioninfoListComponent;
  let fixture: ComponentFixture<NutritioninfoListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NutritioninfoListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NutritioninfoListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
