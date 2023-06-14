import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NutritioninfoEditComponent } from './nutritioninfo-edit.component';

describe('NutritioninfoEditComponent', () => {
  let component: NutritioninfoEditComponent;
  let fixture: ComponentFixture<NutritioninfoEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NutritioninfoEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NutritioninfoEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
