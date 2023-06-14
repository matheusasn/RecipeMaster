import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponse } from '../../models/api-response';
import { FinancialHistory, FinancialHistoryFilter } from '../../models/business/financial-history';
import { APIClientService } from '../common/api-client.service';
import { ENDPOINTS } from './../../constants/endpoints';



@Injectable({
  providedIn: 'root'
})
export class FinancialService {

  constructor(private api:APIClientService) { }

  findHistoryByFinancialId(financialId:number):Observable<ApiResponse> {
    
    let filter:FinancialHistoryFilter = {
      currentPage: 1,
      includeFinancial: false
    };

    return this.api.post(`${ENDPOINTS.BUSINESS.FINANCIAL_HISTORY}/financial/${financialId}`, filter);
    
  }

  addFinancialHistory(history: FinancialHistory):Observable<ApiResponse> {
    return this.api.post(`${ENDPOINTS.BUSINESS.FINANCIAL_HISTORY}`, history);
  }

}
