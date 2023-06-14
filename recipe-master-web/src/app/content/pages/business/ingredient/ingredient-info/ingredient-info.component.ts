import { Component, OnInit, Inject, Input, ChangeDetectorRef, AfterViewInit, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog, MatTabChangeEvent, MatDialogConfig } from '@angular/material';
import { RecipeIngredient } from '../../../../../core/models/business/recipeingredient';
import { UnitService } from '../../../../../core/services/business/unit.service';
import { ApiResponse } from '../../../../../core/models/api-response';
import { Unit, UnitType } from '../../../../../core/models/business/unit';
import { CpBaseComponent } from '../../../common/cp-base/cp-base.component';
import { CpLoadingService } from '../../../../../core/services/common/cp-loading.service';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import * as _ from 'lodash';
import { ToastrService } from 'ngx-toastr';
import { unityValidator } from '../../../../../validators/unity.validator';
import { TranslateService } from '@ngx-translate/core';
import { NutritionInfo, ForbiddenItems } from '../../../../../core/models/business/nutritioninfo';
import { NutritionInfoService, NutritionInfoFactory } from '../../../../../core/services/business/nutritioninfo.service';
import { NutritionInfoFilter, NutritionInfoOrigin } from '../../../../../core/models/business/dto/nutritioninfo-filter';
import { NutritionInfoUnityValidator } from '../../../../../validators/nutrition-info-unit.validator';
import swal from 'sweetalert2';
import { NutritioninfoAddModalComponent } from '../../../components/nutritioninfo/nutritioninfo-add-modal/nutritioninfo-add-modal.component';
import { User } from '../../../../../core/models/user';
import { UserDTO } from '../../../../../core/models/security/dto/user-dto';
import { UserService } from '../../../../../core/auth/user.service';
import { CpLocalStorageService } from '../../../../../core/services/common/cp-localstorage.service';
import { NutritioninfoCustomComponent } from '../../../components/nutritioninfo/nutritioninfo-custom/nutritioninfo-custom.component';
import { RecipeService } from '../../../../../core/services/business/recipe.service';
import { Recipe } from '../../../../../core/models/business/recipe';
import { ShareModalComponent } from '../../../components/share-modal/share-modal.component';
import { IngredientInfoFactorComponent } from '../ingredient-info-factor/ingredient-info-factor.component';
import { IngredientInfoHistoryComponent } from '../ingredient-info-history/ingredient-info-history.component';
import { IngredientInfoUnitComponent } from '../ingredient-info-unit/ingredient-info-unit.component';
import { TranslationService } from '../../../../../core/metronic/services/translation.service';
import { IngredientCategory } from '../../../../../core/models/business/ingredientcategory';
import { Router } from '@angular/router';
import { isNil, split, transform } from 'lodash';
import { NutritionalInfoPipe } from '../../../../../pipes/nutritional-info.pipe';
import { IngredientService } from '../../../../../core/services/business/ingredient.service';
import { RecipeItem } from '../../../../../core/models/business/recipeitem';
import { CommonCalcService } from '../../../../../core/services/business/common-calc.service';
import { connectableObservableDescriptor } from 'rxjs/internal/observable/ConnectableObservable';
import { DialogRecipeIngredientWeightComponent } from '../../../tutorials/recipe/dialog-recipe-ingredient-weight/dialog-recipe-ingredient-weight.component';
import { DialogRecipeUseAmountComponent } from '../../../tutorials/recipe/dialog-recipe-use-amount/dialog-recipe-use-amount.component';
import { DialogRecipeBuyPricingComponent } from '../../../tutorials/recipe/dialog-recipe-buy-pricing/dialog-recipe-buy-pricing.component';
import { DialogRecipeNutritionalInstructionComponent } from '../../../tutorials/recipe/dialog-recipe-nutritional-instruction/dialog-recipe-nutritional-instruction.component';
import { ComponentType } from '@angular/cdk/portal';

@Component({
	selector: 'm-ingredient-info',
	templateUrl: './ingredient-info.component.html',
	styleUrls: ['./ingredient-info.component.scss'],
	encapsulation: ViewEncapsulation.None
})
export class IngredientInfoComponent extends CpBaseComponent implements OnInit {

	user: UserDTO;
	private _currentUser: User;
	units: Unit[] = [];
	recipeIngredient: RecipeIngredient;
	formGroup: FormGroup;
	type: string;
	titleModal: String;
	cifrao: String;
	@Input() category: IngredientCategory;
	origin: NutritionInfoOrigin;
	nutritioninfos: NutritionInfo[] = [];
	nutritionalInfos: NutritionInfo[];
	nutritionInfoAddRef: MatDialogRef<NutritioninfoAddModalComponent>;
	customNutritionInfoAddRef: MatDialogRef<NutritioninfoCustomComponent>;
	itemSelected: NutritionInfo;
	lastNutritionInfo: NutritionInfo;
	tabSelectedIndex: number;
	lang: string;
	tables: NutritionInfoOrigin[] = [
		NutritionInfoOrigin.TACO,
		NutritionInfoOrigin.IBGE,
		NutritionInfoOrigin.USDA
	];
	recipeAsRecipeIngredient: Recipe = null;

	constructor(
		private nutritionService: NutritionInfoService,
		@Inject(MAT_DIALOG_DATA) private data: any, _loading: CpLoadingService,
		public _cdr: ChangeDetectorRef,
		private _dialogRef: MatDialogRef<IngredientInfoComponent>,
		private _dialog: MatDialog,
		private _formBuilder: FormBuilder,
		private _unitService: UnitService,
		private _userService: UserService,
		private _cpLocalStorageService: CpLocalStorageService,
		private _toast: ToastrService,
		private translate: TranslateService,
		private _dialogIngredientInfo: MatDialog,
		private recipeService: RecipeService,
		private translationService: TranslationService,
		private nutritionInfoService: NutritionInfoService,
		private router: Router,
		private nutriInfoPipe: NutritionalInfoPipe,
		private ingredientService: IngredientService,
		private calc: CommonCalcService,
	) {
		super(_loading, _cdr);
		this.recipeIngredient = data.recipeIngredient;

		this.translationService.getSelectedLanguage().subscribe(lang => {
			this.lang = lang;
		});

		try {
			this.type = data.type;
		} catch (e) {
			console.log(e);
		}

		this.fillUser();
	}

	async ngOnInit() {
		this.origin = NutritionInfoOrigin.TACO;
		if (this.recipeIngredient.nutritionInfo && this.recipeIngredient.nutritionInfo.origin) {
			this.origin = this.tables.find(table => table === this.recipeIngredient.nutritionInfo.origin);
		}

		this.fetchUnits();
		this.buildForm();
		this.translate.get('MODAL.DELETE_INGREDIENTE_TITLE').subscribe(
			data => {
				this.titleModal = data;
			}
		);

		this.fetchNutritionInfo();
		this.fetchCategory();

		if (this.recipeIngredient.ingredient.recipeCopiedId) {
			const { data } = await this.recipeService.getById(this.recipeIngredient.ingredient.recipeCopiedId).toPromise();
			this.recipeAsRecipeIngredient = data;
			if (!this.recipeAsRecipeIngredient.recipeWeight) {
				this.units = this.units.filter(u => u.id !== 1 && u.id !== 2)
			}
		}
	}

	fillUser() {
		this._currentUser = this._cpLocalStorageService.getLoggedUser();
		if (this._currentUser) {
			this._userService.findByIdReduced(this._currentUser.id).subscribe((res) => {
				this.user = res.data;
				this.cifrao = this.user.currency;
			}, err => {
			});
		}
	}

	get screenWidth() {
		return +window.innerWidth
	}

	onSelectedTabChange(ev: MatTabChangeEvent) {
		this.origin = this.tables[ev.index];

		this.fetchNutritionInfo();
	}

	fetchCategory(){
		this.category = this.recipeIngredient.ingredient.ingredientCategory;
		if (!_.isNil(this.category)) {
			switch(this.category.id){
				case 100:
				this.category.name = "INGREDIENT.CATEGORIA.TXT1";
				break;

				case 101:
				this.category.name = "INGREDIENT.CATEGORIA.TXT2";
				break;

				case 102:
				this.category.name = "INGREDIENT.CATEGORIA.TXT3";
				break;

				case 103:
				this.category.name = "INGREDIENT.CATEGORIA.TXT4";
				break;

				case 104:
				this.category.name = "INGREDIENT.CATEGORIA.TXT5";
				break;

				case 105:
				this.category.name = "INGREDIENT.CATEGORIA.TXT6";
				break;

				case 106:
				this.category.name = "INGREDIENT.CATEGORIA.TXT7";
				break;

				case 107:
				this.category.name = "INGREDIENT.CATEGORIA.TXT8";
				break;


				case 108:
				this.category.name = "INGREDIENT.CATEGORIA.TXT19";
				break;

				case 109:
				this.category.name = "INGREDIENT.CATEGORIA.TXT10";
				break;

				case 110:
				this.category.name = "INGREDIENT.CATEGORIA.TXT11";
				break;

				case 111:
				this.category.name = "INGREDIENT.CATEGORIA.TXT12";
				break;

				case 112:
				this.category.name = "INGREDIENT.CATEGORIA.TXT13";
				break;

				case 113:
				this.category.name = "INGREDIENT.CATEGORIA.TXT14";
				break;

				case 114:
				this.category.name = "INGREDIENT.CATEGORIA.TXT15";
				break;

				case 115:
				this.category.name = "INGREDIENT.CATEGORIA.TXT16";
				break;

				case 116:
				this.category.name = "INGREDIENT.CATEGORIA.TXT17";
				break;

				case 117:
				this.category.name = "INGREDIENT.CATEGORIA.TXT18";
				break;

				case 118:
				this.category.name = "INGREDIENT.CATEGORIA.TXT20";
				break;

				case 119:
				this.category.name = "INGREDIENT.CATEGORIA.TXT22";
				break;

				default:
				this.category.name = "INGREDIENT.CATEGORIA.TXT21";
				break;
			}
		}
	}

	cancel() {
		this._dialogRef.close({
			recipeIngredient: null,
			exclude: null
		});
	}

	doDismiss(event) {
		//console.log('não remover ingrediente da receita');
	}

	doRecipe(recipeId: number) {

		this._dialogRef.close({
			recipeIngredient: this.recipeIngredient,
			exclude: false,
			viewRecipe: true
		});

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

		if (this.type != 'menu') {

			if (!this.formGroup.value.correctionFactor.grossWeight) {
				this.formGroup.patchValue({
					correctionFactor: {
						grossWeight: 0
					}
				});
			}

			if (!this.formGroup.value.correctionFactor.netWeight) {
				this.formGroup.patchValue({
					correctionFactor: {
						netWeight: 0
					}
				});
			}

		}

		if (!this.formGroup.valid && this.formGroup.errors) {
			try {

				if (this.formGroup.errors.uncompatibleNutritionInfoUnit == true) {
					swal('Atenção!', 'Para utilizar a Informação Nutricional, a medida em uso deve ser em quilos ou gramas', 'warning');
				} else {
					this._toast.warning('Formulário com algum erro! Revise as informações.');
				}

			} catch (e) {
				console.log(e.message);
			}

			return;

		}

		// talvez salvar aqui, mas pode-se salvar tudo ao salvar a receita.
		//console.log('IngredientInfoComponent.save()', this.recipeIngredient, this.formGroup.value);

		const amount = Number(String(this.formGroup.value.amount).replace(',', '.'));

		if (isNaN(amount)) {
			const splitted = split(String(this.formGroup.value.amount), '/');
			const decimalResult = Number(splitted[0]) / Number(splitted[1]);
			this.recipeIngredient.amount = decimalResult;
			this.recipeIngredient.fraction = String(this.formGroup.value.amount);
		} else {
			this.recipeIngredient.amount = amount;
			this.recipeIngredient.fraction = null;
		}

		this.recipeIngredient.unit = this.formGroup.value.unit;
		this.recipeIngredient.ingredient.purchasePrice = this.formGroup.value.purchasePrice;

		this.recipeIngredient.nutritionInfo = this.formGroup.value.nutritionInfo;

		if (this.type != 'menu') {
			this.recipeIngredient.correctionFactor = this.formGroup.value.correctionFactor;
			this.recipeIngredient.ingredient.lastGrossWeight = this.recipeIngredient.correctionFactor.grossWeight;
			this.recipeIngredient.ingredient.lastNetWeight = this.recipeIngredient.correctionFactor.netWeight;
		}

		// Atualizando último valor em uso...
		this.recipeIngredient.ingredient.lastUnit = this.recipeIngredient.unit;
		this.recipeIngredient.ingredient.lastAmount = this.recipeIngredient.amount;

		// this._dialog.close(this.formGroup.value);

		this._dialogRef.close({
			recipeIngredient: this.recipeIngredient,
			exclude: false
		});

	}

	private buildForm() {
		this.tabSelectedIndex = this.tables.findIndex(
			t => this.recipeIngredient.nutritionInfo && t === this.recipeIngredient.nutritionInfo.origin);
		const purchaseprice = this.recipeIngredient.ingredient.purchasePrice;

		if (this.type == 'menu') {

			this.formGroup = this._formBuilder.group({
				amount: [this.recipeIngredient.amount, [Validators.required]],
				unit: [this.recipeIngredient.unit],
				recipeIngredientName: [this.recipeIngredient.ingredient.name],
				recipeIngredient: [this.recipeIngredient],
				purchasePrice: this._formBuilder.group({
					price: [purchaseprice && purchaseprice.price ? purchaseprice.price : 0, [Validators.required]],
					unityQuantity: [purchaseprice && purchaseprice.unityQuantity ? purchaseprice.unityQuantity : 0, [Validators.required]],
					unit: [purchaseprice && purchaseprice.unit ? purchaseprice.unit : null]
				})
			}, { validator: [unityValidator] });

		} else {

			const correctionFactor = this.recipeIngredient.correctionFactor;

			let amount: number|string = this.recipeIngredient.amount;

			if (!isNil(this.recipeIngredient.fraction)) {
				amount = this.recipeIngredient.fraction;
			}

			this.formGroup = this._formBuilder.group({
				amount: [amount, [Validators.required]],
				fraction: [this.recipeIngredient.fraction],
				unit: [this.recipeIngredient.unit],
				nutritionInfo: [this.recipeIngredient.nutritionInfo, []],
				recipeIngredientName: [this.recipeIngredient.ingredient.name],
				recipeIngredient: [this.recipeIngredient],
				purchasePrice: this._formBuilder.group({
					price: [purchaseprice && purchaseprice.price ? purchaseprice.price : 0, [Validators.required]],
					unityQuantity: [purchaseprice && purchaseprice.unityQuantity ? purchaseprice.unityQuantity : 0, [Validators.required]],
					unit: [purchaseprice && purchaseprice.unit ? purchaseprice.unit : null]
				}),
				correctionFactor: this._formBuilder.group({
					grossWeight: [correctionFactor && correctionFactor.grossWeight ? correctionFactor.grossWeight : null, [Validators.required]],
					netWeight: [correctionFactor && correctionFactor.netWeight ? correctionFactor.netWeight : null, [Validators.required]],
				}),
			}, { validator: [unityValidator, NutritionInfoUnityValidator] });

			this.formGroup.controls.unit.valueChanges.subscribe((change) => {
				this.updatePurchasePriceBasedOnRecipeIngredient();
			})
		}
	}

	private updatePurchasePriceBasedOnRecipeIngredient() {
		if (this.recipeAsRecipeIngredient) {
			const totalIngredientes = this.calc.totalRecipeIngredients(this.recipeAsRecipeIngredient.ingredients);
			const totalOtherCosts = this.getItensTotalCost(this.recipeAsRecipeIngredient.itens);
			const totalCost = totalIngredientes + totalOtherCosts;
			const selectedUnit = this.formGroup.value.unit.id;
			let price = totalCost;

			let weight = this.recipeAsRecipeIngredient.recipeWeight;
			const recipeRegisteredInKg = this.recipeAsRecipeIngredient.recipeWeightUnit.id === 2;
			const recipeRegisteredInGrams = this.recipeAsRecipeIngredient.recipeWeightUnit.id === 1;

			if (selectedUnit === 1 || selectedUnit === 2) {
				if (recipeRegisteredInGrams && selectedUnit === 2) {
					weight /= 1000;
				} else if (recipeRegisteredInKg && selectedUnit === 1) {
					weight *= 1000;
				}
				price = (totalCost / weight);
			} else {
				price = (totalCost / this.recipeAsRecipeIngredient.unityQuantity);
			}
			this.formGroup.patchValue({
				purchasePrice: {
					unit: this.formGroup.value.unit,
					price
				}
			})
		}
	}

	private getItensTotalCost(itens: RecipeItem[]): number {
		if (itens && itens.length > 0) {
			return _.reduce(itens, (sum: number, item: RecipeItem) => {
				const valor: number = this.calc.calcRecipeItemPrice(item);
				return sum + valor;
			}, 0);
		}
		return 0;
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

				_.forEach(this.units, (u: Unit) => {
					if (u.name.toLowerCase() === 'xícara') {
						u.name = 'INGREDIENT.UNIDADE.TXT8';
					} else if (u.name.toLowerCase() === 'colher de chá') {
						u.name = 'INGREDIENT.UNIDADE.TXT9';
					} else if (u.name.toLowerCase() === 'colher de sopa') {
						u.name = 'INGREDIENT.UNIDADE.TXT10';
					}
				})

				this.fetchUnitsAbbreviated();
			},
			(apiResponse: ApiResponse) => {
			}
		);
	}

	private fetchUnitsAbbreviated() {
		this._unitService.getAbbreviated().subscribe(
			(apiResponse: ApiResponse) => {
				this.units.forEach((x, i) => x.abbreviation = apiResponse.data[i].name);
			},
			(apiResponse: ApiResponse) => {
			}
		);
	}

	doClickToggle() {
		this.onChange();
	}

	isNutritionInfo(ni: any): ni is NutritionInfo {

		if (ni == null) {
			return false;
		}

		return (ni.origin) != undefined;

	}

	openRecipeInNewTab() {
		const url = this.router.serializeUrl(
			this.router.createUrlTree([`/receita/${this.recipeIngredient.ingredient.recipeCopiedId}`])
		);

		window.open(url, '_blank');
	}

	get getCorrectionFactorAverage() {

		let auxFatorCorrecao: string;

		this.translate.get('INGREDIENT.INGREDIENT_TXT9').subscribe(data => auxFatorCorrecao = data);

		const { grossWeight, netWeight } = this.formGroup.value.correctionFactor;
		const result = (grossWeight / netWeight);

		if (isNaN(result)) {
			return 0;
		}

		return auxFatorCorrecao + ': ' + result.toFixed(2);
	}

	onChange() {
		let selected: NutritionInfo | number | null = this.formGroup.value.nutritionInfo;
		if (_.isNil(selected)) {
			this.lastNutritionInfo = selected;
			return;
		}

		if (this.isNutritionInfo(selected)) {
			this.lastNutritionInfo = selected;
			return;
		}
		switch (+selected) {
			case -1: //criar
				this.openAddNutritionInfoModal();
				break;
			case -2: //editar
				this.openCustomNutritionInfoModal();
				break;
		}

	}

	private async fetchNutritionInfo() {
		if (this.lang === 'en' || this.lang === 'es') {
			this.origin = NutritionInfoOrigin.USDA;
		}
		const filter: NutritionInfoFilter = {
			description: this.recipeIngredient.ingredient.name,
			origin: this.origin,
			currentPage: 1,
			itensPerPage: 1000,
			lang: this.lang
		};

		this.nutritionService.getByFilter(filter).subscribe((response: ApiResponse) => {

			const _nutritioninfos: NutritionInfo[] = _.filter(response.data, (ni:NutritionInfo) => {
				if (!ni.enDescription) return true;
				return !ForbiddenItems.some(item => ni.enDescription.toLowerCase().includes(item))
			});

			const infoWithIngredient: NutritionInfo[] = _.filter(_nutritioninfos, (ni: NutritionInfo) => {
				return !_.isNil(ni.recipe);
			});

			if (infoWithIngredient.length == 0 && this.recipeIngredient.ingredient.recipeCopiedId) {

				const ni: NutritionInfo = NutritionInfoFactory.create(this.recipeIngredient, this.recipeIngredient.ingredient.user);

				this.loadRecipeIngredientNutriInfo(ni);

				_nutritioninfos.push(ni);

			} else {

				_.each(infoWithIngredient, (ni: NutritionInfo) => {
					this.loadRecipeIngredientNutriInfo(ni);
				});

			}

			this.nutritioninfos = _.orderBy(_nutritioninfos, ['user', 'id']);
		}, (err: any) => console.log(err));

		this.lastNutritionInfo = this.itemSelected = this.recipeIngredient.nutritionInfo;

	}

	compareByID(itemOne, itemTwo) {
		return itemOne && itemTwo && itemOne.id === itemTwo.id;
	}

	private loadRecipeIngredientNutriInfo(ni: NutritionInfo) {
		if (this.recipeIngredient.ingredient.recipeCopiedId) {
			const recipeId: number = this.recipeIngredient.ingredient.recipeCopiedId;

			this.recipeService.getById(recipeId).subscribe((response: ApiResponse) => {

				const recipe: Recipe = response.data;

				ni.recipe = recipe;

				ni = NutritionInfoFactory.reset(ni);

				NutritionInfoFactory.calculate(this.nutriInfoPipe, recipe, ni)

			}, err => console.warn(err));
		}
	}

	private openCustomNutritionInfoModal() {

		this.customNutritionInfoAddRef = this._dialogIngredientInfo.open(NutritioninfoCustomComponent, {
			panelClass: 'custom-modalbox',
			data: {
				ingredient: this.recipeIngredient.ingredient,
				items: this.nutritioninfos,
				selectedItem: this.itemSelected
			}
		});

		this.customNutritionInfoAddRef.afterClosed().subscribe((response: any) => {

			try {

				if (!response) {

					this.formGroup.patchValue({
						nutritionInfo: this.lastNutritionInfo
					});

					return;

				}

				this.formGroup.patchValue({
					nutritionInfo: response.item
				});

			} catch (e) {
				console.warn(e.message);
			}

			try {

				if (!_.isNil(response.items)) {
					this.nutritioninfos = response.items;
				}

			} catch (e) {
				console.warn(e.message);
			}

		});

	}

	private openAddNutritionInfoModal() {

		this.nutritionInfoAddRef = this._dialogIngredientInfo.open(NutritioninfoAddModalComponent, {
			data: {
				ingredient: this.recipeIngredient.ingredient
			},
			panelClass: 'custom-modalbox'
		});

		this.nutritionInfoAddRef.afterClosed().subscribe((response: any) => {

			if (!response) {

				this.formGroup.patchValue({
					nutritionInfo: this.lastNutritionInfo
				});

				return;
			}

			if (response.event == 'create') {

				this.nutritioninfos.push(response.item);

				this.nutritioninfos = _.orderBy(this.nutritioninfos, ['user', 'id']);

				this.formGroup.patchValue({
					nutritionInfo: response.item
				});

			} else if (response.event == 'cancel') {
				console.log('cancelou...');
			}

		});

	}

	doAddNutritionInfo(ev: any) {

		switch (Number.parseInt(this.formGroup.value.nutritionInfo)) {
			case -2:
				this.openCustomNutritionInfoModal();
				break;
			case -1:
				this.openAddNutritionInfoModal();
				break;
			default:
				this.itemSelected = this.formGroup.value.nutritionInfo;
				this.lastNutritionInfo = this.formGroup.value.nutritionInfo != null ? Object.assign({}, this.formGroup.value.nutritionInfo) : null;


				if (!_.isNil(this.itemSelected) && _.isNil(this.itemSelected.id)) {

					this.nutritionInfoService.insert(this.itemSelected).subscribe((response: ApiResponse) => {
						// this.toaster.success("Informação Nutricional atualizada com sucesso!");

						// this.onSave.emit(ni);
						this.itemSelected.id = response.data.id;

					}, (err) => {
						console.warn(err);
						// this.toaster.error("Não foi possível atualizar o regsitro.");
					});

				}

		}

	}

	saibaMais() {
		window.open('https://www.google.com.br', '_blank');
	}

	async openDialogFactor() {
		const correctionFactor = this.formGroup.value.correctionFactor;
		let maxGrossWeight = this.recipeIngredient.ingredient.maxGrossWeight;
		let minGrossWeight = this.recipeIngredient.ingredient.minGrossWeight;

		if (this.recipeIngredient.ingredient.ingredientCopiedId && (!maxGrossWeight || !minGrossWeight)) {
			const response = await this.ingredientService
				.getById(this.recipeIngredient.ingredient.ingredientCopiedId).toPromise()
			maxGrossWeight = response.data.maxGrossWeight
			minGrossWeight = response.data.minGrossWeight
		}

		const dialog = this._dialog.open(IngredientInfoFactorComponent, {
			data: {
				correctionFactor,
				maxGrossWeight,
				minGrossWeight,
			},
			panelClass: 'cpPanelOverflow'
		});

		dialog.afterClosed().subscribe(response => {
			if (response) {
				const { grossWeight, netWeight } = response;
				this.formGroup.controls.correctionFactor.patchValue({ grossWeight, netWeight });
			}
		});
	}

	openDialogHistory() {
		this._dialog.open(IngredientInfoHistoryComponent, {
			data: {
				ingredient: this.recipeIngredient.ingredient
			},
			panelClass: 'custom-modalbox'
		});
	}

	openDialogUnit() {
		const purchasePrice = this.formGroup.value.purchasePrice;
		const dialog = this._dialog.open(IngredientInfoUnitComponent, {
			data: {
				...purchasePrice,
				recipeIngredient: this.recipeIngredient,
				unitType: UnitType.PURCHASE_LIST
			},
			panelClass: 'cpPanelOverflow'
		});

		dialog.afterClosed().subscribe(response => {
			if (response) {
				const { unit, unityQuantity, description } = response;
				this.formGroup.controls.purchasePrice.patchValue({ unit, unityQuantity, description });
			}
		});
	}

	openRecipeIngredientDialog(): void {
		this.openDialog(DialogRecipeIngredientWeightComponent);
	}

	openRecipeUseAmountDialog(): void {
		this.openDialog(DialogRecipeUseAmountComponent);
	}

	openRecipeBuyPricingDialog(): void {
		this.openDialog(DialogRecipeBuyPricingComponent);
	}

	openRecipeNutritionalDialog(): void {
		this.openDialog(DialogRecipeNutritionalInstructionComponent);
	}

	openDialog<T>(component: ComponentType<T>): void {

		const dialogConfig: MatDialogConfig = {
			maxWidth: '90vw',
			width: '587px',
			maxHeight: '95vh',
			hasBackdrop: true,
			closeOnNavigation: true,
			panelClass: 'tutorial-dialog-container'
		};

		this._dialogIngredientInfo.open(component, dialogConfig);
	}
}
