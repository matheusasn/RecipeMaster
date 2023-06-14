import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MessageWelcomeFirebaseComponent } from './message-welcome-firebase.component';

describe('MessageWelcomeFirebaseComponent', () => {
  let component: MessageWelcomeFirebaseComponent;
  let fixture: ComponentFixture<MessageWelcomeFirebaseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MessageWelcomeFirebaseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MessageWelcomeFirebaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
