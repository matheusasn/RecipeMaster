import { BaseEntity } from "../common/baseentity";
import { User } from "../user";
import { Ingredient } from "./ingredient";

export const GRAMA_UNIT = 1;
export const KILO_UNIT = 2;
export const MILILITROS_UNIT = 3;
export const LITROS_UNIT = 4;
export const POUND_UUID = 'ffc216c6-a354-4aeb-9c15-845346c77e14';
export const OUNCE_UUID = 'd847fbc3-4013-46a9-a688-629ad4783b89';
export const FLUID_OUNCE_UUID = 'fbe1ca86-a6c7-4ca6-ae00-34976f85607e';
export const STICKY_UUID = '245c2c66-7ae7-4353-84b9-109996143ada';

export interface Unit extends BaseEntity {
    abbreviated: string;
    abbreviation: string;

    amount?:number;
    unitId?:number;
		unitUuid?:string;
    ingredientId?:number;

    user?:User;
    userId?:number;
    type?:UnitType
		uuid?:string;

}

export enum UnitType {
    PURCHASE_LIST = "PURCHASE_LIST",
		OTHER_COSTS = "OTHER_COSTS"
}

export const EnglishUnitsUuid = [
	'245c2c66-7ae7-4353-84b9-109996143ada',
	'ffc216c6-a354-4aeb-9c15-845346c77e14',
	'd847fbc3-4013-46a9-a688-629ad4783b89',
	'fbe1ca86-a6c7-4ca6-ae00-34976f85607e'
]

export const PERCENT_UUID = '5069030d-b67c-431f-8350-b8ac53e90163'
