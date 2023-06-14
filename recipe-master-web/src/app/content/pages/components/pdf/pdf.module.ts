import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoverComponent } from './components/cover/cover.component';
import { RecipeInfoComponent } from './components/recipe-info/recipe-info.component';
import { IngredientsComponent } from './components/ingredients/ingredients.component';
import { StepsComponent } from './components/steps/steps.component';
import { FinancialComponent } from './components/financial/financial.component';
import { FooterComponent } from './components/footer/footer.component';
import { PdfComponent } from './pdf.component';
import { PDFExportModule } from '@progress/kendo-angular-pdf-export';
import { OtherCostsComponent } from './components/other-costs/other-costs.component';
import { NutritionInfoComponentsModule } from '../nutritioninfo/nutritioninfo-components.module';
import { ConfigModalComponent } from './components/config-modal/config-modal.component';
import { MatDialogModule, MatIconModule } from '@angular/material';
import { PdfService } from './pdf.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { PhotoUploadModule } from '../photo-upload/photo-upload.module';
import { MetronicCoreModule } from '../../../../core/metronic/metronic-core.module';
import { HttpClientModule } from '@angular/common/http';
import { InterceptorModule } from '../../../../core/interceptors/interceptor.module';
import { MenuInfoComponent } from './components/menu-info/menu-info.component';
import { PdfMenuComponent } from './pdf-menu/pdf-menu.component';
import {TranslateModule} from '@ngx-translate/core';
import { WidgetChartsModule } from '../../../partials/content/widgets/charts/widget-charts.module';
import { CurrencyMaskModule } from 'ng2-currency-mask';
import { PdfIngredientsUsedComponent } from './pdf-ingredients-used/pdf-ingredients-used.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    PDFExportModule,
    NutritionInfoComponentsModule,
    MatDialogModule,
    FormsModule,
    ReactiveFormsModule,
    PhotoUploadModule,
    InterceptorModule,
    TranslateModule,
		WidgetChartsModule,
		CurrencyMaskModule,
		MatIconModule
  ],
  exports: [PdfComponent, PdfMenuComponent, PdfIngredientsUsedComponent],
  providers: [PdfService],
  entryComponents: [ConfigModalComponent, PdfComponent, PdfMenuComponent, PdfIngredientsUsedComponent],
  declarations: [CoverComponent, RecipeInfoComponent, IngredientsComponent, StepsComponent, FinancialComponent, FooterComponent, PdfComponent, OtherCostsComponent, ConfigModalComponent, MenuInfoComponent, PdfMenuComponent, PdfIngredientsUsedComponent]
})
export class PdfModule { }
