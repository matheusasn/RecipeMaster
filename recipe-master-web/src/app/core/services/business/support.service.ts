import { Injectable } from "@angular/core";
import { APIClientService } from "../common/api-client.service";
import { ApiResponse } from "../../models/api-response";
import { Observable } from "rxjs";
import { ENDPOINTS } from "../../constants/endpoints";
import { Recipe } from "../../models/business/recipe";
import { RecipeFilter } from "../../models/business/dto/recipe-filter";

@Injectable()
export class SupportService {

    constructor(
        private _apiService: APIClientService
    ){
    }

	public sendMail(support: any): Observable<ApiResponse> {
		return this._apiService.post(ENDPOINTS.BUSINESS.SUPPORT+"/sendmail", support);
	}

	public getQuestions(language: string, filter: string): Observable<ApiResponse> {
		return this._apiService.get(`${ENDPOINTS.BUSINESS.COMMONQUESTIONS}?language=${language}&filter=${filter}`);
	}

}
