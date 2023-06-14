import { Component, Inject, OnInit } from '@angular/core';
import { e } from '@angular/core/src/render3';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import _ from 'lodash';
import { UserService } from '../../../../../core/auth/user.service';
import { RecipeItem } from '../../../../../core/models/business/recipeitem';
import { FixedSpecificCost, RecipeFixedSpecificCost } from '../../../../../core/models/business/fixed-specific-cost';
import { EnglishUnitsUuid, PERCENT_UUID, Unit, UnitType } from '../../../../../core/models/business/unit';
import { FixedSpecificCostService } from '../../../../../core/services/business/fixed-specific-cost.service';
import { FixedCostService } from '../../../../../core/services/business/fixedcost.service';
import { VariableCostService } from '../../../../../core/services/business/variablecost.service';
import { CpLocalStorageService } from '../../../../../core/services/common/cp-localstorage.service';
import { IngredientInfoUnitComponent } from '../../../business/ingredient/ingredient-info-unit/ingredient-info-unit.component';
import { TypeOfCostSelected } from '../../../business/recipe/recipe/recipe.component';
import { RecipeFixedSpecificCostService } from '../../../../../core/services/business/recipe-fixed-specific-cost.service';

enum CalculationType {
	PRICE = "PRICE",
	PERCENT = "PERCENT"
}

export enum ModalCostsTab {
	OTHERS = "OTHERS",
	LABOUR = "LABOUR",
	EQUIPMENT = "EQUIPMENT"
}

@Component({
  selector: 'm-modal-fixed-costs-form',
  templateUrl: './modal-fixed-costs-form.component.html',
  styleUrls: ['./modal-fixed-costs-form.component.scss']
})
export class ModalFixedCostsFormComponent implements OnInit {
	modalCostsTab = ModalCostsTab;
	selectedCalculationType: CalculationType|string = CalculationType.PRICE;
	formGroup: FormGroup;
	// TODO Change this to FixedCost
	item:RecipeItem;
	cifrao: String;
	type: String;
	lang: String;
	units: Unit[] = [];
	originalUnits: Unit[] = [];

	tabSelected: ModalCostsTab = ModalCostsTab.OTHERS

	recipeFixedSpecificCost: RecipeFixedSpecificCost;

	requiredName: boolean = false;
	requiredPercent: boolean = false;

	typeOfCostSelected: TypeOfCostSelected;

	quantityUnits: Unit[];
	priceUnits: Unit[];

	modalFixedCostsFormTabMap: Map<string, any> = new Map()

	lastkilowattHourPrice: number = 0;
	lastGasPrice: number = 0;

  constructor(
		@Inject(MAT_DIALOG_DATA) private data: any,
		private _dialogRef: MatDialogRef<ModalFixedCostsFormComponent>,
		private _dialog: MatDialog,
		private _formBuilder: FormBuilder,
		private localStorageService: CpLocalStorageService,
		private fixedSpecificCostService: FixedSpecificCostService,
		private recipeFixedSpecificCostService: RecipeFixedSpecificCostService
	) {
		this.lang = this.data.lang;
		this.item = this.data.item;
		this.recipeFixedSpecificCost = this.data.recipeFixedSpecificCost;
		this.cifrao = this.data.cifrao;
		this.type = this.data.recipeFixedSpecificCost.fixedSpecificCost.type;
		this.units = this.data.units;
		this.originalUnits = this.data.units;
		this.typeOfCostSelected = this.data.typeOfCostSelected;

		console.log(this.data)

		this.recipeFixedSpecificCostService.getLastWattPriceAndGasPrice().subscribe((response) => {
			this.lastGasPrice = response.data.gasPrice;
			this.lastkilowattHourPrice = response.data.kilowattHourPrice;
			if (!this.data.recipeFixedSpecificCost.id) {
				this.formGroup.patchValue({
					price: response.data.kilowattHourPrice
				})
			}
		})

		this.filterUnits();

		this.createModalFixedCostsFormTabMap()

		this.tabChange(this.type as ModalCostsTab);

		this.buildRecipeSpecificFixedCostForm(this.data.recipeFixedSpecificCost);

		this.formGroup.controls.consumptionUnit.valueChanges.subscribe((unit: Unit) => {
			if (unit && this.tabSelected === ModalCostsTab.EQUIPMENT) {
				let priceUnit = null;
				let priceUnitQuantity = this.formGroup.value.priceUnitQuantity;
				let price = 0;
				if (unit.abbreviation === 'W' || unit.abbreviation === 'kWh') {
					priceUnit = this.units.find(unit => unit.abbreviation === 'kWh');
					priceUnitQuantity = 0;
					price = this.lastkilowattHourPrice;
				} else if (unit.abbreviation === 'Kg/h') {
					priceUnit = this.units.find(unit => unit.abbreviation === 'Kg');
					priceUnitQuantity = Number(priceUnitQuantity) === 0 ? 13 : priceUnitQuantity;
					price = this.lastGasPrice;
				}
				this.formGroup.patchValue({
					priceUnit,
					priceUnitQuantity,
					price
				})
			}
		})

		this.formGroup.controls.priceUnit.valueChanges.subscribe((unit: Unit) => {
			if (unit && this.tabSelected === ModalCostsTab.OTHERS) {
				let quantityUnit = this.formGroup.value.quantityUnit;
				if (unit.abbreviation === 'Unid.') {
					quantityUnit = this.units.find(unit => ['5e44be76-4bc4-4173-8ae5-9fc5c6469415'].includes(unit.uuid)); // Unid.
					this.quantityUnits = [quantityUnit]
				} else {
					this.quantityUnits = this.units.filter(unit => ['Unid.', 'min', 'hrs'].includes(unit.abbreviation));
				}
				this.formGroup.patchValue({
					quantityUnit
				})
			}
		})

	}

	ngOnInit(): void {
	}

	private createModalFixedCostsFormTabMap() {
		const unid = this.units.find(unit => unit.abbreviation === 'Unid.')

		this.modalFixedCostsFormTabMap.set(ModalCostsTab.EQUIPMENT, {
			priceUnits: this.units.filter(unit => ['kWh', 'Kg'].includes(unit.abbreviation)),
			quantityUnits: this.temporalUnits,
			defaultPriceUnit: this.units.find(unit => unit.abbreviation === 'kWh'),
			defaultQuantityUnit: this.temporalUnits[0]
		})

		this.modalFixedCostsFormTabMap.set(ModalCostsTab.LABOUR, {
			priceUnits: this.temporalUnits,
			quantityUnits: this.temporalUnits,
			defaultPriceUnit: this.temporalUnits[0],
			defaultQuantityUnit: this.temporalUnits[0]
		})

		this.modalFixedCostsFormTabMap.set(ModalCostsTab.OTHERS, {
			priceUnits: this.units,
			quantityUnits: this.units.filter(unit => ['Unid.', 'min', 'hrs'].includes(unit.abbreviation)),
			defaultPriceUnit: unid,
			defaultQuantityUnit: unid
		})
	}

	get consumptionUnits() {
		const allowedUUids = [
			'29d5a6da-9661-49a5-add0-1e7a4d57538b', // W
			'1b8c294f-817c-4eef-b646-9cefd2335eaa', // kWh
			'2109049f-93d2-4f8f-864f-95f9d7946bc0' // Kg/h
		]
		const filtered = this.units.filter(unit => allowedUUids.includes(unit.uuid))
		return _.sortBy(filtered, 'id', 'ASC')
	}

	get temporalUnits() {
		const allowedUUids = [
			'65d6439e-a1df-4548-bc56-046399bd075c', // Minutes
			'aa21feca-c428-40ad-9c20-428c4e502679', // Hours
		]
		return this.units.filter(unit => allowedUUids.includes(unit.uuid))
	}

	close() {
		this._dialogRef.close();
	}

	tabChange(tab: ModalCostsTab) {
		const mapValue = this.modalFixedCostsFormTabMap.get(tab)

		this.priceUnits = mapValue.priceUnits;
		this.quantityUnits = mapValue.quantityUnits;

		if (this.formGroup) {
			this.formGroup.patchValue({
				priceUnit: mapValue.defaultPriceUnit,
				priceUnitQuantity: 1,
				quantityUnit: mapValue.defaultQuantityUnit
			})
		}

		this.tabSelected = tab;
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

	private buildRecipeSpecificFixedCostForm(item: RecipeFixedSpecificCost) {
    this.formGroup = this._formBuilder.group({
			specificFixedCostId: [item && item.fixedSpecificCost.id ? item.fixedSpecificCost.id : null, []],
			recipeSpecificFixedCostId: [item && item.id ? item.id : null, []],
      name: [item ? item.fixedSpecificCost.name : null, [Validators.required]],
			consumptionAmount: [ item ? item.consumptionAmount : null, [Validators.required] ],
			consumptionUnit: [ item ? item.consumptionUnit : null, [Validators.required] ],
      price: [item ? item.price : null, []],
			priceUnit: [ item ? item.priceUnit : null, [] ],
			priceUnitQuantity: [ item ? item.priceUnitQuantity : null, [] ],
			quantity: [ item ? item.quantity : null, [] ],
			quantityUnit: [ item ? item.quantityUnit : null, [] ],
    });
  }

	openDialogUnit() {
		const dialog = this._dialog.open(IngredientInfoUnitComponent, {
			data: {
				unit: this.formGroup.value.priceUnit,
				unityQuantity: this.formGroup.value.priceUnitQuantity,
				unitType: UnitType.OTHER_COSTS,
				unitBasic: false,
				unitCanUpdate: false,
				unitCanCreate: false,
				selectTabOnModalSpecificCost: this.tabSelected,
				isModalSpecificCost: true,
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

	async save() {
		if (this.formGroup.valid) {
			if (!this.formGroup.value.specificFixedCostId) {
				const user = this.localStorageService.getLoggedUser()

				const { data } = await this.fixedSpecificCostService.insert({
					name: this.formGroup.value.name,
					nameen: this.formGroup.value.name,
					namees: this.formGroup.value.name,
					type: this.tabSelected.toString(),
					user
				}).toPromise()

				const recipeSpecificFixedCost: RecipeFixedSpecificCost = {
					id: this.formGroup.value.recipeSpecificFixedCostId,
					priceUnitQuantity: this.formGroup.value.priceUnitQuantity,
					consumptionAmount: Number(`${this.formGroup.value.consumptionAmount}`.replace(",", ".")),
					consumptionUnit: this.formGroup.value.consumptionUnit,
					fixedSpecificCost: data,
					price: this.formGroup.value.price,
					priceUnit: this.formGroup.value.priceUnit,
					quantity: this.formGroup.value.quantity,
					quantityUnit: this.formGroup.value.quantityUnit
				}
				this._dialogRef.close(recipeSpecificFixedCost);
			} else {
				const id = this.formGroup.value.specificFixedCostId;
				const toUpdate: any = {
					type: this.tabSelected.toString()
				}
				if (this.lang === 'pt') {
					toUpdate.name = this.formGroup.value.name;
				} else if (this.lang === 'en') {
					toUpdate.nameen = this.formGroup.value.name;
				} else if (this.lang === 'es') {
					toUpdate.namees = this.formGroup.value.name;
				}

				const { data } = await this.fixedSpecificCostService.patch(id, toUpdate).toPromise()

				const recipeSpecificFixedCost: RecipeFixedSpecificCost = {
					id: this.formGroup.value.recipeSpecificFixedCostId,
					priceUnitQuantity: this.formGroup.value.priceUnitQuantity,
					consumptionAmount: Number(`${this.formGroup.value.consumptionAmount}`.replace(",", ".")),
					consumptionUnit: this.formGroup.value.consumptionUnit,
					fixedSpecificCost: data,
					price: this.formGroup.value.price,
					priceUnit: this.formGroup.value.priceUnit,
					quantity: this.formGroup.value.quantity,
					quantityUnit: this.formGroup.value.quantityUnit
				}
				this._dialogRef.close(recipeSpecificFixedCost);
			}
			this.formGroup.reset();
		}
		this.requiredName = false;
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

	getQuantityLabel() {
		if (this.tabSelected === ModalCostsTab.OTHERS) {
			return 'Quantidade'
		}
		if (this.tabSelected === ModalCostsTab.EQUIPMENT) {
			return 'Tempo de uso'
		}
		return 'Tempo'
	}
}
