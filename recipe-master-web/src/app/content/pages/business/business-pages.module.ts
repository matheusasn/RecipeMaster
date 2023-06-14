import { NgModule }                                              from "@angular/core";
import { CurrencyMaskModule }                                    from 'ng2-currency-mask';
import { WidgetChartsModule }                                    from '../../partials/content/widgets/charts/widget-charts.module';
import { UnitinfoModule }                                        from '../components/unitinfo/unitinfo.module';
import { BusinessPagesRoutingModule }                            from "./business-pages-routing.module";
import { IngredientInfoHistoryComponent }                        from './ingredient/ingredient-info-history/ingredient-info-history.component';
import { IngredientInfoUnitComponent }                           from './ingredient/ingredient-info-unit/ingredient-info-unit.component';
import { IngredientInfoModule }                                  from './ingredient/ingredient-info/ingredient-info.module';
import { IngredientMenuInfoComponent }                           from './menu/ingredient-menu-info/ingredient-menu-info.component';
import { CPProfileComponent }                                    from "./profile/cp-profile.component";
import { MatFormFieldModule, MatInputModule, MatCheckboxModule, MatProgressSpinnerModule, MatIconModule } from '@angular/material';
import { ReactiveFormsModule, FormsModule }                      from "@angular/forms";
import { CommonModule }                                          from "@angular/common";
import { TranslateModule }                                       from "@ngx-translate/core";
import { RecipeModule }                                          from "./recipe/recipe/recipe.module";
import {CanDeactivateGuard}                                      from '../../../core/interfaces/canDeactivateGuard';
import { CPCommonComponentsModule }                              from "../components/common/cp-common-components.module";
import { SweetAlert2Module }                                     from "@sweetalert2/ngx-sweetalert2";
import { PlanoAssinaturaModule }                                 from "./plano-assinatura/plano-assinatura.module";
import { PurchaseListsModule } from "./purchase-list/purchase-lists/purchase-lists.module";
import { PhotoUploadModule }             from "../components/photo-upload/photo-upload.module";
import { IngredientInfoFactorComponent } from './ingredient/ingredient-info-factor/ingredient-info-factor.component';
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";

@NgModule({
	entryComponents: [
		IngredientInfoFactorComponent,
		IngredientInfoHistoryComponent,
		IngredientInfoUnitComponent,
		IngredientMenuInfoComponent,
	],
    imports: [
				NgbModule,
        CommonModule,
        BusinessPagesRoutingModule,
        MatFormFieldModule,
        MatInputModule,
        MatCheckboxModule,
        ReactiveFormsModule,
        RecipeModule,
        FormsModule,
        TranslateModule.forChild(),
        PhotoUploadModule,
        CPCommonComponentsModule,
        SweetAlert2Module.forRoot(),
        PlanoAssinaturaModule,
        PurchaseListsModule,
        CurrencyMaskModule,
        WidgetChartsModule,
        UnitinfoModule,
        IngredientInfoModule,
        MatProgressSpinnerModule,
				MatIconModule
    ],
	providers: [
		CanDeactivateGuard
	],
	declarations: [
		CPProfileComponent,
		IngredientInfoFactorComponent,
		IngredientInfoHistoryComponent,
		IngredientInfoUnitComponent,
		IngredientMenuInfoComponent,
	]
})
export class BusinessPagesModule { }
