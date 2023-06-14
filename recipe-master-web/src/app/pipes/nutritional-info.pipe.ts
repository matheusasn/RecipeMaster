import { Pipe, PipeTransform } from '@angular/core';
import { RecipeIngredient } from '../core/models/business/recipeingredient';
import * as _ from 'lodash';
import { Recipe } from '../core/models/business/recipe';
import { FLUID_OUNCE_UUID, GRAMA_UNIT, KILO_UNIT, LITROS_UNIT, MILILITROS_UNIT, OUNCE_UUID, POUND_UUID, STICKY_UUID } from '../core/models/business/unit';
import { NutritionInfo } from '../core/models/business/nutritioninfo';

const PORCAO_PADRAO:number = 100;

@Pipe({
  name: 'nutritionalinfo'
})
export class NutritionalInfoPipe implements PipeTransform {

  private _dietaPadrao = {
    'kcal': () => { return 2000 },
    'carbohydrates': () => { return 300 },
    'protein': () => { return 75 },
    'totalFat': () => { return 55 },
    'saturatedFat': () => { return 22 },
    'fibers': () => { return 25 },
    'sodium': () => { return 2400 },

		'totalSugars': () => { return 50 },
		'vitaminD': () => { return 20 },
		'calcium': () => { return 1300 },
		'iron': () => { return 18 },
		'potassium': () => { return 4700 },
		'magnesium': () => { return 420 },
		'manganese': () => { return 2.3 },
		'phosphorus': () => { return 1250 },
		'copper': () => { return 0.9 },
		'zinc': () => { return 11 },
		'vitaminARAE': () => { return 900 },
		'thiamine': () => { return 1.2 },
		'riboflavin': () => { return 1.3 },
		'niacin': () => { return 16 },
		'vitaminB6': () => { return 1.7 },
		'vitamin12': () => { return 2.4 },
		'vitaminC': () => { return 90 },
  };

  transform(recipe: Recipe, ...args: any[]): number|string {

    let ingredients: RecipeIngredient[] = recipe.ingredients;

    let field:string = 'kcal';
    let type:string = 'amount';
    let peso:number;
    let porcao:number;

    if(args && args[0]) {
      field = args[0];
    }

    if(args && args[1]) {
      type = args[1];
    }

    if(args && args[2]) {
      peso = args[2]; // peso da receita
    }

    if(args && args[3]) {
      porcao = args[3]; // peso da porção
    }

    if(!peso) {
        peso = _.sumBy(ingredients, (ri:RecipeIngredient) => {
            return this.calcAmountInGrams(ri);
        });
    }

    if(!porcao) {
        porcao = PORCAO_PADRAO; // 100g - em gramas
    }

    // peso receita
    // peso porcao desejada
    // info nutricional (IF) por 100g(IF100) de cada ingrediente
    // peso do ingrediente usando a porção desejada (calcular)
    // IF do ingrediente na porção desejada (calcular)
    // somar a IF da porção dos ingredientes (calcular)

    // pesoPorcao = (pesoIngrediente*porcao)/peso;
    // N.I. calculada para a porção = ( pesoPorcao * niDe100gramas-normalizada ) / 100;

    let soma: number = 0;

    _.each(ingredients, (ri:RecipeIngredient) => {

        try {

            let correctionFactor:number = 1; // se o cadastro de referência da info nutricional for diferente de 100g.

            try {
							const grams = this.getNutritionInfoGrams(ri)
							const portion = this.getStandardPortion(ri)
							correctionFactor = portion / grams;
            }
            catch(e) {
                // console.warn(e.message);
            }

            let qtdIngredient:number = this.calcAmountInGrams(ri);
            let nutriInfo:number = (ri.nutritionInfo[field]?ri.nutritionInfo[field]:0);

						const portionWeight = porcao;
						const totalWeight = peso;
						const nutriWeight = ri.nutritionInfo.grams;

						soma += (qtdIngredient * (portionWeight/totalWeight) * (nutriInfo/nutriWeight))
        }
        catch(e) {
            // console.warn(e.message);
        }

    });

    if(type=="amount") {
      return parseInt(soma.toFixed(1));
    }
    else if(type=="percent") {

      if(field == 'transFat') {
        return "(**)";
      }

			if (!this._dietaPadrao[field]) {
				return '';
			}

      return parseInt(((soma/this._dietaPadrao[field]())*100).toFixed(0)) + '%';
    }

  }

	private getStandardPortion(ri: RecipeIngredient): number {
		if (ri.ingredient.unit.id === 3 || ri.ingredient.unit.id === 4) {
			const oilCategoryId = 112
			const isOil = ri.ingredient.ingredientCategory.id === oilCategoryId
			let standardPortion;

			if (ri.ingredient.unit.id === 3) {
				standardPortion = 1
				if (isOil) {
					standardPortion = 0.9
				}
			} else if (ri.ingredient.unit.id === 4) {
				standardPortion = 1000
				if (isOil) {
					standardPortion = 900
				}
			}
			return standardPortion
		}
		return PORCAO_PADRAO
	}

	private getNutritionInfoGrams(ri: RecipeIngredient): number {
		const gramsOrKgUnits = [1, 2, 204, 205, 207]

		let found = _.findIndex(gramsOrKgUnits, (id: number) => {
			return id === ri.unit.id
		})

		// Grama ou KG - EN: (Pounds, Ounce e Sticky)
		if (found !== -1) {
			return ri.nutritionInfo.grams;
		}

		const standardPortion = this.getStandardPortion(ri)

		// Categoria bebidas
		const oilCategoryId = 112
		const drinksId = 101
		const isDrinks = ri.ingredient.ingredientCategory.id === drinksId
		const isOil = ri.ingredient.ingredientCategory.id === oilCategoryId

		const isWholeMilk = 'Whole milk' === ri.ingredient.nameen;
		const isSkimmedMilk = 'Skim milk' === ri.ingredient.nameen;
		const isEnglishSauce = 'Worcestershire sauce' === ri.ingredient.nameen;
		const isShoyoSauce = 'Shoyo sauce' === ri.ingredient.nameen;

		if (isDrinks || isOil || isWholeMilk || isSkimmedMilk
				|| isEnglishSauce || isShoyoSauce) {
					return ri.amount * standardPortion
				}
		return 0;
	}

  private calcAmountInGrams(ri:RecipeIngredient):number {

    if(!ri.unit) {
        return 0;
    }

    let recipeIngredientUnitId:number = ri.unit.ingredientId?ri.unit.unitId:ri.unit.id;
    let amount:number = ri.amount;

    if(ri.unit.ingredientId) {
        amount *= ri.unit.amount;
    }

		let recipeIngredientUnitUuid:string = ri.unit.ingredientId?ri.unit.unitUuid:ri.unit.uuid;

		if (recipeIngredientUnitUuid === POUND_UUID
			|| recipeIngredientUnitUuid === OUNCE_UUID
			|| recipeIngredientUnitUuid === FLUID_OUNCE_UUID
			|| recipeIngredientUnitUuid === STICKY_UUID) {
				return amount;
			}

		if(recipeIngredientUnitId === GRAMA_UNIT) {
        return amount;
    }
    else if(recipeIngredientUnitId == KILO_UNIT) {
        return amount * 1000;
    }

    if (recipeIngredientUnitId === LITROS_UNIT || recipeIngredientUnitId === MILILITROS_UNIT) {
			const oilCategoryId = 112
			const isOil = ri.ingredient.ingredientCategory && ri.ingredient.ingredientCategory.id === oilCategoryId
			let standardPortion;

			if (recipeIngredientUnitId === 3) {
				standardPortion = 1
				if (isOil) {
					standardPortion = 0.9
				}
			} else if (recipeIngredientUnitId === 4) {
				standardPortion = 1000
				if (isOil) {
					standardPortion = 900
				}
			}
			return amount * standardPortion

    }


    return 0;

  }


}
