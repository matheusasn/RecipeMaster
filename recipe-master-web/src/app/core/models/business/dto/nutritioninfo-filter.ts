import { CpFilter } from "../../common/filter";

// export const ORIGIN_IBGE = "IBGE";
// export const ORIGIN_TACO = "TACO";
// export const ORIGIN_USER = "USER";

export enum NutritionInfoOrigin {
    IBGE = "IBGE",
    TACO = "TACO",
    USER = "USER",
    RECIPE = "RECIPE",
    USDA = "USDA_FOUNDATION"
}

export interface NutritionInfoFilter extends CpFilter {
    description: string;
    origin: NutritionInfoOrigin;
    itensPerPage?: number;
		lang?: string;
}
