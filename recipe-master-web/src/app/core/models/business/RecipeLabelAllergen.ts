import { Allergen, AllergenType } from "./allergen";
import { RecipeLabel } from "./recipe-label";

export interface RecipeLabelAllergen {
	recipeLabel: RecipeLabel;
	allergen: Allergen;
	allergenType: AllergenType;
}
