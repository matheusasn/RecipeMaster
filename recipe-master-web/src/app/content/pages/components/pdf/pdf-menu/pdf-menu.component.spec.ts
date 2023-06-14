import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PdfMenuComponent } from './pdf-menu.component';

describe('PdfMenuComponent', () => {
  let component: PdfMenuComponent;
  let fixture: ComponentFixture<PdfMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PdfMenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PdfMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
