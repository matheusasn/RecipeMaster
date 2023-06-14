import { Component, Input, OnInit } from '@angular/core';

@Component({
	selector: 'other-payments-card',
	templateUrl: './other-payments-card.component.html',
	styleUrls: ['./other-payments-card.component.scss']
})
export class OtherPaymentsCardComponent implements OnInit {

	@Input() public title: string;
	@Input() public imageSrc: string;

	constructor() { }

	ngOnInit() {
	}

}
