import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MetronicCoreModule } from '../../../../../core/metronic/metronic-core.module';
import {
	MatProgressSpinnerModule,
	MatProgressBarModule
} from '@angular/material';
import { PortletComponent } from './portlet.component';

@NgModule({
	imports: [
		CommonModule,
		MetronicCoreModule,
		MatProgressSpinnerModule,
		MatProgressBarModule
	],
	declarations: [PortletComponent],
	exports: [PortletComponent]
})
export class PortletModule {}
