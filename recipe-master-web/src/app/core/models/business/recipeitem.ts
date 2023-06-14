
import { Recipe } from './recipe';

export interface OtherCostDTO {
	id?:number;
	name:string;
	inclusion?:Date;
	price:number;
	unityQuantity:number;
	unitId:number;
	unityQuantityUsed:number;
	usedUnitId:number;
	objectId:number;
	type:string; // "recipe","menu"
}

export class RecipeItem {
	id: number;
	name: string;
	price: number;
	unityQuantity: number;
	unit: any;
	unityQuantityUsed: number;
	unitUsed: any;
	recipe: Recipe;
	order: number;
	createdOnFinancial?: boolean;
}
