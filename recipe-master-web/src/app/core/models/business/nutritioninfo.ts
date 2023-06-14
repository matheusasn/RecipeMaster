import { User } from "../user";
import { Unit } from "./unit";
import { NutritionInfoOrigin } from "./dto/nutritioninfo-filter";
import { RecipeIngredient } from "./recipeingredient";
import { Recipe } from "./recipe";

export interface NutritionInfo {

	id?: number;
    description: string;
		enDescription?: string;
		esDescription?: string;
    preparationDescription?: string;
    origin?:NutritionInfoOrigin;

    grams?:number
    kcal?:number
    carbohydrates?:number
    fibers?:number
    protein?:number
    totalFat?:number
    saturatedFat?:number
    transFat?:number
    sodium?:number
    cholesterol?:number
		monounsatured?:number;
		polyunsatured?:number;
		calcium?:number;
		magnesium?:number;
		manganese?:number;
		phosphorus?:number;
		iron?:number;
		potassium?:number;
		copper?:number;
		zinc?:number;
		retinol?:number;
		vitaminARAE?:number;
		vitaminD?:number;
		thiamine?:number;
		riboflavin?:number;
		pyridoxine?:number;
		niacin?:number;
		vitaminB6?:number;
		vitaminB12?:number;
		vitaminC?:number;
		lipids?:number;
		totalSugars?:number;

    user?: User;
    recipe?: Recipe;

}

export const ForbiddenItems = [
	'subway',
	'fast food',
	'babyfood',
	'soups',
	'soup',
	'applebees',
]
