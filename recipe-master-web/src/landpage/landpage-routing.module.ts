import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LandpageComponent } from './landpage.component';

const routes: Routes = [
    { path: '', component: LandpageComponent }
];

@NgModule({
    imports: [
        RouterModule.forChild(routes)
    ],
    exports: [RouterModule]
})
export class LandpageRoutingModule { }
