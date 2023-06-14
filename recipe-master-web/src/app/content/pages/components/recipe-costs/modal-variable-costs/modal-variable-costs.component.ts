import { Component, Inject, OnInit, ViewChild } from "@angular/core";
import { FormArray, FormBuilder, FormControl, FormGroup } from "@angular/forms";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import _ from "lodash";
import swal, { SweetAlertOptions } from "sweetalert2";
import { TranslationService } from "../../../../../core/metronic/services/translation.service";
import { isRecipeVariableCostActive } from "../../../../../core/models/business/recipe";
import { RecipeItem } from "../../../../../core/models/business/recipeitem";
import { Unit, PERCENT_UUID } from "../../../../../core/models/business/unit";
import { FixedCost } from "../../../../../core/models/fixedcost";
import {
	PercentCostType,
	RecipeVariableCost,
	VariableCost,
} from "../../../../../core/models/variablecost";
import { CommonCalcService } from "../../../../../core/services/business/common-calc.service";
import { FixedCostService } from "../../../../../core/services/business/fixedcost.service";
import { RecipeService } from "../../../../../core/services/business/recipe.service";
import { VariableCostService } from "../../../../../core/services/business/variablecost.service";
import { TypeOfCostSelected } from "../../../business/recipe/recipe/recipe.component";
import { ModalCostsEditComponent } from "../modal-costs-edit/modal-costs-edit.component";

@Component({
	selector: "m-modal-costs",
	templateUrl: "./modal-variable-costs.component.html",
	styleUrls: ["./modal-variable-costs.component.scss"],
})
export class ModalVariableCostsComponent implements OnInit {
	modalRef: MatDialogRef<ModalCostsEditComponent>;
	variableCosts: FormArray;
	cifrao: string;
	units: Unit[];
	totalCost: number;
	formGroup: FormGroup;
	lang: string;
	recipeVariableCosts: RecipeVariableCost[];
	typeOfCostSelected: TypeOfCostSelected;
	recipeYield: number;
	cmv: number;
	totalMonthlyBilling: number;
	@ViewChild("selectAllVariableCostsCheckbox") selectAllVariableCostsCheckbox;

	constructor(
		@Inject(MAT_DIALOG_DATA) private data: any,
		private _dialog: MatDialogRef<ModalVariableCostsComponent>,
		private _dialogEditModal: MatDialog,
		private translationService: TranslationService,
		private _formBuilder: FormBuilder,
		private variableCostService: VariableCostService,
		private calcService: CommonCalcService,
		private recipeService: RecipeService
	) {
		this.translationService.getSelectedLanguage().subscribe((lang) => {
			this.lang = lang;
			this.cifrao = data.cifrao;
			this.units = data.units;
			this.totalCost = data.totalCost;
			this.recipeVariableCosts = data.recipeVariableCosts;
			this.typeOfCostSelected = data.typeOfCostSelected;
			this.recipeYield = data.recipeYield;
			this.cmv = data.cmv;
			this.totalMonthlyBilling = data.totalMonthlyBilling;

			this.formGroup = this._formBuilder.group({
				variableCosts: this._formBuilder.array([]),
			});

			const selectedVariableCostsLength = data.recipeVariableCosts.filter(
				(item) => isRecipeVariableCostActive(item, this.typeOfCostSelected)
			).length;

			if (data.variableCosts.length === selectedVariableCostsLength) {
				setTimeout(
					() =>
						(this.selectAllVariableCostsCheckbox.nativeElement.checked = true),
					10
				);
			}

			data.variableCosts.forEach((variableCost) => {
				let recipeVariableCost = null;
				const found = data.recipeVariableCosts.find(
					(recipeVariableCost) =>
						recipeVariableCost.variableCost.id === variableCost.id
				);
				if (found) {
					recipeVariableCost = found;
				}

				this.addVariableCost(variableCost, recipeVariableCost);
			});

			this.formGroup.controls.variableCosts.valueChanges.subscribe(
				(variableCosts) => {
					variableCosts.forEach((variableCost) => {
						if (
							isRecipeVariableCostActive(
								{
									...variableCost,
									totalCostChecked: variableCost.active,
									unitCostChecked: variableCost.active,
								},
								this.typeOfCostSelected
							)
						) {
							const found = this.recipeVariableCosts.find(
								(rvc) => rvc.variableCost.id === variableCost.id
							);
							if (!found) {
								const defaultUnit = variableCost.priceUnit || this.units[4];
								const priceQuantity = variableCost.priceUnitQuantity || 1;
								let recipeVariableCost: RecipeVariableCost = {
									id: null,
									unitUsed: defaultUnit,
									unityQuantityUsed: priceQuantity,
									unitCostUnitUsed: defaultUnit,
									unitCostUnityQuantityUsed: priceQuantity,
									variableCost,
								};
								this.recipeVariableCosts.push(recipeVariableCost);
							}
						}
					});
				}
			);
		});

		_dialog.beforeClosed().subscribe(() => this.gotoBack());
	}

	ngOnInit() {}

	private getTranslatedName = (cost: any, lang: string) => {
		if (lang === "pt") return cost.name;
		else if (lang === "en") return cost.nameen;
		else if (lang === "es") return cost.namees;
	};

	getTotalVariableCosts(): number {
		const total = this.formGroup.value.variableCosts
			.filter((item) => item.active)
			.map((item) => this.calcVariableCostPrice(item))
			.reduce((a, b) => a + b, 0);
		return total;
	}

	calcVariableCostPrice(variableCost: VariableCost) {
		const recipeVariableCost = this.recipeVariableCosts.find(
			(rvc) => rvc.variableCost.id === variableCost.id
		);
		const cost =
			variableCost.percentCostType === PercentCostType.SALE_PRICE
				? this.totalCost
				: this.cmv;
		if (!recipeVariableCost) {
			if (variableCost.priceUnit.uuid === PERCENT_UUID) {
				return cost * (variableCost.priceUnitQuantity / 100);
			}
			return variableCost.price;
		}
		return this.calcService.calcRecipeVariableCostPrice(
			this.typeOfCostSelected,
			recipeVariableCost,
			cost
		);
	}

	addVariableCost(
		variableCost: VariableCost,
		recipeVariableCost: RecipeVariableCost
	): void {
		this.variableCosts = this.formGroup.get("variableCosts") as FormArray;
		const item: FormGroup = this.createVariableCost(
			variableCost,
			recipeVariableCost
		);
		this.variableCosts.push(item);
	}

	createVariableCost(
		variableCost: VariableCost,
		recipeVariableCost: RecipeVariableCost
	): FormGroup {
		const name = this.getTranslatedName(variableCost, this.lang);
		return this._formBuilder.group({
			id: [variableCost.id, []],
			name: [name, []],
			price: [variableCost.price, []],
			active: [
				recipeVariableCost
					? isRecipeVariableCostActive(
							recipeVariableCost,
							this.typeOfCostSelected
					  )
					: false,
				[],
			],
			priceUnit: [variableCost.priceUnit, []],
			priceUnitQuantity: [variableCost.priceUnitQuantity, []],
			percentCostType: [variableCost.percentCostType, []],
		});
	}

	gotoBack() {
		this._dialog.close({
			items: {
				variableCosts: this.formGroup.value.variableCosts,
				recipeVariableCosts: this.recipeVariableCosts.map((rvc) => ({
					...rvc,
					active: this.formGroup.value.variableCosts.find(
						(vc) => vc.id === rvc.variableCost.id
					).active,
				})),
			},
		});
	}

	selectAllVariableCostsCheckBoxesChange() {
		if (this.selectAllVariableCostsCheckbox.nativeElement.checked) {
			this.variableCosts.controls.forEach((fixedCost) => {
				fixedCost.patchValue({
					active: true,
				});
			});
		} else {
			this.variableCosts.controls.forEach((fixedCost) => {
				fixedCost.patchValue({
					active: false,
				});
			});
		}
	}

	openModaVaribleCosts(index: number) {
		document.getElementById(`variablecost${index}`).click();
	}

	delete(item: RecipeItem | number, type) {
		const op: SweetAlertOptions = {
			title: "",
			text: "Tem certeza que deseja excluir? Será excluído de todas as outras receitas.",
			type: "warning",
			showCancelButton: true,
			confirmButtonColor: "#f4516c",
			cancelButtonColor: "#d2d2d2",
			confirmButtonText: "Excluir",
			cancelButtonText: "Voltar",
		};

		swal(op).then((result) => {
			if (result.value) {
				this.variableCostService.delete(item as number).subscribe(() => {
					const index = this.formGroup.value.variableCosts.findIndex(
						(fixedCost) => fixedCost.id === item
					);
					this.variableCosts.removeAt(index);
					this.recipeVariableCosts = this.recipeVariableCosts.filter(
						(rvc) => rvc.variableCost.id !== item
					);
				});
			}
		});
	}

	getUnitLabel(variableCost: VariableCost) {
		const recipeVariableCost = this.recipeVariableCosts.find(
			(rvc) => rvc.variableCost.id === variableCost.id
		);
		if (recipeVariableCost) {
			if (this.typeOfCostSelected === TypeOfCostSelected.TOTAL) {
				return `${recipeVariableCost.unityQuantityUsed} ${recipeVariableCost.unitUsed.abbreviation}`;
			} else {
				const qtd = recipeVariableCost.unitCostUnityQuantityUsed
					? recipeVariableCost.unitCostUnityQuantityUsed
					: 1;
				const abbreviation = recipeVariableCost.unitCostUnitUsed
					? recipeVariableCost.unitCostUnitUsed.abbreviation
					: this.units[4].abbreviation;
				return `${qtd} ${abbreviation}`;
			}
		}
		if (variableCost.priceUnit) {
			return `${variableCost.priceUnitQuantity || 0} ${
				variableCost.priceUnit.abbreviation
			}`;
		}
		return `1 ${this.units[4].abbreviation}`;
	}

	openEditModal(item?) {
		const defaultCost: VariableCost = {
			price: 0,
			priceUnitQuantity: 1,
			priceUnit: this.units[4],
			percentCostType: PercentCostType.SALE_PRICE,
		};

		let recipeVariableCost: RecipeVariableCost = {
			id: null,
			unitUsed: this.units[4],
			unityQuantityUsed: 1,
			unitCostUnitUsed: this.units[4],
			unitCostUnityQuantityUsed: 1,
			variableCost: item ? item.value : defaultCost,
		};

		if (item) {
			const found = this.recipeVariableCosts.find(
				(rvc) => rvc.variableCost.id === item.value.id
			);
			if (found) {
				recipeVariableCost = found;
			}
		}

		this.modalRef = this._dialogEditModal.open(ModalCostsEditComponent, {
			data: {
				recipeVariableCost,
				cifrao: this.cifrao,
				units: this.units,
				lang: this.lang,
				typeOfCostSelected: this.typeOfCostSelected,
			},
		});

		this.modalRef.afterClosed().subscribe((data) => {
			if (data) {
				if (this.recipeYield && !data.id) {
					if (Number(data.unityQuantityUsed) === this.recipeYield) {
						data.unitCostUnityQuantityUsed =
							data.unitCostUnityQuantityUsed / this.recipeYield;
					}
				}
				const recipeVariableCostIndex = this.recipeVariableCosts.findIndex(
					(rvc) => rvc.id === data.id
				);
				if (recipeVariableCostIndex !== -1) {
					this.recipeVariableCosts[recipeVariableCostIndex] = data;
				} else {
					this.recipeVariableCosts.push(data);
				}

				const variableCosts = this.formGroup.value.variableCosts;
				const index = variableCosts.findIndex(
					(variableCost) => variableCost.id === data.variableCost.id
				);
				if (index !== -1) {
					variableCosts[index] = data.variableCost;
				} else {
					this.addVariableCost(data.variableCost, null);
				}

				this.formGroup.patchValue({
					variableCosts: _.sortBy(this.formGroup.value.variableCosts, [
						function (o) {
							return o.name.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
						},
					]),
				});
			}
		});
	}
}
