import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OldUserWithXRecipesComponent } from './old-user-with-x-recipes.component';

describe('OldUserWithXRecipesComponent', () => {
  let component: OldUserWithXRecipesComponent;
  let fixture: ComponentFixture<OldUserWithXRecipesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OldUserWithXRecipesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OldUserWithXRecipesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
