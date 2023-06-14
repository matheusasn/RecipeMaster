import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LandpageComponent } from './landpage.component';
import { LandpageRoutingModule } from './landpage-routing.module';

@NgModule({
    imports: [
        CommonModule,
        LandpageRoutingModule
    ],
    exports: [],
    declarations: [
        LandpageComponent
    ]
})
export class LandpageModule { }
