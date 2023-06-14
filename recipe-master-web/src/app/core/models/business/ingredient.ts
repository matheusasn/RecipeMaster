import { PurchasePrice } from "../common/purchaseprice";
import { User } from "../user";
import { Unit } from "./unit";

export interface Ingredient {

	id: number;
	name: string;
	nameen?: string;
	namees?: string;
	ingredientCategory: any; //TODO: relacionamento
	recipeCategory?: any;
	purchasePrice: PurchasePrice;
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

	saleValue?: number;

}
