import { Component, Input, OnInit } from '@angular/core';
import { Recipe } from '../../../../../../core/models/business/recipe';
import { RecipeIngredient } from '../../../../../../core/models/business/recipeingredient';
import * as _ from 'lodash';
import { Unit } from '../../../../../../core/models/business/unit';
import { CommonCalcService } from '../../../../../../core/services/business/common-calc.service';
import { Menu } from '../../../../../../core/models/business/menu';
import { User } from '../../../../../../core/models/user';
import { CpLocalStorageService } from '../../../../../../core/services/common/cp-localstorage.service';
import { TranslateService } from '@ngx-translate/core';
import { RecipeItem } from '../../../../../../core/models/business/recipeitem';

@Component({
  selector: 'm-ingredients',
  templateUrl: './ingredients.component.html',
  styleUrls: ['./ingredients.component.scss']
})
export class IngredientsComponent implements OnInit {

  title:string;
  @Input() recipe: Recipe;
  @Input() menu: Menu;
	@Input() menuRecipes: Recipe[];
  @Input() units:Unit[];
  @Input() showFinancial:boolean = true;
	@Input() isProduction:boolean = false;
	@Input() isComplete:boolean = false;
  cifrao:string;
  user: User;

  constructor(
    private calc:CommonCalcService,
    private _localStorage:CpLocalStorageService,
    private translate: TranslateService) {

      this.fillUser();
    }

  ngOnInit() {
    this.translate.get("MENU.INGREDIENTS").subscribe(data => this.title = data)
  }

  fillUser() {
		this.user = this._localStorage.getLoggedUser();
		if (this.user){
      this.cifrao = this._localStorage.getCurrency();
    }
	}

	getAmountBasedOnRecipeYield(total: number): number {
		let amount = total;
		if (this.recipe && this.recipe.unityQuantity && this.recipe.ingredientsYield) {
			amount = (this.recipe.ingredientsYield / this.recipe.unityQuantity) * amount;
		}
		const amountSplitted = (amount+"").split(".");
		if (amountSplitted.length === 2) {
			const numbersAfterComma = amountSplitted[1].length;
			if (numbersAfterComma > 3) {
				amount = Number(amount.toFixed(3));
			}
		}
		return amount;
	}

  calcIngredientPrice(ri: RecipeIngredient) {
		if (ri.ingredient.recipeCopiedId && this.menu) {
			if (this.menuRecipes) {
				const recipe = this.menuRecipes.find(r => r.id === ri.ingredient.recipeCopiedId)
				const rendimento = recipe.unityQuantity ? recipe.unityQuantity : 1;
				return ((this.calc.totalRecipeIngredients(recipe.ingredients)+this.getItensTotalCost(recipe))/rendimento) * ri.amount;
			}
			return 0;
		}
		return this.calc.calcIngredientPrice(ri);
	}

	private getItensTotalCost(recipe: Recipe): number {
		if (recipe.itens && recipe.itens.length > 0) {
			return _.reduce(recipe.itens, (sum: number, item: RecipeItem) => {
				const valor: number = this.calc.calcRecipeItemPrice(item);
				return sum + valor;
			}, 0);
		}
		return 0;
	}

	calcProfit(ri: RecipeIngredient) {
		try {
			return (ri.saleValue * ri.amount) - this.calcIngredientPrice(ri);
		}
		catch(e) {
			console.warn(e);
			return 0;
		}
	}

	getMedidaCaseira(ri: RecipeIngredient) {
    if(!_.isNil(ri.unit.ingredientId)) {
			return `(${ri.amount} ${ri.unit.name})`;
		}
		return '';
	}

	getUnitLabelBasedOnRecipeYield(unitLabel: string) {
		let newUnitLabel = unitLabel;
		try {
			const splitted = unitLabel.trim().split(' ');
			const amount = Number(splitted[0]);
			const newAmount = this.getAmountBasedOnRecipeYield(amount);
			newUnitLabel = `${newAmount} ${splitted[1]}`;
		} catch (error) {
		}
		return newUnitLabel;
	}

  getUnitLabel(ri: RecipeIngredient) {

    if(!_.isNil(ri.unit.ingredientId)) {

        let label:Unit = _.find(this.units, ['id',ri.unit.unitId]);

        return `${ri.amount * ri.unit.amount} ${label?label.abbreviation:''}`;

    }
    else {
        return `${ri.amount} ${ri.unit?ri.unit.abbreviation:''}`;
    }

  }

}
