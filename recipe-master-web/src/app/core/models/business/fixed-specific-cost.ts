import { Unit } from "../business/unit";
import { User } from "../user";
import { Recipe } from "./recipe";

export enum SpecificCostType {
	OTHERS = "OTHERS",
	LABOUR = "LABOUR",
	EQUIPMENT = "EQUIPMENT"
}

export class FixedSpecificCost {
	id?: number;
	uuid?: string;
	name?: string;
	nameen?: string;
	namees?: string;
	user?: User;
	type?: SpecificCostType | string;
}

export class RecipeFixedSpecificCost {
	id?: number | string;
	recipe?: Recipe;
	fixedSpecificCost?: FixedSpecificCost;
	consumptionAmount?: number;
	consumptionUnit?: Unit;
	price?: number;
	priceUnit?: Unit;
	priceUnitQuantity: number;
	quantity?: number;
	quantityUnit?: Unit;
	checked?: boolean;
}
