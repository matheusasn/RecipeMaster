import {LayoutModule} from './../../../../layout/layout.module';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MenusComponent} from './menus.component';
import {RouterModule, Routes} from '@angular/router';
import {MetronicCoreModule} from '../../../../../core/metronic/metronic-core.module';
import {PartialsModule} from '../../../../partials/partials.module';
import {AngularEditorModule} from '@kolkov/angular-editor';
import {MatButtonModule, MatCardModule, MatDividerModule, MatIconModule, MatListModule} from '@angular/material';
import {CPCommonComponentsModule} from '../../../components/common/cp-common-components.module';
import {TranslateModule} from '@ngx-translate/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DialogWhatsMenuDatasheetComponent } from '../../../tutorials/menu/dialog-whats-menu-datasheet/dialog-whats-menu-datasheet.component';
import { DialogMenuComponent } from '../../../tutorials/menu/dialog-menu/dialog-menu.component';
import { DialogMenuItemsComponent } from '../../../tutorials/menu/dialog-menu-items/dialog-menu-items.component';
import { DialogMenuOtherCostsComponent } from '../../../tutorials/menu/dialog-menu-other-costs/dialog-menu-other-costs.component';
import { DialogMenuFinancialComponent } from '../../../tutorials/menu/dialog-menu-financial/dialog-menu-financial.component';

const routes: Routes = [
  {
    path: '',
    component: MenusComponent
  }
];

@NgModule({
	imports: [
		CommonModule,
		MetronicCoreModule,
		LayoutModule,
		PartialsModule,
		AngularEditorModule,
		MatListModule,
		MatCardModule,
		MatDividerModule,
		MatButtonModule,
		MatIconModule,
		CPCommonComponentsModule,
		NgbModule,
		RouterModule.forChild(routes),
		TranslateModule.forChild()
	],
  declarations: [
    MenusComponent
  ],
	entryComponents: [
		DialogWhatsMenuDatasheetComponent,
		DialogMenuComponent,
		DialogMenuItemsComponent,
		DialogMenuOtherCostsComponent,
		DialogMenuFinancialComponent
	]
})
export class MenusModule { }
