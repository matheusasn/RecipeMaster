import { Injectable } from "@angular/core";
import { APIClientService } from "../common/api-client.service";
import { ApiResponse } from "../../models/api-response";
import { Observable } from "rxjs";
import { ENDPOINTS } from "../../constants/endpoints";
import { HttpHeaders, HttpClient } from "@angular/common/http";
import { PerfilEnum, PerfilPermission, Perfil } from "../../models/security/perfil.enum";
import { environment } from "../../../../environments/environment";
import { PlanOption } from "../../../content/pages/business/plano-assinatura/plan-card/plan-card.component";


@Injectable()
export class PagSeguroService{

    constructor(private _apiClient: APIClientService){ }

    public checkoutPlan(plan:PlanOption, perfil: PerfilEnum, useDiscount:boolean = false) {

        let checkoutData:any = {
            perfil: perfil,
            description: plan.description,
            value: useDiscount&&plan.values.annually_50off?plan.values.annually_50off:plan.values.annually
        };

        return this._apiClient.post(`${ENDPOINTS.PAGSEGURO.CHECKOUT}/coupon`, checkoutData);

    }

    public checkout(perfil: PerfilEnum, isCoupon:boolean = false) {

        if(isCoupon) {

            let plan:any = environment.plans.pagseguro.pro_nutri_promocional;

            let checkoutData:any = {
                perfil: perfil,
                description: plan.description,
                value: plan.values.annually
            };

            return this._apiClient.post(`${ENDPOINTS.PAGSEGURO.CHECKOUT}/coupon`, checkoutData);

        }
        else {
            let p:number = Perfil.perfilToIndex(perfil);

            return this._apiClient.get(`${ENDPOINTS.PAGSEGURO.CHECKOUT}/${p}`);
        }

    }
    
}