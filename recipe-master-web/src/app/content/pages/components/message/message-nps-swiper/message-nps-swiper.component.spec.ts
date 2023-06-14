import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MessageNpsSwiperComponent } from './message-nps-swiper.component';

describe('MessageNpsSwiperComponent', () => {
  let component: MessageNpsSwiperComponent;
  let fixture: ComponentFixture<MessageNpsSwiperComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MessageNpsSwiperComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MessageNpsSwiperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
