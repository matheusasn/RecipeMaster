import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListTimelineComponent } from './list-timeline.component';
import { TimelineItemComponent } from './timeline-item/timeline-item.component';
import { MetronicCoreModule } from '../../../../../core/metronic/metronic-core.module';

@NgModule({
	imports: [CommonModule, MetronicCoreModule],
	declarations: [ListTimelineComponent, TimelineItemComponent],
	exports: [ListTimelineComponent, TimelineItemComponent]
})
export class ListTimelineModule {}
