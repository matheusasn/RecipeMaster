import {MenuDTO} from './../../../../../core/models/business/dto/menu-dto';
import {Router} from '@angular/router';
import {CpLoadingService} from './../../../../../core/services/common/cp-loading.service';
import {ApiResponse} from './../../../../../core/models/api-response';
import {MenuService} from './../../../../../core/services/business/menu.service';
import {ChangeDetectorRef, Component, OnInit, OnChanges, ViewChild} from '@angular/core';
import {CpRoutes} from '../../../../../core/constants/cp-routes';
import {CpCustomCardComponent} from '../../../components/common/custom-card/cp-custom-card.component';
import {CpLocalStorageService} from '../../../../../core/services/common/cp-localstorage.service';
import {RecipePosition} from '../../../../../core/models/business/recipeposition';
import {CpBaseComponent} from '../../../common/cp-base/cp-base.component';
import * as _ from 'lodash';
import { MatDialog, MatDialogConfig } from '@angular/material';

import { UserService } from '../../../../../core/auth/user.service';
import { CARD_TYPE } from '../../../../../core/models/common/card-type';
import { PlanService } from '../../../../../core/services/business/plan.service';
import { RolePermission } from '../../../../../core/models/security/perfil.enum';
import { GoogleAnalyticsService } from 'ngx-google-analytics';
import { environment } from '../../../../../../environments/environment';
import { TranslateService } from '@ngx-translate/core';
import { DialogWhatsMenuDatasheetComponent } from '../../../tutorials/menu/dialog-whats-menu-datasheet/dialog-whats-menu-datasheet.component';
import { DialogMenuComponent } from '../../../tutorials/menu/dialog-menu/dialog-menu.component';
import { DialogMenuItemsComponent } from '../../../tutorials/menu/dialog-menu-items/dialog-menu-items.component';
import { DialogMenuOtherCostsComponent } from '../../../tutorials/menu/dialog-menu-other-costs/dialog-menu-other-costs.component';
import { DialogMenuFinancialComponent } from '../../../tutorials/menu/dialog-menu-financial/dialog-menu-financial.component';

@Component({
	selector: 'm-menus',
	templateUrl: './menus.component.html',
	styleUrls: ['./menus.component.scss']
})
export class MenusComponent extends CpBaseComponent implements OnInit, OnChanges  {

	menus: MenuDTO[] = [];
	fullMenus: any[] = [];
	first = false;
	ready = false;
	searchTerm: string;
	options:any = {
		type: CARD_TYPE.CARDAPIO,
		label: "Cardápio",
		pdfVisible: true,
		shareVisible: false,
		cloneVisible: true,
		removeVisible: true
	};

	@ViewChild('dragCustom') dragCustom: CpCustomCardComponent;

	constructor(
		private dialog: MatDialog,
		private _service: MenuService,
		protected _cdr: ChangeDetectorRef,
		protected _loading: CpLoadingService,
        private _router: Router,
		private translate: TranslateService,
		private _localStorage: CpLocalStorageService,
		private _dialogPagSeguro: MatDialog,
		private userService:UserService,
        private planService: PlanService,
        protected $gaService: GoogleAnalyticsService
	) {
		super(_loading, _cdr);
	}

	ngOnChanges(){
		this.fetchMenus();
	}

	ngOnInit() {
		this.fetchMenus();
	}

	fetchMenus(name?: string): any {
		this._loading.show();
		this._service.getAllByUser(this._localStorage.getLoggedUser().id, {
			currentPage: this.pagination.currentPage,
			name
		}).subscribe(
			async (apiResponse: ApiResponse) => {
				if(apiResponse.data.length > 0) {
					this.menus = apiResponse.data;
					this.fillPaginationWithApiResponse(apiResponse);
					await this.retrieveFullMenu(this.menus);
					this.onChangeComponent();
					const newPostions: RecipePosition[] = this.updateNullPositions(this.menus);
					if (newPostions) {
						this._service.updatePositions(newPostions).subscribe(res => {});
					}
					this.delayedLoadingHide();
				} else{
					this.mock();
					this._loading.hide();
				}
			},
			error => {
				this._loading.hide();
				this.onChangeComponent();
			}
		);
	}

	async retrieveFullMenu(lastMenus: any[]) {

		if (this.menus && this.menus.length > 0) {

			await _.each(this.menus, (recipe1: any, index) => {

				const menuCompleto: any = _.find(lastMenus, (menu2: any) => {
					return menu2.id === recipe1.id && !_.isNil(menu2.financial);
				});

				if (_.isNil(menuCompleto)) {

					this.getById(recipe1.id, index);
				} else {
					this.menus[index] = menuCompleto;
					this.fullMenus[index] = menuCompleto;
				}
			});
			this.ready = true;
		}

	}

	private delayedLoadingHide() {
		setTimeout( () => {
			this._loading.hide();
		}, 100);
	}

	async getById(id, index) {
		await this._service.getById(id).subscribe(async (apiResponse: ApiResponse) => {
			const fullMenu: MenuDTO = apiResponse.data;

			this.menus[index] = fullMenu;
			this.fullMenus[index] = fullMenu;
			this.dragCustom.update(this.menus);
			this.onChangeComponent();
		}, err => {
			console.log(err);
		} );
	}

	updateNullPositions(menus: any[]): RecipePosition[] {
		const positions: RecipePosition[] = [];
		let maximo: number = 0;

		// Popula os nulos
		for (let i = menus.length - 1; i >= 0; i--) {
			if (menus[i].position === null) {
				maximo = maximo + 100;
				menus[i].position = maximo;

				const newPosition: RecipePosition = new RecipePosition();
				newPosition.id = menus[i].id;
				newPosition.position = menus[i].position;

				positions.push(newPosition);
			} else {
				maximo = menus[i].position;
			}
		}

		if (positions.length > 0) {
			return positions;
		} else {
			return null;
		}
	}

	updateNewPositions(menus: any[]): RecipePosition[] {
		const positions: RecipePosition[] = [];
		let calcPosition: number = 0;
		let changePos: boolean = false;

		if (menus.length > 1) {
			for (let i = menus.length - 1; i >= 0; i--) {
				if (i === menus.length - 1) { // último
					if (menus[i - 1].position <= 1) {
						calcPosition = 100;
						changePos = true;
					} else if (menus[i].position >= menus[i - 1].position) {
						calcPosition = Math.round(menus[i - 1].position / 2) + 1;
						changePos = true;
					}
				} else if (i === 0) { // primeiro
					if (menus[i].position <= menus[i + 1].position) {
						calcPosition = menus[i + 1].position + 100;
						changePos = true;
					}
				} else { // intermediário
					if (menus[i].position <= menus[i + 1].position) {
						calcPosition = Math.round((menus[i - 1].position - menus[i + 1].position) / 2);
						if (calcPosition <= 0) {
							calcPosition = menus[i + 1].position + 1;
						} else {
							calcPosition = calcPosition + menus[i + 1].position + 1;
						}
						changePos = true;
					}
				}

				if (changePos) {
					menus[i].position = calcPosition;

					const newPosition: RecipePosition = new RecipePosition();
					newPosition.id = menus[i].id;
					newPosition.position = menus[i].position;

					positions.push(newPosition);
					changePos = false;
				}
			}

		}

		if (positions.length > 0) {
			return positions;
		} else {
			return null;
		}
	}

	updateDragPositions(event) {
		this.menus.forEach((recipe) => {
			const item = event.find(p => recipe.id === p.id);
			if (item) {
				(recipe as any).position = item.position;
			}
		});

		const newPositions = this.updateNewPositions(event);
		if (newPositions) {
			this._service.updatePositions(newPositions).subscribe(res => {});
		}
	}

	doCreate() {

		if( this.planService.hasPermission(RolePermission.MENU_ENABLED) ) {
				console.log("ENTROU AQUI!!!!!", RolePermission.MENU_ENABLED)
            environment.ga.enabled && this.$gaService.event('do_create__perm_ok', 'menu_actions');
			this._router.navigate([CpRoutes.MENU]);
        }
        else {
				console.log("ENTROU AQUI!!!!!")

            environment.ga.enabled && this.$gaService.event('do_create__no_perm', 'menu_actions');
        }

	}

	edit(id: number) {
		this._router.navigate([CpRoutes.MENU, id]);
	}

	mock() {
		let auxCardapio: string;

		this.translate.get('INPUTS.NEW_CARDAPIO').subscribe(data => auxCardapio = data);

		const menu1 = {id: -1, name: auxCardapio, financial: { totalCostValue: 0.00}};
		this.menus = [menu1];
		this.fullMenus = [menu1];
		this.first = true;
	}

	onChangeSearch(term: string) {
		this.searchTerm = term;
	}

	onSearch(apiResponse) {
    	this.ready = false;
        const lastMenus = this.menus;
        this.menus = apiResponse.data;
        this.retrieveFullMenu(this.menus);

    }

	saibaMais(){
		window.open("https://www.google.com.br", "_blank");
	}

	openWhatsMenuDatasheetDialog(): void {
		const dialogConfig: MatDialogConfig = {
			maxWidth: '90vw',
			width: '587px',
			maxHeight: '95vh',
			hasBackdrop: true,
			closeOnNavigation: true,
			panelClass: 'tutorial-dialog-container'
		};

		this.dialog.open(DialogWhatsMenuDatasheetComponent, dialogConfig);
	}

}
