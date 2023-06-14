import { Injectable } from "@angular/core";
import { APIClientService } from "../common/api-client.service";
import { ApiResponse } from "../../models/api-response";
import { Observable } from "rxjs";
import { ENDPOINTS } from "../../constants/endpoints";
import { PurchaseListFilter } from "../../models/business/dto/purchase-list-filter";
import { PurchaseList } from '../../models/business/purchase-list.model';

@Injectable({
  providedIn: 'root'
})
export class PurchaseListService {

  constructor(
    private _apiService: APIClientService
  ) { }

  public getAllByUser(userId: number, filter: PurchaseListFilter): Observable<ApiResponse> {
		return this._apiService.post(`${ENDPOINTS.BUSINESS.PURCHASELIST}/user/${userId}/all`, filter);
  }

  public getAllByUserPesquisa(userId: number, filter: PurchaseListFilter): Observable<ApiResponse> {
    return this._apiService.post(`${ENDPOINTS.BUSINESS.PURCHASELIST}/listaComprasPesq/${userId}`, filter);
  }

  public insert(p: PurchaseList): Observable<ApiResponse> {
		return this._apiService.post(`${ENDPOINTS.BUSINESS.PURCHASELIST}`, p);
	}

  public update(p: PurchaseList): Observable<ApiResponse> {
		return this._apiService.put(`${ENDPOINTS.BUSINESS.PURCHASELIST}`, p);
  }
  
  public remover(userId: number, id: number): Observable<ApiResponse> {
		return this._apiService.delete(`${ENDPOINTS.BUSINESS.PURCHASELIST}/${userId}/${id}`);
  }

  public getById(id: number): Observable<ApiResponse> {
    return this._apiService.get(`${ENDPOINTS.BUSINESS.PURCHASELIST}/listaCompras/${id}`);
  }

}
