import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import * as _ from 'lodash';
import { ApiResponse } from '../../../../core/models/api-response';
import { MenuIngredient } from '../../../../core/models/business/menuingredient';
import { Recipe } from '../../../../core/models/business/recipe';
import { RecipeIngredient } from '../../../../core/models/business/recipeingredient';
import { RecipeItem } from '../../../../core/models/business/recipeitem';
import { Unit } from '../../../../core/models/business/unit';
import { CommonCalcService } from '../../../../core/services/business/common-calc.service';
import { RecipeService } from '../../../../core/services/business/recipe.service';
import { CpLoadingService } from '../../../../core/services/common/cp-loading.service';
import { CpBaseComponent } from '../../common/cp-base/cp-base.component';

@Component({
	selector: 'm-cp-menu-recipe-item',
	templateUrl: './cp-menu-recipe-item.component.html',
	styleUrls: ['./cp-menu-recipe-item.component.scss']
})
export class CpMenuRecipeItemComponent extends CpBaseComponent implements OnInit {

	@Input() recipeIngredient: MenuIngredient;
	recipe:Recipe;
	cifrao:string = 'R$';
	@Output() unityQuantityChange = new EventEmitter();

	constructor(_cdr: ChangeDetectorRef, _loading: CpLoadingService, private calcService:CommonCalcService, private recipeService: RecipeService) {
		super(_loading, _cdr);
	}

	ngOnInit() {
		if (this.recipeIngredient.ingredient.recipeCopiedId) {
			this.recipeService.getById(this.recipeIngredient.ingredient.recipeCopiedId).subscribe( (response:ApiResponse) => {
				this.recipe = response.data;

				this.onChangeComponent();

			}, err => console.warn(err) );
		}
	}

	onUnityQuantityBlur() {
		this.unityQuantityChange.emit();
	}

	calcCostPrice(): number {
		if (this.recipe) {
			const rendimento = this.recipe.unityQuantity ? this.recipe.unityQuantity : 1;
			return ((this.calcService.totalRecipeIngredients(this.recipe.ingredients)+this.getItensTotalCost())/rendimento) * this.recipeIngredient.amount;
		}
		return this.calcService.calcIngredientPrice(this.recipeIngredient);
	}

	calcSalePrice():number {
		try {
			return this.recipeIngredient.saleValue * this.recipeIngredient.amount
		}
		catch(e) {
			console.warn(e.message);
			return 0;
		}
	}

	calcProfit() {

		try {

			return this.calcSalePrice() - this.calcCostPrice();

		}
		catch(e) {
			console.warn(e);
			return 0;
		}

	}

	private getItensTotalCost(): number {

		if (this.recipe.itens && this.recipe.itens.length > 0) {
			return _.reduce(this.recipe.itens, (sum: number, item: RecipeItem) => {
				const valor: number = this.calcService.calcRecipeItemPrice(item);
				return sum + valor;
			}, 0);
		}

		return 0;

	}

}
