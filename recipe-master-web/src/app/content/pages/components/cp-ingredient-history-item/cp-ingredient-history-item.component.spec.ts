import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CpIngredientHistoryItemComponent } from './cp-ingredient-history-item.component';

describe('CpIngredientHostoryItemComponent', () => {
  let component: CpIngredientHistoryItemComponent;
  let fixture: ComponentFixture<CpIngredientHistoryItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CpIngredientHistoryItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CpIngredientHistoryItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
