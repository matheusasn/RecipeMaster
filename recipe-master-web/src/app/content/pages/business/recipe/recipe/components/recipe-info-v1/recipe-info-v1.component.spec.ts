import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecipeInfoV1Component } from './recipe-info-v1.component';

describe('RecipeInfoV1Component', () => {
  let component: RecipeInfoV1Component;
  let fixture: ComponentFixture<RecipeInfoV1Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecipeInfoV1Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecipeInfoV1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
