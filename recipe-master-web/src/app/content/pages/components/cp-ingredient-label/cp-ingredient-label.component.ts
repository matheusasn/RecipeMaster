import { Component, OnInit, Input } from '@angular/core';
import { IngredientCategory } from '../../../../core/models/business/ingredientcategory';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'm-cp-ingredient-label',
  templateUrl: './cp-ingredient-label.component.html',
  styleUrls: ['./cp-ingredient-label.component.scss']
})
export class CpIngredientLabelComponent implements OnInit {

  @Input() category: IngredientCategory;
  constructor(private translate: TranslateService, ) {}

  ngOnInit() {
		this.fetchCategory();
  }

	get classname():string {

    try {
      return `label-${this.category.id}`;
    }
    catch(e) {
      console.warn(e.message);
      return `label-none`;
    }
  }

	fetchCategory(){
		switch(this.category.id){
			case 100:
			this.category.name = "INGREDIENT.CATEGORIA.TXT1";
			break;

			case 101:
			this.category.name = "INGREDIENT.CATEGORIA.TXT2";
			break;

			case 102:
			this.category.name = "INGREDIENT.CATEGORIA.TXT3";
			break;

			case 103:
			this.category.name = "INGREDIENT.CATEGORIA.TXT4";
			break;

			case 104:
			this.category.name = "INGREDIENT.CATEGORIA.TXT5";
			break;

			case 105:
			this.category.name = "INGREDIENT.CATEGORIA.TXT6";
			break;

			case 106:
			this.category.name = "INGREDIENT.CATEGORIA.TXT7";
			break;

			case 107:
			this.category.name = "INGREDIENT.CATEGORIA.TXT8";
			break;


			case 108:
			this.category.name = "INGREDIENT.CATEGORIA.TXT19";
			break;

			case 109:
			this.category.name = "INGREDIENT.CATEGORIA.TXT10";
			break;

			case 110:
			this.category.name = "INGREDIENT.CATEGORIA.TXT11";
			break;

			case 111:
			this.category.name = "INGREDIENT.CATEGORIA.TXT12";
			break;

			case 112:
			this.category.name = "INGREDIENT.CATEGORIA.TXT13";
			break;

			case 113:
			this.category.name = "INGREDIENT.CATEGORIA.TXT14";
			break;

			case 114:
			this.category.name = "INGREDIENT.CATEGORIA.TXT15";
			break;

			case 115:
			this.category.name = "INGREDIENT.CATEGORIA.TXT16";
			break;

			case 116:
			this.category.name = "INGREDIENT.CATEGORIA.TXT17";
			break;

			case 117:
			this.category.name = "INGREDIENT.CATEGORIA.TXT18";
			break;

			case 118:
			this.category.name = "INGREDIENT.CATEGORIA.TXT20";
			break;

			case 119:
			this.category.name = "INGREDIENT.CATEGORIA.TXT22";
			break;

			default:
			this.category.name = "INGREDIENT.CATEGORIA.TXT21";
			break;
		}

	}

}
