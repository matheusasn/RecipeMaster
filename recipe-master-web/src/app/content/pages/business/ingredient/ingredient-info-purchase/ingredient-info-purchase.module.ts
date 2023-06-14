import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { WidgetChartsModule }               from '../../../../partials/content/widgets/charts/widget-charts.module';
import { IngredientInfoPurchaseComponent }  from "./ingredient-info-purchase.component";
import { CommonModule }                     from "@angular/common";
import { MetronicCoreModule }               from "../../../../../core/metronic/metronic-core.module";
import { LayoutModule }                     from "@angular/cdk/layout";
import { PartialsModule }                   from "../../../../partials/partials.module";
import { AngularEditorModule }              from "@kolkov/angular-editor";
import { ReactiveFormsModule }              from "@angular/forms";
import { CommonServiceModule }              from "../../../../../core/services/common/common-service.module";
import { CPCommonComponentsModule }         from "../../../components/common/cp-common-components.module";
import { TranslateModule }                  from "@ngx-translate/core";
import { CurrencyMaskModule } from "ng2-currency-mask";
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { RouterModule } from "@angular/router";
import { UiSwitchModule } from 'ngx-toggle-switch';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { UnitinfoModule } from "../../../components/unitinfo/unitinfo.module";

@NgModule({
    imports: [
        CommonModule,
        MetronicCoreModule,
        LayoutModule,
        PartialsModule,
        AngularEditorModule,
        ReactiveFormsModule,
        CommonServiceModule,
        CPCommonComponentsModule,
        CurrencyMaskModule,
        TranslateModule.forChild(),
        SweetAlert2Module.forRoot(),
        RouterModule,
        UiSwitchModule,
        NgbModule,
        UnitinfoModule,
        WidgetChartsModule
    ],
    declarations: [
        IngredientInfoPurchaseComponent
    ],
    entryComponents: [
        IngredientInfoPurchaseComponent
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class IngredientInfoPurchaseModule { }
