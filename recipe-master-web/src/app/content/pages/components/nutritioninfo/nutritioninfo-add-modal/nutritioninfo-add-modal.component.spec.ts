import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NutritioninfoAddModalComponent } from './nutritioninfo-add-modal.component';

describe('NutritioninfoAddModalComponent', () => {
  let component: NutritioninfoAddModalComponent;
  let fixture: ComponentFixture<NutritioninfoAddModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NutritioninfoAddModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NutritioninfoAddModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
