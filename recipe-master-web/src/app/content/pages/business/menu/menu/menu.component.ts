import { DragulaService }                                                           from 'ng2-dragula';
import { IngredientMenuInfoComponent }                                              from '../ingredient-menu-info/ingredient-menu-info.component';
import { Messages }                                                                 from './../../../../../core/constants/messages';
import { PERCENT_UUID, Unit }                                                                     from './../../../../../core/models/business/unit';
import { UnitService }                                                              from './../../../../../core/services/business/unit.service';
import { ApiResponse }                                                              from './../../../../../core/models/api-response';
import { Recipe }                                                                   from './../../../../../core/models/business/recipe';
import { CpLoadingService }                                                         from './../../../../../core/services/common/cp-loading.service';
import { Router, ActivatedRoute }                                                   from '@angular/router';
import { Component, OnInit, ChangeDetectorRef, ViewChildren, ViewChild, OnDestroy } from '@angular/core';
import { CpRoutes }                                                                 from '../../../../../core/constants/cp-routes';
import { FormBuilder, FormGroup, FormControl }                                      from '@angular/forms';
import { CpBaseComponent } from '../../../common/cp-base/cp-base.component';
import { CpLocalStorageService } from '../../../../../core/services/common/cp-localstorage.service';
import { ToastrService } from 'ngx-toastr';
import { Ingredient } from '../../../../../core/models/business/ingredient';
import { IngredientService } from '../../../../../core/services/business/ingredient.service';
import { RecipeIngredient } from '../../../../../core/models/business/recipeingredient';
import { MatDialog, MatDialogRef, MatDialogConfig } from '@angular/material';
import { IngredientInfoComponent } from '../../ingredient/ingredient-info/ingredient-info.component';
import { User } from '../../../../../core/models/user';
import * as _ from 'lodash';
import { CommonCalcService } from '../../../../../core/services/business/common-calc.service';
import { RecipeImageCropComponent } from '../../../components/recipe-image-crop/recipe-image-crop.component';
import { Menu } from '../../../../../core/models/business/menu';
import { MenuService } from '../../../../../core/services/business/menu.service';
import { MenuItem } from '../../../../../core/models/business/menuitem';
import {RecipeReportOptions} from '../../../../../core/report/recipe/recipereportoptions';
import { TranslateService } from '@ngx-translate/core';
import { PlanService } from '../../../../../core/services/business/plan.service';
import { RolePermission } from '../../../../../core/models/security/perfil.enum';
import { UserService } from '../../../../../core/auth/user.service';
import { UserDTO } from '../../../../../core/models/security/dto/user-dto';
import { APP_CONFIG } from '../../../../../config/app.config';
import { MenuIngredient } from '../../../../../core/models/business/menuingredient';
import { RecipeService } from '../../../../../core/services/business/recipe.service';
import { RecipeItem } from '../../../../../core/models/business/recipeitem';
import { DeviceDetectorService } from 'ngx-device-detector';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { DialogMenuComponent } from '../../../tutorials/menu/dialog-menu/dialog-menu.component';
import { DialogMenuItemsComponent } from '../../../tutorials/menu/dialog-menu-items/dialog-menu-items.component';
import { DialogMenuOtherCostsComponent } from '../../../tutorials/menu/dialog-menu-other-costs/dialog-menu-other-costs.component';
import { DialogMenuFinancialComponent } from '../../../tutorials/menu/dialog-menu-financial/dialog-menu-financial.component';

@Component({
  selector: 'm-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent extends CpBaseComponent implements OnInit, OnDestroy {

	ingredientDraggable: boolean;
	menu: Menu;
	user: User;
	private _currentUser: UserDTO;
	units: Unit[] = [];
	unitsAbbreviated: Unit[] = [];
	ingredients: MenuIngredient[] = [];
	ingredientsQuery: (Ingredient|Recipe)[] = [];
	ingredientInfoRef: MatDialogRef<IngredientMenuInfoComponent>;
	formMenu: FormGroup;
	photo: string;
	itens: MenuItem[] = [];

	private inputToFocus: any;
	private chartData: any;
	private financialAnalysisChartData: any;
	private costPerItemChartData: any;
	private recipes: Recipe[] = [];

	reportOptions: RecipeReportOptions;
	selectedColumns: any[] = [];

	@ViewChild('pdf') pdf;

	showDialogMenu = false;
	selectedMenu = {
		general: true,
		ingredients: true,
		steps: false,
		menuItens: true,
		financial: true,
		nutrition: false
	};

	titleModal: String;
	cifrao: String = 'R$';
	menuPhotoUpdated:boolean = false;
	baseUrl:string = APP_CONFIG.S3_MENU_URL;

	cropOtions:any = {
		aspectRatio: 1
	};

	saveFormSubject: Subject<void> = new Subject<void>();

	constructor(
		_cdr: ChangeDetectorRef,
		_loading: CpLoadingService,
		private _menuService: MenuService,
		private _router: Router,
		private _formBuilder: FormBuilder,
		private _route: ActivatedRoute,
		private _unitService: UnitService,
		private _localStorage: CpLocalStorageService,
		private _ingredientService: IngredientService,
		private _toast: ToastrService,
		private _dialogIngredientInfo: MatDialog,
		private calc: CommonCalcService,
		private translate: TranslateService,
		private planService: PlanService,
		private _userService: UserService,
		private dragulaService: DragulaService,
		private _recipeService: RecipeService,
		private deviceDetectorService: DeviceDetectorService
	) {
		super(_loading, _cdr);
		this.user = this._localStorage.getLoggedUser();
		this.reportOptions = new RecipeReportOptions();
		this.reportOptions.setDisplay(this.selectedMenu);
		this.fillUser();
		const doSave = () => {
			// this.save(true);
			// console.log('Automatic saved')
		}
		this.saveFormSubject.pipe(
			debounceTime(1000)
		).subscribe(() => doSave())
	}

	fillUser() {
		this.user = this._localStorage.getLoggedUser();
		if (this.user) {
			this._userService.findByIdReduced(this.user.id)
				.subscribe((res) => {
					this._currentUser = res.data;
					this.cifrao = this._currentUser.currency || 'R$';
				}, err => {
				});
		}
	}

	ngOnInit() {
		// this._loading.show();
		this.fetchUnits();
		this.loadMenuAndBuildForm();
		this.translate.get('MODAL.DELETE_CARDAPIO').subscribe(
			data => {this.titleModal = data}
		);

		this.initDragula();
	}

	ngOnDestroy() {
		super.ngOnDestroy();
		this.destroyDragula();
	}

	initDragula() {
		this.dragulaService.createGroup('INGREDIENTS_DRAGGABLE', {
			direction: 'vertical',
			moves: () => {
				return this.ingredientDraggable;
			}
		});
	}

	destroyDragula() {
		this.dragulaService.destroy('INGREDIENTS_DRAGGABLE');
		this.saveFormSubject.next();
	}

	doDismiss(event) {
		console.log("não remover ingrediente");
	}

	removeRecipeIngredient(menuIngredient:MenuIngredient) {

		this.ingredients = _.filter(this.ingredients, (value, index) => {
			return value != menuIngredient;
		});

		this.formMenu.patchValue({
			ingredients: this.ingredients
		});

	}

	onChangeIngredients() {

		this.formMenu.patchValue({
			ingredients: this.ingredients
		});

		this.saveFormSubject.next();
	}

	onChangeItens(ev) {
		this.formMenu.patchValue({
			itens: this.itens
		});

		this.calculateOtherCostsPercentPrice();
		console.log('Fui chamado')
		this.saveFormSubject.next();
	}

	private calculateOtherCostsPercentPrice() {
		const costValue = this.formMenu.value.financial.totalCostValue;
		this.itens.forEach(item => {
			if (item.unitUsed.uuid === PERCENT_UUID) {
				item.price = costValue * (item.unityQuantityUsed / 100);
			}
		})
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

	async save(automatic?: boolean) {
		if (!automatic) {
			this._loading.show();
		}

		this.formMenu.patchValue({
			user: this._localStorage.getLoggedUser()
		});

		await this.createUserIngredients();

		if (this.menu && this.menu.id) {
			this.updateMenu(automatic);
		}
		else {
			this.createMenu(automatic);
		}
	}

	private async createUserIngredients() {

		try {

			let order:number = 0;

			let promises = _.map(this.ingredients, (ri:MenuIngredient) => {

				ri.order = order++;

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

			this.formMenu.patchValue({
				ingredients: this.ingredients
			});

		}
		catch(e) {
			console.log(e);
		}

	}

	private async updateMenu(automatic?: boolean) {

		this.formMenu.addControl('id', new FormControl(this.menu.id, []));

		this.formMenu.value.itens = this.itens;

		if (!automatic) {
			this._loading.show();
		}

		if(this.menuPhotoUpdated) {

			let imageDto:any = {
				content: this.photo
			};

			this._menuService.uploadPhoto(this.menu.id, imageDto).subscribe( (response: ApiResponse) => {
				try {

					if(response && response.data) {
						this.formMenu.patchValue({
							photoUrl: this.baseUrl + response.data.key
						});
					}

				}
				catch(e) {
					console.warn(e.message);
				}

				this._menuService.update(this.formMenu.value).subscribe(
					apiResponse => {
						this._loading.hide();
						if (!automatic) {
							this._toast.success(Messages.SUCCESS);
							this._router.navigate([CpRoutes.MENUS]);
						}
					},
					error => {
						this._loading.hide();
					}
				);

			}, err => console.warn(err));

		}
		else {

			this._menuService.update(this.formMenu.value).subscribe(
				apiResponse => {
					this._loading.hide();
					if (!automatic) {
						this._toast.success(Messages.SUCCESS);
						this._router.navigate([CpRoutes.MENUS]);
					}
				},
				error => {
					this._loading.hide();
				}
			);

		}

	}

	private async createMenu(automatic?: boolean) {

		if(_.isNil(this.formMenu.value.name)) {
			let auxName: string;
			this.translate.get('INPUTS.UNTITLED').subscribe(data => auxName = data);

			this.formMenu.patchValue({
				name: auxName
			});
		}

		this.formMenu.value.itens = this.itens;

		if(this.menuPhotoUpdated) {

			let imageDto:any = {
				content: this.photo
			};

			this._menuService.uploadMenuPhoto(imageDto).subscribe( (response: ApiResponse) => {
				try {
					if(response && response.data) {
						this.formMenu.patchValue({
							photoUrl: this.baseUrl + response.data.key
						});

					}

				}
				catch(e) {
					console.warn(e.message);
				}

				this._menuService.insert(this.formMenu.value).subscribe(
					apiResponse => {
						this.menu = apiResponse.data;
						if (automatic) {
							this._router.navigate([CpRoutes.MENU, response.data.id]);
						} else {
							this._loading.hide();
							this._toast.success(Messages.SUCCESS);
							this._router.navigate([CpRoutes.MENUS]);
						}
					},
					error => {
						this._loading.hide();
					}
				);

			}, err => console.warn(err));

		}
		else {

			this._menuService.insert(this.formMenu.value).subscribe(
				apiResponse => {
					this.menu = apiResponse.data;
					this._loading.hide();
					if (automatic) {
						this._router.navigate([CpRoutes.MENU, apiResponse.data.id]);
					} else {
						this._loading.hide();
						this._toast.success(Messages.SUCCESS);
						this._router.navigate([CpRoutes.MENUS]);
					}

				},
				error => {
					this._loading.hide();
				}
			);

		}

	}

	cancel() {
		this._router.navigate([CpRoutes.MENUS]);
	}

	setIngredientInfo(index: number) {
		this.ingredientInfoRef = this._dialogIngredientInfo.open(IngredientMenuInfoComponent, {
			data: {
				recipeIngredient: this.ingredients[index],
				type: 'menu'
			},
            panelClass: 'cpPanelOverflow'
		});

		this.ingredientInfoRef.afterClosed().subscribe(async(ingredientInfoData) => {

			if(!ingredientInfoData || !ingredientInfoData.recipeIngredient) {
				return;
			}

			if(ingredientInfoData.viewRecipe == true) {
				this._router.navigateByUrl(CpRoutes.MENU + ingredientInfoData.recipeIngredient.ingredient.recipeCopiedId);
				return;
			}
			else if(ingredientInfoData.exclude === true) {
				this.removeRecipeIngredient(ingredientInfoData.recipeIngredient);
				this.saveFormSubject.next();
				return;
			}
			else {

				this.ingredients[index] = ingredientInfoData.recipeIngredient;

				this.formMenu.patchValue({
					ingredients: this.ingredients
				});

			}

			this.onSelected();
			this.onChangeComponent();

		});

		this.onChangeComponent();

	}

	getItensTotalCost() {

		return _.reduce(this.itens, (sum:number, item:MenuItem) => {
			let valor:number = this.calc.calcMenuItemPrice(item);
			return sum + valor;
		}, 0);

	}

	getTotalIngredients(): number {
		return this.calc.totalRecipeIngredients(this.ingredients);
	}

	calcMargemDeLucro(tipo:string = 'total'): number {
		let rendimento:number = 1
		let precoDeVenda:number = this.formMenu.value.financial.totalCostValue;

		if (tipo === 'unitario') {
			precoDeVenda = this.formMenu.value.financial.costUnitValue;
			rendimento = this.formMenu.value.unityQuantity ? this.formMenu.value.unityQuantity : 1;
		}

		return this.calc.calcMargemDeLucro(this.ingredients, precoDeVenda, rendimento, this.getItensTotalCost());
	}

	calcIngredientPrice(recipeIngredient:RecipeIngredient|MenuIngredient) {
		return this.calc.calcIngredientPrice(recipeIngredient);
	}

	calcIngredientAmount(recipeIngredient:RecipeIngredient) {

		if(recipeIngredient.ingredient.recipeCopiedId != null) {
			return 1;
		}
		else {
			return recipeIngredient.amount;
		}

	}

	getTotalCost(): number {
		return this.getTotalIngredients() + this.getItensTotalCost();
	}

	getUnitCost(): number {
		// return this.calc.recipeUnitCost(this.ingredients, this.formMenu.value.unityQuantity);

		let unityQuantity:number = this.formMenu.value.unityQuantity;
		return this.getTotalCost() / (unityQuantity?unityQuantity:1)

	}

	onBlurCostValue() {
		this.generateChartData();
	}

	onChangeCostValue() {
		let recipe = this.formMenu.value;
		if (recipe && recipe.financial) {
			let costValue = this.formMenu.value.financial.totalCostValue;
			let totalCostPerc = 0.0;
			if (costValue && costValue > 0) {

				totalCostPerc = ((costValue - this.getTotalCost()) / this.getTotalCost()) * 100;
			}

			this.formMenu.patchValue({
				financial: {
					totalCostPerc: totalCostPerc
				}
			});

		}
		this.getTotalCost();
		this.onChangeComponent();
		this.calculateOtherCostsPercentPrice();
	}

	onChangeCostPerc() {

		let recipe = this.formMenu.value;

		if (recipe && recipe.financial) {
			let costPerc = this.formMenu.value.financial.totalCostPerc;
			let totalCostValue = 0.0;
			if (costPerc) {
				totalCostValue = (this.getTotalCost() + (costPerc * this.getTotalCost()) / 100)
			}
			else {
				totalCostValue = this.getTotalCost();
			}

			this.formMenu.patchValue({
				financial: {
					totalCostValue: totalCostValue
				}
			});

		}

		this.onChangeComponent();

	}

	onChangeCostUnitValue() {
		let recipe = this.formMenu.value;

		if (recipe && recipe.financial) {

			let costUnitValue = this.formMenu.value.financial.costUnitValue;
			let costUnitPerc = 0.0;
			let rendimento = this.formMenu.value.unityQuantity?this.formMenu.value.unityQuantity:1;
			let totalIngredientsByUnityQuantity = this.getTotalCost()/rendimento;

			if (costUnitValue && costUnitValue > 0) {
				costUnitPerc = ((costUnitValue - totalIngredientsByUnityQuantity) / totalIngredientsByUnityQuantity) * 100;
			}

			this.formMenu.patchValue({
				financial: {
					costUnitPerc: costUnitPerc
				}
			});
		}

		this.onChangeComponent();

	}

	onChangeCostUnitPerc() {

		let recipe = this.formMenu.value;

		if (recipe && recipe.financial) {

			let costUnitPerc = this.formMenu.value.financial.costUnitPerc;
			let costUnitValue = 0.0;
			let rendimento = this.formMenu.value.unityQuantity?this.formMenu.value.unityQuantity:1;
			let totalIngredientsByUnityQuantity = this.getTotalCost()/rendimento;

			if (costUnitPerc) {
				costUnitValue = (totalIngredientsByUnityQuantity + (costUnitPerc * totalIngredientsByUnityQuantity) / 100);
			}
			else {
				costUnitValue = totalIngredientsByUnityQuantity;
			}

			this.formMenu.patchValue({
				financial: {
					costUnitValue: costUnitValue
				}
			});

		}

		this.onChangeComponent();

	}

	delete() {
		this._loading.show();

		this._menuService.delete(this.user.id, this.menu.id).subscribe(
			apiResponse => {
				this._loading.hide();
				this._toast.success(Messages.SUCCESS);
				this._router.navigate([CpRoutes.MENUS]);
			},
			error => {
				this._loading.hide();
			}
		)
	}

	private loadMenuAndBuildForm() {
		this._route.params.subscribe(params => {
			let id = +params['id'];

			if( !isNaN(id) && !_.isNil(id)) {

				this._loading.show();

				this._menuService.getById(id).subscribe(async(apiResponse) => {

						let menu = apiResponse.data;

						for (const ingredient of menu.ingredients) {
							if (!_.isNil(ingredient.ingredient.recipeCopiedId)) {
								const { data } = await this._recipeService.getById(ingredient.ingredient.recipeCopiedId).toPromise();
								this.recipes.push(data);
							}
						}

						this.ingredients = menu.ingredients;
						this.itens = menu.itens;

						this.createForm(menu);

						this._loading.hide();

					}, error => { this._loading.hide(); }
				);
			}
			else {
				this.createForm();
				this.saveFormSubject.next();
			}

		});

	}

	private updateTotalCostValue() {
		const totalCostValue = this.getTotalSaleValue();

		this.formMenu.patchValue({
			financial: {
				totalCostValue: totalCostValue
			}
		})
	}

	onSelected() {
		this.updateTotalCostValue();
		this.onChangeIngredients();
	}

	private createForm(menu?:Menu) {

		this.formMenu = this._formBuilder.group({
			name: [menu?menu.name:null, []],
			description: [menu?menu.description:null, []],
			unityQuantity: [menu?menu.unityQuantity:null, []],
			unit: [menu?menu.unit:null, []],
			ingredients: [menu?menu.ingredients:[], []],
			photoUrl: [menu?menu.photoUrl:null, []],
			user: [null, []],
			financial: this._formBuilder.group({
				totalCostValue: [menu?menu.financial.totalCostValue:0, []],
				totalCostPerc: [menu?menu.financial.totalCostPerc:0, []],
				costUnitValue: [menu?menu.financial.costUnitValue:0, []],
				costUnitPerc: [menu?menu.financial.costUnitPerc:0, []]
			}),
			itens: this._formBuilder.array([])
		});

		this.formMenu.controls.ingredients.valueChanges.subscribe(async(change: RecipeIngredient[]) => {

			const currentRecipesIds = this.recipes.map(recipe => recipe.id);

			for (const recipeIngredient of change) {
				if (recipeIngredient.ingredient.recipeCopiedId && !currentRecipesIds.includes(recipeIngredient.ingredient.recipeCopiedId)) {
					const { data } = await this._recipeService.getById(recipeIngredient.ingredient.recipeCopiedId).toPromise();
					this.recipes.push(data);
				}
			}

			this.onChangeCostValue();
			this.onChangeCostUnitValue();

			this.generateChartData();
		});

		this.formMenu.controls.itens.valueChanges.subscribe( (change) => {
			this.onChangeCostValue();
			this.onChangeCostUnitValue();

			this.generateChartData();

		});

		this.formMenu.controls.unityQuantity.valueChanges.subscribe( (change) => {
			this.onChangeCostValue();
			this.onChangeCostUnitValue();

			this.generateChartData();

		});

		this.formMenu.controls.unit.valueChanges.subscribe(() => {
			this.saveFormSubject.next();
		})

		this.menu = menu;

		this.generateChartData();

	}

	private generateChartData(ingredients?: MenuIngredient[]) {

		if(!ingredients) {
			ingredients = this.ingredients;
		}

		let data:number[] = [];
		let labels:string[] = [];

		let total = this.getTotalIngredients() + this.getItensTotalCost();

		_.forEach(ingredients, (ri:MenuIngredient) => {
			let price:number = this.calcIngredientPrice(ri);
			let porcent:number = (price/total)*100;
			data.push(price);
			labels.push(ri.ingredient.name + " (" + porcent.toFixed(0) + "%)");
		});

		if(this.itens && this.itens.length > 0) {
			labels.push('BREAK');
			_.forEach(this.itens, (mi:MenuItem) => {
				let price:number = this.calc.calcMenuItemPrice(mi);
				let porcent:number = (price/total)*100;
				data.push(price);
				labels.push(mi.name + " (" + porcent.toFixed(0) + "%)");
			});

		}

		this.chartData = {
			labels: labels,
			data: data
		};

		const totalFinance = this.getTotalIngredients() + this.getItensTotalCost();
		const getPercent = (value) => totalFinance === 0 ? 0 : Number((value / totalFinance) * 100).toFixed(0);
		const calcProfit = this.calcProfit() >= 0 ? this.calcProfit() : 0;

		this.financialAnalysisChartData = {
			labels: [
				`Itens (${getPercent(this.getTotalIngredients())}%)`,
				`Outros Custos (${getPercent(this.getItensTotalCost())}%)`,
				`Lucro de produção (${this.calcMargemDeLucro().toFixed(0)}%)`
			],
			data: [this.getTotalIngredients(), this.getItensTotalCost(), calcProfit]
		}

		try {
			if(ingredients.length == 0) {
				this.chartData = {};
			}
		}
		catch(e) {
			console.log(e);
		}

		this.generateCostPerItemChartData();
	}

	private getTotalSaleValue() {
		let totalSaleValue = 0;
		_.forEach(this.ingredients, (ri: MenuIngredient) => {
			totalSaleValue += (ri.saleValue * ri.amount);
		});
		return totalSaleValue;
	}

	private getTotalSumOfItemsProfits() {
		let total = 0;
		_.forEach(this.ingredients, (ri: MenuIngredient) => {
			if (ri.ingredient.recipeCopiedId) {
				const recipe = _.find(this.recipes, { id: ri.ingredient.recipeCopiedId })
				const rendimento = recipe.unityQuantity ? recipe.unityQuantity : 0;
				const totalRecipeIngredients = (this.calc.totalRecipeIngredients(recipe.ingredients)/rendimento) * ri.amount;
				const totalRecipeOtherCosts = this.calc.getItensTotalCost(recipe.itens) * ri.amount;
				const profit = Math.abs((ri.saleValue * ri.amount) - (totalRecipeIngredients + totalRecipeOtherCosts));
				total += profit;
			} else {
				const profit = Math.abs((ri.saleValue * ri.amount) - this.calc.calcIngredientPrice(ri));
				total += profit;
			}
		});
		return total;
	}

	private generateCostPerItemChartData(ingredients?: MenuIngredient[]) {
		this.costPerItemChartData = {}
		if(!ingredients) {
			ingredients = this.ingredients;
		}

		let labels:string[] = [];

		const residue = this.calcProfit();

		const getGraphData = (residue: number, ri: MenuIngredient) => {
			let totalCost = 0;
			let totalRecipeOtherCosts = 0;
			let totalRecipeIngredients = 0;

			if (ri.ingredient.recipeCopiedId) {
				const recipe = _.find(this.recipes, { id: ri.ingredient.recipeCopiedId })
				const rendimento = recipe.unityQuantity ? recipe.unityQuantity : 0;
				totalRecipeIngredients = (this.calc.totalRecipeIngredients(recipe.ingredients)/rendimento) * ri.amount;
				totalRecipeOtherCosts = this.calc.getItensTotalCost(recipe.itens) * ri.amount;
				totalCost = (totalRecipeIngredients + totalRecipeOtherCosts);
			} else {
				totalCost = this.calc.calcIngredientPrice(ri);
				totalRecipeIngredients = totalCost;
			}

			const lucroDesteItem = (ri.saleValue * ri.amount) - totalCost;

			const percentUponMenuPrice = ingredients.length > 1 ? (Math.abs(lucroDesteItem) * 100) / this.getTotalSumOfItemsProfits() : 100;

			let profit = residue * (percentUponMenuPrice / 100);

			let menuOtherCosts = this.getItensTotalCost() * (percentUponMenuPrice / 100);

			return {
				totalRecipeIngredients,
				totalRecipeOtherCosts,
				profit,
				menuOtherCosts
			}
		}

		let items:MenuIngredient[] = _.sortBy(ingredients, function(i) {
			const {
				totalRecipeIngredients,
				totalRecipeOtherCosts,
				profit,
				menuOtherCosts
			} = getGraphData(residue, i);

			return Math.abs(totalRecipeIngredients) + Math.abs(totalRecipeOtherCosts)
				 + Math.abs(profit)	+ Math.abs(menuOtherCosts);
		});

		items.reverse();
		const ingredientsCostData = [];
		const ortherCostsData = [];
		const profitData = [];
		const menuOtherCostsData = [];

		_.forEach(items, (ri: MenuIngredient, index) => {
			const {
				totalRecipeIngredients,
				totalRecipeOtherCosts,
				profit,
				menuOtherCosts
			} = getGraphData(residue, ri);

			ingredientsCostData.push(totalRecipeIngredients);
			ortherCostsData.push(totalRecipeOtherCosts);
			profitData.push(profit);
			menuOtherCostsData.push(menuOtherCosts);

			const percentAbCurve = ((index + 1) * 100) / items.length

			let curve = '';
			if (percentAbCurve <= 20) {
				curve = 'Curva A';
			} else if (percentAbCurve <= 50) {
				curve = 'Curva B';
			} else {
				curve = 'Curva C';
			}

			labels.push(`${ri.ingredient.name};${curve}`);
		});

		// console.log('Confere lucro', profitData.reduce((sum, item) => sum + item, 0))
		// console.log('Confere outros custos cardapio', menuOtherCostsData.reduce((sum, item) => sum + item, 0))

		let data: any[] = [
			{ label: 'CMV', data: ingredientsCostData, backgroundColor: '#D6E9C6', xAxisID: 'xAxis1' },
			{ label: 'Custos diretos', data: ortherCostsData, backgroundColor: '#FAEBCC', xAxisID: 'xAxis1' },
			{ label: 'Custos indiretos', data: menuOtherCostsData, backgroundColor: '#EBCCD1', xAxisID: 'xAxis1' },
			{ label: 'Lucro', data: profitData.map(profit => profit < 0 ? 0 : profit), backgroundColor: '#EBCCD1', xAxisID: 'xAxis1' },
		];

		const monetaryLoss = profitData.map(profit => profit < 0 ? profit : 0);
		const hasLoss = profitData.filter(profit => profit < 0).length > 0;
		if (hasLoss) {
			data.push({
				label: 'Prejuízo', data: [...monetaryLoss], backgroundColor: '#EBCCD1', xAxisID: 'xAxis1'
			})
		}

		this.costPerItemChartData = {
			labels,
			data
		}

		if (items.length == 0) {
			this.costPerItemChartData = {};
		}

	}

	private fetchUnits() {
		this._unitService.getReduced().subscribe(
			(apiResponse: ApiResponse) => {
				// this.units = apiResponse.data;
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

	@ViewChildren('inputToFocus') set inputF(inputF: any) {

		this.inputToFocus = inputF;

		try {
			if(!this.inputToFocus.last.nativeElement.value) {
				this.inputToFocus.last.nativeElement.focus();
			}
		}
		catch(e) { }
	};

	gerarPdf() {

		if( ! this.planService.hasPermission(RolePermission.PDF_CREATION) ) {
			return;
		}

		this.selectedMenu.general = true;
		this.selectedMenu.ingredients = true;
		this.selectedMenu.steps = true;
		this.selectedMenu.financial = true;
		this.showDialogMenu = true;
		this.pdf.refresh(this.reportOptions);

	}

	calcProfit() {

		try {

			let menu:Menu = this.formMenu.value;

			return menu.financial.totalCostValue - this.getTotalCost();

		}
		catch(e) {
			console.warn(e);
			return 0;
		}

	}

	get screenWidth() {
		return +window.innerWidth
	}

	calcUnitProfit() {

		try {

			let menu:Menu = this.formMenu.value;

			return menu.financial.costUnitValue - this.getUnitCost();

		}
		catch(e) {
			console.warn(e);
			return 0;
		}

	}

	confirmPdf() {
		this.reportOptions.setDisplay(this.selectedMenu);
		this.pdf.refresh(this.reportOptions);
		this.pdf.save('recipemaster - Cardápio ' + this.menu.name + '.pdf');
		this.showDialogMenu = false;
	}

	onPhotoChange(base64Content:any) {
		this.photo = base64Content;
		this.menuPhotoUpdated = true;
		this.saveFormSubject.next();
	}

	toggleIngredientDraggable() {
		this.ingredientDraggable = !this.ingredientDraggable;
	}

	openDialog(type: string): void {
		const dialogConfig: MatDialogConfig = {
			maxWidth: '90vw',
			width: '587px',
			maxHeight: '95vh',
			hasBackdrop: true,
			closeOnNavigation: true,
			panelClass: 'tutorial-dialog-container'
		};

		const optionsDialog = {
			menu: DialogMenuComponent,
			item: DialogMenuItemsComponent,
			otherCosts: DialogMenuOtherCostsComponent,
			financial: DialogMenuFinancialComponent
		}

		const dialogComponent = optionsDialog[type];
		this._dialogIngredientInfo.open(dialogComponent, dialogConfig);
	}


}
