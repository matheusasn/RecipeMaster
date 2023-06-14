import { CpFilter } from "../../common/filter";

export interface RecipeFilter extends CpFilter {

    name: string;
		publicRecipe?: boolean;
}
