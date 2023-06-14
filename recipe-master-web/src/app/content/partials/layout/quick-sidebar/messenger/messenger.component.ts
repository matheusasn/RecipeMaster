import {
	Component,
	OnInit,
	Input,
	ChangeDetectionStrategy
} from '@angular/core';
import { Observable } from 'rxjs';
import { MessengerService } from '../../../../../core/metronic/services/messenger.service';

@Component({
	selector: 'm-messenger',
	templateUrl: './messenger.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class MessengerComponent implements OnInit {
	@Input() messages: Observable<any>;

	constructor(public messengerService: MessengerService) {}

	ngOnInit(): void {
		// call logs to http api
		// this.messages = this.messengerService.getData();
	}
}
