import { Component, Input, OnInit } from '@angular/core';
import { Menu } from '../../../../../../core/models/business/menu';
import { Recipe } from '../../../../../../core/models/business/recipe';
import { RecipeItem } from '../../../../../../core/models/business/recipeitem';
import { CommonCalcService } from '../../../../../../core/services/business/common-calc.service';
import { User } from '../../../../../../core/models/user';
import { CpLocalStorageService } from '../../../../../../core/services/common/cp-localstorage.service';
import { TranslateService } from '@ngx-translate/core';
import { RecipeVariableCost, VariableCost } from '../../../../../../core/models/variablecost';
import { TypeOfCostSelected } from '../../../../business/recipe/recipe/recipe.component';

enum OtherCostType {
	FIXED = "FIXED",
	VARIABLE = "VARIABLE"
}

@Component({
  selector: 'm-other-costs',
  templateUrl: './other-costs.component.html',
  styleUrls: ['./other-costs.component.scss']
})
export class OtherCostsComponent implements OnInit {

  @Input() recipe: Recipe;
  @Input() menu: Menu;
  @Input() showFinancial:boolean = true;
	@Input() isProduction:boolean = false;
	@Input() otherCostType: OtherCostType;
  cifrao:string;
  user: User;

  constructor(
    private calc:CommonCalcService,
    private _localStorage: CpLocalStorageService,
    private translate: TranslateService) {
    this.fillUser();
  }

  ngOnInit() {
  }

  fillUser() {
		this.user = this._localStorage.getLoggedUser();
		if (this.user){
      this.cifrao = this._localStorage.getCurrency();
    }
	}

	calcVariableCostPrice(recipeVariableCost: RecipeVariableCost) {
		return this.calc.calcRecipeVariableCostPrice(TypeOfCostSelected.TOTAL, recipeVariableCost, this.recipe.financial.totalCostValue)
	}

  calcItemPrice(i:RecipeItem) {
    return this.calc.calcRecipeItemPrice(i);
  }

}
