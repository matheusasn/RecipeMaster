import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { ENDPOINTS } from "../../constants/endpoints";
import { ApiResponse } from "../../models/api-response";
import { FixedSpecificCost } from "../../models/business/fixed-specific-cost";
import { APIClientService } from "../common/api-client.service";

@Injectable({
	providedIn: 'root'
})
export class RecipeFixedSpecificCostService {
	constructor(private _apiService: APIClientService) {}

	public getLastWattPriceAndGasPrice(): Observable<ApiResponse> {
		return this._apiService.get('/business/recipe-fixed-specific-cost/last-watt-price-and-gas-price')
	}

}
