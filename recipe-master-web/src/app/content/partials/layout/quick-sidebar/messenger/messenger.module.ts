import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MessengerComponent } from './messenger.component';
import { MessengerInComponent } from './messenger-in/messenger-in.component';
import { MessengerOutComponent } from './messenger-out/messenger-out.component';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { MetronicCoreModule } from '../../../../../core/metronic/metronic-core.module';

@NgModule({
	imports: [CommonModule, MetronicCoreModule, PerfectScrollbarModule],
	declarations: [
		MessengerComponent,
		MessengerInComponent,
		MessengerOutComponent
	],
	exports: [MessengerComponent, MessengerInComponent, MessengerOutComponent]
})
export class MessengerModule {}
