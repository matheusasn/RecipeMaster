import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { IngredientHistoryDTO } from '../../../../../core/models/business/dto/ingredient-history-dto';

import { Ingredient } from '../../../../../core/models/business/ingredient';
import { IngredientHistoryService } from '../../../../../core/services/business/ingredient-history.service';
import { CpLoadingService } from '../../../../../core/services/common/cp-loading.service';
import { CpBaseComponent } from '../../../common/cp-base/cp-base.component';

@Component({
	selector: 'm-ingredient-info-history',
	templateUrl: './ingredient-info-history.component.html',
	styleUrls: ['./ingredient-info-history.component.scss']
})
export class IngredientInfoHistoryComponent extends CpBaseComponent implements OnInit {

	public ingredient: Ingredient;
	public loading: boolean;

	public priceHistory: IngredientHistoryDTO[];
	public priceHistoryReverse: IngredientHistoryDTO[] = [];
	public chartData: number[];
	public chartLabels: string[];
	public lineChartOpacity: number = 0.7;

	constructor(
		@Inject(MAT_DIALOG_DATA) private data: any,
		_loading: CpLoadingService,
		_cdr: ChangeDetectorRef,
		private _dialog: MatDialogRef<IngredientInfoHistoryComponent>,
		private ingredientHistoryService: IngredientHistoryService,
	) {
		super(_loading, _cdr);
	}

	ngOnInit() {
		this.ingredient = this.data.ingredient;
		this.loadPriceHistoryData(this.ingredient.id);
	}

	cancel() {
		this._dialog.close();
	}

	private loadPriceHistoryData(id: number) {
		this.loading = true;

		this.ingredientHistoryService.getByIngredient(id).subscribe( ({ priceHistory, chartData, chartLabels }) => {
			this.loading = false;
			this.priceHistory = [...priceHistory];
			this.priceHistoryReverse = [...priceHistory.reverse()];
			this.chartData = chartData;
			this.chartLabels = chartLabels;

			this.onChangeComponent();
		}, err => {
			console.warn(err);
			this.loading = false;
		});
	}

	protected onChangeComponent() {
		this._cdr.detectChanges();
	}

}
