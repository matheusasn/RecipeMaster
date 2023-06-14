import { Component, Inject, OnInit } from '@angular/core';
import { e } from '@angular/core/src/render3';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import _ from 'lodash';
import { UserService } from '../../../../../core/auth/user.service';
import { RecipeItem } from '../../../../../core/models/business/recipeitem';
import { EnglishUnitsUuid, PERCENT_UUID, Unit, UnitType } from '../../../../../core/models/business/unit';
import { RecipeVariableCost } from '../../../../../core/models/variablecost';
import { FixedCostService } from '../../../../../core/services/business/fixedcost.service';
import { VariableCostService } from '../../../../../core/services/business/variablecost.service';
import { CpLocalStorageService } from '../../../../../core/services/common/cp-localstorage.service';
import { IngredientInfoUnitComponent } from '../../../business/ingredient/ingredient-info-unit/ingredient-info-unit.component';
import { TypeOfCostSelected } from '../../../business/recipe/recipe/recipe.component';

enum CalculationType {
	PRICE = "PRICE",
	PERCENT = "PERCENT"
}

@Component({
  selector: 'm-modal-costs-edit',
  templateUrl: './modal-costs-edit.component.html',
  styleUrls: ['./modal-costs-edit.component.scss']
})
export class ModalCostsEditComponent implements OnInit {

	selectedCalculationType: CalculationType|string = CalculationType.PRICE;
	formGroup: FormGroup;
	// TODO Change this to FixedCost
	item:RecipeItem;
	cifrao: String;
	type: String;
	lang: String;
	units: Unit[] = [];
	originalUnits: Unit[] = [];

	recipeVariableCost: RecipeVariableCost;

	requiredName: boolean = false;
	requiredPercent: boolean = false;

	typeOfCostSelected: TypeOfCostSelected;

  constructor(
		@Inject(MAT_DIALOG_DATA) private data: any,
		private _dialogRef: MatDialogRef<ModalCostsEditComponent>,
		private _dialog: MatDialog,
		private _formBuilder: FormBuilder,
		private fixedCostService: FixedCostService,
		private localStorageService: CpLocalStorageService,
		private variableCostService: VariableCostService,
	) {
		this.lang = this.data.lang;
		this.item = this.data.item;
		this.recipeVariableCost = this.data.recipeVariableCost;
		this.cifrao = this.data.cifrao;
		this.type = this.data.type;
		this.units = this.data.units;
		this.originalUnits = this.data.units;
		this.typeOfCostSelected = this.data.typeOfCostSelected;
		this.filterUnits();
	}

	close() {
		this._dialogRef.close();
	}

  ngOnInit() {
		if (this.type !== 'FIXED_COSTS') {
			if (this.typeOfCostSelected === TypeOfCostSelected.TOTAL) {
				if (this.recipeVariableCost.unitUsed.uuid === PERCENT_UUID) {
					this.selectedCalculationType = CalculationType.PERCENT;
				}
			} else {
				if (this.recipeVariableCost.unitCostUnitUsed.uuid === PERCENT_UUID) {
					this.selectedCalculationType = CalculationType.PERCENT;
				}
			}
			this.buildRecipeVariableCostForm(this.recipeVariableCost);
		} else {
			this.buildFixedCostForm(this.item);
		}
  }

	selectPercentCostType(type: string) {
		this.formGroup.patchValue({
			percentCostType: type
		})
	}

	selectCalculationType(type: string) {
		this.selectedCalculationType = type;
		if (type === CalculationType.PERCENT) {
			const percentUnit = this.originalUnits.find(unit => unit.uuid === PERCENT_UUID)
			this.formGroup.patchValue({
				priceUnit: percentUnit,
				unitUsed: percentUnit,
				unitCostUnitUsed: percentUnit,
				price: 0
			})
		} else {
			this.formGroup.patchValue({
				priceUnit: this.units[4],
				unitUsed: this.units[4],
				unitCostUnitUsed: this.units[4],
				unityQuantityUsed: 1,
				unitCostUnityQuantityUsed: 1,
				priceUnitQuantity: 1,
			})
		}
	}

	private buildFixedCostForm(item:RecipeItem) {
    this.formGroup = this._formBuilder.group({
      name: [item ? item.name : null, [Validators.required]],
      price: [item ? item.price : null, []],
			unityQuantity: [item ? item.unityQuantity : null, []],
			unityQuantityUsed: [item ? item.unityQuantityUsed : null, []],
			unitUsed: [item ? item.unitUsed : null, []]
    });
  }

	private buildRecipeVariableCostForm(item:RecipeVariableCost) {
    this.formGroup = this._formBuilder.group({
			variableCostId: [item && item.variableCost.id ? item.variableCost.id : null, []],
			recipeVariableCostId: [item && item.id ? item.id : null, []],
      name: [item ? item.variableCost.name : null, [Validators.required]],
      price: [item ? item.variableCost.price : null, []],
			unityQuantityUsed: [item ? item.unityQuantityUsed : null, []],
			unitUsed: [item ? item.unitUsed : null, []],
			unitCostUnitUsed: [item ? item.unitCostUnitUsed : null, []],
			unitCostUnityQuantityUsed: [item ? item.unitCostUnityQuantityUsed : null, []],
			priceUnitQuantity: [item ? item.variableCost.priceUnitQuantity : null, []],
			priceUnit: [item ? item.variableCost.priceUnit : null, []],
			percentCostType: [ item ? item.variableCost.percentCostType : null, [] ]
    });
  }

	openDialogUnit() {
		const dialog = this._dialog.open(IngredientInfoUnitComponent, {
			data: {
				unit: this.formGroup.value.priceUnit,
				unityQuantity: this.formGroup.value.priceUnitQuantity,
				unitType: UnitType.OTHER_COSTS
			},
		});
		dialog.afterClosed().subscribe(async response => {
			if (response) {
				const { unit, unityQuantity } = response;
				this.formGroup.patchValue({
					unit,
					unitUsed: unit,
					priceUnitQuantity: unityQuantity,
					priceUnit: unit
				});
			}
		});
	}

	private async saveVariableCost() {
		if (this.formGroup.valid) {
			if (this.formGroup.value.priceUnit.uuid === PERCENT_UUID) {
				this.formGroup.patchValue({
					unitCostUnityQuantityUsed: this.formGroup.value.priceUnitQuantity || 0,
					unityQuantityUsed: this.formGroup.value.priceUnitQuantity || 0,
					priceUnitQuantity: this.formGroup.value.priceUnitQuantity || 0
				})
			}
			if (!this.formGroup.value.variableCostId) {
				const user = this.localStorageService.getLoggedUser()
				const { data } = await this.variableCostService.insert({
					name: this.formGroup.value.name,
					nameen: this.formGroup.value.name,
					namees: this.formGroup.value.name,
					user: user,
					price: this.formGroup.value.price,
					priceUnitQuantity: this.formGroup.value.priceUnitQuantity,
					priceUnit: this.formGroup.value.priceUnit,
					percentCostType: this.formGroup.value.percentCostType
				}).toPromise()

				let unitUsed = this.formGroup.value.unitUsed;
				let quantityUsed = this.formGroup.value.unityQuantityUsed;
				if (this.typeOfCostSelected === TypeOfCostSelected.UNIT) {
					unitUsed = this.formGroup.value.unitCostUnitUsed;
					quantityUsed = this.formGroup.value.unitCostUnityQuantityUsed;
				}

				const recipeVariableCost: RecipeVariableCost = {
					id: this.formGroup.value.recipeVariableCostId,
					unitUsed: unitUsed,
					unityQuantityUsed: quantityUsed,
					variableCost: data,

					unitCostUnitUsed: unitUsed,
					unitCostUnityQuantityUsed: quantityUsed
				}
				this._dialogRef.close(recipeVariableCost);
			} else {
				const id = this.formGroup.value.variableCostId;
				const toUpdate: any = {
					price: this.formGroup.value.price,
					priceUnitQuantity: this.formGroup.value.priceUnitQuantity,
					priceUnit: this.formGroup.value.priceUnit,
					percentCostType: this.formGroup.value.percentCostType
				}
				if (this.lang === 'pt') {
					toUpdate.name = this.formGroup.value.name;
				} else if (this.lang === 'en') {
					toUpdate.nameen = this.formGroup.value.name;
				} else if (this.lang === 'es') {
					toUpdate.namees = this.formGroup.value.name;
				}

				const { data } = await this.variableCostService.patch(id, toUpdate).toPromise()

				const recipeVariableCost: RecipeVariableCost = {
					id: this.formGroup.value.recipeVariableCostId,
					unitUsed: this.formGroup.value.unitUsed,
					unityQuantityUsed: this.formGroup.value.unityQuantityUsed,
					variableCost: data,
					unitCostUnitUsed: this.formGroup.value.unitCostUnitUsed,
					unitCostUnityQuantityUsed: this.formGroup.value.unitCostUnityQuantityUsed
				}
				this._dialogRef.close(recipeVariableCost);
			}
			this.formGroup.reset();
		}
		this.requiredName = false;
	}

	private async saveFixedCost() {
		if (!this.item) {
			const user = this.localStorageService.getLoggedUser()
			const { data } = await this.fixedCostService.insert({
				name: this.formGroup.value.name,
				nameen: this.formGroup.value.name,
				namees: this.formGroup.value.name,
				user: user,
				price: this.formGroup.value.price || 0
			}).toPromise();
			this._dialogRef.close({
				...data,
				shouldUpdate: false
			});
		} else {
			const objectToSave: any = {
				id: this.item.id,
				price: this.formGroup.value.price,
			}
			if (this.lang === 'pt') {
				objectToSave.name = this.formGroup.value.name;
			} else if (this.lang === 'en') {
				objectToSave.nameen = this.formGroup.value.name;
			} else if (this.lang === 'es') {
				objectToSave.namees = this.formGroup.value.name;
			}
			this._dialogRef.close({
				...objectToSave,
				shouldUpdate: true
			});
		}
		this.formGroup.reset();
		this.requiredName = false;
	}

	async save() {
		if (!this.formGroup.value.name) {
			this.requiredName = true;
			return
		}
		if (this.type === 'FIXED_COSTS') {
			await this.saveFixedCost();
		} else {
			this.saveVariableCost();
		}
	}

	compareSelect(value1: any, value2: any): boolean {
		return value1 && value2 ? value1.id === value2.id : value1 === value2;
	}

	private filterUnits() {
		this.units = _.filter(this.units, (u:Unit) => {
			return _.isNil(u.ingredientId) && u.name !== 'Porcento %';
		});

		this.units = _.orderBy(this.units, ['userId', 'name'], ['asc', 'desc']);

		this.units = this.removeDuplicatedUnits();

		if (this.lang !== 'pt') {
			this.units = _.filter(this.units, (u:Unit) => {
				return u.name !== 'Colher de Café';
			});
		}

		if (this.lang !== 'en') {
			this.units = this.removeEnglishUnits();
		}
	}

	private removeEnglishUnits() {
		return _.filter(this.units, (u:Unit) => {
			return !EnglishUnitsUuid.includes(u.uuid) && u.name !== 'Stick';
		});
	}

	private removeDuplicatedUnits() {
		var reduced = [];
		_.reverse(this.units).forEach((item) => {
			var duplicated  = reduced.findIndex(redItem => {
					return item.name == redItem.name;
			}) > -1;

			if(!duplicated) {
				reduced.push(item);
			}
		});
		return reduced;
	}
}
