import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PageDiscountComponent } from './page-discount.component';

describe('PageDiscountComponent', () => {
  let component: PageDiscountComponent;
  let fixture: ComponentFixture<PageDiscountComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PageDiscountComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PageDiscountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
