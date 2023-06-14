import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlanoAssinaturaComponent } from './plano-assinatura.component';
import { Routes, RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { MetronicCoreModule } from '../../../../core/metronic/metronic-core.module';
import { LayoutModule } from '@angular/cdk/layout';
import { PartialsModule } from '../../../partials/partials.module';
import { CommonServiceModule } from '../../../../core/services/common/common-service.module';
import { CPCommonComponentsModule } from '../../components/common/cp-common-components.module';
import { MatProgressSpinnerModule, MatIconModule } from '@angular/material';
import { PaymentButtonModule } from './payment-button/payment-button.module';
import { CouponComponent } from './coupon/coupon.component';
import { PlanoAssinaturaRoutingModule } from './plano-assinatura-routing.module';
import { ModalMercadoPagoComponent, PlanCardComponent } from './plan-card/plan-card.component';
import { DiscountBadgeComponent } from './discount-badge/discount-badge.component';
import { MercadopagoButtonComponent } from './mercadopago-button/mercadopago-button.component';
import { OtherPaymentsCardComponent } from './other-payments-card/other-payments-card.component';
import { PlanFeatCardComponent } from './plan-feat-card/plan-feat-card.component';
import { PlanFeatCardComponentOne } from './plan-feat-card1/plan-feat-card1.component';
import { PlanFeatCardComponentTwo } from './plan-feat-card2/plan-feat-card2.component';
import { CountdownDiscountComponent } from './countdown-discount/countdown-discount.component';
import { PaymentInstructionsCardComponent } from './payment-instructions-card/payment-instructions-card.component';
import { PagePixComponent } from './page-pix/page-pix.component';
import { PageDiscountComponent } from './page-discount/page-discount.component';
import { NgxUsefulSwiperModule } from 'ngx-useful-swiper';
import { DialogPlansComponent } from '../../tutorials/plans/dialog-plans/dialog-plans.component';

// const routes: Routes = [
//   {
//     path: '',
//     component: PlanoAssinaturaComponent
//   }
// ];

@NgModule({
  imports: [
    CommonModule,
    PlanoAssinaturaRoutingModule,
    MetronicCoreModule,
    LayoutModule,
    PartialsModule,
    // RouterModule.forChild(routes),
    TranslateModule.forChild(),
    CommonServiceModule,
    CPCommonComponentsModule,
    MatProgressSpinnerModule,
    PaymentButtonModule,
		NgxUsefulSwiperModule,
		MatIconModule
  ],
  declarations: [
    PlanoAssinaturaComponent,
    CouponComponent,
    PlanCardComponent,
    DiscountBadgeComponent,
    MercadopagoButtonComponent,
    OtherPaymentsCardComponent,
    PlanFeatCardComponent,
    PlanFeatCardComponentOne,
    PlanFeatCardComponentTwo,
    CountdownDiscountComponent,
    PaymentInstructionsCardComponent,
    PagePixComponent,
    PageDiscountComponent
  ],
	entryComponents: [
		DialogPlansComponent
	]
})
export class PlanoAssinaturaModule { }
