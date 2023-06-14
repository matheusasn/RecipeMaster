import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup }                       from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef }                from '@angular/material';
import { Ingredient } from '../../../../../core/models/business/ingredient';
import { RecipeIngredient } from '../../../../../core/models/business/recipeingredient';
import { Unit, UnitType }                                         from '../../../../../core/models/business/unit';
import { UnitService }                                  from '../../../../../core/services/business/unit.service';

import { CpLoadingService }              from '../../../../../core/services/common/cp-loading.service';
import { CpBaseComponent }               from '../../../common/cp-base/cp-base.component';
import { ModalCostsTab } from '../../../components/recipe-costs/modal-fixed-costs-form/modal-fixed-costs-form.component';

@Component({
	selector: 'm-ingredient-info-unit',
	templateUrl: './ingredient-info-unit.component.html',
	styleUrls: ['./ingredient-info-unit.component.scss']
})
export class IngredientInfoUnitComponent extends CpBaseComponent implements OnInit {

	formGroup: FormGroup;
	units: Unit[] = [];
	recipeIngredient: RecipeIngredient;
	unitType: UnitType;

	isModalSpecificCost: boolean = false;
	selectTabOnModalSpecificCost: ModalCostsTab;

	unitBasic: boolean = true;
	unitCanUpdate: boolean = true;
	unitCanCreate: boolean = true;
	showUnitAbbreviated: boolean = false;

	constructor(
		@Inject(MAT_DIALOG_DATA) private data: any,
		_loading: CpLoadingService,
		_cdr: ChangeDetectorRef,
		private _dialog: MatDialogRef<IngredientInfoUnitComponent>,
		private _unitService: UnitService
	) {
		super(_loading, _cdr);
		this.recipeIngredient = data.recipeIngredient;
		this.isModalSpecificCost = data.isModalSpecificCost;
		this.selectTabOnModalSpecificCost = data.selectTabOnModalSpecificCost;
		this.unitBasic = data.unitBasic;
		this.unitCanUpdate = data.unitCanUpdate;
		this.unitCanCreate = data.unitCanCreate;
		this.showUnitAbbreviated = data.showUnitAbbreviated;
	}

	ngOnInit() {
		const { unit, unityQuantity } = this.data;
		this.recipeIngredient = this.data.recipeIngredient;
		this.unitType = this.data.unitType;
		this.formGroup = new FormGroup({
			unit: new FormControl(),
			unityQuantity: new FormControl(),
			description: new FormControl(),
			id: new FormControl()
		});

		this.fetchUnits();
		this.formGroup.patchValue({ unit, unityQuantity });
	}

	save() {
		this.close(this.formGroup.value);
	}

	close(result?: any) {
		this._dialog.close(result);
	}

	private fetchUnits() {
		this._unitService.getReduced().subscribe(
			apiResponse => {
				this.units = apiResponse.data;
				this.units[0].name = 'INGREDIENT.UNIDADE.TXT1';
				this.units[1].name = 'INGREDIENT.UNIDADE.TXT2';
				this.units[2].name = 'INGREDIENT.UNIDADE.TXT3';
				this.units[3].name = 'INGREDIENT.UNIDADE.TXT4';
				this.units[4].name = 'INGREDIENT.UNIDADE.TXT5';
				this.units[5].name = 'INGREDIENT.UNIDADE.TXT6';
				this.units[6].name = 'INGREDIENT.UNIDADE.TXT7';
			},
			error => { }
		);
	}

}
