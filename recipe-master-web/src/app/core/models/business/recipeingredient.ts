import { Ingredient } from "./ingredient";
import { CorrectionFactor } from "../common/correctionfactor";
import { Unit } from "./unit";
import { NutritionInfo } from "./nutritioninfo";

export interface RecipeIngredient{
    amount: number;
		fraction?: string;
    unit: Unit;
    ingredient: Ingredient;
    correctionFactor: CorrectionFactor;

    id?:number;
    inclusion?;
    uuid?;
    edition?;
    status?;
    nutritionInfo?:NutritionInfo;

    check?: boolean;

    order?:number;

		saleValue?: number;

}
