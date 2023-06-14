import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaymentButtonComponent } from './payment-button.component';
import { TranslateModule } from '@ngx-translate/core';
import { DeviceDetectorModule } from 'ngx-device-detector';
import { ModalMercadoPagoComponent } from '../plan-card/plan-card.component';
import { MatProgressSpinnerModule } from '@angular/material';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule.forChild(),
    DeviceDetectorModule,
		MatProgressSpinnerModule
  ],
  declarations: [PaymentButtonComponent, ModalMercadoPagoComponent],
  exports: [PaymentButtonComponent],
  entryComponents: [ModalMercadoPagoComponent]
})
export class PaymentButtonModule { }
