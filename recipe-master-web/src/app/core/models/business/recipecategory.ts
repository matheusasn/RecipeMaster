import { BaseEntity } from "../common/baseentity";
import { User } from "../user";

export interface RecipeCategory extends BaseEntity {

    recipeId?:number;
    user?:User;
    userId?:number;
		quantityUsed:number;
}
