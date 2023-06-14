import { Component, Input, OnInit } from '@angular/core';
import { environment } from '../../../../../../environments/environment';
import { ApiResponse } from '../../../../../core/models/api-response';
import { PerfilEnum } from '../../../../../core/models/security/perfil.enum';
import { MercadopagoService, PreferenceItemDTO } from '../../../../../core/services/business/mercadopago.service';
import { PlanOption } from '../plan-card/plan-card.component';

@Component({
  selector: 'mercadopago-button',
  templateUrl: './mercadopago-button.component.html',
  styleUrls: [
    './mercadopago-button.component.scss',
    '../payment-button/payment-button.component.scss'
  ]
})
export class MercadopagoButtonComponent implements OnInit {

  @Input() perfil:PerfilEnum;
  @Input() label: string = 'MERCADOPAGO.BTN_LABEL';
  @Input() customClass: string = 'btn';

  constructor(private mpService: MercadopagoService) { }

  ngOnInit() {}

  doClick() {

    let plan:PlanOption = this.getPlanByPerfil();

    let item:PreferenceItemDTO = {
      title: plan.description,
      quantity: 1,
      unitPrice: plan.values.annually,
      perfil: this.perfil
    };

    this.mpService.openCheckoutModal(item);

  }

  private getPlanByPerfil():PlanOption {

    if(!this.perfil) {
      return environment.plans.mercadopago.basic;
    }

    switch(this.perfil) {
      case PerfilEnum.USER_BASIC:
        return environment.plans.mercadopago.basic;
      case PerfilEnum.USER_PRO:
        return environment.plans.mercadopago.pro;
      case PerfilEnum.USER_PRO_NUTRI:
        return environment.plans.mercadopago.pro_nutri;
      default:
        return environment.plans.mercadopago.basic;
    }

  }

}
