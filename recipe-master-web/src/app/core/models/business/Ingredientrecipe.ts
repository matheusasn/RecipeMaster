import { User } from "../user";
import { Unit } from "./unit";

export interface IngredientRecipe {

	id: number;
	name: string;
	nameen?: string;
	ingredientCategory: any; //TODO: relacionamento
    purchasePrice: any;
    unit: any;
    description: string;
    user: User;
    ingredientCopiedId: number;
    recipeCopiedId: number;

    lastUnit?:Unit;
    lastAmount?:number;
    lastGrossWeight?:number;
    lastNetWeight?:number;
    minGrossWeight?:number;
    maxGrossWeight?:number;

    amountPurchase?: number;
    unitRecipeIngredient?:Unit;

}
