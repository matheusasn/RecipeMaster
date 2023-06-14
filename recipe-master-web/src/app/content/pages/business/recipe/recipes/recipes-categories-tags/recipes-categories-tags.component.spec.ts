import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecipesCategoriesTagsComponent } from './recipes-categories-tags.component';

describe('RecipesCategoriesTagsComponent', () => {
  let component: RecipesCategoriesTagsComponent;
  let fixture: ComponentFixture<RecipesCategoriesTagsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecipesCategoriesTagsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecipesCategoriesTagsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
