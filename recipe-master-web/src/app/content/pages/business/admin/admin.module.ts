import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { AdminStatsComponent } from './admin-stats/admin-stats.component';
import { MatCardModule, MatDialogModule } from '@angular/material';
import { CPCommonComponentsModule } from '../../components/common/cp-common-components.module';
import { UsersComponent } from './users/users.component';
import { PartialsModule } from '../../../partials/partials.module';
import { DataTablesModule } from 'angular-datatables';
import { UserDetailComponent } from './user-detail/user-detail.component';
import { DialogModule } from 'primeng/dialog';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { WidgetChartsModule } from '../../../partials/content/widgets/charts/widget-charts.module';
import { EditUserPlanDateComponent } from './edit-user-plan-date/edit-user-plan-date.component';
import { NewPwdModalComponent } from './users/newpwdmodal.component';


@NgModule({
  imports: [
    CommonModule,
    AdminRoutingModule,
    CPCommonComponentsModule,
    MatCardModule,
    PartialsModule,
    DataTablesModule,
    MatDialogModule,
    FormsModule,
    ReactiveFormsModule,
		WidgetChartsModule
  ],
  declarations: [AdminStatsComponent, UsersComponent, UserDetailComponent, EditUserPlanDateComponent, NewPwdModalComponent],
  entryComponents: [UserDetailComponent, EditUserPlanDateComponent, NewPwdModalComponent]
})
export class AdminModule { }
