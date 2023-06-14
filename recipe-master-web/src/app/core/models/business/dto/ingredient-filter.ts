import { CpFilter } from "../../common/filter";

export interface IngredientFilter extends CpFilter {
    copied?: boolean;
    name: string;
    historyLimit?:number;
		usedInRecipe?: boolean;
		sortField?: string;
		sortType?: string;
		itensPerPage?: number;
}
