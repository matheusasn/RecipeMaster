import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SupportComponent } from './support.component';
import { Routes, RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { MetronicCoreModule } from '../../../../core/metronic/metronic-core.module';
import { LayoutModule } from '@angular/cdk/layout';
import { PartialsModule } from '../../../partials/partials.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonServiceModule } from '../../../../core/services/common/common-service.module';
import { CPCommonComponentsModule } from '../../components/common/cp-common-components.module';
import { MatTabsModule, MatIconModule } from '@angular/material';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';


const routes: Routes = [
  {
    path: '',
    component: SupportComponent
  }
];

@NgModule({
  imports: [
    CommonModule,
		MetronicCoreModule,
		LayoutModule,
    PartialsModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    TranslateModule.forChild(),
    CommonServiceModule,
    CPCommonComponentsModule,
    MatTabsModule,
    NgbModule,
		MatIconModule
  ],
  declarations: [SupportComponent]
})
export class SupportModule { }
