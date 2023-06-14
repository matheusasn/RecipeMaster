import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MessageWizardComponent } from './message-wizard.component';

describe('MessageWizardComponent', () => {
  let component: MessageWizardComponent;
  let fixture: ComponentFixture<MessageWizardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MessageWizardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MessageWizardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
