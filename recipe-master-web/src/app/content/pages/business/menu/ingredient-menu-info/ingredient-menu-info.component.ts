import { Component, OnInit, Inject, ChangeDetectorRef } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material';
import { FormBuilder, FormGroup, Validators }       from '@angular/forms';
import { TranslateService }                         from '@ngx-translate/core';
import { RecipeIngredient }                             from '../../../../../core/models/business/recipeingredient';

import { Unit, UnitType }                           from '../../../../../core/models/business/unit';
import { UnitService }                    from '../../../../../core/services/business/unit.service';
import { ApiResponse }                    from '../../../../../core/models/api-response';
import { CpLoadingService }               from '../../../../../core/services/common/cp-loading.service';
import { unityValidator }                 from '../../../../../validators/unity.validator';
import { CpBaseComponent }                from '../../../common/cp-base/cp-base.component';
import { IngredientInfoHistoryComponent } from '../../ingredient/ingredient-info-history/ingredient-info-history.component';
import { IngredientInfoUnitComponent }    from '../../ingredient/ingredient-info-unit/ingredient-info-unit.component';
import { ToastrService } from 'ngx-toastr';
import { MenuIngredient } from '../../../../../core/models/business/menuingredient';
import _ from 'lodash';

@Component({
	selector: 'm-ingredient-menu-info',
	templateUrl: './ingredient-menu-info.component.html',
	styleUrls: ['./ingredient-menu-info.component.scss']
})
export class IngredientMenuInfoComponent extends CpBaseComponent implements OnInit {

	public units: Unit[] = [];
	public formGroup: FormGroup;
	public recipeIngredient: MenuIngredient;
	public titleAlert: string;
	public type: string;

	constructor(
		@Inject(MAT_DIALOG_DATA) private data: any,
		_loading: CpLoadingService,
		_cdr: ChangeDetectorRef,
		private _dialogRef: MatDialogRef<IngredientMenuInfoComponent>,
		private _dialog: MatDialog,
		private _unitService: UnitService,
		private _translateService: TranslateService,
		private _formBuilder: FormBuilder,
		private _toast: ToastrService,
	) {
		super(_loading, _cdr);
	}

	ngOnInit() {
		this.recipeIngredient = this.data.recipeIngredient;
		this.type = this.data.type;
		this._translateService.get('MODAL.DELETE_CARDAPIO_TITLE').subscribe(
			data => this.titleAlert = data);

		this.fetchUnits();
		this.buildForm();
	}

	buildForm() {
		const purchaseprice = this.recipeIngredient.ingredient.purchasePrice;

		this.formGroup = this._formBuilder.group({
			amount: [this.recipeIngredient.amount, [Validators.required]],
			unit: [this.recipeIngredient.unit],
			purchasePrice: this._formBuilder.group({
				price: [purchaseprice && purchaseprice.price ? purchaseprice.price : 0, [Validators.required]],
				unityQuantity: [purchaseprice && purchaseprice.unityQuantity ? purchaseprice.unityQuantity : 0, [Validators.required]],
				unit: [purchaseprice && purchaseprice.unit ? purchaseprice.unit : null]
			}),
			saleValue: [this.recipeIngredient.saleValue]
		}, { validator: [unityValidator]});
	}

	cancel() {
		this._dialogRef.close();
	}

	doDismiss(event) {
		console.log('não remover ingrediente da receita');
	}

	removeRecipeIngredient() {
		this._dialogRef.close({
			recipeIngredient: this.recipeIngredient,
			exclude: true
		});
	}

	save() {

		if (!this.formGroup.value.amount) {
			this.formGroup.patchValue({
				amount: 0
			});
		}

		if (!this.formGroup.value.purchasePrice.price) {
		this.formGroup.patchValue({
			purchasePrice: {
			price: 0
			}
		});
		}

		if (!this.formGroup.value.purchasePrice.unityQuantity) {
		this.formGroup.patchValue({
			purchasePrice: {
			unityQuantity: 0
			}
		});
		}

		if (!this.formGroup.value.saleValue) {
			this.formGroup.patchValue({
				saleValue: 0
			})
		}

		this.recipeIngredient.amount = this.formGroup.value.amount;
			this.recipeIngredient.unit = this.formGroup.value.unit;
		this.recipeIngredient.ingredient.purchasePrice = this.formGroup.value.purchasePrice;

		this.recipeIngredient.nutritionInfo = this.formGroup.value.nutritionInfo;

		// Atualizando último valor em uso...
		this.recipeIngredient.ingredient.lastUnit = this.recipeIngredient.unit;
		this.recipeIngredient.ingredient.lastAmount = this.recipeIngredient.amount;

		this.recipeIngredient.saleValue = this.formGroup.value.saleValue;

		if (_.isNil(this.recipeIngredient.ingredient.recipeCopiedId)) {
			this.recipeIngredient.ingredient.saleValue = this.formGroup.value.saleValue;
		}

		this._dialogRef.close({
		  recipeIngredient: this.recipeIngredient,
		  exclude: false
		});
	}

	openDialogHistory() {
		const dialog = this._dialog.open(
			IngredientInfoHistoryComponent, { panelClass: 'cpPanelOverflow' });
	}

	openDialogUnit() {
		const dialog = this._dialog.open(
			IngredientInfoUnitComponent, {
				data: {
					unit: this.formGroup.value.purchasePrice.unit,
					unityQuantity: this.formGroup.value.purchasePrice.unityQuantity,
					recipeIngredient: this.recipeIngredient,
					unitType: UnitType.PURCHASE_LIST
				},
				panelClass: 'cpPanelOverflow'
			});

			dialog.afterClosed().subscribe(response => {
				if (response) {
					const { unit, unityQuantity } = response;
					this.formGroup.patchValue({
						purchasePrice: {
							unit,
							unityQuantity
						}
					});
				}
			});
	}

	private fetchUnits() {
		this._unitService.getReduced().subscribe(
			(apiResponse: ApiResponse) => {
				this.units = apiResponse.data;
				this.units[0].name = 'INGREDIENT.UNIDADE.TXT1';
				this.units[1].name = 'INGREDIENT.UNIDADE.TXT2';
				this.units[2].name = 'INGREDIENT.UNIDADE.TXT3';
				this.units[3].name = 'INGREDIENT.UNIDADE.TXT4';
				this.units[4].name = 'INGREDIENT.UNIDADE.TXT5';
				this.units[5].name = 'INGREDIENT.UNIDADE.TXT6';
				this.units[6].name = 'INGREDIENT.UNIDADE.TXT7';
				this.fetchUnitsAbbreviated();
			},
			(apiResponse: ApiResponse) => { }
		);
	}

	private fetchUnitsAbbreviated() {
		this._unitService.getAbbreviated().subscribe(
			(apiResponse: ApiResponse) => {
				this.units.forEach((x, i) => x.abbreviation = apiResponse.data[i].name);
			},
			(apiResponse: ApiResponse) => { }
		);
	}
}
