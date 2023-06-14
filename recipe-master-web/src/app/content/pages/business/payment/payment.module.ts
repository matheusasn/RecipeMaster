import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaymentComponent } from './payment.component';
import { Routes, RouterModule } from '@angular/router';
import { MetronicCoreModule } from "../../../../core/metronic/metronic-core.module";
import { LayoutModule } from "../../../layout/layout.module";
import { PartialsModule } from "../../../partials/partials.module";
import { TranslateModule } from "@ngx-translate/core";
import { CPCommonComponentsModule } from '../../components/common/cp-common-components.module';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxUsefulSwiperModule } from 'ngx-useful-swiper';
import { PaymentCardComponent } from './components/payment-card/payment-card.component';
import { PaymentInfoComponent } from './components/payment-info/payment-info.component';


const routes: Routes = [
    {
        path: '',
        component: PaymentComponent
    }
];

@NgModule({
  imports: [
    CommonModule,
    MetronicCoreModule,
    LayoutModule,
    PartialsModule,
    AngularEditorModule,
    CPCommonComponentsModule,
    RouterModule.forChild(routes),
    TranslateModule.forChild(),
    NgbModule,
    NgxUsefulSwiperModule
  ],
  declarations: [PaymentComponent, PaymentCardComponent, PaymentInfoComponent]
})
export class PaymentModule { }
