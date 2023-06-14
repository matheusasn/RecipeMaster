import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MultilinesChartComponent } from './line-chart.component';

describe('LineChartComponent', () => {
  let component: MultilinesChartComponent;
  let fixture: ComponentFixture<MultilinesChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MultilinesChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MultilinesChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
