import { DragulaModule }            from 'ng2-dragula';
import { CPCommonComponentsModule } from './../../../components/common/cp-common-components.module';
import { CommonServiceModule }      from './../../../../../core/services/common/common-service.module';
import {
    MatCheckboxModule,
    MatIconModule,
    MatOptionModule,
    MatSelectModule,
    MatListModule,
    MatCardModule,
    MatDividerModule,
    MatDialogModule,
    MatStepperModule,
    MatTooltipModule,
    MatMenuModule
} from '@angular/material';
import { LayoutModule } from './../../../../layout/layout.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { MetronicCoreModule } from '../../../../../core/metronic/metronic-core.module';
import { PartialsModule } from '../../../../partials/partials.module';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { MatInputModule, MatFormFieldModule } from '@angular/material';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { NgbModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { IngredientInfoModule } from '../../ingredient/ingredient-info/ingredient-info.module';
import { CurrencyMaskModule } from "ng2-currency-mask";

import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { WidgetChartsModule } from '../../../../partials/content/widgets/charts/widget-charts.module';
import { MenuComponent } from './menu.component';
import { MenuitemComponent } from '../menuitem/menuitem.component';
import { MenuitemInfoComponent } from '../menuitem-info/menuitem-info.component';
import {DialogModule} from 'primeng/dialog';
import {CheckboxModule} from 'primeng/checkbox';
import {RecipeReportModule} from '../../../../../core/report/recipe/recipereport.module';
import {ButtonModule} from 'primeng/button';
import { UnitinfoModule } from '../../../components/unitinfo/unitinfo.module';
import { PhotoUploadModule } from '../../../components/photo-upload/photo-upload.module';
import { DialogMenuComponent } from '../../../tutorials/menu/dialog-menu/dialog-menu.component';
import { DialogMenuItemsComponent } from '../../../tutorials/menu/dialog-menu-items/dialog-menu-items.component';
import { DialogMenuOtherCostsComponent } from '../../../tutorials/menu/dialog-menu-other-costs/dialog-menu-other-costs.component';
import { DialogMenuFinancialComponent } from '../../../tutorials/menu/dialog-menu-financial/dialog-menu-financial.component';

const routes: Routes = [
  {
    path: '',
    component: MenuComponent
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
		MatSelectModule,
		MatListModule,
		MatCardModule,
		MatDividerModule,
		MatDialogModule,
		MatStepperModule,
		NgbPaginationModule,
		ReactiveFormsModule,
		CommonServiceModule,
		ReactiveFormsModule,
		FormsModule,
		PhotoUploadModule,
		CPCommonComponentsModule,
		IngredientInfoModule,
		CurrencyMaskModule,
		NgbModule.forRoot(),
		TranslateModule.forChild(),
		RouterModule.forChild(routes),
		SweetAlert2Module.forRoot(),
		WidgetChartsModule,
		MatTooltipModule,
		DialogModule,
		CheckboxModule,
		RecipeReportModule,
		ButtonModule,
		UnitinfoModule,
		MatMenuModule,
		DragulaModule
	],
  declarations: [
	MenuComponent,
	MenuitemComponent,
	MenuitemInfoComponent
  ],
  entryComponents: [
		MenuitemInfoComponent,
		DialogMenuComponent,
		DialogMenuItemsComponent,
		DialogMenuOtherCostsComponent,
		DialogMenuFinancialComponent
	]
})
export class MenuModule { }
