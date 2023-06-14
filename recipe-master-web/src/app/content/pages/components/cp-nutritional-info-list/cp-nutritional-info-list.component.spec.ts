import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CpNutritionalInfoListComponent } from './cp-nutritional-info-list.component';

describe('CpNutritionalInfoListComponent', () => {
  let component: CpNutritionalInfoListComponent;
  let fixture: ComponentFixture<CpNutritionalInfoListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CpNutritionalInfoListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CpNutritionalInfoListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
