import { EventEmitter, Injectable, Output } from "@angular/core";
import { APIClientService } from "../common/api-client.service";
import { ApiResponse } from "../../models/api-response";
import { Observable } from "rxjs";
import { ENDPOINTS } from "../../constants/endpoints";
import { Recipe } from "../../models/business/recipe";
import { RecipeFilter } from "../../models/business/dto/recipe-filter";
import {RecipePosition} from '../../models/business/recipeposition';
import { RecipeShareDTO } from "../../models/business/dto/recipe-share-dto";
import { PesquisaUser } from "../../models/business/pesquisaUser";
import { RecipeCategory } from "../../models/business/recipecategory";

@Injectable()
export class RecipeService {

	@Output() onCreateCategory:EventEmitter<RecipeCategory[]>;

    constructor(
        private _apiService: APIClientService
    ){
	}

	onCreateCategoryEvent() {

        if(!this.onCreateCategory) {
            this.onCreateCategory = new EventEmitter<RecipeCategory[]>();
        }

        return this.onCreateCategory;

    }

	public insert(recipe: Recipe): Observable<ApiResponse> {
		if (recipe.label) {
			if (recipe.label.weight) {
				recipe.label.weight = parseFloat(String(recipe.label.weight).replace(',', '.'))
			}
			if (recipe.label.portion) {
				recipe.label.portion = parseFloat(String(recipe.label.portion).replace(',', '.'))
			}
		}
		return this._apiService.post(ENDPOINTS.BUSINESS.RECIPES, recipe);
	}

	public update(recipe: Recipe): Observable<ApiResponse> {
		if (recipe.label) {
			if (recipe.label.weight) {
				recipe.label.weight = parseFloat(String(recipe.label.weight).replace(',', '.'))
			}
			if (recipe.label.portion) {
				recipe.label.portion = parseFloat(String(recipe.label.portion).replace(',', '.'))
			}
		}
		return this._apiService.put(ENDPOINTS.BUSINESS.RECIPES, recipe);
	}

	public get(): Observable<ApiResponse> {
		return this._apiService.get(ENDPOINTS.BUSINESS.RECIPES);
	}

	public countByUser(requestParams?: any): Observable<ApiResponse> {
		return this._apiService.get(`${ENDPOINTS.BUSINESS.RECIPES}/count${requestParams || ""}`);
	}

	public generateReport(userEmail: string): Observable<ApiResponse> {
		return this._apiService.post(`${ENDPOINTS.BUSINESS.RECIPES_REPORTS}`, userEmail);
	}

	public getAllByUser(userId: number, filter: RecipeFilter): Observable<ApiResponse> {
		return this._apiService.post(`${ENDPOINTS.BUSINESS.RECIPES}/user/${userId}/all`, filter);
	}

	public getAllByRecipes(userId: number, filter: any): Observable<ApiResponse> {
		return this._apiService.post(`${ENDPOINTS.BUSINESS.RECIPES}/user/${userId}/all`, filter);
	}

	public getByUser(userId: number, filter: RecipeFilter): Observable<ApiResponse> {
		return this._apiService.post(`${ENDPOINTS.BUSINESS.RECIPES}/user/${userId}`, filter);
	}

	public getById(id: number): Observable<ApiResponse> {
		return this._apiService.get(`${ENDPOINTS.BUSINESS.RECIPES}/${id}`);
	}

	public getCategoriesReduced(): Observable<ApiResponse> {
		return this._apiService.get(ENDPOINTS.BUSINESS.RECIPE_CATEGORIES_REDUCED)
	}

	public updatePositions(positions: RecipePosition[]): Observable<ApiResponse> {
		return this._apiService.post(`${ENDPOINTS.BUSINESS.RECIPES}/positions`, positions);
	}

	public copyPublicRecipes(ids: string[]): Observable<ApiResponse> {
		return this._apiService.post(`${ENDPOINTS.BUSINESS.RECIPES}/public/copy`, {
			ids
		});
	}

	public delete(userId: number, id: number): Observable<ApiResponse> {
		return this._apiService.delete(`${ENDPOINTS.BUSINESS.RECIPES}/${userId}/${id}`);
	}

	public share(dto: RecipeShareDTO): Observable<ApiResponse> {
		return this._apiService.post(`${ENDPOINTS.BUSINESS.RECIPES}/share`, dto);
	}

	public updateTotalMonthlyBillingFromAllUserRecipes(amount: number): Observable<ApiResponse> {
		return this._apiService.put(`${ENDPOINTS.BUSINESS.RECIPES}/update-all-total-monthly-billing`, {
			amount
		});
	}

	public getCategoryRecipe(idCategory: number, idUser: number, filter: RecipeFilter): Observable<ApiResponse>{
		return this._apiService.post(`${ENDPOINTS.BUSINESS.RECIPES}/buscaCategoria/${idCategory}/${idUser}`, filter);
	}

	public getTotalRecipeWithPhoto(recipeId:number): Observable<ApiResponse> {
		return this._apiService.get(`${ENDPOINTS.BUSINESS.RECIPES}/photos/${recipeId}`);
	}

	public sendEmailSatisfacao(userId: number, userDadosPesquisa: PesquisaUser): void {
		this._apiService.post(`${ENDPOINTS.BUSINESS.RECIPES}/user/${userId}/satisfacaoCliente`, userDadosPesquisa).subscribe();
	}

	public uploadPhoto(recipeId:number, imageDto:any): Observable<ApiResponse> {
		return this._apiService.post(`${ENDPOINTS.STORAGE.RECIPE}/${recipeId}`, imageDto);
	}

	public uploadRecipePhoto(imageDto:any): Observable<ApiResponse> {
		return this._apiService.post(`${ENDPOINTS.STORAGE.RECIPE}`, imageDto);
	}

	createCategory(category: RecipeCategory): Observable<ApiResponse> {
        return this._apiService.post(`${ENDPOINTS.BUSINESS.RECIPE_CATEGORIES}`, category);
    }

    deleteCategory(userId:number, categoryId:number):Observable<ApiResponse> {
        return this._apiService.delete(`${ENDPOINTS.BUSINESS.RECIPE_CATEGORIES}/${userId}/${categoryId}`);
    }

    updateCategory(category: RecipeCategory):Observable<ApiResponse> {
        return this._apiService.put(ENDPOINTS.BUSINESS.RECIPE_CATEGORIES, category);
	}

	public getCategoriesByUserLanguage(language: string, queryParams?: any): Observable<ApiResponse> {
		return this._apiService.get(`${ENDPOINTS.BUSINESS.RECIPE_CATEGORIES}/language/${language}${queryParams || ""}`)
	}

}
