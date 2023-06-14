import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TutorialIframeComponent } from './tutorial-iframe.component';

describe('TutorialIframeComponent', () => {
  let component: TutorialIframeComponent;
  let fixture: ComponentFixture<TutorialIframeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TutorialIframeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TutorialIframeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
