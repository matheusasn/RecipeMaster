import {
	Component,
	OnInit,
	Input,
	ChangeDetectionStrategy
} from '@angular/core';
import { Observable } from 'rxjs';
import { LogData } from '../../../../../core/metronic/interfaces/log-data';
import { LogsService } from '../../../../../core/metronic/services/logs.service';

@Component({
	selector: 'm-list-timeline',
	templateUrl: './list-timeline.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class ListTimelineComponent implements OnInit {
	@Input() type: any;
	@Input() heading: any;

	@Input() logList: Observable<LogData[]>;

	constructor(private logsService: LogsService) {}

	ngOnInit() {
		// call logs to http api
		// this.logList = this.logsService.getData({ types: this.type });
	}
}
