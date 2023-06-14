import { ENDPOINTS } from './../../constants/endpoints';
import { Injectable } from '@angular/core';
import { APIClientService } from '../common/api-client.service';
import { Observable } from 'rxjs/internal/Observable';
import { Ingredient } from '../../models/business/ingredient';
import { IngredientDTO } from '../../models/business/dto/ingredient-dto';
import { ApiResponse } from '../../models/api-response';
import { CpFilter } from '../../models/common/filter';
import { IngredientFilter } from '../../models/business/dto/ingredient-filter';

@Injectable()
export class IngredientService {

	constructor(
		private _apiService: APIClientService
	) {
	}

	public insert(ingredient: Ingredient): Observable<ApiResponse> {
		return this._apiService.post(ENDPOINTS.BUSINESS.INGREDIENTS, ingredient);
	}

	public update(ingredient: Ingredient): Observable<ApiResponse> {
		return this._apiService.put(ENDPOINTS.BUSINESS.INGREDIENTS, ingredient);
	}

	public updateFromForm(ingredient: Ingredient): Observable<ApiResponse> {
		return this._apiService.put(`${ENDPOINTS.BUSINESS.INGREDIENTS}/form`, ingredient);
	}

	public get(): Observable<ApiResponse> {
		return this._apiService.get(ENDPOINTS.BUSINESS.INGREDIENTS);
	}

	public getReduced(): Observable<ApiResponse> {
		return this._apiService.get(`${ENDPOINTS.BUSINESS.INGREDIENTS}/reduced`);
	}

	public getByUser(userId: number, filter: IngredientFilter): Observable<ApiResponse> {
		return this._apiService.post(`${ENDPOINTS.BUSINESS.INGREDIENTS}/user/${userId}`, filter);
	}

	public getByUserIdioma(userId: number, linguagem: string, filter: IngredientFilter): Observable<ApiResponse> {
		return this._apiService.post(`${ENDPOINTS.BUSINESS.INGREDIENTS}/user/${userId}/${linguagem}`, filter);
	}

	public getCopiedByUserIdioma(userId: number, linguagem: string, filter: IngredientFilter): Observable<ApiResponse> {
		return this._apiService.post(`${ENDPOINTS.BUSINESS.INGREDIENTS}/copied/user/${userId}/${linguagem}`, filter);
	}

	public getById(id: number): Observable<ApiResponse> {
		return this._apiService.get(`${ENDPOINTS.BUSINESS.INGREDIENTS}/${id}`);
	}

	public getCategoriesReduced(): Observable<ApiResponse> {
		return this._apiService.get(ENDPOINTS.BUSINESS.INGREDIENT_CATEGORIES_REDUCED)
	}

	public getIdFromCopiedId(copiedId: number): Observable<ApiResponse> {
		return this._apiService.post(`${ENDPOINTS.BUSINESS.INGREDIENTS}/copied/${copiedId}`, copiedId)
	}

	public delete(userId: number, id: number): Observable<ApiResponse> {
		return this._apiService.delete(`${ENDPOINTS.BUSINESS.INGREDIENTS}/${userId}/${id}`);
	}

	public getRecipeIngredients(id: number): Observable<ApiResponse> {
		return this._apiService.get(`${ENDPOINTS.BUSINESS.INGREDIENTS}/recipeIngredient/${id}`);
	}

	public getIngredientByRecipeCopiedId(recipeId:number):Observable<ApiResponse> {
		return this._apiService.get(`${ENDPOINTS.BUSINESS.INGREDIENTS}/recipe/${recipeId}`);
	}

}
