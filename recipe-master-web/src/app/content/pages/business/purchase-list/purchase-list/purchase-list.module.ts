import { NgModule }             from '@angular/core';
import { CommonModule }         from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { DragulaModule }        from 'ng2-dragula';
import { MetronicCoreModule }   from '../../../../../core/metronic/metronic-core.module';
import { LayoutModule }         from '../../../../layout/layout.module';
import { PartialsModule }       from '../../../../partials/partials.module';
import { AngularEditorModule }  from '@kolkov/angular-editor';
import {    MatListModule,
            MatCardModule,
            MatDividerModule,
            MatIconModule,
            MatProgressSpinnerModule,
            MatMenuModule,
            MatButtonModule }   from '@angular/material';
import { CPCommonComponentsModule } from '../../../components/common/cp-common-components.module';
import { TranslateModule } from '@ngx-translate/core';
import { NgbPaginationModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AdsenseModule } from 'ng2-adsense';
import { MatDialogModule } from '@angular/material/dialog';

import { PurchaseListComponent } from './purchase-list.component';
import { IngredientInfoPurchaseModule } from '../../ingredient/ingredient-info-purchase/ingredient-info-purchase.module';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, MatRippleModule } from '@angular/material/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { AmountModalModule } from '../amount-modal/amount-modal.module';
import { UnitinfoModule } from '../../../components/unitinfo/unitinfo.module';

const routes: Routes = [
    {
        path: '',
        component: PurchaseListComponent
    }
];

@NgModule({
    imports: [
        NgbModule,
        FormsModule,
        ReactiveFormsModule,
        CommonModule,
        MetronicCoreModule,
        LayoutModule,
        PartialsModule,
        AngularEditorModule,
        IngredientInfoPurchaseModule,
        MatListModule,
        MatCardModule,
        MatDividerModule,
        MatIconModule,
        MatButtonModule,
        MatMenuModule,
        NgbPaginationModule,
        CPCommonComponentsModule,
        RouterModule.forChild(routes),
        TranslateModule.forChild(),
        SweetAlert2Module.forRoot(),
        MatProgressSpinnerModule,
        MatDialogModule,
        AmountModalModule,

        MatDatepickerModule,
        MatNativeDateModule, MatRippleModule,
        MatCheckboxModule,

        AdsenseModule.forRoot({
            adClient: 'ca-pub-7000897604640151',
            adSlot: 4439575095,
        }),
        UnitinfoModule, DragulaModule
    ],
    declarations: [
        PurchaseListComponent
    ],
    exports: [
        PurchaseListComponent
    ],
    bootstrap: [
        PurchaseListComponent
    ],
    entryComponents: [
    ],
    providers: [
        { provide: MAT_DATE_LOCALE, useValue: 'pt-BR'},
    ]
})
export class PurchaseListModule { }
