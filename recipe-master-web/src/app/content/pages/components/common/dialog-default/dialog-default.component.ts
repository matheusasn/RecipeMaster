import { Component, EventEmitter, HostBinding, Input, OnInit, Output } from '@angular/core';

@Component({
	selector: 'cp-dialog-default',
	templateUrl: './dialog-default.component.html',
	styleUrls: ['./dialog-default.component.scss']
})
export class DialogDefaultComponent implements OnInit {

	@HostBinding('style.minHeight') minHeight;

	@Output() close = new EventEmitter<void>();

	@Input('height')
	set height(value: string) {
		this.minHeight = value;
	}

	constructor() { }

	ngOnInit() { }

	closeEmitter() {
		this.close.emit();
	}

}
