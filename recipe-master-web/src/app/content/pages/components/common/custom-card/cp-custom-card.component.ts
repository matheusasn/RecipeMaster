import {AfterViewInit, Component, EventEmitter, Input, OnInit, Output, ViewChild, DoCheck, ViewEncapsulation} from '@angular/core';
import {
	CdkDrag,
	CdkDragDrop,
	CdkDropList,
	CdkDropListContainer,
	CdkDropListGroup,
	moveItemInArray
} from '@angular/cdk/drag-drop';
import {Menu} from '../../../../../core/models/business/menu';
import {RecipeReportOptions} from '../../../../../core/report/recipe/recipereportoptions';
import {Recipe} from '../../../../../core/models/business/recipe';
import { RecipeService } from '../../../../../core/services/business/recipe.service'
import { CpLocalStorageService } from '../../../../../core/services/common/cp-localstorage.service';
import _ from 'lodash';
import { RecipeIngredient } from '../../../../../core/models/business/recipeingredient';
import { UserService } from '../../../../../core/auth/user.service';
import { CpLoadingService } from '../../../../../core/services/common/cp-loading.service';
import { CARD_TYPE } from '../../../../../core/models/common/card-type';
import { MenuService } from '../../../../../core/services/business/menu.service';
import { PlanService } from '../../../../../core/services/business/plan.service';
import { PerfilEnum, RolePermission } from '../../../../../core/models/security/perfil.enum';
import { PdfService } from '../../pdf/pdf.service';
import { PdfComponent } from '../../pdf/pdf.component';
import { PdfConfigModalOptions } from '../../pdf/components/config-modal/config-modal.component';
import { ApiResponse } from '../../../../../core/models/api-response';
import { CPPagination } from '../../../../../core/models/common/cp-pagination';
import {RecipeDTO} from '../../../../../core/models/business/dto/recipe-dto';
import { MenuDTO } from '../../../../../core/models/business/dto/menu-dto';
import { RecipeItem } from '../../../../../core/models/business/recipeitem';
import { TranslateService } from '@ngx-translate/core';
import { CommonCalcService } from '../../../../../core/services/business/common-calc.service';

@Component({
	selector: 'cp-custom-card',
	templateUrl: './cp-custom-card.component.html',
	styleUrls: ['./cp-custom-card.component.scss'],
	encapsulation: ViewEncapsulation.None
})
export class CpCustomCardComponent implements OnInit, AfterViewInit, DoCheck {

	@ViewChild(CdkDropListGroup) listGroup: CdkDropListGroup<CdkDropList>;
	@ViewChild(CdkDropList) placeholder: CdkDropList;

	public target: CdkDropList;
	public targetIndex: number;
	public source: CdkDropListContainer;
	public sourceIndex: number;
	public btnAddIsActive: boolean;

	@Input() options:any = {
		type: CARD_TYPE.RECEITA,
		label: "Receita",
		pdfVisible: true,
		shareVisible: true,
		cloneVisible: true,
		removeVisible: true
	};

	@Input()
	disabledCustom = false;

	@Input()
	first = false;

	@Input() recipesAux: RecipeDTO[];

	@Input() menusAux: MenuDTO[];

	@Input() recipes:boolean;

	@Input() selectedCategory: number;

	@Input() isTemplateRecipesScreenActive: boolean;

	@Input()
	ready = false;

	@Input('items')
	set setItens(value) {
		if (value) {
			this.itemsOriginal = value;
			this.recipes ? this.generalCount = 30 : this.generalCount = 18;
			this.distributeItems(value);
		}
	}
	generalCount: number;
	itemsOriginal: any[] = [];
	itemsOriginalPaged: any[] = [];
	user: any;
	mobile = false;

	@ViewChild('pdfReceita') pdfReceita:PdfComponent;
	@ViewChild('pdfCardapio') pdfCardapio:PdfComponent;
	@ViewChild('pdfOld') pdfOld:any;

	@Output() selectItem = new EventEmitter();
	@Output() updatedList = new EventEmitter();
	@Output() fetchRecipes = new EventEmitter();
	@Output() fetchCategories = new EventEmitter();
	@Output() fetchMenus = new EventEmitter();
	@Output() newItem = new EventEmitter();

	reportOptions: RecipeReportOptions;
	selectedItem: Recipe|Menu;
	menuRecipes: Recipe[];

	showDialog = false;
	selectedRecipe = {
		general: true,
		ingredients: true,
		steps: true,
		menuItens: true,
		financial: true,
		nutrition: true
	};

	generateLabel:string;
	nutritionalInfoPermission:boolean = false;
	CARD_TYPE = CARD_TYPE;
	pagination: CPPagination = new CPPagination();

	chartData;

	constructor(
		private recipeService: RecipeService,
		private menuService: MenuService,
		private _localStorage: CpLocalStorageService,
		private planService: PlanService,
		private userService:UserService,
		private _loading: CpLoadingService,
		private pdfService:PdfService,
		private translate: TranslateService,
		private calc: CommonCalcService,
	) {
		this.user = this._localStorage.getLoggedUser();
		this.reportOptions = new RecipeReportOptions();

		if(this.options.type == CARD_TYPE.RECEITA) {

			this.reportOptions.setDisplay({
				general: true,
				ingredients: true,
				steps: true,
				menuItens: false,
				financial: true,
				nutrition: true
			});

			this.reportOptions.setItem(new Recipe());

		}
		else {

			this.reportOptions.setDisplay({
				general: true,
				ingredients: true,
				steps: false,
				menuItens: true,
				financial: true,
				nutrition: false
			});

			this.reportOptions.setItem(new Menu());

		}

		this.target = null;
		this.source = null;
	}

	getItensTotalCost(itens): number {

		if (itens && itens.length > 0) {
			return _.reduce(itens, (sum: number, item: RecipeItem) => {
				const valor: number = this.calc.calcRecipeItemPrice(item);
				return sum + valor;
			}, 0);
		}

		return 0;

	}

	getTotalCost(recipe: Recipe): number {
		return this.calc.totalRecipeIngredients(recipe.ingredients) + this.getItensTotalCost(recipe.itens);
	}

	calcProfit(recipe: Recipe) {

		try {

			return recipe.financial.totalCostValue - this.getTotalCost(recipe);

		}
		catch(e) {
			console.warn(e);
			return 0;
		}

	}

	calcMargemDeLucro(recipe: Recipe): number {

		let rendimento:number = 1;
		let precoDeVenda:number = recipe.financial.totalCostValue;

		return this.calc.calcMargemDeLucro(recipe.ingredients, precoDeVenda, rendimento, this.getItensTotalCost(recipe.itens));

	}

	async ngOnInit() {
		await this.condition()
	}

	async ngAfterViewInit() {
		if (this.placeholder) {
			const phElement = this.placeholder.element.nativeElement;
			phElement.style.display = 'none';
			phElement.parentNode.removeChild(phElement);
		}
		this.mobile = +window.innerWidth < 768;
		this.nutritionalInfoPermission = this.planService.hasPermission(RolePermission.NUTRITION_INFO_ENABLED, false);
		await this.condition();
	}

	async ngDoCheck(){
		await this.condition();
	}

	condition(){
		if(this.recipesAux != undefined){
			if(this.recipesAux.length <= 1 && this.recipesAux[0].id == -1){
				this.btnAddIsActive = true;
			}else{
				this.btnAddIsActive = false;
			}
		}

		if(this.menusAux != undefined){
			if(this.menusAux.length <= 1 && this.menusAux[0].id == -1){
				this.btnAddIsActive = true;
			}else{
				this.btnAddIsActive = false;
			}
		}

	}

	getGenerateLabel() {

		if(this.options && this.options.type == CARD_TYPE.RECEITA) {
			this.generateLabel = 'RECIPE.MSG_GERAR_PDF_DETALHE';
		}
		else {
			this.generateLabel = 'RECIPE.MSG_GERAR_PDF_DETALHEAUX';
		}

		return this.generateLabel;

	}

	update(value) {
		this.itemsOriginalPaged = [];
		this.recipes ? this.generalCount = 30 : this.generalCount = 18;
		this.distributeItems(value);
	}

	private distributeItems(arrayOrigin: any[]) {
		console.log({arrayOrigin})
		arrayOrigin.forEach((itemOrigin, index) => {
			if (index < this.generalCount) {
				if (this.selectedCategory && this.selectedCategory !== -1) {
					if (itemOrigin.recipeCategory && itemOrigin.recipeCategory.id === this.selectedCategory) {
						const itemAlreadyInList = this.itemsOriginalPaged.find(item => item.id === itemOrigin.id)
						if (!itemAlreadyInList) {
							this.itemsOriginalPaged.push(itemOrigin);
						}
					}
				} else {
					const itemAlreadyInList = this.itemsOriginalPaged.find(item => item.id === itemOrigin.id)
					if (!itemAlreadyInList) {
						this.itemsOriginalPaged.push(itemOrigin);
					}
				}
			}
		});
	}

	onScroll() {
		// console.log(this.selectedCategory, 'category')
		if (this.ready) {
			this.generalCount = this.generalCount + 18;
			const totalLength = this.itemsOriginalPaged.length;
			const arraySide = this.itemsOriginal.slice(totalLength, totalLength + this.generalCount);
			this.distributeItems(arraySide);
		}
	}

	percent(menu: Menu): string {
		return (((menu.sellValue * 100) / menu.costPrice) - 100).toFixed(2);
	}

	showItem(item) {
		if (!this.showDialog) {
			this.selectItem.emit(item);
		}
	}

	get isBeta():boolean {

		return this.user.perfis.includes(PerfilEnum.USER_BETA);

	}

	async gerarPdf(ev:any) {
		const { id } = ev

		let selectedItem = null;

		if (this.recipes) {
			const { data } = await this.recipeService.getById(id).toPromise();
			selectedItem = {
				...data,
				type: 'recipe'
			};
		} else {
			const { data } = await this.menuService.getById(id).toPromise();
			selectedItem = data;
			const menu: Menu = data;
			this._loading.show();

			const promises = menu.ingredients.map(ingredient => {
				if (ingredient.ingredient.recipeCopiedId) {
					return this.recipeService.getById(ingredient.ingredient.recipeCopiedId).toPromise()
				}
			});

			const promisesResult = await Promise.all(promises.filter(x => x !== undefined))

			let menuRecipes = _.map(promisesResult, (apiresp:ApiResponse) => {
				return apiresp.data;
			});

			this.menuRecipes = menuRecipes;
			this._loading.hide();
		}

		const { data: count } = await this.pdfService.count().toPromise();

		if (count > 0) {
			if(!this.planService.hasPermission(RolePermission.PDF_CREATION) ) {
				return;
			}
		}
		this.selectedItem = selectedItem;

		let options:PdfConfigModalOptions = {
			type: this.options && this.options.type?this.options.type:(this.recipes===true?CARD_TYPE.RECEITA:CARD_TYPE.CARDAPIO),
			service: null
		};

		const modal = this.pdfService.openConfig(options);

		modal.beforeClosed().subscribe(() => this._loading.show());

		modal.afterClosed().subscribe(async (response:any) => {
			if(response == PdfService.PDF_GENERATE) {

				if(options.type == CARD_TYPE.RECEITA) {
					await new Promise(r => setTimeout(r, 1000));
					this.pdfReceita.save('recipemaster - Receita ' + this.selectedItem.name + '.pdf');
				}
				else {
					this.pdfCardapio.save('recipemaster - Cardápio ' + this.selectedItem.name + '.pdf');
				}
			}
			this._loading.hide();
		});

	}

	confirmPdf() {
		this.showDialog = false;
		this.pdfOld.refresh(this.reportOptions);

		let filename:string = 'recipemaster - ' + this.options.label + ' ' + this.selectedItem.name + '.pdf';

		this.pdfOld.save(filename);
	}

	enter = (drag: CdkDrag, drop: CdkDropList) => {
		if (drop === this.placeholder) {
			return true;
		}

		const phElement = this.placeholder.element.nativeElement;
		const dropElement = drop.element.nativeElement;

		const dragIndex = __indexOf((<Element> dropElement.parentNode).children, drag.dropContainer.element.nativeElement);
		const dropIndex = __indexOf((<Element> dropElement.parentNode).children, dropElement);

		if (!this.source) {
			this.sourceIndex = dragIndex;
			this.source = drag.dropContainer;

			const sourceElement = this.source.element.nativeElement;
			phElement.style.width = sourceElement.clientWidth + 'px';
			phElement.style.height = sourceElement.clientHeight + 'px';

			sourceElement.parentNode.removeChild(sourceElement);
		}

		this.targetIndex = dropIndex;
		this.target = drop;

		phElement.style.display = '';
		dropElement.parentNode.insertBefore(phElement, (dragIndex < dropIndex)
			? dropElement.nextSibling : dropElement);

		this.source.start();
		this.placeholder.enter(drag, drag.element.nativeElement.offsetLeft, drag.element.nativeElement.offsetTop);

		return false;
	}

	deleteRecipe(itemId) {
		if(this.options.type == CARD_TYPE.CARDAPIO) {
			this.menuService.delete(this.user.id, itemId)
			.subscribe(
				() => {
					this.itemsOriginalPaged = this.itemsOriginalPaged
						.filter(item => item.id !== itemId)
					this.updatedList.emit(this.itemsOriginalPaged);
					this.fetchMenus.emit();
				},
				err => console.warn(err)
			);

		}
		else {
			this.recipeService.delete(this.user.id, itemId)
				.subscribe(
					() => {
						this.itemsOriginalPaged = this.itemsOriginalPaged
							.filter(item => item.id !== itemId)
						this.updatedList.emit(this.itemsOriginalPaged);
						this.fetchRecipes.emit();
						this.fetchCategories.emit();
					},
					err => console.warn(err)
				)
		}

	}

	private async copyRecipe(item:Recipe) {
		const { data: recipe } = await this.recipeService.getById(item.id).toPromise()

		try {
			const recipeCopy:Recipe = Object.assign({}, recipe)
			delete recipeCopy.id;
			delete recipeCopy.financial.id;
			recipeCopy.steps = recipeCopy.steps.map(step => {
				delete step.id;
				return step;
			})

			if(recipeCopy.itens) {

				recipeCopy.itens = recipeCopy.itens.map( (item) => {
					delete item.id;
					return item;
				} );

			}

			if (recipeCopy.fixedCosts) {
				recipeCopy.fixedCosts = recipeCopy.fixedCosts.map(item => {
					delete item.id;
					return item;
				})
			}
			if (recipeCopy.variableCosts) {
				recipeCopy.variableCosts = recipeCopy.variableCosts.map(item => {
					delete item.id;
					return item;
				})
			}

			recipeCopy.ingredients = recipeCopy.ingredients.map( (ri:RecipeIngredient) => {
				ri = this.unsetCommonFields(ri);
				ri.correctionFactor = this.unsetCommonFields(ri.correctionFactor);
				return ri;
			} );

			try {
				delete recipeCopy.label.id;
			}
			catch(e) {
				console.warn(e.message);
			}

			recipeCopy.name = `Cópia de ${recipeCopy.name}`;

			this.recipeService.insert(recipeCopy).subscribe(
				res => {
					this.itemsOriginalPaged = [res.data].concat(this.itemsOriginalPaged)
					this.updatedList.emit(this.itemsOriginalPaged);
					this.fetchRecipes.emit();
				},
				err => console.warn(err)
			);

		} catch (err) {
			console.warn(err)
		}

	}

	private copyMenu(item:Menu) {

		this.menuService.copy(item.id).subscribe(
			(res:ApiResponse) => {
				this.itemsOriginalPaged = [res.data].concat(this.itemsOriginalPaged);
				this.updatedList.emit(this.itemsOriginalPaged);
			},
			err => console.warn(err)
		);

	}

	async copy(item:any) {
		const responseCountRecipes = await this.recipeService.countByUser().toPromise()
		const totalRecipes = responseCountRecipes.data;

		if(this.options.type == CARD_TYPE.CARDAPIO) {
			this.copyMenu(item);
		}
		else {
			let msg: string;
			this.translate.get('ALERT_PLAN.TXT_RECIPE_UNLIMITED').subscribe(data => msg = data);

			if (!this.planService.hasPermission(RolePermission.RECIPE_UNLIMITED, false)) {
				if (totalRecipes >= 6) {
						this.planService.noPlanAlert(msg);
					} else {
						await this.copyRecipe(item);
					}
			} else {
				await this.copyRecipe(item);
			}
		}

	}

	private unsetCommonFields(o:any) {
		delete o.id;
		delete o.inclusion;
		delete o.uuid;
		delete o.edition;
		delete o.status;

		return o;
	}

	drop() {
		if (!this.target) {
			return;
		}

		const phElement = this.placeholder.element.nativeElement;
		const parent = phElement.parentNode;

		phElement.style.display = 'none';

		parent.removeChild(phElement);
		parent.appendChild(phElement);
		parent.insertBefore(this.source.element.nativeElement, (<Element> parent).children[this.sourceIndex]);

		this.target = null;
		this.source = null;

		if (this.sourceIndex !== this.targetIndex) {
			moveItemInArray(this.itemsOriginalPaged, this.sourceIndex, this.targetIndex);
		}

		this.updatedList.emit(this.itemsOriginalPaged);
	}
}

function __indexOf(collection, node) {
	return Array.prototype.indexOf.call(collection, node);
}
