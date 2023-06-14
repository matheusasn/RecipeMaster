import { CPCommonComponentsModule } from './../../../components/common/cp-common-components.module';
import { NgModule } from "@angular/core";
import { IngredientComponent } from "./ingredient.component";
import { MetronicCoreModule } from "../../../../../core/metronic/metronic-core.module";
import { PartialsModule } from "../../../../partials/partials.module";
import { AngularEditorModule } from "@kolkov/angular-editor";
import {
	MatIconModule,
	MatInputModule,
	MatFormFieldModule,
	MatCheckboxModule,
	MatOptionModule,
	MatSelectModule,
	MatTabsModule, MatMenuModule
} from '@angular/material';
import { LayoutModule } from "../../../../layout/layout.module";
import { Routes, RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { CommonServiceModule } from "../../../../../core/services/common/common-service.module";
import { ReactiveFormsModule } from "@angular/forms";
import { TranslateModule } from "@ngx-translate/core";
import { CurrencyMaskModule } from 'ng2-currency-mask';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { UnitinfoModule } from '../../../components/unitinfo/unitinfo.module';
import { WidgetChartsModule } from '../../../../partials/content/widgets/charts/widget-charts.module';
import { SharedPipesModule } from '../../../../../pipes/shared-pipes.module';
import { NutritionInfoComponentsModule } from '../../../components/nutritioninfo/nutritioninfo-components.module';
import { NutritioninfoComponent } from './nutritioninfo/nutritioninfo.component';

const routes: Routes = [
    {
        path: '',
        component: IngredientComponent
    },

];

@NgModule({
	entryComponents: [IngredientComponent],
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
		MatSelectModule,
		ReactiveFormsModule,
		CommonServiceModule,
		ReactiveFormsModule,
		CPCommonComponentsModule,
		TranslateModule.forChild(),
		// RouterModule.forChild(routes),
		CurrencyMaskModule,
		SweetAlert2Module.forRoot(),
		UnitinfoModule,
		WidgetChartsModule,
		MatTabsModule,
		MatMenuModule,
		SharedPipesModule,
		NutritionInfoComponentsModule,
	],
    declarations: [
        IngredientComponent,
        NutritioninfoComponent
	]
})
export class IngredientModule { }
