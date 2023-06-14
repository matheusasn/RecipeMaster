import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponse } from '../../models/api-response';
import { APIClientService } from '../common/api-client.service';
import { ENDPOINTS } from "../../constants/endpoints";
import { DOCUMENT } from '@angular/common';
import { ModalMercadoPagoComponent } from '../../../content/pages/business/plano-assinatura/plan-card/plan-card.component';
import { MatDialog, MatDialogRef } from '@angular/material';
import { PerfilEnum } from '../../models/security/perfil.enum';


export interface PreferenceItemDTO {
  title:string;
  quantity:number;
  unitPrice:number;
  perfil: PerfilEnum;
}

@Injectable({
  providedIn: 'root'
})
export class MercadopagoService {

  modalMercadoPago:MatDialogRef<ModalMercadoPagoComponent>;

  constructor(private api:APIClientService, private dialog:MatDialog, @Inject(DOCUMENT) private document:Document) { }

  public openCheckoutUrl(item:PreferenceItemDTO) {

    this.createPreferenceURL(item).subscribe( (response:ApiResponse) => {
      this.document.location.href = response.message;

    }, err => console.warn(err) );

  }

  public openCheckoutModal(item:PreferenceItemDTO) {

    this.createPreferenceURL(item).subscribe( (response:ApiResponse) => {
      this.modalMercadoPago = this.dialog.open(ModalMercadoPagoComponent, {
        data: {
          url: response.message
        },
        panelClass: 'mercadopago-modal'
      });

      this.modalMercadoPago.afterClosed().subscribe( (response:any) => {
        console.log("fechando modal mercadopago", response);
				window.location.reload()
      }, err => console.warn(err) );

    }, err => console.warn(err) );

  }

  private createPreferenceURL(item:PreferenceItemDTO): Observable<ApiResponse> {
    return this.api.post(`${ENDPOINTS.BUSINESS.MERCADOPAGO}/preference`, item);
  }

}
