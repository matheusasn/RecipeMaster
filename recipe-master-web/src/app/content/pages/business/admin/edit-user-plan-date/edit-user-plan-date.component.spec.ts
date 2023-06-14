import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditUserPlanDateComponent } from './edit-user-plan-date.component';

describe('EditUserPlanDateComponent', () => {
  let component: EditUserPlanDateComponent;
  let fixture: ComponentFixture<EditUserPlanDateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditUserPlanDateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditUserPlanDateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
