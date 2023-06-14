import { ApiResponse } from './../../models/api-response';
import { Observable } from 'rxjs';
import { Injectable, Output, EventEmitter } from '@angular/core';
import { APIClientService } from '../common/api-client.service';
import { ENDPOINTS } from '../../constants/endpoints';
import { Unit } from '../../models/business/unit';

@Injectable()
export class UnitService {

    @Output() onCreate:EventEmitter<Unit[]>;

	constructor(private _apiService: APIClientService) {

    }

    onCreateUnitEvent() {

        if(!this.onCreate) {
            this.onCreate = new EventEmitter<Unit[]>();
        }

        return this.onCreate;

    }

	public getById(id: number): Observable<ApiResponse> {
		return this._apiService.get(`${ENDPOINTS.BUSINESS.UNITS}/${id}`);
	}

	public getReduced(): Observable<ApiResponse> {
		return this._apiService.get(ENDPOINTS.BUSINESS.UNITS_REDUCED)
	}

	public getAbbreviated(): Observable<ApiResponse> {
		return this._apiService.get(ENDPOINTS.BUSINESS.UNITS_ABBREVIATED)
    }

    create(unit: Unit): Observable<ApiResponse> {
        return this._apiService.post(ENDPOINTS.BUSINESS.UNITS, unit);
    }

    delete(userId:number, unitId:number):Observable<ApiResponse> {
        return this._apiService.delete(`${ENDPOINTS.BUSINESS.UNITS}/${userId}/${unitId}`);
    }

    update(unit: Unit):Observable<ApiResponse> {
        return this._apiService.put(ENDPOINTS.BUSINESS.UNITS, unit);
    }

    public getReducedByIngredient(ingredientId: number): Observable<ApiResponse> {
		return this._apiService.get(`${ENDPOINTS.BUSINESS.UNITS}/reducedByIngredient/${ingredientId}`);
	}

}
