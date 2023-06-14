import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { ENDPOINTS } from "../../constants/endpoints";
import { ApiResponse } from "../../models/api-response";
import { FixedSpecificCost } from "../../models/business/fixed-specific-cost";
import { APIClientService } from "../common/api-client.service";

@Injectable({
	providedIn: 'root'
})
export class FixedSpecificCostService {
	constructor(private _apiService: APIClientService) {}

	public insert(payload: FixedSpecificCost): Observable<ApiResponse> {
		return this._apiService.post(ENDPOINTS.BUSINESS.FIXED_SPECIFIC_COST, payload);
	}

	public get(): Observable<ApiResponse> {
		return this._apiService.get(ENDPOINTS.BUSINESS.FIXED_SPECIFIC_COST);
	}

	public patch(id: number, payload: any): Observable<ApiResponse> {
		return this._apiService.patch(`${ENDPOINTS.BUSINESS.FIXED_SPECIFIC_COST}/${id}`, payload);
	}

	public delete(id: number): Observable<ApiResponse> {
		return this._apiService.delete(`${ENDPOINTS.BUSINESS.FIXED_SPECIFIC_COST}/${id}`);
	}
}
