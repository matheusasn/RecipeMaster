import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { MatTabsModule }                    from '@angular/material';
import { IngredientInfoComponent }          from "./ingredient-info.component";
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
import { NutritioninfoAddModalComponent } from "../../../components/nutritioninfo/nutritioninfo-add-modal/nutritioninfo-add-modal.component";
import { NutritioninfoCustomComponent } from "../../../components/nutritioninfo/nutritioninfo-custom/nutritioninfo-custom.component";
import { NutritionInfoComponentsModule } from "../../../components/nutritioninfo/nutritioninfo-components.module";
import { NutritioninfoEditComponent } from "../../../components/nutritioninfo/nutritioninfo-edit/nutritioninfo-edit.component";
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { UnitinfoModule } from "../../../components/unitinfo/unitinfo.module";
import { TruncateStringPipe } from "../../../../../pipes/truncate-string.pipe";
import { DialogRecipeIngredientWeightComponent } from '../../../tutorials/recipe/dialog-recipe-ingredient-weight/dialog-recipe-ingredient-weight.component';
import {MatIconModule} from '@angular/material/icon';
import { DialogRecipeUseAmountComponent } from '../../../tutorials/recipe/dialog-recipe-use-amount/dialog-recipe-use-amount.component';
import { DialogRecipeBuyPricingComponent } from '../../../tutorials/recipe/dialog-recipe-buy-pricing/dialog-recipe-buy-pricing.component';
import { DialogRecipeNutritionalInstructionComponent } from '../../../tutorials/recipe/dialog-recipe-nutritional-instruction/dialog-recipe-nutritional-instruction.component';

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
        NutritionInfoComponentsModule,
        NgbModule,
        UnitinfoModule,
        MatTabsModule,
				NutritionInfoComponentsModule,
				MatIconModule
    ],
    declarations: [
        IngredientInfoComponent,
				TruncateStringPipe,

    ],
    exports: [
			TruncateStringPipe
		],
    entryComponents: [
        IngredientInfoComponent,
				NutritioninfoAddModalComponent,
				NutritioninfoCustomComponent,
				NutritioninfoEditComponent,
				DialogRecipeUseAmountComponent,
				DialogRecipeBuyPricingComponent,
				DialogRecipeNutritionalInstructionComponent
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class IngredientInfoModule { }
