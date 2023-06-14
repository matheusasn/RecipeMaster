import { Component, Input, OnInit } from '@angular/core';
import { NutritionInfo } from '../../../../core/models/business/nutritioninfo';
import { TranslateService } from '@ngx-translate/core';

@Component({
	selector: 'm-cp-nutritional-info-list',
	templateUrl: './cp-nutritional-info-list.component.html',
	styleUrls: ['./cp-nutritional-info-list.component.scss'],
})
export class CpNutritionalInfoListComponent implements OnInit {

	@Input() nutritionalInfo:NutritionInfo;

	constructor() { }

	ngOnInit() { }

}
