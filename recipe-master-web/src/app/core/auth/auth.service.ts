import { Injectable } from '@angular/core';
import { APIClientService } from '../services/common/api-client.service';
import { Credentials } from '../interfaces/credentials';
import { ENDPOINTS } from '../constants/endpoints';
import { Observable } from 'rxjs';
import { ApiResponse } from '../models/api-response';
import { map, tap } from 'rxjs/operators';
import { CpLocalStorageService } from '../services/common/cp-localstorage.service';
import { PlanService } from '../services/business/plan.service';

@Injectable()
export class AuthService {

  constructor(
    private _apiClient: APIClientService,
    private storageService: CpLocalStorageService,
    private planService: PlanService
  ) {
  }

  authenticate(credencials: Credentials) {
    return this._apiClient.post(ENDPOINTS.SECURITY.LOGIN, credencials);
  }

	loginWithFacebook(dto) {
		return this._apiClient.post(ENDPOINTS.SECURITY.LOGIN_FACEBOOK, dto);
	}

	loginWithGoogle(dto) {
		return this._apiClient.post(ENDPOINTS.SECURITY.LOGIN_GOOGLE, dto);
	}

  changePass(credencials) {
    return this._apiClient.post(`${ENDPOINTS.SECURITY.USER}/redefine-pass`, credencials);
  }

  login(credencials: Credentials): Observable<ApiResponse> {

    return this._apiClient.post(ENDPOINTS.SECURITY.LOGIN, credencials).pipe(
      map((result: ApiResponse) => {
        if (result instanceof Array) {
          return result.pop();
        }
        return result;
      }),
      tap(this.saveAccessData.bind(this))
    );

  }

  private saveAccessData(accessData: ApiResponse) {
    if (typeof accessData !== 'undefined') {

      this.storageService.setToken(accessData.data);
      this.planService.setUserRoles(accessData);

    }
  }

}
