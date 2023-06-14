import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { ENDPOINTS } from "../../constants/endpoints";
import { ApiResponse } from "../../models/api-response";
import { Unit } from "../../models/business/unit";
import { FixedCost } from "../../models/fixedcost";
import { VariableCost } from "../../models/variablecost";
import { APIClientService } from "../common/api-client.service";

export type VariableCostPatch = {
	name?: string
	nameen?: string
	namees?: string
	price?: number
	priceUnitQuantity?: number;
	priceUnit?: Unit;
}

@Injectable({
	providedIn: 'root'
})
export class VariableCostService {
	constructor(private _apiService: APIClientService) {

	}

	public insert(payload: VariableCost): Observable<ApiResponse> {
		return this._apiService.post(ENDPOINTS.BUSINESS.VARIABLE_COST, payload);
	}

	public get(): Observable<ApiResponse> {
		return this._apiService.get(ENDPOINTS.BUSINESS.VARIABLE_COST);
	}

	public patch(id: number, payload: VariableCostPatch): Observable<ApiResponse> {
		return this._apiService.patch(`${ENDPOINTS.BUSINESS.VARIABLE_COST}/${id}`, payload);
	}

	public delete(id: number): Observable<ApiResponse> {
		return this._apiService.delete(`${ENDPOINTS.BUSINESS.VARIABLE_COST}/${id}`);
	}
}
