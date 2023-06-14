import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecipeitemInfoComponent } from './recipeitem-info.component';

describe('RecipeitemInfoComponent', () => {
  let component: RecipeitemInfoComponent;
  let fixture: ComponentFixture<RecipeitemInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecipeitemInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecipeitemInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
