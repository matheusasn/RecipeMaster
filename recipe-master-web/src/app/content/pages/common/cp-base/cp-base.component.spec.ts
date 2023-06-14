import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CpBaseComponent } from './cp-base.component';

describe('CpBaseComponent', () => {
  let component: CpBaseComponent;
  let fixture: ComponentFixture<CpBaseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CpBaseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CpBaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
