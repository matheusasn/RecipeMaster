import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseListsComponent } from './purchase-lists.component';

describe('PurchaseListsComponent', () => {
  let component: PurchaseListsComponent;
  let fixture: ComponentFixture<PurchaseListsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PurchaseListsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PurchaseListsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
