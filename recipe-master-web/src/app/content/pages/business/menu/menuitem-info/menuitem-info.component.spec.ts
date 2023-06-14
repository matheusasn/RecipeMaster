import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuitemInfoComponent } from './menuitem-info.component';

describe('MenuitemInfoComponent', () => {
  let component: MenuitemInfoComponent;
  let fixture: ComponentFixture<MenuitemInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MenuitemInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MenuitemInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
