import { Component, Input, OnInit } from '@angular/core';
import * as _ from 'lodash';
import { MenuIngredient } from '../../../../core/models/business/menuingredient';
import { CpLocalStorageService } from '../../../../core/services/common/cp-localstorage.service';
import { User } from '../../../../core/models/user';

import { RecipeIngredient } from '../../../../core/models/business/recipeingredient';
import { RecipeItem } from '../../../../core/models/business/recipeitem';
import { Unit } from '../../../../core/models/business/unit';
import { CommonCalcService } from '../../../../core/services/business/common-calc.service';

@Component({
	selector: 'm-cp-recipe-ingredients-item',
	templateUrl: './cp-recipe-ingredients-item.component.html',
	styleUrls: ['./cp-recipe-ingredients-item.component.scss']
})
export class CpRecipeIngredientsItemComponent implements OnInit {

	@Input() ingredient: RecipeIngredient|any;
	@Input() units: Unit[] = [];
	@Input() showHomeMeasureUnit: boolean;
	@Input() isDraggingEnabled: boolean;
	@Input() ingredientsYield: number;
	@Input() recipeUnityQuantity: number;
	prefix: String;
	cifrao: String;
	private _currentUser: User;

	constructor(
		private calcService: CommonCalcService,
		private _localStorage: CpLocalStorageService,) {

		this.fillUser();
	}

	ngOnInit() {
		this.setMaskInputCurrency(this.cifrao);
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

	getUnitLabel(recipeIngredient: RecipeIngredient) {
		if (!_.isNil(recipeIngredient.unit.ingredientId)) {
			const label: Unit = _.find(this.units, ['id', recipeIngredient.unit.unitId]);
			const homeMeasure = `${recipeIngredient.amount} ${recipeIngredient.unit.name}`;

			const isMobile = +window.innerWidth < 768

			const defaultLabel = `${recipeIngredient.amount * recipeIngredient.unit.amount} ${label ? label.abbreviation : ''}`

			if (isMobile) {
				if (this.showHomeMeasureUnit) {
					return homeMeasure;
				} else {
					return defaultLabel
				}
			}

			return `${defaultLabel} (${homeMeasure})`;
		} else {
			const abbreviation = recipeIngredient.unit.abbreviation;
			if (abbreviation === 'Stick') {
				return `${recipeIngredient.unit.amount} grams`;
			} else if (abbreviation === 'lib') {
				return `${recipeIngredient.unit.amount} grams`;
			} else if (abbreviation === 'fl oz') {
				return `${recipeIngredient.unit.amount} ml`;
			}
			const amount = !_.isNil(recipeIngredient.amount) ? recipeIngredient.amount : recipeIngredient['unityQuantityUsed'];
			return `
				${amount} ${recipeIngredient.unit ? recipeIngredient.unit.abbreviation : ''}`;
		}
	}

	getAmountBasedOnRecipeYield(total: number): number {
		let amount = total;
		if (this.recipeUnityQuantity && this.ingredientsYield) {
			amount = (this.ingredientsYield / this.recipeUnityQuantity) * amount
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

	calcIngredientPrice(ingredient: RecipeIngredient) {
		let price = 0;
		if (ingredient['price']) {
			// @ts-ignore
			price = this.calcService.calcRecipeItemPrice(ingredient as RecipeItem);
		} else {
			price = this.calcService.calcIngredientPrice(ingredient);
		}
		return price;
	}

	fillUser() {
		this._currentUser = this._localStorage.getLoggedUser();
		if (this._currentUser) {
			this.cifrao = this._localStorage.getCurrency();
    	}
	}

	setMaskInputCurrency(currentCurrency){
		this.prefix = currentCurrency;
	}

}
