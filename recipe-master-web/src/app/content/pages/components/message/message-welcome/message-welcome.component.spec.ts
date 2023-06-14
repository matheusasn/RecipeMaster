import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MessageWelcomeComponent } from './message-welcome.component';

describe('MessageWelcomeComponent', () => {
  let component: MessageWelcomeComponent;
  let fixture: ComponentFixture<MessageWelcomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MessageWelcomeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MessageWelcomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
