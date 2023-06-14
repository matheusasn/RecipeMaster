import { Unit } from "../business/unit";

export interface PurchasePrice {

    id?:number;

    price: number;

    unityQuantity: number;

    unit: Unit;
}