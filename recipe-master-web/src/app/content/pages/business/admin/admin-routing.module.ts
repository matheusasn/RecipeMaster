import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../../../../core/auth/auth.guard';
import { AdminStatsComponent } from './admin-stats/admin-stats.component';
import { UsersComponent } from './users/users.component';

const routes: Routes = [{
    path: '', children: [
        {
            path: '', 
            component: UsersComponent, 
            canActivate: [ AuthGuard ] 
        },
        // {
        //     path: 'stats',
        //     component: AdminStatsComponent, 
        //     canActivate: [ AuthGuard ] 
        // }
    ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
