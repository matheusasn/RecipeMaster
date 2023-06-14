import { Injectable, EventEmitter } from '@angular/core';
import { APIClientService } from '../services/common/api-client.service';
import { ENDPOINTS } from '../constants/endpoints';
import { User } from '../models/user';
import { CpLocalStorageService } from '../services/common/cp-localstorage.service';
import { of, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Plan, PagseguroStatus, PaypalStatus, PlanDateUpdate } from '../models/business/plan';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models/api-response';
import { PerfilEnum } from '../models/security/perfil.enum';

export interface HandleAppleStorePaymentDTO {
	productIdentifier: string;
	transactionIdentifier: string;
	userId: number;
	perfil: PerfilEnum;
}

export interface  HandleAppleStoreSubscriptionSyncDTO {
	productIdentifier: string;
	transactionIdentifier: string;
	transactionDate: string;
	userId: number;
}

@Injectable()
export class UserService {
  public updatePhoto = new EventEmitter<string>();

  constructor(
    private _apiClient: APIClientService,
    private _cpLocalStorageService:CpLocalStorageService
  ) { }

  register(user: User) {
    return this._apiClient.post(ENDPOINTS.SECURITY.USER, user);
  }

  update(user: User) {
    return this._apiClient.put(ENDPOINTS.SECURITY.USER, user);
  }

	updateUserLocality(userId:string, country: string, city: string) {
    return this._apiClient.put(`${ENDPOINTS.SECURITY.USER}/${userId}/locality`, {
			country, city
		});
	}

	updateByAdmin(user: User) {
    return this._apiClient.put(`${ENDPOINTS.SECURITY.USER}/admin`, user);
  }

	updatePlanExpiration(planDateUpdate: PlanDateUpdate) {
		return this._apiClient.put(`${ENDPOINTS.SECURITY.USER}/admin/plan-expiration`, planDateUpdate);
	}

  findByIdReduced(id: number) {
    return this._apiClient.get(`${ENDPOINTS.SECURITY.USER}/reduced/${id}`);
  }

  findById(id: number) {
    return this._apiClient.get(`${ENDPOINTS.SECURITY.USER}/${id}`);
  }

  refreshPlan() {
    return this._apiClient.get(`${ENDPOINTS.SECURITY.USER}/refresh-plan`);
  }

	toggleHomeMeasureUnit(userId: number) {
    return this._apiClient.post(`${ENDPOINTS.SECURITY.USER}/${userId}/toggle-home-measure-unit`, {});
  }

  getPlan():Observable<Plan> {

    if(!environment.VALIDADE_PLAN) {
        return of({
            pagseguroTransactionStatus: PagseguroStatus.PAGA,
            paypalOrderStatus: PaypalStatus.COMPLETED,
            expiration: new Date('2050-12-31'),
            pagseguroTransactionId:'pagseguroTransactionId'
        });
    }

    let user =  this._cpLocalStorageService.getLoggedUser();

    if(user == null) {
      return of(null);
    }

    return this.findByIdReduced(user.id).pipe(map((res)=>{

      let u:User = res.data;

      if(!u.plan) {
        return null;
      }
      else {

        if( u.plan.paypalOrderStatus == PaypalStatus.UNDEFINED ||
            u.plan.pagseguroTransactionStatus==PagseguroStatus.DISPONIVEL ||
            u.plan.pagseguroTransactionStatus==PagseguroStatus.PAGA) { // ainda não foi aprovado.. forço um refresh para evitar que a notificação do pagseguro nunca chegue

          this.refreshPlan().subscribe((d)=>{
            console.log(d);
          });

        }

        return u.plan;

      }

    }));

  }

  public uploadPhoto(userId:number, imageDto:any): Observable<ApiResponse> {
		return this._apiClient.post(`${ENDPOINTS.STORAGE.PROFILE}/${userId}`, imageDto);
	}

	public uploadMenuPhoto(imageDto:any): Observable<ApiResponse> {
		return this._apiClient.post(`${ENDPOINTS.STORAGE.PROFILE}`, imageDto);
  }

	public startDiscountTimer(userId: number): Observable<ApiResponse> {
		return this._apiClient.put(`${ENDPOINTS.SECURITY.USER}/start-discount-timer/${userId}`, {})
	}

	public handleAppleStorePayment(dto: HandleAppleStorePaymentDTO): Observable<ApiResponse> {
		return this._apiClient.post(`${ENDPOINTS.BUSINESS.APPLESTORE}/subscriptions/create`, dto);
	}

	public handleAppleStoreSubscriptionSync(dto: HandleAppleStoreSubscriptionSyncDTO): Observable<ApiResponse> {
		return this._apiClient.post(`${ENDPOINTS.BUSINESS.APPLESTORE}/subscriptions/sync`, dto);
	}

  photoChangeObservable: EventEmitter<User>;

  public getPhotoChangeEvent() {

    if(!this.photoChangeObservable) {
      this.photoChangeObservable = new EventEmitter<User>();
    }

    return this.photoChangeObservable;

  }

	public getNps(): any {
		return this._apiClient.get(`${ENDPOINTS.SECURITY.USER}/nps`);
	}

}
