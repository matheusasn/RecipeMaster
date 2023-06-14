import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { APIClientService } from '../common/api-client.service';
import { ApiResponse } from '../../models/api-response';
import { CpLocalStorageService } from '../common/cp-localstorage.service';
import { UserStatsDTO } from '../../../content/pages/business/admin/users/users.component';
import { ENDPOINTS, PACKAGE } from '../../constants/endpoints';
import { RequestStatsGraphDTO } from '../../../content/pages/business/admin/admin-stats/admin-stats.component';
import { DeviceType } from './stats.service';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

    constructor(private _apiService: APIClientService, private storageService: CpLocalStorageService) { }

    public updateAll(users:UserStatsDTO[]) {

      try {

        let statsResponse:ApiResponse = this.storageService.getStats();

        statsResponse.data = users;

        this.storageService.saveStats(statsResponse);

      }
      catch(e) {
        console.warn(e.message);
      }

    }

		public getAllStats(): Observable<ApiResponse> {
			return this._apiService.get(ENDPOINTS.ADMIN.STATS.ALL);
		}

		public loadGraph(path: string, dto: RequestStatsGraphDTO): Observable<ApiResponse> {
			return this._apiService.post(`${ENDPOINTS.ADMIN.STATS.ALL_GRAPH}/${path}`, dto);
		}

		public updateUserPassword(userId: number, password: string):Observable<ApiResponse> {
			return this._apiService.post(`${ENDPOINTS.SECURITY.USER}/admin/${userId}/update-password`, password);
		}

		public getTodayUsers():Observable<ApiResponse> {
			return this._apiService.get(`${PACKAGE.ADMIN}/count/today-users`)
		}

		public getTodayAccesses():Observable<ApiResponse> {
			return this._apiService.get(`${PACKAGE.ADMIN}/count/today-accesses`)
		}

		public getTodaySubscribers():Observable<ApiResponse> {
			return this._apiService.get(`${PACKAGE.ADMIN}/count/today-subscribers`)
		}

		public getTodayRecipes():Observable<ApiResponse> {
			return this._apiService.get(`${PACKAGE.ADMIN}/count/today-recipes`)
		}

		public getTodayPdfs():Observable<ApiResponse> {
			return this._apiService.get(`${PACKAGE.ADMIN}/count/today-pdfs`)
		}

		public getTodayIngredients():Observable<ApiResponse> {
			return this._apiService.get(`${PACKAGE.ADMIN}/count/today-ingredients`)
		}

		public getTodayCompoundIngredients():Observable<ApiResponse> {
			return this._apiService.get(`${PACKAGE.ADMIN}/count/today-compound-ingredients`)
		}

		public getFirebaseStats():Observable<ApiResponse> {
			return this._apiService.get(`${PACKAGE.ADMIN}/count/firebase-stats`)
		}

		public getTodayPrices():Observable<ApiResponse> {
			return this._apiService.get(`${PACKAGE.ADMIN}/count/today-prices`)
		}

		public getTodayMenus():Observable<ApiResponse> {
			return this._apiService.get(`${PACKAGE.ADMIN}/count/today-menus`)
		}

		public getCountByDevice(device: DeviceType):Observable<ApiResponse> {
			return this._apiService.get(`${PACKAGE.ADMIN}/count/device/${device}`)
		}

		public getPlanExpirations():Observable<ApiResponse> {
			return this._apiService.get(`${PACKAGE.ADMIN}/expirations`)
		}

}
