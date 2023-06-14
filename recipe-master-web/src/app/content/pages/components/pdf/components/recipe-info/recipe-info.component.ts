import { Component, ElementRef, Input, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { APP_CONFIG } from '../../../../../../config/app.config';
import { PACKAGE } from '../../../../../../core/constants/endpoints';
import { Recipe } from '../../../../../../core/models/business/recipe';

@Component({
  selector: 'm-recipe-info',
  templateUrl: './recipe-info.component.html',
  styleUrls: ['./recipe-info.component.scss']
})
export class RecipeInfoComponent implements OnInit {

  backgroundImage:any;
  defaultBackgroundImage = 'assets/app/no-recipe.png';

  @Input()
  recipe: Recipe;
  @Input()
  showPhoto:boolean = false;
  @ViewChild('mainContainer') mainContainer:ElementRef;

  constructor(private sanitizer:DomSanitizer) { }

  ngOnInit() {
  }

	getRecipeWeight() {
		if (this.recipe) {
			const recipeYield = this.recipe.unityQuantity || 1
			const round = (num) => Math.round(num * 100) / 100
			if (this.recipe.label && this.recipe.label.weight) {
				return `(${(round(this.recipe.label.weight/recipeYield))}g)`;
			}
		}
		return '';
	}

	ngOnChanges(changes:SimpleChanges) {
		if (this.recipe && this.recipe.photoUrl) {
			this.loadPhoto();
		} else {
			this.backgroundImage = null;
		}
  }

  get size():number {

    try {
      return this.mainContainer.nativeElement.offsetHeight;
    }
    catch(e){
      console.warn(e);
    }

    return 0;

  }

  private async loadPhoto() {

		try {

			let photoUrl = this.recipe.photoUrl;

			photoUrl = photoUrl.replace(/^.*[\\\/]/, '');

			let bucket:string = "/recipe";

			this.backgroundImage = `${APP_CONFIG.BASE_FULL_URL}${PACKAGE.STORAGE}${bucket}/${photoUrl}`;

		}
		catch(e) {
			console.warn(e.message);
		}

	}

}
