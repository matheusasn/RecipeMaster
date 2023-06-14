import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PagePixComponent } from './page-pix.component';

describe('PagePixComponent', () => {
  let component: PagePixComponent;
  let fixture: ComponentFixture<PagePixComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PagePixComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PagePixComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
