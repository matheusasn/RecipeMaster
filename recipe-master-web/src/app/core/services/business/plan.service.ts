import { Injectable, Sanitizer, Inject } from '@angular/core';
import { PerfilEnum, RolePermission, PerfilPermission, Perfil } from '../../models/security/perfil.enum';
import { STORAGE_KEYS } from '../../../config/storage_keys.config';
import * as _ from 'lodash';
import { ApiResponse } from '../../models/api-response';
import { User } from '../../models/user';
import swal, { SweetAlertOptions } from 'sweetalert2';
import { Router } from '@angular/router';
import { CpRoutes } from '../../constants/cp-routes';
import { environment } from '../../../../environments/environment';
import { UserService } from '../../auth/user.service';
import { APIClientService } from '../common/api-client.service';
import { ENDPOINTS } from '../../constants/endpoints';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { Plan, PagseguroStatus, MercadopagoStatus } from '../../models/business/plan';
import { CpLocalStorageService } from '../common/cp-localstorage.service';
import { PaymentAPI } from '../../models/business/payment-api';
import { DOCUMENT } from '@angular/common';
import { DeviceDetectorService } from 'ngx-device-detector';
import { TranslateService } from '@ngx-translate/core';
import { HttpBackend, HttpClient } from '@angular/common/http';

declare let PagSeguroLightbox: any;

@Injectable({
  providedIn: 'root'
})
export class PlanService {

    // Code	Continent name
    // AF	Africa
    // AN	Antarctica
    // AS	Asia
    // EU	Europe
    // NA	North america
    // OC	Oceania
    // SA	South america

    pagseguroContinentCodes: string[];
    _isPaypal:boolean;
		private customHttpClient: HttpClient;

  constructor(private _apiClient: APIClientService, private _router: Router, private userService: UserService, private _cpLocalStorageService:CpLocalStorageService,
    private sanitize: Sanitizer, @Inject(DOCUMENT) private document: Document, private deviceDetector: DeviceDetectorService, private translate: TranslateService,
		customHttpBackend: HttpBackend) {
      this.pagseguroContinentCodes = environment.plans.pagseguro.continent_codes;
			this.customHttpClient = new HttpClient(customHttpBackend);
  }

  public getUserRoles():PerfilEnum[] {

    try {

        let user:User = this._cpLocalStorageService.getLoggedUser();

        let roles: PerfilEnum[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.ROLES + "-u-" + user.id));

        if( _.isNil(roles) ) {
            return [];
        }

        return roles;

    }
    catch(e) {
        console.warn(e.message);
        return [];
    }

  }

  public setUserRoles(response: ApiResponse) {

    let user:User = response.data.user;

    if( _.isNil(user) ) {
      user = response.data;
    }

    try {
      localStorage.setItem(STORAGE_KEYS.ROLES + "-u-" + user.id, JSON.stringify(user.perfis));
    }
    catch(e) {
      console.warn(e.message);
    }

  }

  public hasPermission(perm: RolePermission, showAlertOnPermissionDenied:boolean = true):boolean {

    if( _.isNil(environment.VALIDADE_PLAN) || !environment.VALIDADE_PLAN) {
      return true;
    }

    let userPerfil: PerfilEnum[] = this.getUserRoles();

    if(_.indexOf(userPerfil, PerfilEnum.ADMIN) >= 0) {
        return true;
    }
    else if(_.indexOf(userPerfil, PerfilEnum.NONE) >= 0) {

      if(showAlertOnPermissionDenied) {
        this.noPlanAlert("Você não tem permissões.");
      }

      return false;

    }

    let hasPerm:boolean = false;

    _.each(userPerfil, (perfil: PerfilEnum) => {

        let permissions:RolePermission[] = PerfilPermission.getPermission(perfil);

        if(permissions != null) {

            if(_.indexOf(permissions, perm) >= 0) {
                hasPerm = true;
            }

        }

    });

    if(!hasPerm && showAlertOnPermissionDenied) {
      this.noPlanAlert(PerfilPermission.getMessage(perm));
    }

    return hasPerm;

  }

  public createPlan(plan: Plan) {
    return this._apiClient.post(`${ENDPOINTS.SECURITY.USER}/create-plan`, plan);
  }

  public noPlanAlert(msg: String) {

    let auxConfirmBtnText: string;
    this.translate.get('PLANO_PAGE.BUTTON_CONFIRM').subscribe(data => auxConfirmBtnText = data);

    if(!!this.hasPermission && msg === 'ALERT_PLAN.TXT1'){
      let auxMsg: string;
      this.translate.get('ALERT_PLAN.TXT1').subscribe(data => auxMsg = data);
      msg = `<b style="font-weight: 500">${auxMsg}</b>`;
    }

    let swalOptions:SweetAlertOptions = {
        html: msg + "",
        imageUrl: './assets/img_plans.png',
        imageClass: 'img-plans',
        width: 450,
        showCloseButton: true,
        confirmButtonColor: '#f4516c',
        confirmButtonText: auxConfirmBtnText,
        animation: false,
        customClass: 'animated fadeInDown faster'
    };

    swal(swalOptions).then((result) => {

      if(result.value === true) {
        this._router.navigate([CpRoutes.PLAN_SIGN]);
      }

    });

  }

  public checkoutBox(transactionCode: string, perfil: PerfilEnum) {

    if(this.deviceDetector.isMobile()) {
      this.lightboxMobile(transactionCode, perfil);
      return;
    }

    this.lightboxWeb(transactionCode, perfil);

  }

  private lightboxMobile(transactionCode: string, perfil: PerfilEnum) {

    let url:any = `${environment.PAGSEGURO_URL}?code=${transactionCode}`;

    this.document.location.href = url;

  }

  private lightboxWeb(transactionCode: string, perfil: PerfilEnum) {

    PagSeguroLightbox(transactionCode, {
      success: (transactionID:string) => {

        let plan:Plan = {
            api: PaymentAPI.PAGSEGURO,
            perfil: perfil,
            pagseguroTransactionId: transactionID
        };

        this.createPlan(plan).subscribe((r)=>{

            this.validatePlan().subscribe((r)=> console.log(`Plano existente e dentro da validade? ${r}`),err => console.log(err));

        },
        err => {
            console.log(err);
        });

      },
      abort: (response:any) => {
          console.log("desistiu da compra:", response);
      }
    });

    // let swalOptions:SweetAlertOptions = {
    //   imageUrl: './assets/favicon.png',
    //   imageWidth: 92,
    //   title: "Você será redirecionado para o Pagseguro",
    //   text: "Se isso não ocorrer automaticamente, verifique as permissões do navegador.",
    //   confirmButtonColor: '#f4516c'
    // };

    // swal(swalOptions).then((result) => {
    // });

  }

  validatePlan():Observable<boolean> {

    if(!environment.VALIDADE_PLAN) {
      return of(true);
    }

    let user =  this._cpLocalStorageService.getLoggedUser();

    if(user == null) {
      return of(false);
    }

    return this.userService.findById(user.id).pipe(map((res)=>{

      let u:any = res.data;

      if(!u.plan) {
        return false;
      }
      else {
				let date = new Date();
        date.setHours(0,0,0,0);
				if (u.plan.api === 'MERCADOPAGO' && u.plan.mercadopagoTransactionStatus === MercadopagoStatus.APPROVED) {
					const user:ApiResponse = {
						data: {
							user: u
						}
					}
					this.setUserRoles(user);
					return date.getTime() < new Date(u.plan.expiration).getTime();
				}

        if( u.plan.pagseguroTransactionStatus==PagseguroStatus.DISPONIVEL ||
            u.plan.pagseguroTransactionStatus==PagseguroStatus.ANALISE ||
            u.plan.pagseguroTransactionStatus==PagseguroStatus.PAGA ||
            u.plan.api == PaymentAPI.MERCADOPAGO || u.plan.api == "MERCADOPAGO") { // ainda não foi aprovado.. forço um refresh para evitar que a notificação do pagseguro nunca chegue

              this.userService.refreshPlan().subscribe((response:ApiResponse)=>{
                this.setUserRoles(response);

                return date.getTime() < new Date(u.plan.expiration).getTime();

              }, (err) => {
                return false;
              });

        }
        else {
          return date.getTime() < new Date(u.plan.expiration).getTime();
        }

      }

    }));

  }

    isPaypal():Observable<boolean> {
        return new Observable( (observer) => {

					const isIOS = this._cpLocalStorageService.isIOS()
					// @ts-ignore
					const isAndroid = typeof(Android) != "undefined";

					if (isIOS || isAndroid) {
						this._isPaypal = false;
					}

            if(!_.isNil(this._isPaypal)) {
                observer.next(this._isPaypal);
                observer.complete();
                return;
            }

            this.customHttpClient.get(`${environment.ipgeolocation.url}?auth=${environment.ipgeolocation.token}`).subscribe( (response:any) => {
                try {
                    this._isPaypal = !this.pagseguroContinentCodes.includes(response.continent_code);
                    observer.next(this._isPaypal);
                }
                catch(e) {
                    console.warn(e.message);
                    observer.next(false);
                }

                observer.complete();

            }, err => {
                console.warn(err.message);
                observer.next(false);
                observer.complete();
            } );

        } );

    }

}
