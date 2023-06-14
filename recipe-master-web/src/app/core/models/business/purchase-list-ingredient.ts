import { Ingredient } from "./ingredient";
import { Unit } from "./unit";
import { CorrectionFactor } from "../common/correctionfactor";

export interface PurchaseListIngredient {

    id?: number;
    ingredient?: Ingredient;

    inclusion?;
    uuid?;
    edition?;
    status?;

    quantCompra?: number;
    unitCompra?: Unit;
    
    amount?: number;
    unit?: Unit;

    correctionFactor?: CorrectionFactor;

    order?:number;
}