import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule, CurrencyPipe }       from '@angular/common';
import { TranslateModule }                  from '@ngx-translate/core';
import { ChartsModule }                     from 'ng2-charts';

import { BarChartComponent }        from './bar-chart/bar-chart.component';
import { BarStackedChartComponent } from './bar-stacked-chart/bar-stacked-chart.component';
import { DoughnutChartComponent }   from './doughnut-chart/doughnut-chart.component';
import { LineChartComponent }       from './line-chart/line-chart.component';
import { MultilinesChartComponent } from './multilines-chart/multilines-chart.component';
import { DoughnutChartRecipeComponent } from './doughnut-chart-recipe/doughnut-chart-recipe.component';
import { GraphComponent } from '../../../../pages/components/pdf/components/financial/graph/graph.component';

@NgModule({
    imports: [
        CommonModule,
        ChartsModule,
        TranslateModule
    ],
	exports: [
		BarChartComponent,
		DoughnutChartComponent,
		LineChartComponent,
		MultilinesChartComponent,
		BarStackedChartComponent,
		DoughnutChartRecipeComponent,
		GraphComponent
	],
	declarations: [
		BarChartComponent,
		DoughnutChartComponent,
		LineChartComponent,
		MultilinesChartComponent,
		BarStackedChartComponent,
		DoughnutChartRecipeComponent,
		GraphComponent
	],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    providers: [CurrencyPipe]
})
export class WidgetChartsModule {}
