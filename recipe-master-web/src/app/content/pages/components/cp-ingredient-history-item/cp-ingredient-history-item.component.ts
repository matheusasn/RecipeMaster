import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
	selector: 'm-cp-ingredient-hostory-item',
	templateUrl: './cp-ingredient-history-item.component.html',
	styleUrls: ['./cp-ingredient-history-item.component.scss']
})
export class CpIngredientHistoryItemComponent implements OnInit {

	@Input() id: string;
	@Input() price: string;
	@Input() amount: number;
	@Input() date: string;
	@Input() unitAbbreviation: string;
	@Input() isFirst: boolean;

	@Output() onDelete = new EventEmitter();

	constructor() { }

	ngOnInit() { }

	deleteHistory() {
		this.onDelete.emit(this.id);
	}

}
