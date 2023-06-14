import { Component, Input, OnInit } from '@angular/core';
import { cloneDeep } from 'lodash';
import { isRecipeVariableCostActive, Recipe } from '../../../../../../../core/models/business/recipe';
import { PERCENT_UUID } from '../../../../../../../core/models/business/unit';
import { PercentCostType, RecipeVariableCost } from '../../../../../../../core/models/variablecost';
import { CommonCalcService } from '../../../../../../../core/services/business/common-calc.service';
import { TypeOfCostSelected } from '../../../../../business/recipe/recipe/recipe.component';

@Component({
  selector: 'm-graph',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.scss']
})
export class GraphComponent implements OnInit {

	@Input() typeOfCost: TypeOfCostSelected;
	@Input() recipe: Recipe;
	@Input() cifrao;

	financialAnalysisChartData: any;

  constructor(private calc: CommonCalcService) {
		this.recipe = cloneDeep(this.recipe);
	}

  ngOnInit() { this.generateChartData() }

	private round = (num: any) => Math.round(num * 100) / 100

	private generateChartData() {

		const salePrice = this.getSalePrice();
		const profit = this.calcProfit();

		const getPercent = (value) => salePrice === 0 ? 0 : Number((value / salePrice) * 100).toFixed(0);

		this.financialAnalysisChartData = {
			labels: [
				`CMV (${getPercent(this.getCMV())}%)`,
				`Custos var. (${getPercent(this.getTotalOtherCosts())}%)`,
				`Custos fixos (${getPercent(this.getFixedCostsBasedOnSalePrice())}%)`,
			],
			data: [
				this.getCMV(),
				this.getTotalOtherCosts(),
				this.getFixedCostsBasedOnSalePrice()
			]
		}

		if (profit > 0) {
			this.financialAnalysisChartData.labels.push(`Lucro (${getPercent(profit)}%)`);
			this.financialAnalysisChartData.data.push(profit);
		}

		try {
			if (this.recipe.ingredients.length == 0) {
				this.financialAnalysisChartData = {}
			}
		} catch (e) {
			console.warn(e.message);
		}

	}

	private getRendimento():number {
		if (this.recipe.ingredientsYield) {
			return this.recipe.ingredientsYield;
		}
		return this.recipe.unityQuantity || 1;
	}

	private getTotalIngredients(): number {
		return this.calc.totalRecipeIngredients(this.recipe.ingredients);
	}

	getAmountBasedOnRecipeYield(total: number): number {
		let amount = total;
		if (this.recipe.ingredientsYield) {
			amount = (this.recipe.ingredientsYield / this.recipe.unityQuantity) * amount;
		}
		return amount;
	}

	private formatMarkup = (value: any) => {
		const splitted = value.toString().split('.');
		if (splitted[1]) {
			if (splitted[1].length >= 2) {
				return Number(value).toFixed(2);
			}
			return Number(value).toFixed(1);
		} else {
			return Number(value).toFixed(1);
		}
	}

	private getTotalCostMarktup() {
		const costValue = this.recipe.financial.totalCostValue;
		let totalCostPerc = 0.0;
		if (costValue && costValue > 0) {
			totalCostPerc = this.recipe.financial.totalCostValue / this.getTotalCost();
		}

		if (isNaN(totalCostPerc) || !isFinite(totalCostPerc)) {
			totalCostPerc = 0;
		};

		return this.formatMarkup(totalCostPerc);
	}

	private getUnitCostMarkup() {
		const costUnitValue = this.recipe.financial.costUnitValue;
		let costUnitPerc = 0.0;

		if (costUnitValue && costUnitValue > 0) {
			costUnitPerc = costUnitValue / this.getUnitCost();
		}

		if (isNaN(costUnitPerc) || !isFinite(costUnitPerc)) {
			costUnitPerc = 0;
		}

		return this.formatMarkup(costUnitPerc);
	}

	getMarkup() {
		if (this.typeOfCost === TypeOfCostSelected.UNIT) {
			return this.getUnitCostMarkup();
		}
		return this.getTotalCostMarktup();
	}

	getCMV() {
		let cmv = this.getTotalIngredients();
		if (this.typeOfCost === TypeOfCostSelected.UNIT) {
			cmv = this.getTotalIngredients() / this.getRendimento();
		}
		return this.getAmountBasedOnRecipeYield(cmv);
	}

	private getSalePrice() {
		let salePrice = this.recipe.financial.totalCostValue;
		if (this.typeOfCost === TypeOfCostSelected.UNIT) {
			salePrice = this.recipe.financial.costUnitValue;
		}
		return salePrice || 0;
	}

	getTotalFixedCosts() {
		const total = this.recipe.fixedCosts
			.map(item => item.fixedCost.price).reduce((a, b) => a + b, 0);
		return total
	}

	getFixedCostsPercentage() {
		const totalMonthlyBilling = this.recipe.financial.totalMonthlyBilling;
		const fixedCosts = this.getTotalFixedCosts();
		if (!totalMonthlyBilling || !fixedCosts) return 0;
		return (fixedCosts * 100) / totalMonthlyBilling;
	}

	private getUnitCost(): number {
		let rendimento:number = this.getRendimento();
		const totalCost = (this.getAmountBasedOnRecipeYield(this.getTotalIngredients())/rendimento) + this.getTotalOtherCosts() + this.getFixedCostsBasedOnSalePrice();
		return totalCost;
	}

	getTotalCost(): number {
		if (this.typeOfCost === TypeOfCostSelected.TOTAL) {
			return this.getAmountBasedOnRecipeYield(this.getTotalIngredients()) + this.getTotalOtherCosts() + this.getFixedCostsBasedOnSalePrice();
		}
		return this.getUnitCost();
	}

	getSaleValue() {
		if (this.typeOfCost === TypeOfCostSelected.TOTAL) return this.recipe.financial.totalCostValue;
		else if (this.typeOfCost === TypeOfCostSelected.UNIT) return this.recipe.financial.costUnitValue;
		return 0;
	}

	getFixedCostsBasedOnSalePrice() {
		const salePrice = this.getSalePrice();
		if (!salePrice) return 0;
		return salePrice * (this.getFixedCostsPercentage() / 100);
	}

	getTotalOtherCosts(): number {
		const getPrice = (recipeVariableCost: RecipeVariableCost) => {
			if (!recipeVariableCost) return 0;

			const amount = (
				recipeVariableCost.variableCost.percentCostType === PercentCostType.SALE_PRICE
					|| recipeVariableCost.variableCost.priceUnit.uuid !== PERCENT_UUID
				)
				? this.getSalePrice()
				: this.getCMV();

			return this.calc.calcRecipeVariableCostPrice(this.typeOfCost, recipeVariableCost, amount);
		}

		const total = this.recipe.variableCosts
			.filter(item => isRecipeVariableCostActive(item, this.typeOfCost))
			.map(getPrice).reduce((a, b) => a + b, 0);
		return total;
	}

	getPercentageBasedOnSalePrice(amount: number) {
		const result = this.round((amount * 100) / this.getSalePrice())
		return (isNaN(result) || !isFinite(result)) ? 0 : result;
	}

	calcProfit() {
		try {
			const profit = this.getSalePrice() - this.getCMV() - this.getFixedCostsBasedOnSalePrice() - this.getTotalOtherCosts();
			return profit;
		}
		catch(e) {
			console.warn(e);
			return 0;
		}
	}

}
