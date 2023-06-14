import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecipeImageCropComponent } from './recipe-image-crop.component';

describe('RecipeImageCropComponent', () => {
  let component: RecipeImageCropComponent;
  let fixture: ComponentFixture<RecipeImageCropComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecipeImageCropComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecipeImageCropComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
