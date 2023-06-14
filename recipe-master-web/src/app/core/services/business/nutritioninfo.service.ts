import { ENDPOINTS } from './../../constants/endpoints';
import { Injectable } from '@angular/core';
import { APIClientService } from '../common/api-client.service';
import { Observable } from 'rxjs/internal/Observable';
import { ApiResponse } from '../../models/api-response';
import { NutritionInfoFilter, NutritionInfoOrigin } from '../../models/business/dto/nutritioninfo-filter';
import { NutritionInfo } from '../../models/business/nutritioninfo';
import { User } from '../../models/user';
import { RecipeIngredient } from '../../models/business/recipeingredient';
import { NutritionalInfoPipe } from '../../../pipes/nutritional-info.pipe';
import { Recipe } from '../../models/business/recipe';

@Injectable()
export class NutritionInfoService {

	constructor( private _apiService: APIClientService ) {}

	public getByFilter(filter: NutritionInfoFilter): Observable<ApiResponse> {
		return this._apiService.post(`${ENDPOINTS.BUSINESS.NUTRITIONINFO}/filter`, filter);
	}

	public insert(ni: NutritionInfo): Observable<ApiResponse> {
		return this._apiService.post(ENDPOINTS.BUSINESS.NUTRITIONINFO, ni);
	}

	public delete(userId: number, id: number): Observable<ApiResponse> {
		return this._apiService.delete(`${ENDPOINTS.BUSINESS.NUTRITIONINFO}/${userId}/${id}`);
    }

}

export class NutritionInfoFactory {

    public static create(recipeIngredient:RecipeIngredient, user: User): NutritionInfo {

        return {
            description: recipeIngredient.ingredient.name + " (minha receita)",
            user: user,
            grams: 100,
            origin: NutritionInfoOrigin.RECIPE,
            recipe: null
        };

    }

    public static reset(nutritionInfo: NutritionInfo): NutritionInfo {

        nutritionInfo.kcal = 0;
        nutritionInfo.carbohydrates = 0;
        nutritionInfo.fibers = 0;
        nutritionInfo.protein = 0;
        nutritionInfo.totalFat = 0;
        nutritionInfo.saturatedFat = 0;
        nutritionInfo.transFat = 0;
        nutritionInfo.sodium = 0;
        nutritionInfo.cholesterol = 0;

        return nutritionInfo;

    }

		public static calculate(nutriInfoPipe: NutritionalInfoPipe, recipe: Recipe, ni: NutritionInfo) {
			const weight = recipe.label.weight;
				const portion = recipe.label.portion;
				const kcal = nutriInfoPipe.transform(recipe, 'kcal', 'amount', weight, portion);
				ni.kcal = Number(kcal);
				const carbo = nutriInfoPipe.transform(recipe, 'carbohydrates', 'amount', weight, portion);
				ni.carbohydrates = Number(carbo);
				const fibers = nutriInfoPipe.transform(recipe, 'fibers', 'amount', weight, portion);
				ni.fibers = Number(fibers);
				const protein = nutriInfoPipe.transform(recipe, 'protein', 'amount', weight, portion);
				ni.protein = Number(protein);
				const totalFat = nutriInfoPipe.transform(recipe, 'totalFat', 'amount', weight, portion);
				ni.totalFat = Number(totalFat);
				const saturatedFat = nutriInfoPipe.transform(recipe, 'saturatedFat', 'amount', weight, portion);
				ni.saturatedFat = Number(saturatedFat);
				const transFat = nutriInfoPipe.transform(recipe, 'transFat', 'amount', weight, portion);
				ni.transFat = Number(transFat);
				const sodium = nutriInfoPipe.transform(recipe, 'sodium', 'amount', weight, portion);
				ni.sodium = Number(sodium);
				const cholesterol = nutriInfoPipe.transform(recipe, 'cholesterol', 'amount', weight, portion);
				ni.cholesterol = Number(cholesterol);
				const monounsatured = nutriInfoPipe.transform(recipe, 'monounsatured', 'amount', weight, portion);
				ni.monounsatured = Number(monounsatured);
				const polyunsatured = nutriInfoPipe.transform(recipe, 'polyunsatured', 'amount', weight, portion);
				ni.polyunsatured = Number(polyunsatured);
				const calcium = nutriInfoPipe.transform(recipe, 'calcium', 'amount', weight, portion);
				ni.calcium = Number(calcium);
				const magnesium = nutriInfoPipe.transform(recipe, 'magnesium', 'amount', weight, portion);
				ni.magnesium = Number(magnesium);
				const manganese = nutriInfoPipe.transform(recipe, 'manganese', 'amount', weight, portion);
				ni.manganese = Number(manganese);
				const phosphorus = nutriInfoPipe.transform(recipe, 'phosphorus', 'amount', weight, portion);
				ni.phosphorus = Number(phosphorus);
				const iron = nutriInfoPipe.transform(recipe, 'iron', 'amount', weight, portion);
				ni.iron = Number(iron);
				const potassium = nutriInfoPipe.transform(recipe, 'potassium', 'amount', weight, portion);
				ni.potassium = Number(potassium);
				const copper = nutriInfoPipe.transform(recipe, 'copper', 'amount', weight, portion);
				ni.copper = Number(copper);
				const zinc = nutriInfoPipe.transform(recipe, 'zinc', 'amount', weight, portion);
				ni.zinc = Number(zinc);
				const retinol = nutriInfoPipe.transform(recipe, 'retinol', 'amount', weight, portion);
				ni.retinol = Number(retinol);
				const vitaminARAE = nutriInfoPipe.transform(recipe, 'vitaminARAE', 'amount', weight, portion);
				ni.vitaminARAE = Number(vitaminARAE);
				const vitaminD = nutriInfoPipe.transform(recipe, 'vitaminD', 'amount', weight, portion);
				ni.vitaminD = Number(vitaminD);
				const thiamine = nutriInfoPipe.transform(recipe, 'thiamine', 'amount', weight, portion);
				ni.thiamine = Number(thiamine);
				const riboflavin = nutriInfoPipe.transform(recipe, 'riboflavin', 'amount', weight, portion);
				ni.riboflavin = Number(riboflavin);
				const pyridoxine = nutriInfoPipe.transform(recipe, 'pyridoxine', 'amount', weight, portion);
				ni.pyridoxine = Number(pyridoxine);
				const niacin = nutriInfoPipe.transform(recipe, 'niacin', 'amount', weight, portion);
				ni.niacin = Number(niacin);
				const vitaminB6 = nutriInfoPipe.transform(recipe, 'vitaminB6', 'amount', weight, portion);
				ni.vitaminB6 = Number(vitaminB6);
				const vitaminB12 = nutriInfoPipe.transform(recipe, 'vitaminB12', 'amount', weight, portion);
				ni.vitaminB12 = Number(vitaminB12);
				const vitaminC = nutriInfoPipe.transform(recipe, 'vitaminC', 'amount', weight, portion);
				ni.vitaminC = Number(vitaminC);
				const lipids = nutriInfoPipe.transform(recipe, 'lipids', 'amount', weight, portion);
				ni.lipids = Number(lipids);
		}

    public static add(nutritionInfo: NutritionInfo, nutritionInfoToAdd: NutritionInfo): NutritionInfo {

        let correctionFactor:number = nutritionInfo.grams / nutritionInfoToAdd.grams;

        nutritionInfo.kcal = (nutritionInfo.kcal?nutritionInfo.kcal:0) + ( (nutritionInfoToAdd.kcal?nutritionInfoToAdd.kcal:0) * correctionFactor );
        nutritionInfo.carbohydrates = (nutritionInfo.carbohydrates?nutritionInfo.carbohydrates:0) + ( (nutritionInfoToAdd.carbohydrates?nutritionInfoToAdd.carbohydrates:0) * correctionFactor );
        nutritionInfo.fibers = (nutritionInfo.fibers?nutritionInfo.fibers:0) + ( (nutritionInfoToAdd.fibers?nutritionInfoToAdd.fibers:0) * correctionFactor );
        nutritionInfo.protein = (nutritionInfo.protein?nutritionInfo.protein:0) + ( (nutritionInfoToAdd.protein?nutritionInfoToAdd.protein:0) * correctionFactor );
        nutritionInfo.totalFat = (nutritionInfo.totalFat?nutritionInfo.totalFat:0) + ( (nutritionInfoToAdd.totalFat?nutritionInfoToAdd.totalFat:0) * correctionFactor );
        nutritionInfo.saturatedFat = (nutritionInfo.saturatedFat?nutritionInfo.saturatedFat:0) + ( (nutritionInfoToAdd.saturatedFat?nutritionInfoToAdd.saturatedFat:0) * correctionFactor );
        nutritionInfo.transFat = (nutritionInfo.transFat?nutritionInfo.transFat:0) + ( (nutritionInfoToAdd.transFat?nutritionInfoToAdd.transFat:0) * correctionFactor );
        nutritionInfo.sodium = (nutritionInfo.sodium?nutritionInfo.sodium:0) + ( (nutritionInfoToAdd.sodium?nutritionInfoToAdd.sodium:0) * correctionFactor );
        nutritionInfo.cholesterol = (nutritionInfo.cholesterol?nutritionInfo.cholesterol:0) + ( (nutritionInfoToAdd.cholesterol?nutritionInfoToAdd.cholesterol:0) * correctionFactor );

        return nutritionInfo;

    }

}
