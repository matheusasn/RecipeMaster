import { Recipe } from "./business/recipe";
import { User } from "./user";

export class FixedCost {
	id?: number;
	uuid?: string;
	name?: string;
	nameen?: string;
	namees?: string;
	price?: number;
	user?: User;
}

export class RecipeFixedCost {
	id?: number;
	fixedCost: FixedCost;
}
