import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { DragulaService }                                  from 'ng2-dragula';
import { CpLoadingService }                                           from './../../../../../core/services/common/cp-loading.service';
import { FormBuilder, Validators, FormArray, FormGroup, FormControl } from '@angular/forms';
import { CpBaseComponent }                                            from '../../../common/cp-base/cp-base.component';
import { PurchaseList }                                               from './../../../../../core/models/business/purchase-list.model';
import { Router, ActivatedRoute }                                     from '@angular/router';
import * as _                                                         from 'lodash';
import { MatDialog, MatDialogRef }                                    from '@angular/material';
import { IngredientInfoPurchaseComponent }                            from '../../ingredient/ingredient-info-purchase/ingredient-info-purchase.component';
import { CommonCalcService }                                          from '../../../../../core/services/business/common-calc.service';
import { User }                                                       from '../../../../../core/models/user';
import { CpLocalStorageService } from '../../../../../core/services/common/cp-localstorage.service';
import { UserDTO } from '../../../../../core/models/security/dto/user-dto';
import { UserService } from '../../../../../core/auth/user.service';
import { IngredientService } from '../../../../../core/services/business/ingredient.service';
import { Unit } from './../../../../../core/models/business/unit';
import { UnitService } from './../../../../../core/services/business/unit.service';
import { ApiResponse } from './../../../../../core/models/api-response';
import { CpRoutes } from '../../../../../core/constants/cp-routes';
import { Messages } from './../../../../../core/constants/messages';
import { ToastrService } from 'ngx-toastr';
import { PurchaseListService } from '../../../../../core/services/business/purchase-list.service';
import { PurchaseListIngredient } from '../../../../../core/models/business/purchase-list-ingredient';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import {
	MAT_MOMENT_DATE_FORMATS,
	MomentDateAdapter,
	MAT_MOMENT_DATE_ADAPTER_OPTIONS,
  } from '@angular/material-moment-adapter';
import { TranslateService } from '@ngx-translate/core';
import { RecipeCategory } from '../../../../../core/models/business/recipecategory';
import { RecipeIngredient } from '../../../../../core/models/business/recipeingredient';
import { IngredientHistory } from '../../../../../core/models/business/dto/ingredient-history';
import { IngredientHistoryService } from '../../../../../core/services/business/ingredient-history.service';

@Component({
  selector: 'm-purchase-list',
  templateUrl: './purchase-list.component.html',
  styleUrls: ['./purchase-list.component.scss'],
  providers: [
	  {provide: MAT_DATE_LOCALE, useValue: 'pt-br'},
	  {
		provide: DateAdapter,
		useClass: MomentDateAdapter,
		deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
	  },
	  {provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS},
	],
})
export class PurchaseListComponent extends CpBaseComponent implements OnInit, OnDestroy {

	private _currentUser: User;
	private _userService: UserService;
	cifrao: String = 'R$';

	formListaCompra: FormGroup;
	purchaseList: PurchaseList;
	steps: FormArray;
	ingredientInfoRef: MatDialogRef<IngredientInfoPurchaseComponent>;

	user: UserDTO;
	units: Unit[] = [];

	titleModal: string;

	categories: RecipeCategory[] = [];
	catEscolhido: number = -1;

	ingredients: any[] = [];
	ingredientsFiltro: any[] = [];
	ingredientsBackup: any[] = [];

	resulTotalMarcado: number = 0;
	resulTotalEstimado: number = 0;
	showFilterGetCategoryIngredient: boolean = false;

  	constructor(
		_cdr: ChangeDetectorRef,
		_loading: CpLoadingService,
		private _router: Router,
		private _formBuilder: FormBuilder,
		private _route: ActivatedRoute,
		private _dialogIngredientInfo: MatDialog,
		private calc: CommonCalcService,
		private _cpLocalStorageService: CpLocalStorageService,
		private _ingredientService: IngredientService,
		private _unitService: UnitService,
		private _service: PurchaseListService,
		private _toast: ToastrService,
		private _localStorage: CpLocalStorageService,
		private translate: TranslateService,
		private dragulaService: DragulaService,
		private ingredientHistoryService: IngredientHistoryService
  	) {
    	super(_loading, _cdr);
   	}

   	fillUser() {
		this._currentUser = this._cpLocalStorageService.getLoggedUser();
		if (this._currentUser) {
			this._userService.findByIdReduced(this._currentUser.id)
				.subscribe((res) => {
				this.user = res.data;
				this.cifrao = this.user.currency || 'R$'
			}, err => {});
		}
	}

	async ngOnInit() {
		this.translate.get('LISTA_COMPRAS.DELETE').subscribe(
			data => {this.titleModal = data}
		);
		this.fetchUnits();
		this.fetchCategoriesIngredients();
		this.loadRecipeAndBuildForm();
	}

	ngOnDestroy() {
		super.ngOnDestroy();

		this.destroyDragula();
	}

	initDragula() {
		this.dragulaService.createGroup('INGREDIENTS_DRAGGABLE', {
			direction: 'vertical',
		});
	}

	destroyDragula() {
		this.dragulaService.destroy('INGREDIENTS_DRAGGABLE');
	}

	onChangeIngredients() {
		this.unirRecipeIngredient();
		this.calcTotalEstimado();
		this.calcTotalMarcado();
		this.formListaCompra.patchValue({
			ingredients: this.ingredients
		});
	}

	createItem(description: string, order: number): FormGroup {
		return this._formBuilder.group({
			order: [order, [Validators.required]],
			description: [description, [Validators.required]]
		});
	}

	addItem(description: string = ''): void {
		this.steps = this.formListaCompra.get('steps') as FormArray;
		let item:FormGroup = this.createItem(description, this.steps.length);
		this.steps.push(item);
	}

	private createForm(purchaseList?:any) {
		this.formListaCompra = this._formBuilder.group({
			nome: [purchaseList?purchaseList.nome: null, []],
			dataCadastro: [purchaseList?purchaseList.dataCadastro: null, []],
			ingredients: [purchaseList?purchaseList.ingredients:[], []],
			preco: [purchaseList?purchaseList.preco: 0, []],
			precoMarcado: [purchaseList?purchaseList.precoMarcado: 0, []],
			user: [purchaseList?purchaseList.user: null, []]
		});

		this.purchaseList = purchaseList;
	}

	private loadRecipeAndBuildForm() {
		this._route.params.subscribe(params => {
			const id = +params['id'];

			if ( !isNaN(id) && !_.isNil(id)) {
				this._loading.show();

				this._service.getById(id).subscribe(
				apiResponse => {
					const listaCompra = apiResponse.data;

					let arrayIngredient = [];
					listaCompra.ingredients.forEach(e => {
						let ri = {
							amount: null,
							unit: null,
							ingredient: null,
							quantCompra: null,
							unitCompra: null,
							marked: false,
							correctionFactor: {
								grossWeight: null,
								netWeight: null
							}
						};

						ri.amount = e.ingredient.purchasePrice.unityQuantity;
						ri.unit = e.ingredient.purchasePrice.unit;
						ri.quantCompra = e.quantCompra;
						ri.unitCompra = e.unitCompra;
						ri.ingredient = e.ingredient;
						ri.correctionFactor.grossWeight = e.ingredient.lastGrossWeight;
						ri.correctionFactor.netWeight = e.ingredient.lastNetWeight;
						ri.marked = e.marked;
						arrayIngredient.push(ri);
					});
					this.ingredients = arrayIngredient;
					this.ingredients = _.sortBy(this.ingredients, [function(o) { return o.ingredient.ordem; }]);

					this.createForm(listaCompra);
					this.calcTotalEstimado();
					this.calcTotalMarcado();

					this._loading.hide();
				},
				error => {
					this._loading.hide();
					}
				);
			} else {
				this.createForm();
			}

		});

	}

	private ingredientHistoryList:IngredientHistory[];

	async saveIngredientHistory(list:IngredientHistory[]) {

		if(list && list.length > 0) {
			this.ingredientHistoryService.add(list);
		}

	}

	addHistory(recipeIngredient:RecipeIngredient) {

		try {

			if(!recipeIngredient.ingredient.id) {
				return;
			}

			let history:IngredientHistory = {
				ingredient: recipeIngredient.ingredient,
				price: recipeIngredient.ingredient.purchasePrice.price,
				unit: recipeIngredient.ingredient.purchasePrice.unit,
				unityQuantity: recipeIngredient.ingredient.purchasePrice.unityQuantity
			};

			if(!this.ingredientHistoryList) {
				this.ingredientHistoryList = [];
			}

			let index = _.findIndex(this.ingredientHistoryList, ( h:IngredientHistory) => {

				if(recipeIngredient.ingredient.id) {
					return h.ingredient.id == recipeIngredient.ingredient.id
				}

				return h.ingredient.name == recipeIngredient.ingredient.name;

			});

			if(index > -1) {
				this.ingredientHistoryList[index] = history;
			}
			else {
				this.ingredientHistoryList.push(history);
			}

		}
		catch(e) {
			console.warn(e.message);
		}

	}


	setIngredientInfo(index: number) {
		this.ingredientInfoRef = this._dialogIngredientInfo.open(IngredientInfoPurchaseComponent, {
			data: {
				item: this.ingredients[index]
			}
		});

		this.ingredientInfoRef.afterClosed().subscribe( (ingredientInfoData) => {
			if(!ingredientInfoData || !ingredientInfoData.item) {
				return;
			}
			if (ingredientInfoData.exclude === true) {
				this.removeListaCompraIngredient(ingredientInfoData.item.ingredient);
				this.calcTotalEstimado();
				this.calcTotalMarcado();
				this.onChangeComponent();
				return;
			} else {
				this.ingredients[index] = ingredientInfoData.item;

				this.formListaCompra.patchValue({
					ingredients: this.ingredients
				});

				this.addHistory(ingredientInfoData.item);

				this.calcTotalEstimado();
				this.calcTotalMarcado();
			}
			this.onChangeComponent();
		});

		this.onChangeComponent();
	}

	removeListaCompraIngredient(item:any) {
		this.ingredients = _.remove(this.ingredients, function(n){
			return n.ingredient.id != item.id;
		});

		this.formListaCompra.patchValue({
			ingredients: this.ingredients
		});
	}

	calcIngredientPrice(item: any) {
		return this.calc.calcIngredientPricePurchaseList(item);
	}

	getUnitLabel(recipeIngredient: any) {
		console.log("produto");
		console.log(recipeIngredient);
        if(!_.isNil(recipeIngredient.unit.ingredientId)) {

            let label:Unit = _.find(this.units, ['id',recipeIngredient.unit.unitId]);

            return `${recipeIngredient.quantCompra} ${label?label.abbreviation:''}`;
        }
        else {
            return `${recipeIngredient.quantCompra} ${recipeIngredient.unit?recipeIngredient.unit.abbreviation:''}`;
        }

    }

	private fetchUnits() {
		this._unitService.getReduced().subscribe(
			(apiResponse: ApiResponse) => {
				this.fetchUnitsAbbreviated(apiResponse.data)
			},
			(apiResponse: ApiResponse) => { }
		)
	}

	private fetchUnitsAbbreviated(units:Unit[]) {
		this._unitService.getAbbreviated().subscribe(
			(apiResponse: ApiResponse) => {
				units.forEach((x, i) => x.abbreviation = apiResponse.data[i].name)
				this.units = units;
				this.units[0].name = "INGREDIENT.UNIDADE.TXT1";
				this.units[1].name = "INGREDIENT.UNIDADE.TXT2";
				this.units[2].name = "INGREDIENT.UNIDADE.TXT3";
				this.units[3].name = "INGREDIENT.UNIDADE.TXT4";
				this.units[4].name = "INGREDIENT.UNIDADE.TXT5";
				this.units[5].name = "INGREDIENT.UNIDADE.TXT6";
				this.units[6].name = "INGREDIENT.UNIDADE.TXT7";
			},
			(apiResponse: ApiResponse) => { }
		)
	}

	private calcTotalEstimado() {
		this.resulTotalEstimado = 0;

		if(this.ingredients.length != 0){
			this.ingredients.forEach(e => {
				this.resulTotalEstimado += this.calc.calcIngredientPricePurchaseList(e);
			});
		}

		this.formListaCompra.value.preco = this.resulTotalEstimado;
	}

	private calcTotalMarcado() {
		this.resulTotalMarcado = 0;

		if(this.ingredients.length != 0) {
			this.ingredients.forEach(e => {
				if(e.marked)
					this.resulTotalMarcado += this.calc.calcIngredientPricePurchaseList(e);
			});
		}
	}

	calcTotalMarcadoUser(position: number, marked: boolean) {
		//Calculo marcado
		if(this.ingredients[position].marked) {
			this.resulTotalMarcado = this.resulTotalMarcado
									+ this.calc.calcIngredientPricePurchaseList(this.ingredients[position]);
		} else if (!this.ingredients[position].marked) {
			this.resulTotalMarcado = this.resulTotalMarcado
									- this.calc.calcIngredientPricePurchaseList(this.ingredients[position]);
		}
	}

	cancel() {
		this._router.navigate([CpRoutes.PURCHASELISTS]);
	}

	async save() {
		this.formListaCompra.patchValue({
			user: this._localStorage.getLoggedUser()
		});

		this.limparFiltro();

		if (this.purchaseList != null) {
			await this.createUserIngredients();

			this.saveIngredientHistory(this.ingredientHistoryList);

			this.updateListaCompra();
		}
		else {
			await this.createUserIngredients();

			this.saveIngredientHistory(this.ingredientHistoryList);

			this.createListaCompra();
		}
	}

	private updateListaCompra() {
		this.formListaCompra.addControl('id', new FormControl(this.purchaseList.id, []));
		if(this.resulTotalEstimado != 0)
			this.formListaCompra.value.preco = this.resulTotalEstimado;
		this.formListaCompra.value.precoMarcado = this.resulTotalMarcado;
		this._loading.show();

		this._service.update(this.formListaCompra.value).subscribe(apiResponse => {
			this._loading.hide();
			this._toast.success(Messages.SUCCESS);
			this._router.navigate([CpRoutes.PURCHASELISTS]);
		}, error => {
			this._loading.hide();
		});
	}

	private unirRecipeIngredient (){
		let listIngredientCopiedId = [];
		let listNullIngredientCopiedId = [];

		//Separa as informações
		listIngredientCopiedId = _.filter(this.ingredients, function(o) {
			return !_.isNil(o.ingredient.ingredientCopiedId);
		});
		listNullIngredientCopiedId = _.filter(this.ingredients, function(o) {
			return _.isNil(o.ingredient.ingredientCopiedId);
		});

		//Ordena as novas listas
		// listIngredientCopiedId = _.sortBy(listIngredientCopiedId, [function(o) { return o.ingredient.ingredientCopiedId; }]);
		// listNullIngredientCopiedId = _.sortBy(listNullIngredientCopiedId, [function(o) { return o.ingredient.id; }]);

		if(this.ingredients.length > 0) {
			listIngredientCopiedId = this.percorrerListIngredient(listIngredientCopiedId, false);
			listNullIngredientCopiedId = this.percorrerListIngredient(listNullIngredientCopiedId, true);
			this.ingredients = [];

			listIngredientCopiedId.forEach(e1 => {
				this.ingredients.push(e1);
			});
			listNullIngredientCopiedId.forEach(e2 => {
				this.ingredients.push(e2);
			});
		}

		//Recalcular total marcado
		this.resulTotalMarcado = 0;
		this.ingredients.forEach(e => {
			if(e.marked) {
				this.resulTotalMarcado += this.calc.calcIngredientPricePurchaseList(e);
			}
		});

		//Ordenar em ordem alfabetica
		//this.ingredients = _.sortBy(this.ingredients, [function(o) { return o.ingredient.ordem; }]);
	}

	private percorrerListIngredient(list: any, create: boolean) {
		let lastId;
		let p = 0;
		let lastQuantPurchase = 0;
		let lastUnitPurchase;
		let lastPriceIngredient = 0;
		let marked = false;
		let result = [];

		for (let i = 0; i < list.length; i++) {
			if(list[i].ingredient.id != undefined || list[i].ingredient.ingredientCopiedId != undefined){
				lastId = create ? list[i].ingredient.id : list[i].ingredient.ingredientCopiedId;

				//Unir quantidade compra
				if(!_.isNil(list[i].quantCompra)) {

					if(!_.isNil(lastUnitPurchase)) {
						if(lastUnitPurchase.id != list[i].unitCompra.id){
							if(list[i].unitCompra.id==1 || list[i].unitCompra.id==3) {
								lastQuantPurchase = (lastQuantPurchase * 1000) + list[i].quantCompra;
							}
							else if(list[i].unitCompraid==4 || list[i].unitCompra.id==2) {
								lastQuantPurchase = (lastQuantPurchase / 1000) + list[i].quantCompra;
							}else{
								lastQuantPurchase += list[i].quantCompra;
							}
						}else{
							lastQuantPurchase += list[i].quantCompra;
						}
					} else {
						lastQuantPurchase += list[i].quantCompra;
					}

				}

				//Colocar nova medida
				if(!_.isNil(list[i].unitCompra )) {
					lastUnitPurchase = list[i].unitCompra;
				}

				//Manter os checks
				if(list[i].marked) {
					marked = true;
				}

				//Manter price ingredient
				if(lastPriceIngredient == 0) {
					lastPriceIngredient = list[i].ingredient.purchasePrice.price;
				}

				p++;

				if(!(p > list.length)){
					if(p == list.length) {
						list[i].quantCompra = lastQuantPurchase;
						list[i].unitCompra = lastUnitPurchase;
						list[i].marked = marked;
						list[i].ingredient.purchasePrice.price = lastPriceIngredient;
						result.push(list[i]);
					} else if((lastId != list[p].ingredient.ingredientCopiedId && !create) || (lastId != list[p].ingredient.id && create)) {
						list[i].quantCompra = lastQuantPurchase;
						list[i].unitCompra = lastUnitPurchase;
						list[i].marked = marked;
						list[i].ingredient.purchasePrice.price = lastPriceIngredient;
						result.push(list[i]);
						lastQuantPurchase = 0;
						lastUnitPurchase = null;
						marked = false;
						lastPriceIngredient = 0;
					}
				}
			}else{//Itens criados pelo user
				result.push(list[i]);
			}
		}

		return result;
	}

	private async createListaCompra() {
		this.ingredients.forEach(e => {
			if(e.unitCompra == null){
				e.unitCompra = e.unit;
			}
		});

		this.formListaCompra.value.preco = this.resulTotalEstimado;
		this.formListaCompra.value.precoMarcado = this.resulTotalMarcado;
		if(this.formListaCompra.value.nome == null) {

			let auxName: string;
			this.translate.get('INPUTS.UNTITLED').subscribe(data => auxName = data);

			this.formListaCompra.value.nome = auxName;
		}
		this._service.insert(this.formListaCompra.value).subscribe(
			apiResponse => {
				this.purchaseList = apiResponse.data;
				this._loading.hide();
				this._toast.success(Messages.SUCCESS);
				this._router.navigate([CpRoutes.PURCHASELISTS]);
			},
			error => {
				this._loading.hide();
			}
		);
	}

	private async createUserIngredients() {
		try {

			let order:number = 0;

			let promises = _.map(this.ingredients, (ri:PurchaseListIngredient) => {
				ri.ingredient.purchasePrice.unityQuantity = ri.amount;
				ri.ingredient.purchasePrice.unit = ri.unit;

				ri.order + order++;

				if(!_.isNil(ri.ingredient.ingredientCategory))
					ri.ingredient.ingredientCategory = !_.isNil(ri.ingredient.ingredientCategory.id) ? ri.ingredient.ingredientCategory : null;

				if(_.isNil(ri.ingredient.id)) {
					return this._ingredientService.insert(ri.ingredient).toPromise();
				}
				else {
					return this._ingredientService.update(ri.ingredient).toPromise();
				}
			});

			let results = await Promise.all(promises);

			let ingredients = _.map(results, (apiresp:ApiResponse) => {
				return apiresp.data;
			});

			this.ingredients = this.ingredients.map( (value, i) => {
				value.ingredient = ingredients[i];
				return value;
			});

			this.formListaCompra.patchValue({
				ingredients: this.ingredients
			});

		}
		catch(e) {
			console.log(e);
		}
	}

	delete() {
		this._loading.show();
		this._service.remover(this._localStorage.getLoggedUser().id, this.purchaseList.id).subscribe(
			apiResponse => {
				this._loading.hide();
				this._toast.success(Messages.SUCCESS);
				this._router.navigate([CpRoutes.PURCHASELISTS]);
			},
			error => {
				this._loading.hide();
			}
		)
	}

	doDismiss(event) {
	}

	private fetchCategoriesIngredients() {
		this._ingredientService.getCategoriesReduced().subscribe(
			(apiResponse: ApiResponse) => {
				this.categories = apiResponse.data;
				this.categories[0].name = "INGREDIENT.CATEGORIA.TXT1";
				this.categories[1].name = "INGREDIENT.CATEGORIA.TXT2";
				this.categories[2].name = "INGREDIENT.CATEGORIA.TXT3";
				this.categories[3].name = "INGREDIENT.CATEGORIA.TXT4";
				this.categories[4].name = "INGREDIENT.CATEGORIA.TXT5";
				this.categories[5].name = "INGREDIENT.CATEGORIA.TXT6";
				this.categories[6].name = "INGREDIENT.CATEGORIA.TXT7";
				this.categories[7].name = "INGREDIENT.CATEGORIA.TXT8";
				this.categories[8].name = "INGREDIENT.CATEGORIA.TXT9";
				this.categories[9].name = "INGREDIENT.CATEGORIA.TXT10";
				this.categories[10].name = "INGREDIENT.CATEGORIA.TXT11";
				this.categories[11].name = "INGREDIENT.CATEGORIA.TXT12";
				this.categories[12].name = "INGREDIENT.CATEGORIA.TXT13";
				this.categories[13].name = "INGREDIENT.CATEGORIA.TXT14";
				this.categories[14].name = "INGREDIENT.CATEGORIA.TXT15";
				this.categories[15].name = "INGREDIENT.CATEGORIA.TXT16";
				this.categories[16].name = "INGREDIENT.CATEGORIA.TXT17";
				this.categories[17].name = "INGREDIENT.CATEGORIA.TXT18";
				this.categories[19].name = "INGREDIENT.CATEGORIA.TXT22";
			},
			(apiResponse: ApiResponse) => { }
		);
	}

	getCategoria (){
		if(this.ingredientsBackup.length == 0){
			this.ingredientsBackup = this.ingredients;
		}

		if(this.catEscolhido == -1){
			this.ingredients = [];
			this.ingredientsFiltro = [];
			this.ingredients = this.ingredientsBackup;
			this.ingredientsBackup = [];
			this.catEscolhido = -1;
		}else{
			this.ingredients = [];
			this.ingredientsFiltro = [];
			this.ingredients = this.ingredientsBackup;

			this.ingredients.forEach(e => {
				if(!_.isNil(e.ingredient.ingredientCategory)){
					if(e.ingredient.ingredientCategory.id == this.catEscolhido){
						this.ingredientsFiltro.push(e);
					}
				}
			});

			if(this.ingredientsFiltro.length > 0){
				this.ingredients = [];
				this.ingredients = this.ingredientsFiltro;
			}else{
				this.ingredients = [];
			}
		}
	}

	private limparFiltro() {
		this.catEscolhido = -1;
		this.getCategoria();
	}

	setAlphabeticalOrderList() {
		this.limparFiltro();
		this.ingredients = _.sortBy(this.ingredients, [function(o) { return o.ingredient.name; }]);
	}

	setCategoryOrderList() {
		let ingredientsCategoryNull = [];
		let ingredientsCategory = [];

		this.limparFiltro();

		ingredientsCategoryNull = _.filter(this.ingredients, function(o) {
			return _.isNil(o.ingredient.ingredientCategory);
		});

		ingredientsCategory = _.remove(this.ingredients, function(n) {
			return n.ingredient.ingredientCategory != null;
		});

		ingredientsCategory = _.sortBy(ingredientsCategory, [function(o) { return o.ingredient.ingredientCategory.name; }]);

		this.ingredients = [];
		if(ingredientsCategory.length > 0){
			ingredientsCategory.forEach(e => {
				this.ingredients.push(e);
			});
		}
		if(ingredientsCategoryNull.length > 0){
			ingredientsCategoryNull.forEach(e => {
				this.ingredients.push(e);
			});
		}
	}

	getCategoryIngredient() {
		if(this.showFilterGetCategoryIngredient) {
			this.showFilterGetCategoryIngredient = false;
		}else {
			this.showFilterGetCategoryIngredient = true;
		}
	}

}
