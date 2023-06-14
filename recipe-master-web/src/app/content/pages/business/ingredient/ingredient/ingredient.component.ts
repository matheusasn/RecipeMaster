import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';
import * as _ from 'lodash';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { Component, OnInit, OnDestroy, ChangeDetectorRef, Inject } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';

import { CpRoutes } from '../../../../../core/constants/cp-routes';
import { Messages } from '../../../../../core/constants/messages';
import { Recipe } from '../../../../../core/models/business/recipe';
import { Ingredient } from '../../../../../core/models/business/ingredient';
import { IngredientCategory } from '../../../../../core/models/business/ingredientcategory';
import { Unit } from '../../../../../core/models/business/unit';
import { User } from '../../../../../core/models/user';
import { UserService } from '../../../../../core/auth/user.service';
import { UnitService } from './../../../../../core/services/business/unit.service';
import { IngredientService } from '../../../../../core/services/business/ingredient.service';
import { CpLoadingService } from '../../../../../core/services/common/cp-loading.service';
import { CpLocalStorageService } from '../../../../../core/services/common/cp-localstorage.service';
import { RecipeService } from '../../../../../core/services/business/recipe.service';
import { UserDTO } from '../../../../../core/models/security/dto/user-dto';
import { CpBaseComponent } from '../../../common/cp-base/cp-base.component';
import { HistoryIngredient } from '../../../components/cp-ingredient-current-price/cp-ingredient-current-price.component';
import { IngredientHistoryDTO } from '../../../../../core/models/business/dto/ingredient-history-dto';
import { IngredientHistoryService } from '../../../../../core/services/business/ingredient-history.service';
import { ApiResponse } from '../../../../../core/models/api-response';
import * as moment from 'moment';
import { ChartDataSets } from 'chart.js';
import swal, { SweetAlertOptions } from 'sweetalert2';

@Component({
	selector: 'm-ingredient',
	templateUrl: './ingredient.component.html',
	styleUrls: ['./ingredient.component.scss']
})
export class IngredientComponent extends CpBaseComponent implements OnInit, OnDestroy {

	ingredient: Ingredient;
	recipe: Recipe;
	user: User;
	private _currentUser: UserDTO;
	units: Unit[] = [];
	categories: IngredientCategory[] = [];
	formGroup: FormGroup;

	titleModal: String;
	txtModal: String;
	cifrao: String ;
	linguagem: string;
	unitOptions: any;

	mockPrice: string = 'R$350,00';
	mockUnit: String = '1/kg';
	mockId: String = '1';
	mockTextLabelIngredient: String = '?';
	mockName: String = 'Tomate';

	mockData: number[] = [7, 2, 5, 2, 1.8];
	mockLabels: string[] = ['Text', 'Text', 'Text', 'Text', 'Text'];
	chartData: ChartDataSets[] = [];
	chartLabels: string[];

	mockHistoryIngredient: HistoryIngredient[] = [
		{date: '15SET', weight: '1 kg', price: 'R$3,50'},
		{date: '06SET', weight: '1 kg', price: 'R$4,00'},
		{date: '01SET', weight: '1 kg', price: 'R$4,10'},
		{date: '25AGO', weight: '1 kg', price: 'R$3,90'},
		{date: '18AGO', weight: '1 kg', price: 'R$3,85'},
		{date: '10AGO', weight: '1 kg', price: 'R$3,80'},
	];

	priceHistory: IngredientHistoryDTO[];

	modalDeleteIngredientTxtTitle;
	modalDeleteIngredientTxt;
	modalBtn1;
	modalBtn2;

	constructor(
		@Inject(MAT_DIALOG_DATA) private data: any,
		_cdr: ChangeDetectorRef,
		_loading: CpLoadingService,
		private _service: IngredientService,
		private _recipeService: RecipeService,
		private _unitService: UnitService,
		private _toast: ToastrService,
		private _formBuilder: FormBuilder,
		private _router: Router,
		private _localStorage: CpLocalStorageService,
		private _userService: UserService,
		private _route: ActivatedRoute,
		private translate: TranslateService,
		private ingredientHistoryService: IngredientHistoryService,
		private _dialog: MatDialogRef<IngredientComponent>,
	) {
		super(_loading, _cdr);

		this.fillUser();
	}

	fillUser() {
		this.user = this._localStorage.getLoggedUser();
		if (this.user) {
			this._userService.findByIdReduced(this.user.id)
				.subscribe((res) => {
					this._currentUser = res.data;
					this.cifrao = this._currentUser.currency;
				}, err => {
			});
		}
	}

	ngOnInit() {
		this.translate.get('INGREDIENT.DELETE_MESSAGE_TITLE').subscribe(
			data => {this.modalDeleteIngredientTxtTitle = data}
		);

		this.translate.get('INGREDIENT.DELETE_MESSAGE').subscribe(
			data => {this.modalDeleteIngredientTxt = data}
		);
		this.translate.get('MODAL.LOGOUT_TXT_BTN1').subscribe(
			data => {this.modalBtn1 = data}
		);
		this.translate.get('MODAL.LOGOUT_TXT_BTN2').subscribe(
			data => {this.modalBtn2 = data}
		);

		this.translate.get('TRANSLATOR.LINGUAGEM').subscribe(
			data => {
				this.linguagem = data;
			}
		);

		this.fetchCategories();
		this.fetchUnits();
		//this.loadIngredientAndBuildForm();

		this.translate.get('MODAL.DELETE_RECIPE1').subscribe(
			data => {this.titleModal = data; }
		);

		this.translate.get('MODAL.DELETE_RECIPE2').subscribe(
			data => {this.txtModal = data; }
		);

	}

	save() {

		if (this.validate()) {

			this._loading.show();

			this.formGroup.value.user = this.user;
			// this.verifyPurchasePrice();

			if (this.ingredient && this.ingredient.id && this.ingredient.user) {

				this.formGroup.value.id = this.ingredient.id;
				this.formGroup.value.ingredientCopiedId = this.ingredient.ingredientCopiedId;
				this.formGroup.value.recipeCopiedId = this.ingredient.recipeCopiedId;
				this._service.update(this.formGroup.value).subscribe(
					apiResponse => {
						this._loading.hide();
						this._toast.success(Messages.SUCCESS);
						this._router.navigate([CpRoutes.INGREDIENTS]);
					},
					error => {
						this._loading.hide();
					}
				);

			} else {

				if (this.ingredient) {
					this.formGroup.value.ingredientCopiedId = this.ingredient.id;
					delete this.formGroup.value.id;
					delete this.formGroup.value.purchasePrice.id;
				}

				if (_.isNil(this.formGroup.value.name)) {

					let auxName: string;
					this.translate.get('INPUTS.UNTITLED').subscribe(data => auxName = data);

					this.formGroup.value.name = auxName;
				}

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

		}

	}

	validate(): Boolean {
		return true;
	}

	gotoBack() {
		// this._router.navigate([CpRoutes.INGREDIENTS]);
		this._dialog.close();
	}

	gotoEditIngredient() {
		this._dialog.close();
		this._router.navigate([`${CpRoutes.INGREDIENT_FORM}/${this.ingredient.id}`]);
	}



	private fetchCategories() {
		this._service.getCategoriesReduced().subscribe(
			apiResponse => {
				this.categories = apiResponse.data;
				this.categories[0].name = 'INGREDIENT.CATEGORIA.TXT1';
				this.categories[1].name = 'INGREDIENT.CATEGORIA.TXT2';
				this.categories[2].name = 'INGREDIENT.CATEGORIA.TXT3';
				this.categories[3].name = 'INGREDIENT.CATEGORIA.TXT4';
				this.categories[4].name = 'INGREDIENT.CATEGORIA.TXT5';
				this.categories[5].name = 'INGREDIENT.CATEGORIA.TXT6';
				this.categories[6].name = 'INGREDIENT.CATEGORIA.TXT7';
				this.categories[7].name = 'INGREDIENT.CATEGORIA.TXT8';
				this.categories[8].name = 'INGREDIENT.CATEGORIA.TXT9';
				this.categories[9].name = 'INGREDIENT.CATEGORIA.TXT10';
				this.categories[10].name = 'INGREDIENT.CATEGORIA.TXT11';
				this.categories[11].name = 'INGREDIENT.CATEGORIA.TXT12';
				this.categories[12].name = 'INGREDIENT.CATEGORIA.TXT13';
				this.categories[13].name = 'INGREDIENT.CATEGORIA.TXT14';
				this.categories[14].name = 'INGREDIENT.CATEGORIA.TXT15';
				this.categories[15].name = 'INGREDIENT.CATEGORIA.TXT16';
				this.categories[16].name = 'INGREDIENT.CATEGORIA.TXT17';
				this.categories[17].name = 'INGREDIENT.CATEGORIA.TXT18';
				this.categories[19].name = "INGREDIENT.CATEGORIA.TXT22";
			},
			error => { }
		);
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
				this.loadIngredientAndBuildForm();
			},
			error => { }
		);
	}

	doDismiss(event) {
		//console.log('não remover ingrediente');
	}

	delete() {

		this._loading.show();

		swal('Confirmação', 'Você tem certeza?', 'question')
		swal({
			title: this.modalDeleteIngredientTxtTitle,
			text: this.modalDeleteIngredientTxt,
			type: 'warning',
			showCancelButton: true,
			confirmButtonColor: '#f4516c',
			cancelButtonColor: '#d2d2d2',
			confirmButtonText: this.modalBtn1,
			cancelButtonText: this.modalBtn2
		  }).then((result) => {
				if (result.value) {
					this._service.delete(this.user.id, this.ingredient.id).subscribe(
						apiResponse => {
							this._loading.hide();
							this._toast.success(Messages.SUCCESS);
							this._dialog.close();
						},
						error => {
							this._loading.hide();
						}
					);
				} else {
					this._loading.hide();
				}
		  })
	}

	lineChartOpacity: number = 0.7;

	onChangePriceHistory(id) {
		this.loadPriceHistoryData(id);
	}

	private loadPriceHistoryData(id: number) {
		this.ingredientHistoryService.getByIngredient(id).subscribe( ({ priceHistory, chartData, chartLabels}) => {
			this.priceHistory = priceHistory;
			this.chartData = chartData;
			this.chartLabels = chartLabels;
			this.onChangeComponent();
		}, err => console.warn(err) );
	}

	private loadIngredientAndBuildForm() {

		this._route.params.subscribe(params => {

			let id = +this.data['id'];

			if (!isNaN(id) && !_.isNil(id)) {

				this.loadPriceHistoryData(id);

				this._loading.show();

				this.unitOptions = {exclude: [6, 7], canUpdate: true, canCreate: true};

				this._service.getById(id).subscribe( apiResponse => {

					const ingredient = apiResponse.data;

					switch (this.linguagem) {
						case 'en':
							if (ingredient.nameen != null) {
								ingredient.name = ingredient.nameen;
							}
							break;
						case 'es':
							if (ingredient.namees != null) {
								ingredient.name = ingredient.namees;
							}
							break;
						/*Inserir próxima case aqui quando tiver mais linguagem*/
					}

					if (ingredient.recipeCopiedId != null) {
						this._recipeService.getById(ingredient.recipeCopiedId).subscribe(
							apiResponse => {

								const recipe = apiResponse.data;

								this.buildFormIngr(ingredient, recipe);
								this._loading.hide();

							}
						);
					} else {

						this.buildFormIngr(ingredient);
						this._loading.hide();

					}

				}, error => { this._loading.hide(); } );

			} else {

				this.unitOptions = {basic: true, exclude: [6, 7], canUpdate: true, canCreate: true};

				this.buildFormIngr();

			}

		});

	}

	private buildFormIngr(ingredient?: Ingredient, recipe?: Recipe) {
		if (!_.isNil(ingredient) && !_.isNil(recipe)) {

			const purchasePrice = ingredient.purchasePrice ? this._formBuilder.group(ingredient.purchasePrice) : this._formBuilder.group({
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

		} else if (!_.isNil(ingredient)) {

			const purchasePrice = ingredient.purchasePrice ? this._formBuilder.group(ingredient.purchasePrice) : this._formBuilder.group({
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

		} else {

			const unit: Unit = this.units[4];

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
