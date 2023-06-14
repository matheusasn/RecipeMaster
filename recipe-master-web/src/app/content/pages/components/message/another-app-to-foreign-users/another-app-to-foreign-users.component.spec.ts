import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AnotherAppToForeignUsersComponent } from './another-app-to-foreign-users.component';

describe('AnotherAppToForeignUsersComponent', () => {
  let component: AnotherAppToForeignUsersComponent;
  let fixture: ComponentFixture<AnotherAppToForeignUsersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AnotherAppToForeignUsersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnotherAppToForeignUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
