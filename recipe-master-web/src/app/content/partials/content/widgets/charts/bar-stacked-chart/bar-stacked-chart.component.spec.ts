import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BarStackedChartComponent } from './doughnut-chart.component';

describe('DoughnutChartComponent', () => {
  let component: BarStackedChartComponent;
  let fixture: ComponentFixture<BarStackedChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BarStackedChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BarStackedChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
