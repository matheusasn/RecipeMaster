import { Injectable } from '@angular/core';
import * as _ from 'lodash';
import * as moment from 'moment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ENDPOINTS } from '../../constants/endpoints';
import { ApiResponse } from '../../models/api-response';
import { IngredientHistory } from '../../models/business/dto/ingredient-history';
import { IngredientHistoryDTO } from '../../models/business/dto/ingredient-history-dto';
import { APIClientService } from '../common/api-client.service';

export interface IngredientHistoryFilter {
	ingredientId: number;
}

export interface IngredientHistoryResponse {
	chartData: number[];
	priceHistory: any;
	chartLabels: string[];
}

@Injectable({
	providedIn: 'root'
})
export class IngredientHistoryService {

	constructor(
		private api: APIClientService
	) { }

	getByIngredient(ingredientId: number): Observable<IngredientHistoryResponse> {
		const filter: IngredientHistoryFilter = {
			ingredientId: ingredientId
		};

		return this.api.post(`${ ENDPOINTS.BUSINESS.INGREDIENT_HISTORY }/filter`, filter).pipe(
			map(response => {
				let priceHistory = response.data;
				let chartData: number[] = [];
				let chartLabels: string[] = [];

				if (response.errors.length === 0) {
					if (!priceHistory || priceHistory.length === 0) {
						const today = moment();
						chartData = [6, 5, 15, 5, 20];
						chartLabels = [
							today.subtract(4, 'month').format('MMM'),
							today.subtract(3, 'month').format('MMM'),
							today.subtract(2, 'month').format('MMM'),
							today.subtract(1, 'month').format('MMM'),
							today.format('MMM')
						];
					} else {
						priceHistory = _.orderBy(priceHistory, ['inclusion'], ['asc']);
						_.each(priceHistory, (h: IngredientHistoryDTO) => {
							chartData.push(h.price);
							chartLabels.push(moment(h.inclusion).format('DD/MM'));
						});
					}
				}

				return {
					priceHistory,
					chartData,
					chartLabels
				};
			})
		);
	}

	async add(historyList: IngredientHistory[]) {
		historyList.forEach((history: IngredientHistory) => {
			try {
				this.api.post(`${ ENDPOINTS.BUSINESS.INGREDIENT_HISTORY }`, history).toPromise();
			} catch (e) {
				console.warn(e);
			}
		});
	}

	public remove(id: number): Observable<ApiResponse> {
		return this.api.delete(`${ENDPOINTS.BUSINESS.INGREDIENT_HISTORY}/${id}`)
	}

}
