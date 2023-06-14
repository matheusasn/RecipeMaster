import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MessageNpsComponent } from './message-nps.component';

describe('MessageNpsComponent', () => {
  let component: MessageNpsComponent;
  let fixture: ComponentFixture<MessageNpsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MessageNpsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MessageNpsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
