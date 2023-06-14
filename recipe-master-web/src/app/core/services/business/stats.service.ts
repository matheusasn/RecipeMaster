import { Injectable } from '@angular/core';
import { APIClientService } from '../common/api-client.service';
import { Observable } from 'rxjs';
import { ApiResponse } from '../../models/api-response';
import { ENDPOINTS, PACKAGE } from '../../constants/endpoints';

export enum DeviceType {
	WEB = "WEB", ANDROID = "ANDROID", iOS = "iOS"
}

@Injectable({
  providedIn: 'root'
})
export class StatsService {

  constructor(
    private _apiService: APIClientService
  ) { }

  public countUsers(): Observable<ApiResponse> {
    return this._apiService.get(ENDPOINTS.ADMIN.STATS.USERS);
  }

  public countSignatures(): Observable<ApiResponse> {
    return this._apiService.get(ENDPOINTS.ADMIN.STATS.SIGNATURES);
  }

  public countAccess(): Observable<ApiResponse> {
    return this._apiService.get(ENDPOINTS.ADMIN.STATS.ACCESS);
  }

	public getByUser(userId: number): Observable<ApiResponse> {
    return this._apiService.get(ENDPOINTS.ADMIN.STATS.ACCESS + "/" + userId);
  }

  public upcountAccess(deviceType: DeviceType): Observable<ApiResponse> {
    return this._apiService.post(ENDPOINTS.ADMIN.STATS.ACCESS, deviceType);
  }

	public removeDiscountTimer(userId: string): Observable<ApiResponse> {
		return this._apiService.post(`${PACKAGE.ADMIN}/${userId}/remove-discount-timer`, {});
	}

  // public getStats(): Observable<ApiResponse> {
  //   return this._apiService.get(ENDPOINTS.ADMIN.STATS.ALL);
  // }

}
