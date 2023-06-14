import { Injectable } from "@angular/core";
import { APIClientService } from "../common/api-client.service";
import { ApiResponse } from "../../models/api-response";
import { Observable } from "rxjs";
import { ENDPOINTS } from "../../constants/endpoints";
import { Menu } from "../../models/business/menu";
import { MenuFilter } from "../../models/business/dto/menu-filter";
import {RecipePosition} from '../../models/business/recipeposition';

@Injectable()
export class MenuService {

    constructor(
        private _apiService: APIClientService
    ){
    }

	public insert(menu: Menu): Observable<ApiResponse> {
		return this._apiService.post(ENDPOINTS.BUSINESS.MENUS, menu);
	}

	public update(menu: Menu): Observable<ApiResponse> {
		return this._apiService.put(ENDPOINTS.BUSINESS.MENUS, menu);
	}

	public get(): Observable<ApiResponse> {
		return this._apiService.get(ENDPOINTS.BUSINESS.MENUS);
	}

	public getAllByUser(userId: number, filter: MenuFilter): Observable<ApiResponse> {
		return this._apiService.post(`${ENDPOINTS.BUSINESS.MENUS}/user/${userId}/all`, filter);
	}

	public getByUser(userId: number, filter: MenuFilter): Observable<ApiResponse> {
		return this._apiService.post(`${ENDPOINTS.BUSINESS.MENUS}/user/${userId}`, filter);
	}

	public getById(id: number): Observable<ApiResponse> {
		return this._apiService.get(`${ENDPOINTS.BUSINESS.MENUS}/${id}`);
	}

	public delete(userId: number, id: number): Observable<ApiResponse> {
		return this._apiService.delete(`${ENDPOINTS.BUSINESS.MENUS}/${userId}/${id}`);
	}

	public updatePositions(positions: RecipePosition[]): Observable<ApiResponse> {
		return this._apiService.post(`${ENDPOINTS.BUSINESS.MENUS}/positions`, positions);
	}

	public uploadPhoto(menuId:number, imageDto:any): Observable<ApiResponse> {
		return this._apiService.post(`${ENDPOINTS.STORAGE.MENU}/${menuId}`, imageDto);
	}

	public uploadMenuPhoto(imageDto:any): Observable<ApiResponse> {
		return this._apiService.post(`${ENDPOINTS.STORAGE.MENU}`, imageDto);
	}

	public copy(id:number): Observable<ApiResponse> {
		return this._apiService.get(`${ENDPOINTS.BUSINESS.MENUS}/copy/${id}`);
	}

}
