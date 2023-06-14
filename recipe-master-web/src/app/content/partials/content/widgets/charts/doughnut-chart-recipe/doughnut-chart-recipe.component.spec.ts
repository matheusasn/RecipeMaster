import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DoughnutChartRecipeComponent } from './doughnut-chart-recipe.component';

describe('DoughnutChartRecipeComponent', () => {
  let component: DoughnutChartRecipeComponent;
  let fixture: ComponentFixture<DoughnutChartRecipeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DoughnutChartRecipeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DoughnutChartRecipeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
