import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup }                       from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef }                from '@angular/material';

import { CpLoadingService }              from '../../../../../core/services/common/cp-loading.service';
import { CpBaseComponent }               from '../../../common/cp-base/cp-base.component';

@Component({
	selector: 'm-ingredient-info-factor',
	templateUrl: './ingredient-info-factor.component.html',
	styleUrls: ['./ingredient-info-factor.component.scss']
})
export class IngredientInfoFactorComponent extends CpBaseComponent implements OnInit {

	formGroup: FormGroup;
	maxGrossWeight: number;
	minGrossWeight: number;

	constructor(
		@Inject(MAT_DIALOG_DATA) private data: any,
		_loading: CpLoadingService,
		_cdr: ChangeDetectorRef,
		private _dialog: MatDialogRef<IngredientInfoFactorComponent>,
	) {
		super(_loading, _cdr);
	}

	ngOnInit() {
		const { correctionFactor: { grossWeight, netWeight }, maxGrossWeight, minGrossWeight } = this.data;
		this.maxGrossWeight = maxGrossWeight;
		this.minGrossWeight = minGrossWeight;

		this.formGroup = new FormGroup({
			grossWeight: new FormControl(),
			netWeight: new FormControl(),
			description: new FormControl(),
			id: new FormControl()
		});

		this.formGroup.patchValue({ grossWeight, netWeight });
	}

	save() {
		this.close(this.formGroup.value);
	}

	close(result?: any) {
		this._dialog.close(result);
	}

}
