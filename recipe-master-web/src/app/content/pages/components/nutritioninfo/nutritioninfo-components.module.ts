import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {TranslateModule} from '@ngx-translate/core';
import {LayoutModule} from '../../../layout/layout.module';
import { NutritionalInfoPipe } from '../../../../pipes/nutritional-info.pipe';
import { CpNutritionalInfoComponent } from './cp-nutritional-info/cp-nutritional-info.component';
import { CpNutritionalInfoLabelComponent } from './cp-nutritional-info-label/cp-nutritional-info-label.component';
import { MatCheckboxModule, MatButtonModule, MatIconModule } from '@angular/material';
import { PDFExportModule } from '@progress/kendo-angular-pdf-export';
import { MenuItensComponent } from '../menu-itens/menu-itens.component';
import { NutritioninfoListComponent } from './nutritioninfo-list/nutritioninfo-list.component';
import { NutritioninfoEditComponent } from './nutritioninfo-edit/nutritioninfo-edit.component';
import { NutritioninfoCustomComponent } from './nutritioninfo-custom/nutritioninfo-custom.component';
import { CustomNutritionalinfoPipe } from '../../../../pipes/custom-nutritionalinfo.pipe';
import { NutritioninfoAddModalComponent } from './nutritioninfo-add-modal/nutritioninfo-add-modal.component';
import { NutritionalInfoUtilPipe } from '../../../../pipes/nutritional-info-util.pipe';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PaymentButtonModule } from '../../business/plano-assinatura/payment-button/payment-button.module';
import { AllergenComponent } from './allergen/allergen.component';
import { LabelIngredientFormComponent } from './label-ingredient-form/label-ingredient-form.component';
import { ModalLoadingComponent } from '../common/modal-loading/modal-loading.component';

@NgModule({
	declarations: [
		CpNutritionalInfoComponent,
		NutritionalInfoPipe,
		CustomNutritionalinfoPipe,
        NutritionalInfoUtilPipe,
		CpNutritionalInfoLabelComponent,
		MenuItensComponent,
		NutritioninfoListComponent,
		NutritioninfoEditComponent,
		NutritioninfoCustomComponent,
		NutritioninfoAddModalComponent,
		AllergenComponent,
		LabelIngredientFormComponent,
		ModalLoadingComponent
	],
	imports: [
		CommonModule,
		LayoutModule,
		ReactiveFormsModule,
		FormsModule,
		TranslateModule.forChild(),
		MatCheckboxModule,
		PDFExportModule,
        MatButtonModule,
        NgbModule.forRoot(),
        PaymentButtonModule,
				MatIconModule,
	], exports: [
		CpNutritionalInfoComponent,
		NutritionalInfoPipe,
		CustomNutritionalinfoPipe,
        NutritionalInfoUtilPipe,
		CpNutritionalInfoLabelComponent,
		MenuItensComponent,
	],
	providers: [
		NutritionalInfoPipe
	],
    entryComponents: [
			CpNutritionalInfoLabelComponent,
			AllergenComponent,
			LabelIngredientFormComponent,
			ModalLoadingComponent
		],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class NutritionInfoComponentsModule { }
