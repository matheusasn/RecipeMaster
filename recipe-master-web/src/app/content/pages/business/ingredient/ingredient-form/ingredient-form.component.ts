import { Router, ActivatedRoute } from '@angular/router';
import { UnitService } from './../../../../../core/services/business/unit.service';
import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Ingredient } from '../../../../../core/models/business/ingredient';
import { CpBaseComponent } from '../../../common/cp-base/cp-base.component';
import { Unit, UnitType } from '../../../../../core/models/business/unit';
import { IngredientCategory } from '../../../../../core/models/business/ingredientcategory';
import { IngredientService } from '../../../../../core/services/business/ingredient.service';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, Validators } from '@angular/forms';
import { Recipe } from '../../../../../core/models/business/recipe';
import { CpLoadingService } from '../../../../../core/services/common/cp-loading.service';
import { CpLocalStorageService } from '../../../../../core/services/common/cp-localstorage.service';
import { CpRoutes } from '../../../../../core/constants/cp-routes';
import { Messages } from '../../../../../core/constants/messages';
import { RecipeService } from '../../../../../core/services/business/recipe.service';
import { TranslateService } from '@ngx-translate/core';
import * as _ from 'lodash';
import { TranslationService } from '../../../../../core/metronic/services/translation.service';
import { DeviceDetectorService } from 'ngx-device-detector';

@Component({
	selector: 'm-ingredient-form',
	templateUrl: './ingredient-form.component.html',
	styleUrls: ['./ingredient-form.component.scss']
})
export class IngredientFormComponent extends CpBaseComponent implements OnInit, OnDestroy {

	ingredient: Ingredient;
	unitOptions:any;
	linguagem: string;
	recipe: Recipe;
	currency: string;

	units: Unit[] = [];
	purchaseUnits: Unit[] = [];
	categories: IngredientCategory[] = [];
	isEditing: boolean = false;
	lang: string;

	private paramsSub: any;

	private existingIngredientErrorMessage: string;

	constructor(
		_cdr: ChangeDetectorRef,
		_loading: CpLoadingService,
		private translate: TranslateService,
		private _service: IngredientService,
		private _recipeService: RecipeService,
		private _unitService: UnitService,
		private _toast: ToastrService,
		private _formBuilder: FormBuilder,
		private _router: Router,
		private _localStorage: CpLocalStorageService,
		private _route: ActivatedRoute,
		private _translationService: TranslationService,
		private deviceDetectorService: DeviceDetectorService
	) {
		super(_loading, _cdr);
	}

	ngOnInit() {
		this.translate.get('TRANSLATOR.LINGUAGEM').subscribe(
			data => {
				this.linguagem = data;
			}
		);

		this.translate.get('INGREDIENT.EXISTING_INGREDIENT').subscribe(
			data => {
				this.existingIngredientErrorMessage = data;
			}
		);

		const { currency } = this._localStorage.getLoggedUser();
		this.currency = currency;

		this.formGroup = this._formBuilder.group({
			name: [null, [
				Validators.required
			]],
			ingredientCategory: [null, [
				Validators.required
			]],
			purchasePrice: this._formBuilder.group({
				price: [null, [Validators.required]],
				unityQuantity: [null, [Validators.required]],
				unit: [null, [Validators.required]]
			}),
			unit: [null, [
				Validators.required
			]],
			description: [null, []]
		});

		this.fetchCategories();

		this.paramsSub = this._route.params.subscribe(params => {

			let id = +params['id'];

			if(!isNaN(id) && !_.isNil(id)) {
				this.isEditing = true;

				this._loading.show();

				this.unitOptions = {exclude: [6,7], canUpdate: true, canCreate: true};

				this._service.getById(id).subscribe( apiResponse => {

					let ingredient = apiResponse.data;

					switch(this.linguagem) {
						case "en":
							if(ingredient.nameen != null){
								ingredient.name = ingredient.nameen;
							}
							break;
						case "es":
							if(ingredient.namees != null){
								ingredient.name = ingredient.namees;
							}
							break;
						/*Inserir próxima case aqui quando tiver mais linguagem*/
					}

					if(ingredient.recipeCopiedId != null) {
						this._recipeService.getById(ingredient.recipeCopiedId).subscribe(
							apiResponse => {

								let recipe = apiResponse.data;

								this.buildFormIngr(ingredient, recipe);
								this._loading.hide();

							}
						)
					}
					else {

						this.buildFormIngr(ingredient);
						this._loading.hide();

					}

					this.fetchUnits();

				}, error => { this._loading.hide(); } );

			}
			else {

				this.unitOptions = {basic: true, exclude: [6,7], canUpdate: true, canCreate: true};

				this.buildFormIngr();

				this.fetchUnits();

			}
		});

	  this._translationService.getSelectedLanguage().subscribe(lang => {
			this.lang = lang;
		});
	}

	fillForm(): any {
		let purchPrice = this.ingredient.purchasePrice
		this.formGroup.patchValue({
			name: this.ingredient.name,
			ingredientCategory: this.ingredient.ingredientCategory,
			unit: this.ingredient.unit,
			description: this.ingredient.description,
		});
		if (purchPrice) {
			this.formGroup.patchValue({
				purchasePrice: {
					price: purchPrice.price ? purchPrice.price : 0,
					unityQuantity: purchPrice.unityQuantity ? purchPrice.unityQuantity : 0,
					unit: purchPrice.unit
				}
			});
		}
	}

	ngOnDestroy(): void {
		this.paramsSub.unsubscribe();
	}

	checkiOSSave() {
		if (this.deviceDetectorService.os === 'iOS') {
			this.save();
		}
	}

	checkiOSCancel() {
		if (this.deviceDetectorService.os === 'iOS') {
			this.cancel();
		}
	}

	save() {
		if (this.validate()) {
			this._loading.show();
			this.formGroup.value.user = this._localStorage.getLoggedUser();
			this.formGroup.value.nameen = this.formGroup.value.name;
			this.formGroup.value.namees = this.formGroup.value.name;

			this._service.getByUserIdioma(this._localStorage.getLoggedUser().id, this.lang, {
				currentPage: 1,
				name: this.formGroup.value.name.trim()
			}).subscribe(response => {
				if (response.data && response.data.length > 0) {
					const found = response.data.filter(item => item.name.toLowerCase() === this.formGroup.value.name.toLowerCase())
					const isEditing = this.ingredient && this.ingredient.id
					if (isEditing) {
						const filter = response.data.filter(item => item.id === this.ingredient.id)
						if (filter.length === 0) {
							this._toast.error(this.existingIngredientErrorMessage);
							this._loading.hide();
							return;
						}
					} else {
						if (found) {
							this._loading.hide();
							this._toast.error(this.existingIngredientErrorMessage);
							return;
						}
					}
				}

				this.verifyPurchasePrice();
				if (this.ingredient && this.ingredient.id && this.ingredient.user) {
					this.formGroup.value.id = this.ingredient.id;
					this.formGroup.value.ingredientCopiedId = this.ingredient.ingredientCopiedId;
					this._service.updateFromForm({
						id: this.formGroup.value.id,
						ingredientCategory: this.formGroup.value.ingredientCategory,
						name: this.formGroup.value.name,
						purchasePrice: this.formGroup.value.purchasePrice,
						unit: this.formGroup.value.unit,
						user: this.formGroup.value.user,
						description: this.formGroup.value.description,
						ingredientCopiedId: this.formGroup.value.ingredientCopiedId,
						recipeCopiedId: this.formGroup.value.recipeCopiedId
					}).subscribe(
						apiResponse => {
							this._loading.hide();
							this._toast.success(Messages.SUCCESS);
							this._router.navigate([`${CpRoutes.INGREDIENTS}`]);
						},
						error => {
							this._loading.hide();
						}
					);
				} else {
					if (this.ingredient)
						this.formGroup.value.ingredientCopiedId = this.ingredient.id;
					this._service.insert(this.formGroup.value).subscribe(
						apiResponse => {
							this._loading.hide();
							this._toast.success(Messages.SUCCESS);
							this._router.navigate([CpRoutes.INGREDIENTS]);
						},
						error => {
							this._loading.hide();
						}
					);
				}
			})

		}
	}

	validate(): Boolean {
		return true;
	}

	verifyPurchasePrice() {
		let purchasePrice = this.formGroup.value.purchasePrice;
		if (purchasePrice &&
			!purchasePrice.price &&
			!purchasePrice.unityQuantity &&
			!purchasePrice.unit
		) {
			this.formGroup.value.purchasePrice = null
		}

	}

	cancel() {
		//if (this.ingredient && this.ingredient.id) {
		//	this._router.navigate([`${CpRoutes.INGREDIENT}/${this.ingredient.id}`]);
		//} else {
			this._router.navigate([CpRoutes.INGREDIENTS]);
		//}
	}

	fetchCategories() {
		this._service.getCategoriesReduced().subscribe(
			apiResponse => {
				this.categories = apiResponse.data;
				this.categories[0].name = "INGREDIENT.CATEGORIA.TXT1";
				this.categories[1].name = "INGREDIENT.CATEGORIA.TXT2";
				this.categories[2].name = "INGREDIENT.CATEGORIA.TXT3";
				this.categories[3].name = "INGREDIENT.CATEGORIA.TXT4";
				this.categories[4].name = "INGREDIENT.CATEGORIA.TXT5";
				this.categories[5].name = "INGREDIENT.CATEGORIA.TXT6";
				this.categories[6].name = "INGREDIENT.CATEGORIA.TXT7";
				this.categories[7].name = "INGREDIENT.CATEGORIA.TXT8";
				this.categories[8].name = "INGREDIENT.CATEGORIA.TXT10";
				this.categories[9].name = "INGREDIENT.CATEGORIA.TXT11";
				this.categories[10].name = "INGREDIENT.CATEGORIA.TXT12";
				this.categories[11].name = "INGREDIENT.CATEGORIA.TXT13";
				this.categories[12].name = "INGREDIENT.CATEGORIA.TXT14";
				this.categories[13].name = "INGREDIENT.CATEGORIA.TXT15";
				this.categories[14].name = "INGREDIENT.CATEGORIA.TXT16";
				this.categories[15].name = "INGREDIENT.CATEGORIA.TXT17";
				this.categories[16].name = "INGREDIENT.CATEGORIA.TXT18";
				this.categories[17].name = "INGREDIENT.CATEGORIA.TXT20";
				this.categories[18].name = "INGREDIENT.CATEGORIA.TXT19";

				this.categories[19].name = "INGREDIENT.CATEGORIA.TXT22";
			},
			error => { }
		)
	}

	fetchUnits() {
		this._unitService.getReduced().subscribe(
			apiResponse => {
				this.units = apiResponse.data;

				this.units = _.filter(this.units, (u: Unit) => {
					return u.type !== UnitType.OTHER_COSTS;
				})

				this.units = this.removeDuplicatedUnits();
				this.removeInternationalUnitsConditionally();

				this.units = _.filter(this.units, (u: Unit) => {
					return !['Pessoas', 'Porções'].includes(u.name);
				})

				if (this.isEditing) {
					this.units = _.filter(this.units, (u:Unit) => {
						return _.isEqual(this.ingredient.ingredientCopiedId, u.ingredientId) || _.isNull(u.ingredientId);
					});

					this.purchaseUnits = _.filter(this.units, (u:Unit) => {
						return _.isNil(u.ingredientId) || u.type === UnitType.PURCHASE_LIST;
					});

					this.units = _.filter(this.units, (u:Unit) => {
						return u.type !== UnitType.PURCHASE_LIST;
					});

				} else {
					this.units = _.filter(this.units, (u:Unit) => {
						return _.isNull(u.ingredientId);
					});
					this.purchaseUnits = this.units;
				}

				this.units[0].name = "INGREDIENT.UNIDADE.TXT1";
				this.units[1].name = "INGREDIENT.UNIDADE.TXT2";
				this.units[2].name = "INGREDIENT.UNIDADE.TXT3";
				this.units[3].name = "INGREDIENT.UNIDADE.TXT4";
				this.units[4].name = "INGREDIENT.UNIDADE.TXT5";
			},
			error => { }
		)
	}

	removeInternationalUnitsConditionally() {
		if (this.lang === 'pt') {
			const usdaUnits = ['Stick', 'oz', 'lib', 'fl oz'];
			this.units = _.filter(this.units, (u: Unit) => {
				return !usdaUnits.includes(u.abbreviation);
			})
			this.purchaseUnits = this.units;
		}
	}

	removeDuplicatedUnits() {
		var reduced = [];

		this.units.forEach((item) => {
				var duplicated  = reduced.findIndex(redItem => {
						return item.name == redItem.name;
				}) > -1;

				if(!duplicated) {
						reduced.push(item);
				}
		});
		return reduced;
}

	private buildFormIngr(ingredient?:Ingredient, recipe?:Recipe) {
		//console.log("IngredientComponent","buildFormIngr", ingredient, recipe);

		if(!_.isNil(ingredient) && !_.isNil(recipe)) {

			let purchasePrice = ingredient.purchasePrice?this._formBuilder.group(ingredient.purchasePrice):this._formBuilder.group({
				price: [0, []],
				unityQuantity: [1, []],
				unit: ingredient.unit
			});

			this.formGroup = this._formBuilder.group({
				name: [ingredient.name, [ Validators.required ]],
				ingredientCategory: [ingredient.ingredientCategory, [ Validators.required ]],
				unit: [recipe.unit, [ Validators.required ]],
				description: [recipe.description, []],
				purchasePrice: purchasePrice
			});

		}
		else if(!_.isNil(ingredient)) {

			let purchasePrice = ingredient.purchasePrice?this._formBuilder.group(ingredient.purchasePrice):this._formBuilder.group({
				price: [0, []],
				unityQuantity: [1, []],
				unit: ingredient.unit
			});

			this.formGroup = this._formBuilder.group({
				name: [ingredient.name, [ Validators.required ]],
				ingredientCategory: [ingredient.ingredientCategory, [ Validators.required ]],
				unit: [ingredient.unit, [ Validators.required ]],
				description: [ingredient.description, []],
				purchasePrice: purchasePrice
			});

		}
		else {

			let unit:Unit = this.units[4];

			this.formGroup = this._formBuilder.group({
				name: [null, [ Validators.required ]],
				ingredientCategory: [null, [ Validators.required ]],
				unit: [null, [ Validators.required ]],
				description: [null, []],
				purchasePrice: this._formBuilder.group({
					price: [0, []],
					unityQuantity: [1, []],
					unit: unit
				})
			});

		}

		this.ingredient = ingredient;
		this.recipe = recipe;

	}

}
