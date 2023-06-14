import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MessageNpsRankingComponent } from './message-nps-ranking.component';

describe('MessageNpsRankingComponent', () => {
  let component: MessageNpsRankingComponent;
  let fixture: ComponentFixture<MessageNpsRankingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MessageNpsRankingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MessageNpsRankingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
