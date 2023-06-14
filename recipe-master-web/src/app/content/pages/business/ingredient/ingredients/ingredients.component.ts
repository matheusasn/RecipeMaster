import { MatDialog, MatDialogConfig } from '@angular/material';
import { IngredientInfoFactorComponent } from '../ingredient-info-factor/ingredient-info-factor.component';
import { IngredientComponent } from '../ingredient/ingredient.component';
import { ApiResponse } from './../../../../../core/models/api-response';
import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef, NgZone, ViewChildren, QueryList } from '@angular/core';
import { IngredientService } from '../../../../../core/services/business/ingredient.service';
import { IngredientDTO } from '../../../../../core/models/business/dto/ingredient-dto';
import { CpLoadingService } from '../../../../../core/services/common/cp-loading.service';
import { Router } from '@angular/router';
import { CpRoutes } from '../../../../../core/constants/cp-routes';
import { CpLocalStorageService } from '../../../../../core/services/common/cp-localstorage.service';
import { CpFilter } from '../../../../../core/models/common/filter';
import { CPPagination } from '../../../../../core/models/common/cp-pagination';
import { CpBaseComponent } from '../../../common/cp-base/cp-base.component';
import { Observable, fromEvent } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import _ from 'lodash';
import { UserService } from '../../../../../core/auth/user.service';
import { IngredientHistory } from '../../../../../core/models/business/dto/ingredient-history';
import { IngredientHistoryService } from '../../../../../core/services/business/ingredient-history.service';
import { Ingredient } from '../../../../../core/models/business/ingredient';
import { TabDirective } from '../../../components/common/tab/tab.component';
import { ToastrService } from 'ngx-toastr';
import { PdfIngredientsUsedComponent } from '../../../components/pdf/pdf-ingredients-used/pdf-ingredients-used.component';
import { DialogIngredientsComponent } from '../../../tutorials/ingredients/dialog-ingredients/dialog-ingredients.component';
import { DialogIngredientsUsedComponent } from '../../../tutorials/ingredients/dialog-ingredients-used/dialog-ingredients-used.component';
import { log } from 'console';

@Component({
	selector: 'm-ingredients',
	templateUrl: './ingredients.component.html',
	styleUrls: ['./ingredients.component.scss']
})
export class IngredientsComponent extends CpBaseComponent implements OnInit {

	ingredients: IngredientDTO[];
	usedIngredients: IngredientDTO[];
	linguagem: string;

	mockQuantityRecipe:String="3 receitas";
	mockValueRecipe:String="R$3,50";
	mockVariationRecipe:String="+2,02%";

	public searchTerm: string;
	public usedSearchTerm: string;

	sortField: string;
	sortType: string = 'DESC';

	cifrao: String;
	pricingModels;
	isUpdatingPricing: boolean = false;
	showUpdatePricingButton: boolean = false;
	selectedTab = 0;

	countUsedIngredients = 0;

	paginationUsed: CPPagination = new CPPagination();

	@ViewChild('pdf') pdf: PdfIngredientsUsedComponent;

	protected fillPaginationUsedWithApiResponse(apiResponse: ApiResponse) {
			this.paginationUsed = {
					currentPage: apiResponse.currentPage,
					itensPerPage: apiResponse.totalElements,
					totalPages: apiResponse.totalPages
			};
    }

	constructor(
		_cdr: ChangeDetectorRef,
		_loading: CpLoadingService,
		private _service: IngredientService,
		private _localStorage: CpLocalStorageService,
		private _router: Router,
		private _dialog: MatDialog,
		private ngZone: NgZone,
		private translate: TranslateService,
		private userService: UserService,
		private ingredientHistoryService: IngredientHistoryService,
		private toast: ToastrService,
		private dialog: MatDialog
	) {
		super(_loading, _cdr);
		const { id } = this._localStorage.getLoggedUser();
		userService.findByIdReduced(id).subscribe(response => this.cifrao = response.data.currency);
	}

	ngOnInit() {
		this.translate.get('TRANSLATOR.LINGUAGEM').subscribe(
			async data => {
				this.linguagem = data;
				this.fetchUsedIngredients();
				this.fetchIngredients();
			}
		);
	}

	generatePdf() {
		this.pdf.save();
	}

	getIngredientRecipes(i) {

		try {
			return i.recipes;
		}
		catch(e) {
			console.warn(e.message);
			return 0;
		}

	}

	getIngredientPrice(i) {

		try {
			return i.price;
		}
		catch(e) {
			console.warn(e.message);
			return 0;
		}

	}

	async toggleUpdatePricing() {

		if (this.usedIngredients.length === 0) {

			const message = await this.translate.get('NO_INGREDIENTS_MESSAGE').toPromise();

			this.toast.warning(message);

			return;
		}

		const willUpdate = !this.isUpdatingPricing;

		if (willUpdate) {
			this.paginationUsed.itensPerPage = this.paginationUsed.itensPerPage * this.paginationUsed.totalPages
		} else {
			this.paginationUsed.itensPerPage = 10
		}

		await this.fetchUsedIngredients();

		this.isUpdatingPricing = !this.isUpdatingPricing;
	}

	async updatePricing(index) {
		const pricing = this.pricingModels[index];
		const ingredient = this.usedIngredients[index];

    try {

			const { data } = await this._service.getById(ingredient.id).toPromise();
			const fullIngredient: Ingredient = data;

			if (pricing === fullIngredient.purchasePrice.price) return;

			fullIngredient.purchasePrice.price = pricing;

      let history: IngredientHistory = {
        ingredient: fullIngredient,
        price: fullIngredient.purchasePrice.price,
        unit: fullIngredient.purchasePrice.unit,
        unityQuantity: fullIngredient.purchasePrice.unityQuantity
      };

      this.ingredientHistoryService.add([history]);

			await this._service.update(fullIngredient).toPromise();

    }
    catch(e) {
      console.warn(e);
    }
	}

	@ViewChildren(TabDirective) ipt!: QueryList<ElementRef>;
	onEnter(e: Event) {
    this.ipt["_results"][(<HTMLInputElement>e.target).tabIndex%(+this.ipt["_results"].length-1)+1].el.nativeElement.focus();
  }

	tabChanged({ index }) {
		this.showUpdatePricingButton = index === 1
	}

	getIngredientPriceVariation(i:IngredientDTO) {

		let variation:number = 0;

		try {

			let price0:number = i.history[0].price;
			let price1:number = i.history[1].price;

			if (price1 === 0) {
				return '+0%';
			}

			if(price0 > price1) {
				return `+${ ( ((price0/price1) - 1) * 100).toFixed(2) }%`;
			}
			else {
				return `-${ (( (price1/price0) - 1) * 100).toFixed(2) }%`;
			}

		}
		catch(e) {
			console.warn(e.message);
			return `+${variation}%`;
		}

	}

	onSearch(apiResponse) {
		this.ingredients = apiResponse.data;
		this.fillPaginationWithApiResponse(apiResponse);
	}

	onSearchUsed(apiResponse) {
		this.usedIngredients = apiResponse.data;
		console.log(this.usedIngredients, apiResponse.data)
		this.fillPaginationUsedWithApiResponse(apiResponse);
	}

	onChangeSearch(term:string) {
		this.searchTerm = term;
	}

	onChangeUsedSearch(term:string) {
		this.usedSearchTerm = term;
	}

	orderUsedIngredients(field: string) {
		if (this.sortField === field) {
			if (_.isNil(this.sortType)) {
				this.sortType = 'DESC';
			} else {
				if (this.sortType === 'DESC') {
					this.sortType = 'ASC'
				} else if (this.sortType === 'ASC') {
					this.sortType = 'DESC'
				}
			}
		} else {
			this.sortField = field;
			this.sortType = 'ASC';
		}

		this.fetchUsedIngredients(this.searchTerm);
	}

	async fetchUsedIngredients(name?: string) {
		this._loading.show();
		
		try {
			const apiResponse = await this._service.getCopiedByUserIdioma(this._localStorage.getLoggedUser().id, this.linguagem, {
				currentPage: this.paginationUsed.currentPage,
				name,
				copied: true,
				historyLimit: 2,
				usedInRecipe: true,
				sortField: this.sortField,
				sortType: this.sortType,
				itensPerPage: 10
			}).toPromise();

			if (!name) {
				this.countUsedIngredients = apiResponse.totalElements;
			}

			this.usedIngredients = apiResponse.data;

			this.fillPaginationUsedWithApiResponse(apiResponse);
			this._loading.hide();

			this.pricingModels = this.usedIngredients.map(ingredient => ingredient['price'])

		} catch (error) {
			this._loading.hide();
		}

	}

	fetchIngredients(name?: string) {
        this._loading.show();

		this._service.getByUserIdioma(this._localStorage.getLoggedUser().id, this.linguagem, {
			currentPage: this.pagination.currentPage,
            name

		}).subscribe((apiResponse: ApiResponse) => {
			this.ingredients = apiResponse.data;
			this.fillPaginationWithApiResponse(apiResponse);
			this._loading.hide();
		}, (apiResponse: ApiResponse) => {
			this._loading.hide();
		});

	}

	doNew() {
		this._router.navigate([CpRoutes.INGREDIENT_FORM]);
	}

	edit(id: number) {
		this._service.getById(id).subscribe(async (apiResponse: ApiResponse) => {
			const ingredient = apiResponse.data
			const isIngredientDefault = !ingredient.user
			if (isIngredientDefault) {
				const newUserIngredient = {
					...ingredient,
					ingredientCopiedId: ingredient.id,
					purchasePrice: {
						...ingredient.purchasePrice,
						price: 0,
						status: 0,
						unityQuantity: 0
					}
				}

				delete newUserIngredient.id;
				delete newUserIngredient.purchasePrice.id;

				const { data } = await this._service.insert(newUserIngredient).toPromise();
				id = data.id
				this.fetchIngredients();
				this.fetchUsedIngredients();
			}

			const dialog = this._dialog.open(IngredientComponent, {
				data: { id },
				panelClass: 'cpDialogPage',
				closeOnNavigation: true,
			});

			dialog.afterClosed().subscribe(async response => {
				this.fetchUsedIngredients();
				this.fetchIngredients();
			});
		})
	}

	openIndegrientsDialog(): void {
		const dialogConfig: MatDialogConfig = {
			maxWidth: '90vw',
			width: '587px',
			maxHeight: '95vh',
			hasBackdrop: true,
			closeOnNavigation: true,
			panelClass: 'tutorial-dialog-container'
		};

		this.dialog.open(DialogIngredientsComponent, dialogConfig);
	}

	openIndegrientsUsedDialog(): void {
		const dialogConfig: MatDialogConfig = {
			maxWidth: '90vw',
			width: '587px',
			maxHeight: '95vh',
			hasBackdrop: true,
			closeOnNavigation: true,
			panelClass: 'tutorial-dialog-container'
		};

		this.dialog.open(DialogIngredientsUsedComponent, dialogConfig);
	}
}
