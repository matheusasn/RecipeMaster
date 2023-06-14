import { BaseEntity } from "../../common/baseentity";
import { PurchasePrice } from "../../common/purchaseprice";
import { IngredientHistoryDTO } from "./ingredient-history-dto";

export interface IngredientDTO extends BaseEntity {

    id:number;
    name:string;
    ingredientCopiedId:number;
    recipeCopiedId:number;
    history:IngredientHistoryDTO[];
    purchasePrice?:PurchasePrice;

}
