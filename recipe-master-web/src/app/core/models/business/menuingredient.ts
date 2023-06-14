import { Ingredient } from "./ingredient";
import { NutritionInfo } from "./nutritioninfo";
import { Unit } from "./unit";

export interface MenuIngredient {

    amount: number;
    unit: Unit;
    ingredient: Ingredient;

    order?:number;

		saleValue: number;

		nutritionInfo?:NutritionInfo;

}
