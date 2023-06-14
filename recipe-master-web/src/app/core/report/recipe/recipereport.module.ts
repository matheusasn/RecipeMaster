import {NgModule, CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {PDFExportModule} from '@progress/kendo-angular-pdf-export';
import {RecipeReportComponent} from './recipereport.component';
import {CommonModule, registerLocaleData} from '@angular/common';

import 'hammerjs';
import {WidgetChartsModule} from '../../../content/partials/content/widgets/charts/widget-charts.module';
import {ChartsModule} from 'ng2-charts';
import { NutritionInfoComponentsModule } from '../../../content/pages/components/nutritioninfo/nutritioninfo-components.module';

import localeBr from '@angular/common/locales/pt';
registerLocaleData(localeBr, 'br');

@NgModule({
  declarations: [
    RecipeReportComponent
  ],
	imports: [
		PDFExportModule,
		CommonModule,
		WidgetChartsModule,
    ChartsModule,
    NutritionInfoComponentsModule
	],
  exports: [
    RecipeReportComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class RecipeReportModule { }
