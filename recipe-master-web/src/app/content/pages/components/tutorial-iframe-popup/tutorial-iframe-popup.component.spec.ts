import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TutorialIframePopupComponent } from './tutorial-iframe-popup.component';

describe('TutorialIframePopupComponent', () => {
  let component: TutorialIframePopupComponent;
  let fixture: ComponentFixture<TutorialIframePopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TutorialIframePopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TutorialIframePopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
