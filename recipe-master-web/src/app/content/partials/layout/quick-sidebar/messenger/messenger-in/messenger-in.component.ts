import { Component, OnInit, Input, HostBinding, ChangeDetectionStrategy } from '@angular/core';
import { MessageData } from '../../../../../../core/metronic/interfaces/message-data';

@Component({
	selector: 'm-messenger-in',
	templateUrl: './messenger-in.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class MessengerInComponent implements OnInit {
	@HostBinding('class') classes = 'm-messenger__wrapper';
	@Input() message: MessageData;

	constructor() {}

	ngOnInit(): void {}
}
