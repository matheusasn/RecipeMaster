import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { ENDPOINTS } from "../../constants/endpoints";
import { ApiResponse } from "../../models/api-response";
import { FixedCost } from "../../models/fixedcost";
import { APIClientService } from "../common/api-client.service";

export type FixedCostPatch = {
	name?: string
	nameen?: string
	namees?: string
	price?: number
}

@Injectable({
	providedIn: 'root'
})
export class FixedCostService {
	constructor(private _apiService: APIClientService) {

	}

	public insert(payload: FixedCost): Observable<ApiResponse> {
		return this._apiService.post(ENDPOINTS.BUSINESS.FIXED_COST, payload);
	}

	public get(): Observable<ApiResponse> {
		return this._apiService.get(ENDPOINTS.BUSINESS.FIXED_COST);
	}

	public patch(id: number, payload: FixedCostPatch): Observable<ApiResponse> {
		return this._apiService.patch(`${ENDPOINTS.BUSINESS.FIXED_COST}/${id}`, payload);
	}

	public delete(id: number): Observable<ApiResponse> {
		return this._apiService.delete(`${ENDPOINTS.BUSINESS.FIXED_COST}/${id}`);
	}
}
