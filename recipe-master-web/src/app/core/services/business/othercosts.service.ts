import { Injectable } from '@angular/core';
import { APIClientService } from '../common/api-client.service';
import { Observable } from 'rxjs';
import { ENDPOINTS } from "../../constants/endpoints";

export interface OtherCostFilter {
  name:string;
}

@Injectable({
  providedIn: 'root'
})
export class OthercostsService {

  constructor(private _apiClient: APIClientService) { }

  find(term:string):Observable<any> {

    let filter:OtherCostFilter = {
      name: term
    };

    return this._apiClient.post(`${ENDPOINTS.BUSINESS.OTHER_COSTS}`, filter);
    
  }

}
