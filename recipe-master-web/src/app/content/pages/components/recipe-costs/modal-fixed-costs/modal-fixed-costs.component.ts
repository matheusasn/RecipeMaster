import { Component, Inject, OnInit, ViewChild } from "@angular/core";
import { FormArray, FormBuilder, FormGroup } from "@angular/forms";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import _ from "lodash";
import swal, { SweetAlertOptions } from "sweetalert2";
import { TranslationService } from "../../../../../core/metronic/services/translation.service";
import { isRecipeVariableCostActive } from "../../../../../core/models/business/recipe";
import { RecipeItem } from "../../../../../core/models/business/recipeitem";
import { FixedSpecificCost, RecipeFixedSpecificCost, SpecificCostType } from "../../../../../core/models/business/fixed-specific-cost";
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
import { ModalFixedCostsFormComponent } from "../modal-fixed-costs-form/modal-fixed-costs-form.component";
import { FixedSpecificCostService } from "../../../../../core/services/business/fixed-specific-cost.service";
import { calculateFixedSpecificCostPrice } from "./calculate-fixed-specific-cost-price";

export type FixedSpecificCostForm = {
	id: number;
	name: string;
	quantity: number;
	quantityUnit: Unit;
	price: number;
	priceUnit: Unit;
	priceUnitQuantity: number;
	active: boolean;
	recipeFixedSpecificCostId: number | string;
	consumptionAmount: number;
	consumptionUnit: Unit;
	type: SpecificCostType | string;
}

enum ModalCostsTab {
	GENERAL = "GENERAL",
	PERCENTAGE = "PERCENTAGE",
	SPECIFIC = "SPECIFIC",
}
@Component({
	selector: "m-modal-costs",
	templateUrl: "./modal-fixed-costs.component.html",
	styleUrls: ["./modal-fixed-costs.component.scss"],
})
export class ModalFixedCostsComponent implements OnInit {
	modalCostsTab = ModalCostsTab;
	tabSelected: ModalCostsTab = ModalCostsTab.GENERAL;
	cifrao: string;
	units: Unit[];
	totalCost: number;
	fixedCosts: FormArray;
	fixedSpecificCosts: FormArray;

	formGroup: FormGroup;
	lang: string;
	typeOfCostSelected: TypeOfCostSelected;
	recipeFixedSpecificCosts: RecipeFixedSpecificCost[]
	recipeId: number;
	totalMonthlyBilling: number;
	fixedCostPercentage: number;
	cmv: number;
	@ViewChild("selectAllFixedCostsCheckbox") selectAllFixedCostsCheckbox;
	@ViewChild("selectAllFixedSpecificCostsCheckbox") selectAllFixedSpecificCostsCheckbox;

	constructor(
		@Inject(MAT_DIALOG_DATA) private data: any,
		private _dialog: MatDialogRef<ModalFixedCostsComponent>,
		private _dialogEditModal: MatDialog,
		private translationService: TranslationService,
		private _formBuilder: FormBuilder,
		private fixedCostService: FixedCostService,
		private recipeService: RecipeService,
		private fixedSpecificCostService: FixedSpecificCostService
	) {
		this.translationService.getSelectedLanguage().subscribe((lang) => {
			this.lang = lang;
			this.cifrao = data.cifrao;
			this.units = data.units;
			this.totalCost = data.totalCost;
			this.typeOfCostSelected = data.typeOfCostSelected;
			this.totalMonthlyBilling = data.financial.totalMonthlyBilling;
			this.fixedCostPercentage = data.financial.fixedCostPercentage || 0;
			this.tabSelected = data.financial.fixedCostCalculationType || ModalCostsTab.GENERAL;
			this.cmv = data.cmv;
			this.recipeFixedSpecificCosts = data.recipeFixedSpecificCosts;

			this.recipeId = data.recipeId;

			this.formGroup = this._formBuilder.group({
				fixedCosts: this._formBuilder.array([]),
				fixedSpecificCosts: this._formBuilder.array([])
			});

			if (data.fixedCosts.length === data.recipeFixedCosts.length) {
				setTimeout(
					() => (this.selectAllFixedCostsCheckbox.nativeElement.checked = true),
					10
				);
			}

			data.fixedCosts.forEach((fixedCost) => {
				let recipeFixedCostId = null;
				const found = data.recipeFixedCosts.find(
					(recipeFixedCost) => recipeFixedCost.fixedCost.id === fixedCost.id
				);
				if (found) {
					recipeFixedCostId = found.id;
				}
				this.addFixedCost(
					fixedCost.id,
					this.getTranslatedName(fixedCost, lang),
					fixedCost.price,
					!!found,
					recipeFixedCostId
				);
			});

			data.fixedSpecificCosts.forEach((fixedSpecificCost: FixedSpecificCost) => {
				const recipeFixedSpecificCost: RecipeFixedSpecificCost = data.recipeFixedSpecificCosts.find(
					(recipeFixedSpecificCost: RecipeFixedSpecificCost) =>
						recipeFixedSpecificCost.fixedSpecificCost.id === fixedSpecificCost.id
				);
				if (recipeFixedSpecificCost) {
					this.addFixedSpecificCost({
						active: recipeFixedSpecificCost.checked,
						id: fixedSpecificCost.id,
						name: fixedSpecificCost.name,
						price: recipeFixedSpecificCost.price,
						quantity: recipeFixedSpecificCost.quantity,
						quantityUnit: recipeFixedSpecificCost.quantityUnit,
						recipeFixedSpecificCostId: recipeFixedSpecificCost.id,
						consumptionUnit: recipeFixedSpecificCost.consumptionUnit,
						consumptionAmount: recipeFixedSpecificCost.consumptionAmount,
						priceUnit: recipeFixedSpecificCost.priceUnit,
						priceUnitQuantity: recipeFixedSpecificCost.priceUnitQuantity,
						type: fixedSpecificCost.type
					})
				}
			});

		});

		_dialog.beforeClosed().subscribe(() => this.gotoBack());
	}

	ngOnInit() {
	}

	selectAllFixedSpecificCostsCheckBoxesChange() {

	}

	calcFixedSpecificCostPrice(item: FixedSpecificCostForm) {
		return calculateFixedSpecificCostPrice(item);
	}

	deleteFixedSpecificCost(id: number) {
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
				this.fixedSpecificCostService.delete(id).subscribe(() => {
					const index = this.formGroup.value.fixedSpecificCosts.findIndex(
						(fixedCost) => fixedCost.id === id
					);
					this.fixedSpecificCosts.removeAt(index);
				});
			}
		});
	}

	getUnitLabel(fixedSpecificCost: FixedSpecificCost) {
		const recipeFixedSpecificCost = this.recipeFixedSpecificCosts.find(
			(rvc) => rvc.fixedSpecificCost.id === fixedSpecificCost.id
		);
		if (recipeFixedSpecificCost) {
			const qtd = recipeFixedSpecificCost.quantity || 1;
			const abbreviation = recipeFixedSpecificCost.quantityUnit
				? recipeFixedSpecificCost.quantityUnit.abbreviation
				: '';
			return `${qtd} ${abbreviation}`;
		}
		return '';
	}


	openModalFixedCostsForm(item?) {
		const defaultCost: FixedSpecificCost = {
			type: "EQUIPMENT",
		}

		const getUnitByUuid = (uuid: string) =>
			this.units.find((u) => u.uuid === uuid)

		let recipeFixedSpecificCost: RecipeFixedSpecificCost = {
			id: null,
			priceUnitQuantity: 1,
			consumptionAmount: 0,
			consumptionUnit: getUnitByUuid('29d5a6da-9661-49a5-add0-1e7a4d57538b'), // W
			fixedSpecificCost: item ? item.value : defaultCost,
			price: 0,
			priceUnit: getUnitByUuid('1b8c294f-817c-4eef-b646-9cefd2335eaa'), // hWh
			quantity: 1,
			quantityUnit: getUnitByUuid('65d6439e-a1df-4548-bc56-046399bd075c'), // Minuto
		};

		if (item) {
			const index = this.recipeFixedSpecificCosts.findIndex(
				(rfsc) => rfsc.fixedSpecificCost.id === item.value.id
			)
			if (index) {
				const item = this.recipeFixedSpecificCosts[index]
				item.id = item.id || `temp_${Math.random().toString(36)}`
				this.recipeFixedSpecificCosts[index] = item
				recipeFixedSpecificCost = item
			}
		}

		const modalRef = this._dialogEditModal.open(ModalFixedCostsFormComponent, {
			data: {
				recipeFixedSpecificCost,
				cifrao: this.cifrao,
				units: this.units,
				lang: this.lang,
				typeOfCostSelected: this.typeOfCostSelected,
			},
		});

		modalRef.afterClosed().subscribe((data) => {
			if (data) {
				const recipeFixedSpecificCost = this.recipeFixedSpecificCosts.findIndex(
					(item) => item.id === data.id
				);

				if (recipeFixedSpecificCost !== -1) {
					this.recipeFixedSpecificCosts[recipeFixedSpecificCost] = data;
				} else {
					this.recipeFixedSpecificCosts.push(data);
				}

				const fixedSpecificCosts = this.formGroup.value.fixedSpecificCosts;
				const index = fixedSpecificCosts.findIndex(
					(fixedSpecificCost) => fixedSpecificCost.id === data.fixedSpecificCost.id
				);

				const object = {
					id: data.fixedSpecificCost.id,
					active: data.active,
					name: data.fixedSpecificCost.name,
					price: data.price,
					quantity: data.quantity,
					quantityUnit: data.quantityUnit,
					recipeFixedSpecificCostId: data.id,
					consumptionUnit: data.consumptionUnit,
					consumptionAmount: data.consumptionAmount,
					priceUnit: data.priceUnit,
					priceUnitQuantity: data.priceUnitQuantity,
					fixedSpecificCost: data,
					type: data.fixedSpecificCost.type
				}

				if (index !== -1) {
					fixedSpecificCosts[index] = object;
				} else {
					this.addFixedSpecificCost(object);
				}

				this.formGroup.patchValue({
					fixedSpecificCosts: _.sortBy(this.formGroup.value.fixedSpecificCosts, [
						function (o) {
							return o.name.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
						},
					]),
				});
			}
		});
	}

	tabChange(tab: ModalCostsTab) {
		this.tabSelected = tab;
	}

	private getTranslatedName = (cost: any, lang: string) => {
		if (lang === "pt") return cost.name;
		else if (lang === "en") return cost.nameen;
		else if (lang === "es") return cost.namees;
	};

	getTotalFixedCosts() {
		const total = this.formGroup.value.fixedCosts
			.filter((item) => item.active)
			.map((item) => item.price)
			.reduce((a, b) => a + b, 0);
		return total;
	}

	getTotalBasedOnPercentage() {
		return this.cmv * (this.fixedCostPercentage / 100) || 0
	}

	getTotalSpecific() {
		return this.formGroup.value.fixedSpecificCosts
			.filter(item => item.active)
			.map(item => this.calcFixedSpecificCostPrice(item))
			.reduce((a, b) => a + b, 0)
	}

	addFixedSpecificCost(data: FixedSpecificCostForm): void {
		this.fixedSpecificCosts = this.formGroup.get("fixedSpecificCosts") as FormArray;
		const item: FormGroup = this.createFixedSpecificCost(data);
		this.fixedSpecificCosts.push(item);
	}

	createFixedSpecificCost(data: FixedSpecificCostForm): FormGroup {
		data.recipeFixedSpecificCostId = data.recipeFixedSpecificCostId || `temp_${Math.random().toString(36)}`
		return this._formBuilder.group({
			id: [data.id, []],
			name: [data.name, []],
			quantity: [data.quantity, []],
			quantityUnit: [data.quantityUnit, []],
			price: [data.price, []],
			priceUnit: [data.priceUnit, []],
			priceUnitQuantity: [data.priceUnitQuantity, []],
			consumptionAmount: [data.consumptionAmount, []],
			consumptionUnit: [data.consumptionUnit, []],
			active: [data.active, []],
			recipeFixedSpecificCostId: [data.recipeFixedSpecificCostId, []],
			type: [data.type, []]
		});
	}

	addFixedCost(id, name, price, active, recipeFixedCostId): void {
		this.fixedCosts = this.formGroup.get("fixedCosts") as FormArray;
		const item: FormGroup = this.createFixedCost(
			id,
			name,
			price,
			active,
			recipeFixedCostId
		);
		this.fixedCosts.push(item);
	}

	createFixedCost(
		id: number,
		name: string,
		price: number,
		active: boolean,
		recipeFixedCostId: number
	): FormGroup {
		return this._formBuilder.group({
			id: [id, []],
			name: [name, []],
			price: [price, []],
			active: [active, []],
			recipeFixedCostId: [recipeFixedCostId, []],
		});
	}

	async onTotalMonthlyBillingFocusOut() {
		const { data } = await this.recipeService.getById(this.recipeId).toPromise();

		if (data.financial.totalMonthlyBilling !== this.totalMonthlyBilling) {
			const op: SweetAlertOptions = {
				title: "",
				text: "Deseja alterar o faturamento total em todas as receitas?",
				type: "warning",
				showCancelButton: true,
				confirmButtonColor: "#f4516c",
				cancelButtonColor: "#d2d2d2",
				confirmButtonText: "Sim",
				cancelButtonText: "Não",
			};
			swal(op).then(async (result) => {
				if (result.value) {
					await this.recipeService
						.updateTotalMonthlyBillingFromAllUserRecipes(
							this.totalMonthlyBilling
						)
						.toPromise();
				}
			});
		}
	}

	gotoBack() {
		const recipeFixedSpecificCosts = this.formGroup.value.fixedSpecificCosts.map(item => ({
			id: item.recipeFixedSpecificCostId,
			fixedSpecificCost: {
				id: item.id,
				type: item.type
			},
			consumptionAmount: item.consumptionAmount,
			consumptionUnit: item.consumptionUnit,
			price: item.price,
			priceUnit: item.priceUnit,
			priceUnitQuantity: item.priceUnitQuantity,
			quantity: item.quantity,
			quantityUnit: item.quantityUnit,
			checked: item.active
		}))

		this._dialog.close({
			items: this.formGroup.value.fixedCosts,
			recipeFixedSpecificCosts: recipeFixedSpecificCosts,
			totalMonthlyBilling: this.totalMonthlyBilling,
			fixedCostPercentage: this.fixedCostPercentage,
			selectedTab: this.tabSelected
		});
	}

	selectAllFixedCostsCheckBoxesChange() {
		if (this.selectAllFixedCostsCheckbox.nativeElement.checked) {
			this.fixedCosts.controls.forEach((fixedCost) => {
				fixedCost.patchValue({
					active: true,
				});
			});
		} else {
			this.fixedCosts.controls.forEach((fixedCost) => {
				fixedCost.patchValue({
					active: false,
				});
			});
		}
	}

	openModalFixedCosts(index: number) {
		document.getElementById(`fixedcost${index}`).click();
	}

	openModalFixedSpecificCosts(index: number) {
		document.getElementById(`fixedspecificcost${index}`).click();
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
				this.fixedCostService.delete(item as number).subscribe(() => {
					const index = this.formGroup.value.fixedCosts.findIndex(
						(fixedCost) => fixedCost.id === item
					);
					this.fixedCosts.removeAt(index);
				});
			}
		});
	}

	updatePrice(item, index) {
		const found = this.fixedCosts.controls[index];
		if (found.value.price) {
			found.patchValue({
				active: true,
			});
		}
		this.fixedCostService
			.patch(item.id, {
				price: item.price,
			})
			.toPromise();
	}

	openEditModalToFixedCost(item?) {
		const modalRef = this._dialogEditModal.open(ModalCostsEditComponent, {
			data: {
				item,
				cifrao: this.cifrao,
				type: "FIXED_COSTS",
				lang: this.lang,
			},
		});

		modalRef.afterClosed().subscribe((data) => {
			if (data) {
				if (data.shouldUpdate) {
					this.fixedCostService.patch(data.id, data).toPromise();
				}
				const fixedCosts = this.formGroup.value.fixedCosts;
				const found = fixedCosts.find((fc) => fc.id === data.id);
				if (found) {
					const index = fixedCosts.findIndex((fc) => fc.id === data.id);
					fixedCosts[index] = data;
				} else {
					this.addFixedCost(data.id, data.name, data.price, false, null);
				}

				this.formGroup.patchValue({
					fixedCosts: _.sortBy(this.formGroup.value.fixedCosts, [
						function (o) {
							return o.name.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
						},
					]),
				});
			}
		});
	}

	getFixedCostsPercentage() {
		const totalMonthlyBilling = this.totalMonthlyBilling;
		const fixedCosts = this.getTotalFixedCosts();
		if (!totalMonthlyBilling || !fixedCosts) return 0;
		return (fixedCosts * 100) / totalMonthlyBilling;
	}
}
