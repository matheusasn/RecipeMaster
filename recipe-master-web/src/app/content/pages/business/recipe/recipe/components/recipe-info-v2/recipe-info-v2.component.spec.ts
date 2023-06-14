import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecipeInfoV2Component } from './recipe-info-v2.component';

describe('RecipeInfoV2Component', () => {
  let component: RecipeInfoV2Component;
  let fixture: ComponentFixture<RecipeInfoV2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecipeInfoV2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecipeInfoV2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
