import { RecipeIngredient } from './recipeingredient';
import { Financial } from './financial';
import { User } from '../user';
import { Unit } from './unit';
import { RecipeLabel } from './recipe-label';
import { RecipeFixedCost } from '../fixedcost';
import { RecipeVariableCost, VariableCost } from '../variablecost';
import { TypeOfCostSelected } from '../../../content/pages/business/recipe/recipe/recipe.component';
import { RecipeFixedSpecificCost } from './fixed-specific-cost';

export const EMPTY_RECIPE = {
	id: null,
	unityQuantity: null,
	totalWeight: null,
	description: null,
	financial: {
		totalCostValue: 0,
		totalCostPerc: 0,
		costUnitPerc: 0,
		costUnitValue: 0,
		totalMonthlyBilling: 0
	},
	ingredients: [],
	ingredientsYield: null,
	itens: [],
	label: {
		id: null,
		addedSugars: true,
		allergens: [],
		calcium: false,
		carbohydrates: true,
		cholesterol: false,
		copper: false,
		fibers: true,
		gluten: null,
		ingredients: [],
		iron: false,
		kcal: true,
		lactose: null,
		lipids: false,
		magnesium: false,
		manganese: false,
		measure: null,
		monounsatured: false,
		niacin: false,
		phosphorus: false,
		polyunsatured: false,
		portion: 100,
		potassium: false,
		protein: true,
		pyridoxine: false,
		retinol: false,
		riboflavin: false,
		saturatedFat: true,
		servingsPerContainers: null,
		sodium: true,
		thiamine: false,
		totalFat: true,
		totalSugars: true,
		transFat: true,
		vitaminARAE: false,
		vitaminB6: false,
		vitaminB12: false,
		vitaminC: false,
		vitaminD: false,
		weight: null,
		zinc: false
	},
	name: null,
	photoUrl: null,
	portionName: null,
	portionWeight: null,
	portions: null,
	preparationTime: null,
	recipeCategory: null,
	recipeWeight: null,
	recipeWeightUnit: {
		id: 1,
		abbreviation: 'g',
		name: 'INGREDIENT.UNIDADE.TXT1',
		uuid: '7db4d131-6a4a-4d53-92f9-fad50a5067c7',
		abbreviated: null,
	},
	steps: [{ order: 0, description: '' }],
	unit: {
		id: 7,
		abbreviation: 'Porções',
		name: 'INGREDIENT.UNIDADE.TXT7',
		uuid: '62138465-0e3d-4cc0-a390-2e389235dd3c',
		abbreviated: null,
	},
}

export const isRecipeVariableCostActive = (item: RecipeVariableCost, typeOfCostSelected: TypeOfCostSelected) =>
	typeOfCostSelected === TypeOfCostSelected.TOTAL ? item.totalCostChecked : item.unitCostChecked;

export class Recipe {
	id: number;
	name: string;
	photo?: string;
	recipeCategory: any;
	preparationTime: number;
	unityQuantity: number;
	unit: Unit;
	description: string;
	financial: Financial;
	steps: any[];
	ingredients: RecipeIngredient[];
	user?: User;
	label?: RecipeLabel;
	photoUrl: string;
	itens?:any[];

	// campos do form V2 da receita (porções, peso total, nome da porção, peso da porção)
	portions:number;
	totalWeight:number;
	portionName:string;
	portionWeight:number;

	recipeWeight:number;
	recipeWeightUnit: Unit;
	ingredientsYield: number;
	fixedCosts?: RecipeFixedCost[];
	variableCosts?: RecipeVariableCost[];
	fixedSpecificCosts?: RecipeFixedSpecificCost[];
	totalCostPercentageOfNetProfit?: number;
	unitCostPercentageOfNetProfit?: number;


	// usado no pdf
	type?: string;

	constructor() {
		this.ingredients = [];
	}
}
