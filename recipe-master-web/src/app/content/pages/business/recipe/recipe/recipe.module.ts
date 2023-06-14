import { DragulaModule }          from 'ng2-dragula';
import {CPCommonComponentsModule} from './../../../components/common/cp-common-components.module';
import {CommonServiceModule}      from './../../../../../core/services/common/common-service.module';
import {
	MatButtonModule,
	MatCardModule,
	MatCheckboxModule,
	MatDialogModule,
	MatDividerModule,
	MatFormFieldModule,
	MatIconModule,
	MatInputModule,
	MatListModule, MatMenuModule,
	MatOptionModule,
	MatProgressSpinnerModule,
	MatSelectModule,
	MatStepperModule, MatTooltipModule
}                                 from '@angular/material';
import {LayoutModule} from './../../../../layout/layout.module';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {RecipeComponent} from './recipe.component';
import {MetronicCoreModule} from '../../../../../core/metronic/metronic-core.module';
import {PartialsModule} from '../../../../partials/partials.module';
import {AngularEditorModule} from '@kolkov/angular-editor';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {TranslateModule} from '@ngx-translate/core';
import {NgbModule, NgbPaginationModule} from '@ng-bootstrap/ng-bootstrap';
import {IngredientInfoModule} from '../../ingredient/ingredient-info/ingredient-info.module';
import {CurrencyMaskModule} from 'ng2-currency-mask';

import {SweetAlert2Module} from '@sweetalert2/ngx-sweetalert2';
import {WidgetChartsModule} from '../../../../partials/content/widgets/charts/widget-charts.module';
import {RecipeReportModule} from '../../../../../core/report/recipe/recipereport.module';
import {DialogModule} from 'primeng/dialog';
import {CheckboxModule} from 'primeng/checkbox';
import {ButtonModule} from 'primeng/button';
import { NutritionInfoComponentsModule } from '../../../components/nutritioninfo/nutritioninfo-components.module';
import { UnitinfoModule } from '../../../components/unitinfo/unitinfo.module';
import { RecipeitemComponent } from '../recipeitem/recipeitem.component';
import { RecipeitemInfoComponent } from '../recipeitem-info/recipeitem-info.component';
import { PdfModule } from '../../../components/pdf/pdf.module';
import { PhotoUploadModule } from '../../../components/photo-upload/photo-upload.module';
import { RecipeInfoV1Component } from './components/recipe-info-v1/recipe-info-v1.component';
import { RecipeInfoV2Component } from './components/recipe-info-v2/recipe-info-v2.component';
import { NgxSliderModule } from '@angular-slider/ngx-slider';
import { RecipesCategoriesTagsModule } from '../recipes/recipes-categories-tags/recipes-categories-tags.module';
import { DialogRecipeComponent } from '../../../tutorials/recipe/dialog-recipe/dialog-recipe.component';
import { TutorialsModule } from '../../../tutorials/tutorials.module';
import { DialogRecipeYieldsComponent } from '../../../tutorials/recipe/dialog-recipe-yields/dialog-recipe-yields.component';
import { DialogRecipeTotalWeightComponent } from '../../../tutorials/recipe/dialog-recipe-total-weight/dialog-recipe-total-weight.component';
import { DialogRecipeIngredientAddComponent } from '../../../tutorials/recipe/dialog-recipe-ingredient-add/dialog-recipe-ingredient-add.component';
import { DialogRecipeIngredientWeightComponent } from '../../../tutorials/recipe/dialog-recipe-ingredient-weight/dialog-recipe-ingredient-weight.component';
import { DialogRecipeIngredientMultiplierComponent } from '../../../tutorials/recipe/dialog-recipe-ingredient-multiplier/dialog-recipe-ingredient-multiplier.component';
import { DialogRecipeUseAmountComponent } from '../../../tutorials/recipe/dialog-recipe-use-amount/dialog-recipe-use-amount.component';
import { DialogRecipeCorrectionFactorComponent } from '../../../tutorials/recipe/dialog-recipe-correction-factor/dialog-recipe-correction-factor.component';
import { DialogRecipeBuyPricingComponent } from '../../../tutorials/recipe/dialog-recipe-buy-pricing/dialog-recipe-buy-pricing.component';
import { DialogRecipeCompoundIngredientUseAmountComponent } from '../../../tutorials/recipe/dialog-recipe-compound-ingredient-use-amount/dialog-recipe-compound-ingredient-use-amount.component';
import { DialogRecipeCompoundIngredientBuyPricingComponent } from '../../../tutorials/recipe/dialog-recipe-compound-ingredient-buy-pricing/dialog-recipe-compound-ingredient-buy-pricing.component';
import { DialogRecipeCompoundIngredientNutritionalInstructionComponent } from '../../../tutorials/recipe/dialog-recipe-compound-ingredient-nutritional-instruction/dialog-recipe-compound-ingredient-nutritional-instruction.component';
import { DialogRecipeNutritionalInstructionComponent } from '../../../tutorials/recipe/dialog-recipe-nutritional-instruction/dialog-recipe-nutritional-instruction.component';
import { DialogRecipePreparationMethodComponent } from '../../../tutorials/recipe/dialog-recipe-preparation-method/dialog-recipe-preparation-method.component';
import { DialogRecipeFinancialTotalCostComponent } from '../../../tutorials/recipe/dialog-recipe-financial-total-cost/dialog-recipe-financial-total-cost.component';
import { DialogRecipeFinancialUnitCostComponent } from '../../../tutorials/recipe/dialog-recipe-financial-unit-cost/dialog-recipe-financial-unit-cost.component';
import { DialogRecipeFinancialIngredientsComponent } from '../../../tutorials/recipe/dialog-recipe-financial-ingredients/dialog-recipe-financial-ingredients.component';
import { DialogRecipeFinancialVariableCostComponent } from '../../../tutorials/recipe/dialog-recipe-financial-variable-cost/dialog-recipe-financial-variable-cost.component';
import { DialogRecipeFinancialFixedCostComponent } from '../../../tutorials/recipe/dialog-recipe-financial-fixed-cost/dialog-recipe-financial-fixed-cost.component';
import { DialogRecipeFinancialSalePriceComponent } from '../../../tutorials/recipe/dialog-recipe-financial-sale-price/dialog-recipe-financial-sale-price.component';
import { DialogRecipeFinancialMarkupComponent } from '../../../tutorials/recipe/dialog-recipe-financial-markup/dialog-recipe-financial-markup.component';
import { DialogRecipeFinancialChartComponent } from '../../../tutorials/recipe/dialog-recipe-financial-chart/dialog-recipe-financial-chart.component';
import { DialogRecipeFinancialProfitMarginComponent } from '../../../tutorials/recipe/dialog-recipe-financial-profit-margin/dialog-recipe-financial-profit-margin.component';
import { DialogRecipeFinancialChartLegendComponent } from '../../../tutorials/recipe/dialog-recipe-financial-chart-legend/dialog-recipe-financial-chart-legend.component';
import { DialogRecipePdfRecipeComponent } from '../../../tutorials/recipe/dialog-recipe-pdf-recipe/dialog-recipe-pdf-recipe.component';
import { DialogRecipeShareRecipeComponent } from '../../../tutorials/recipe/dialog-recipe-share-recipe/dialog-recipe-share-recipe.component';
import { DialogRecipeHistoryComponent } from '../../../tutorials/recipe/dialog-recipe-history/dialog-recipe-history.component';
import { DialogRecipeNewComponent } from '../../../tutorials/recipe/dialog-recipe-new/dialog-recipe-new.component';
import { DialogRecipeDeleteComponent } from '../../../tutorials/recipe/dialog-recipe-delete/dialog-recipe-delete.component';
import { DialogRecipeEditComponent } from '../../../tutorials/recipe/dialog-recipe-edit/dialog-recipe-edit.component';
import { DialogRecipeNutritionalInfoComponent } from '../../../tutorials/recipe/dialog-recipe-nutritional-info/dialog-recipe-nutritional-info.component';
import { DialogSuportComponent } from '../../../tutorials/suport/dialog-suport/dialog-suport.component';
const routes: Routes = [
	{
		path: '',
		component: RecipeComponent
	}
];

@NgModule({
	imports: [
		CommonModule,
		MetronicCoreModule,
		LayoutModule,
		PartialsModule,
		AngularEditorModule,
		MatInputModule,
		MatFormFieldModule,
		MatCheckboxModule,
		MatIconModule,
		MatOptionModule,
		MatProgressSpinnerModule,
		MatSelectModule,
		MatListModule,
		MatCardModule,
		MatDividerModule,
		MatDialogModule,
		MatStepperModule,
		NgbPaginationModule,
		ReactiveFormsModule,
		CommonServiceModule,
		FormsModule,
		IngredientInfoModule,
		CurrencyMaskModule,
		NgbModule.forRoot(),
		TranslateModule.forChild(),
		RouterModule.forChild(routes),
		SweetAlert2Module.forRoot(),
		WidgetChartsModule,
		RecipeReportModule,
		DialogModule,
		CheckboxModule,
		ButtonModule,
		MatTooltipModule,
		PhotoUploadModule,
		CPCommonComponentsModule,
		NutritionInfoComponentsModule,
		UnitinfoModule,
		PdfModule,
		DragulaModule.forRoot(),
		MatMenuModule,
		RecipesCategoriesTagsModule,
		NgxSliderModule,
		TutorialsModule,
		MatButtonModule
	],
	declarations: [
        RecipeComponent,
        RecipeitemComponent,
        RecipeitemInfoComponent,
        RecipeInfoV1Component,
        RecipeInfoV2Component
	],
    entryComponents: [
			RecipeitemInfoComponent,
			DialogRecipeComponent,
			DialogRecipeYieldsComponent,
			DialogRecipeTotalWeightComponent,
			DialogRecipeIngredientAddComponent,
			DialogRecipeIngredientWeightComponent,
			DialogRecipeIngredientMultiplierComponent,
			DialogRecipeUseAmountComponent,
			DialogRecipeCorrectionFactorComponent,
			DialogRecipeBuyPricingComponent,
			DialogRecipeCompoundIngredientUseAmountComponent,
			DialogRecipeCompoundIngredientBuyPricingComponent,
			DialogRecipeCompoundIngredientNutritionalInstructionComponent,
			DialogRecipeNutritionalInstructionComponent,
			DialogRecipePreparationMethodComponent,
			DialogRecipeFinancialTotalCostComponent,
			DialogRecipeFinancialUnitCostComponent,
			DialogRecipeFinancialIngredientsComponent,
			DialogRecipeFinancialVariableCostComponent,
			DialogRecipeFinancialFixedCostComponent,
			DialogRecipeFinancialSalePriceComponent,
			DialogRecipeFinancialMarkupComponent,
			DialogRecipeFinancialChartComponent,
			DialogRecipeFinancialChartLegendComponent,
			DialogRecipeFinancialProfitMarginComponent,
			DialogRecipePdfRecipeComponent,
			DialogRecipeShareRecipeComponent,
			DialogRecipeHistoryComponent,
			DialogRecipeNewComponent,
			DialogRecipeDeleteComponent,
			DialogRecipeEditComponent,
			DialogRecipeNutritionalInfoComponent,
			DialogSuportComponent
		]
})
export class RecipeModule { }
