import {Component, EventEmitter, Input, OnInit, AfterViewInit, Output, ChangeDetectorRef} from '@angular/core';
import {CommonCalcService} from '../../../../../../core/services/business/common-calc.service';
import * as _ from 'lodash';
import {MenuItem} from '../../../../../../core/models/business/menuitem';
import { MatDialogRef, MatDialog } from '@angular/material';
import { ShareModalComponent } from '../../../share-modal/share-modal.component';
import { TranslateService } from '@ngx-translate/core';
import { PlanService } from '../../../../../../core/services/business/plan.service';
import { RolePermission } from '../../../../../../core/models/security/perfil.enum';
import { UserService } from '../../../../../../core/auth/user.service';
import { CpLocalStorageService } from '../../../../../../core/services/common/cp-localstorage.service';
import { CpBaseComponent } from '../../../../common/cp-base/cp-base.component';
import { CpLoadingService } from '../../../../../../core/services/common/cp-loading.service';
import { RecipeItem } from '../../../../../../core/models/business/recipeitem';
import { CARD_TYPE } from '../../../../../../core/models/common/card-type';
import { PdfService } from '../../../pdf/pdf.service';

@Component({
	selector: 'cp-intern-drag-drop',
	templateUrl: './cp-intern-drag-drop.component.html',
	styleUrls: ['../cp-custom-card.component.scss']
})
export class CpInternDragDropComponent extends CpBaseComponent implements OnInit, AfterViewInit {

	item: any = {};

	CARD_TYPE = CARD_TYPE;

	@Input() options:any = {
		type: CARD_TYPE.RECEITA,
		label: "Receita",
		pdfVisible: true,
		shareVisible: true,
		cloneVisible: true,
		removeVisible: true
	};

	@Input() recipe;

	@Input()
	first = false;

	@Input() isTemplateRecipesScreenActive: boolean;

	@Output()
	gerarPdfEmiiter = new EventEmitter();

	@Output()
	see = new EventEmitter();

	@Output()
	delete = new EventEmitter();

	@Output()
	copy = new EventEmitter();

	@Input('item')
	set setItem(value) {
		if (value) {
			this.item = value;
			this.totalCost = this.getTotalCost();
			this.middleInfo = this.setMiddleInfo();
			this.totalIngredients = this.getTotalIngredients();
		}
	}
	totalCost = 0;
	middleInfo = 0;
	totalIngredients = 0;
	shareModalRef: MatDialogRef<ShareModalComponent>;

	titleModal1: String;
	titleModal2: String;
	titleModal3: String;
	cifrao: String;
	// user: UserDTO;
	// private _currentUser: User;

	// swalOptions:any = { type: 'question', title: `Remover ${this.options.label}?`, showCancelButton: true, confirmButtonColor: '#f4516c', cancelButtonColor: '#d2d2d2' };

	defaultBackgroundImageRecipe = 'assets/app/no-recipe.png';
	defaultBackgroundImageMenu = 'assets/app/no-menu-image.png';


	constructor(
		protected _loading: CpLoadingService,
		protected _cdr: ChangeDetectorRef,
		private calc: CommonCalcService,
		private _dialog: MatDialog,
		private translate: TranslateService,
		private planService: PlanService,
		private _userService: UserService,
		private _cpLocalStorageService: CpLocalStorageService,
		private pdfService: PdfService
	) {
		super(_loading, _cdr);
		this.fillCifrao();
	}

	ngOnInit() {
		this.translate.get('MODAL.DELETE_TXT1').subscribe(
			data => {this.titleModal1 = data}
		);
		this.translate.get('MODAL.DELETE_TXT2').subscribe(
			data => {this.titleModal2 = data}
		);
		this.translate.get('MODAL.DELETE_TXT3').subscribe(
			data => {this.titleModal3 = data}
		);
	}

	handleImgError(event, item) {
		item.photoUrl = null;
	}

	ngAfterViewInit(){
		this.fetchUnitsAbbreviated();
	}

	get screenWidth() {
		return +window.innerWidth
	}

	getSwalOptions () {
		if(this.options.label == 'Cardápio')
			return { type: 'question', title: `${this.titleModal1} ${this.titleModal3}?`, showCancelButton: true, confirmButtonColor: '#f4516c', cancelButtonColor: '#d2d2d2' };
		if(this.options.label == 'Receita')
			return { type: 'question', title: `${this.titleModal1} ${this.titleModal2}?`, showCancelButton: true, confirmButtonColor: '#f4516c', cancelButtonColor: '#d2d2d2' };
	}

	private fetchUnitsAbbreviated() {
		if(this.item.unit){
			switch(this.item.unit.name){
				case 'Gramas':
				this.translate.get('INGREDIENT.UNIDADE_ABREVIADA.TXT1').subscribe(data => this.item.unit.abbreviation = data);
				break;

				case 'Quilogramas':
				this.translate.get('INGREDIENT.UNIDADE_ABREVIADA.TXT2').subscribe(data => this.item.unit.abbreviation = data);
				break;

				case 'Mililitros':
				this.translate.get('INGREDIENT.UNIDADE_ABREVIADA.TXT3').subscribe(data => this.item.unit.abbreviation = data);
				break;

				case 'Litros':
				this.translate.get('INGREDIENT.UNIDADE_ABREVIADA.TXT4').subscribe(data => this.item.unit.abbreviation = data);
				break;

				case 'Unidades':
				this.translate.get('INGREDIENT.UNIDADE_ABREVIADA.TXT5').subscribe(data => this.item.unit.abbreviation = data);
				break;

				case 'Pessoas':
				this.translate.get('INGREDIENT.UNIDADE_ABREVIADA.TXT6').subscribe(data => this.item.unit.abbreviation = data);
				break;

				case 'Porções':
				this.translate.get('INGREDIENT.UNIDADE_ABREVIADA.TXT7').subscribe(data => this.item.unit.abbreviation = data);
				break;
			}
		}
	}

	fillCifrao() {
		this.cifrao = this._cpLocalStorageService.getCurrency();
	}

	percent(item: any, type = 'menu'): number {
		if(item.ingredients != undefined && item.financial !== undefined){
			if (type === 'menu') {
				return Number(this.calc.calcMargemDeLucro(item.ingredients, item.financial.totalCostValue, 1, this.getItensTotalCost()).toFixed(0))
			}
			let resultado = this.calc.calcMargemDeLucro(item.ingredients, item.financial.totalCostValue, 1).toFixed(0);
			return Number(resultado);
		}else{
			return 0;
		}
	}

	customPercent(valuePartial, totalValue): number {
		return valuePartial && totalValue ? +(((valuePartial * 100) / totalValue)).toFixed(0) : 0;
	}

	async gerarPdf() {
		const { data: count } = await this.pdfService.count().toPromise();

		if (count > 0) {
			if (this.planService.hasPermission(RolePermission.PDF_CREATION)) {
				this.gerarPdfEmiiter.emit(this.item);
			}
		} else {
			this.gerarPdfEmiiter.emit(this.item);
		}

	}

	clickToSee() {
		if (this.isTemplateRecipesScreenActive) {
			this.item.checked = !this.item.checked;
		} else {
			this.see.emit();
		}
	}

	deleteRecipe() {
		this.delete.emit()
	}

	doCopy() {
		this.copy.emit()
	}

	shareRecipe() {
		console.log("sharing...", this.item);

		if( ! this.planService.hasPermission(RolePermission.SHARE_ENABLED) ) {
			return;
		}

		this.shareModalRef = this._dialog.open(ShareModalComponent, {
			data: {
				recipe: this.item
			},
			panelClass: 'custom-modalbox'
		});

	}

	getTotalCost(): number {
		return this.getTotalIngredients() + this.getItensTotalCost();
	}

	getTotalIngredients(): number {
		return this.calc.totalRecipeIngredients(this.item.ingredients);
	}

	getItensTotalCost():number {
        return _.reduce(this.item.itens, (sum:number, item:RecipeItem) => {
			let valor:number = this.calc.calcRecipeItemPrice(item);
			return sum + valor;
		}, 0);
    }

	doDismiss(event) { console.log('Canceled') }

	setMiddleInfo() {
		if (this.recipe) {
			return !_.isNil(this.item.financial) && !_.isNil(this.item.financial.totalCostValue) ? this.item.financial.totalCostValue : 0;
		} else {
			return _.reduce(this.item.itens, (sum: number, item: MenuItem) => {
				const valor: number = this.calc.calcMenuItemPrice(item);
				return sum + valor;
			}, 0);
		}
	}
}
