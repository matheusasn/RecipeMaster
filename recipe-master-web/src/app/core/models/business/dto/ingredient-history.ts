import { Ingredient } from "../ingredient";
import { Unit } from "../unit";

export interface IngredientHistory {

    id?:number;

    ingredient:Ingredient;
    price:number;
    unit:Unit;
    unityQuantity:number;

}
