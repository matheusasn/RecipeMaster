import { Recipe } from "./business/recipe";
import { Unit } from "./business/unit";
import { User } from "./user";

export enum PercentCostType {
	SALE_PRICE = "SALE_PRICE",
	COST_OF_INGREDIENTS = "COST_OF_INGREDIENTS"
}

export class VariableCost {
	id?: number;
	uuid?: string;
	name?: string;
	nameen?: string;
	namees?: string;
	price?: number;
	user?: User;
	priceUnitQuantity: number;
	priceUnit: Unit;
	percentCostType: PercentCostType;
}

export class RecipeVariableCost {
	id?: number;
	variableCost: VariableCost;
	unityQuantityUsed: number;
	unitUsed: Unit;
	order?: number;
	totalCostChecked?: boolean;
	unitCostChecked?: boolean;

	unitCostUnityQuantityUsed: number;
	unitCostUnitUsed: Unit;
}
