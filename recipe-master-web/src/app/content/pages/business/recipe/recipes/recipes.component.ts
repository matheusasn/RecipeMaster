import { ChangeDetectorRef, Component, ViewChild, OnChanges, OnInit, AfterViewInit } from '@angular/core';
import { RecipeService } from '../../../../../core/services/business/recipe.service';
import { ApiResponse } from '../../../../../core/models/api-response';
import { RecipeDTO } from '../../../../../core/models/business/dto/recipe-dto';
import { CpLoadingService } from '../../../../../core/services/common/cp-loading.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CpRoutes } from '../../../../../core/constants/cp-routes';
import { CpBaseComponent } from '../../../common/cp-base/cp-base.component';
import { CpLocalStorageService } from '../../../../../core/services/common/cp-localstorage.service';
import * as _ from 'lodash';
import { EMPTY_RECIPE, Recipe } from '../../../../../core/models/business/recipe';
import { CommonCalcService } from '../../../../../core/services/business/common-calc.service';
import { RecipeIngredient } from '../../../../../core/models/business/recipeingredient';
import { DomSanitizer } from '@angular/platform-browser';
import { CpCustomCardComponent } from '../../../components/common/custom-card/cp-custom-card.component';
import { RecipePosition } from '../../../../../core/models/business/recipeposition';
import { NotificationService } from '../../../../../core/services/business/notification.service';
import { NotificationModalComponent } from '../../../components/notification-modal/notification-modal.component';
import { MatDialog, MatDialogConfig, MatDialogRef, MatMenuTrigger } from '@angular/material';
import { User } from '../../../../../core/models/user';
import { PlanService } from '../../../../../core/services/business/plan.service';
import { RecipeCategory } from '../../../../../core/models/business/recipecategory';
import { DeviceType, StatsService } from '../../../../../core/services/business/stats.service';
import { MessageService } from '../../../../../content/pages/components/message/message.service';
import { FirebaseService } from '../../../../../core/services/business/firebase.service';
import swal, { SweetAlertOptions } from 'sweetalert2';
import { CPPagination } from '../../../../../core/models/common/cp-pagination';

import Swal from 'sweetalert2'
import { MigrationStatusComponent } from '../../../components/migration-status/migration-status.component';
import { TranslateService } from '@ngx-translate/core';
import { PerfilPermission, RolePermission } from '../../../../../core/models/security/perfil.enum';
import { RecipeCategoryEditComponent } from '../../../components/recipe-category/r-category-edit/r-category-edit.component';
import { ToastrService } from 'ngx-toastr';
import { DeviceDetectorService } from 'ngx-device-detector';
import { HandleAppleStoreSubscriptionSyncDTO, UserService } from '../../../../../core/auth/user.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { HttpBackend, HttpClient } from '@angular/common/http';
import { environment } from '../../../../../../environments/environment';
import { AnotherAppToForeignUsersComponent } from '../../../components/message/another-app-to-foreign-users/another-app-to-foreign-users.component';
import countryCodes from '../../../../../core/constants/country-codes';
import { SpinnerButtonOptions } from '../../../../partials/content/general/spinner-button/button-options.interface';
import { RecipeFilterOrder } from '../../../../../core/models/business/dto/recipe-filter-order';
import { ReadyRecipesComponent } from '../../../tutorials/my-recipes/ready-recipes/ready-recipes.component';
import { DialogMyRecipesRecipeInsideRecipeComponent } from '../../../tutorials/my-recipes/dialog-my-recipes-recipe-inside-recipe/dialog-my-recipes-recipe-inside-recipe.component';
declare global {
	interface Window {
		handleAppleProductPurchased: any;
		handleApplePlans: any;
	}
}

@Component({
	selector: 'm-recipes',
	templateUrl: './recipes.component.html',
	styleUrls: ['./recipes.component.scss']
})
export class RecipesComponent extends CpBaseComponent implements OnInit {

	spinner: SpinnerButtonOptions = {
		active: false,
		spinnerSize: 18,
		raised: true,
		buttonColor: 'secondary',
		spinnerColor: 'accent',
		fullWidth: false,
		mode: "indeterminate"
	};

	loading: boolean;

	pageControl = {
		itensPerPage: 10,
		publicRecipe: null,
		name: null,
		sortField: 'position',
		order: null,
		sortDirection: 'DESC',
		currentPage: this.pagination.currentPage,
		categoryId: null
	}

	viewType: 'CARDS' | 'LIST' = 'LIST';
	pages: any;

	pagination: CPPagination = new CPPagination();

	totalAndUnit: string;

	sortField: string;
	sortDirection: string = 'DESC';

	cifrao: string;
	recipes: RecipeDTO[] = [];
	recipesData: any;
	fullRecipes: any[] = [];
	searchTerm: string;
	categories: RecipeCategory[] = [];
	catEscolhido: number = -1;
	linguagem: string = 'pt';

	changed = false;
	first = false;
	ready = false;
	showInfo: boolean = false;

	showUpdatePricingButton: boolean = false;
	selectedTab = 0;
	optionSeason: string = 'Total';
	seasons: string[] = ['Total', 'Unitário'];

	notificationModal: MatDialogRef<NotificationModalComponent>;
	user: User;
	totalRecipes: number;

	protected ngUnsubscribe: Subject<void> = new Subject<void>();
	creatingRecipe = false;

	isTemplateRecipesScreenActive: boolean = false;
	selectedRecipesOnTemplateScreen = []

	recipeFilterOrder: RecipeFilterOrder | string

	paginationUsed: CPPagination = new CPPagination();

	@ViewChild('dragCustom') dragCustom: CpCustomCardComponent;

	private customHttpClient: HttpClient;

	constructor(
		protected _loading: CpLoadingService,
		protected _cdr: ChangeDetectorRef,
		private _service: RecipeService,
		private _localStorage: CpLocalStorageService,
		private _router: Router,
		private calc: CommonCalcService,
		public sanitizer: DomSanitizer,
		private notificationService: NotificationService,
		private planService: PlanService,
		private statsService: StatsService,
		private messageService: MessageService,
		private _route: ActivatedRoute,
		private firebaseService: FirebaseService,
		private translate: TranslateService,
		private dialog: MatDialog,
		private userService: UserService,
		private toast: ToastrService
	) {
		super(_loading, _cdr);
	}

	// ngAfterViewInit() {
	// 		let device = DeviceType.WEB;

	// 		// @ts-ignore
	// 		if (typeof Android !== 'undefined') {
	// 			device = DeviceType.ANDROID;
	// 		} else if (this._localStorage.isIOS()) {
	// 			device = DeviceType.iOS;
	// 		}

	// 		this.statsService.getByUser(this.user.id).subscribe((res: any) => {
	// 			if (!res.data) {
	// 				this.goToPublicRecipes();
	// 			}
	// 			this.statsService.upcountAccess(device).subscribe(() => {
	// 				console.log('Sistema carregado...')
	// 				// @ts-ignore
	// 				//window.webkit.messageHandlers.ios.postMessage({ "appLoaded": true });
	// 			});
	// 		})


	// this.planService.validatePlan().subscribe((r)=> console.log(`Plano existente e dentro da validade? ${r}`),err => console.log(err));

	// // setTimeout(() => {

	// // 	this.checkMigrationToken();

	// // }, 3000);

	// }

	async ngOnInit() {

		this.user = this._localStorage.getLoggedUser();

		if (this.user) {
			const { data } = await this.userService.findByIdReduced(this.user.id).toPromise();
			if (data && data.currency) {
				this.cifrao = data.currency;
			}
			// if (!data.country || !data.city) {
			// 	try {
			// 		const response = await this.customHttpClient.get(`${environment.ipgeolocation.url}?auth=${environment.ipgeolocation.token}`).toPromise()
			// 		//@ts-ignore
			// 		await this.userService.updateUserLocality(this.user.id, response.country, response.city).toPromise();
			// 	} catch (error) {
			// 		console.warn(error)
			// 	}
			// }
		}

		this.getLanguage();
		this.getResult();
		this._service.countByUser().subscribe(response => {
			this.totalRecipes = response.data;
		})
	}

	changeViewType(type): void {
		this.viewType = type;
	}

	async exportReport() {
		try {
			await this._service.generateReport(this.user.email).toPromise()
			this.toast.success('Sucesso! Você receberá o relatório no seu e-mail.')
		} catch (error) {
		}
		this.onChangeComponent();
	}

	async toggleRecipeVisualizationOrder() {
		if (this.recipeFilterOrder === RecipeFilterOrder.POSITION) {
		} else {
		}
	}

	getLanguage() {
		this.translate.get('TRANSLATOR.LINGUAGEM').subscribe(
			data => {
				this.linguagem = data;
				this.fetchCategories();
			}
		);
	}

	private async checkIfShouldShowForeignUserModal() {
		// @ts-ignore
		if (typeof Android !== 'undefined') {
			console.log('Dispositivo Android detectado');

			const checkEuaEur = (userAgent: string) => {
				return userAgent.indexOf('euaeur') > -1
			}

			const userAgent = window.navigator.userAgent

			const isEuaEur = checkEuaEur(userAgent);

			console.log('userAgent: ' + userAgent);
			console.log('Verificando se possui euaeur no userAgent', { isEuaEur });

			if (!isEuaEur) {
				const { data } = await this.userService.findByIdReduced(this.user.id).toPromise();
				console.log('O build não é EUA EUR. País do usuário: ' + data.country);
				if (data.country && data.country !== 'Brazil') {
					//@ts-ignore
					const { country_code } = await this.customHttpClient.get(`${environment.ipgeolocation.url}?auth=${environment.ipgeolocation.token}`).toPromise();
					console.log('Usuário não é do Brasil. Seu country code é: ' + country_code);
					if (countryCodes.includes(country_code)) {
						console.log('Abrindo modal de alerta de nova versão de APP');
						//this.openForeignUsersModal();
					}
				}
			}
		}
	}

	async checkMigrationToken() {

		this._route.queryParams.subscribe(params => {

			let token: string = params['token'];

			if (token) {
				this.firebaseService.confirmMigration(token).subscribe(async (response: ApiResponse) => {

					let op: SweetAlertOptions = {
						title: 'Transferência em andamento',
						text: 'Suas receitas serão transferidas nos próximos minutos.',
						type: 'success',
						showCloseButton: true,
						showConfirmButton: false
					};

					const userResponse = await this.userService.findById(this.user.id).toPromise();
					let user: User = userResponse.data;
					const DONE = 7

					if (response.message != "OK") {

						op = null

						if (user.migrationStatus !== DONE) {
							op = {
								title: 'Desculpe!',
								text: response.errors[0],
								type: 'warning',
								showCloseButton: true,
								showConfirmButton: false
							};
						}

					} else {
						const interval = setInterval(async () => {
							const { data } = await this.userService.findById(this.user.id).toPromise();
							user = data;
							if (user.migrationStatus === DONE) {
								setTimeout(() => {
									window.location.reload()
									clearInterval(interval);
								}, 2000)
							}
						}, 5000);
					}

					if (op) {
						swal(op);
					}

				}, err => {
					console.warn(err);
				});

			}

		});

	}

	onSearch(apiResponse) {
		console.log("SAINDO DO SEARCH", apiResponse)
		this.ready = false;
	}

	updateNullPositions(recipes: any[]): RecipePosition[] {
		const positions: RecipePosition[] = [];
		let maximo: number = 0;

		recipes.forEach(recipe => {
			if (recipe.position > maximo) {
				maximo = recipe.position + 100
			}
		})

		// Popula os nulos
		for (let i = recipes.length - 1; i >= 0; i--) {
			if (recipes[i].position === null) {
				recipes[i].position = maximo;

				const newPosition: RecipePosition = new RecipePosition();
				newPosition.id = recipes[i].id;
				newPosition.position = recipes[i].position;

				positions.push(newPosition);

				maximo = maximo + 100;
			}
		}

		if (positions.length > 0) {
			return positions;
		} else {
			return null;
		}
	}

	updateNewPositions(recipes: any[]): RecipePosition[] {
		const positions: RecipePosition[] = [];
		let calcPosition: number = 0;
		let changePos: boolean = false;

		if (recipes.length > 1) {
			for (let i = recipes.length - 1; i >= 0; i--) {
				if (i === recipes.length - 1) { // último
					if (recipes[i - 1].position <= 1) {
						calcPosition = 100;
						changePos = true;
					} else if (recipes[i].position >= recipes[i - 1].position) {
						calcPosition = Math.round(recipes[i - 1].position / 2) + 1;
						changePos = true;
					}
				} else if (i === 0) { // primeiro
					if (recipes[i].position <= recipes[i + 1].position) {
						calcPosition = recipes[i + 1].position + 100;
						changePos = true;
					}
				} else { // intermediário
					if (recipes[i].position <= recipes[i + 1].position) {
						calcPosition = Math.round((recipes[i - 1].position - recipes[i + 1].position) / 2);
						if (calcPosition <= 0) {
							calcPosition = recipes[i + 1].position + 1;
						} else {
							calcPosition = calcPosition + recipes[i + 1].position + 1;
						}
						changePos = true;
					}
				}

				if (changePos) {
					recipes[i].position = calcPosition;

					const newPosition: RecipePosition = new RecipePosition();
					newPosition.id = recipes[i].id;
					newPosition.position = recipes[i].position;

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
		this.recipes.forEach((recipe) => {
			const item = event.find(p => recipe.id === p.id);
			if (item) {
				(recipe as any).position = item.position;
			}
		});

		const newPositions = this.updateNewPositions(event);
		if (newPositions) {
			this._service.updatePositions(newPositions).subscribe(res => { });
		}
	}

	getTotalIngredients(ingredients: RecipeIngredient[]): number {
		return this.calc.totalRecipeIngredients(ingredients);
	}

	onChangeSearch(term: string) {
		this.searchTerm = term;
		if (term !== '') {
			this.pageControl.name = term;
			this.pageControl.currentPage = 1;
			this.getResult();
			this._loading.hide();
		} else {
			this.pageControl.name = null;
			this.pageControl.currentPage = 1;
			this.getResult();
			this._loading.hide();
		}
	}

	goToPublicRecipes() {
		this._router.navigate([CpRoutes.PUBLIC_RECIPES], {
			queryParams: {
				reload: true
			}
		});
	}

	private openForeignUsersModal() {
		let config: MatDialogConfig = {
			data: {},
			panelClass: 'message-modal-full-screen',
			disableClose: true,
			id: 'fireign-users-modal'
		};

		this.dialog.open(AnotherAppToForeignUsersComponent, config);
	}

	fetchRecipes(name?: string): any {
		this._loading.show();
		this._service.getAllByUser(this._localStorage.getLoggedUser().id, {
			currentPage: this.pagination.currentPage,
			name
		}).subscribe(
			async (apiResponse: ApiResponse) => {
				if (!apiResponse.data || !apiResponse.data.length) {
					this.showInfo = true;
				} else {
					this.showInfo = false;
					this.first = false;
				}

				if (apiResponse.data.length > 0) {

					this.recipes = apiResponse.data;
					this.fullRecipes = apiResponse.data;
					this.fillPaginationWithApiResponse(apiResponse);

					setTimeout(() => this.dragCustom.update(this.recipes), 100)
					this.delayedLoadingHide();

					this.onChangeComponent();
					const newPostions: RecipePosition[] = this.updateNullPositions(this.recipes);
					if (newPostions) {
						this._service.updatePositions(newPostions).subscribe(res => { });
					}

					this.ready = true;
				} else {
					this.mock();
					this._loading.hide();
				}

				this.notificationService.checkNotifications(this.messageService);
			},
			error => {
				this._loading.hide();
				this.onChangeComponent();
			}
		);
	}

	private delayedLoadingHide() {
		setTimeout(() => {
			this._loading.hide();
		}, 100);
	}

	async doCreate() {

		this.creatingRecipe = true;

		const responseCountRecipes = await this._service.countByUser().toPromise()
		const totalRecipes = responseCountRecipes.data;

		let msg: string;
		this.translate.get('ALERT_PLAN.TXT_RECIPE_UNLIMITED').subscribe(data => msg = data);

		const create = async () => {
			const recipeToPersist: Recipe = EMPTY_RECIPE;
			recipeToPersist.user = this.user;

			if (_.isNil(recipeToPersist.name)) {
				let auxName: string;
				this.translate.get('INPUTS.UNTITLED').subscribe(data => auxName = data);
				recipeToPersist.name = auxName;
			}

			const insertRecipeResponse = await this._service.insert(recipeToPersist).toPromise();
			this.creatingRecipe = false;
			this._router.navigate([CpRoutes.RECIPE, insertRecipeResponse.data.id]);
		}

		if (!this.planService.hasPermission(RolePermission.RECIPE_UNLIMITED, false)) {
			if (totalRecipes >= 6) {
				this.planService.noPlanAlert(msg);
			} else {
				await create();
			}
		} else {
			await create();
		}
	}

	edit(id) {
		this._router.navigate([CpRoutes.RECIPE, id]);
	}

	mock() {
		let auxName: string;

		this.recipes = []
		this.fullRecipes = []

		this.translate.get('INPUTS.NEW_RECIPE').subscribe(data => auxName = data);
		const menu1 = { id: -1, name: auxName, financial: { totalCostValue: 0 } };
		setTimeout(() => {
			this.recipes = [menu1];
			this.fullRecipes = [menu1];
			this.onChangeComponent()
			this.first = true;
		}, 100)

	}

	private fetchCategories() {
		this._service.getCategoriesByUserLanguage(this.linguagem).subscribe(
			(apiResponse: ApiResponse) => {
				const categories: RecipeCategory[] = apiResponse.data;
				const usedCategories = categories.filter(c => c.quantityUsed > 0);
				if (usedCategories.length > 0) {
					this.categories = _.orderBy(categories, 'quantityUsed', ['desc']);
				} else {
					this.categories = categories;
				}
				this.onChangeComponent();
			},
			(apiResponse: ApiResponse) => { }
		)
	}

	getCategoria(name?: string) {
		if (this.catEscolhido == -1) {
			this.fullRecipes = [];
			this.catEscolhido = -1;
		} else {
			this._loading.show();
			this.pageControl.categoryId = this.catEscolhido
			this._service.getAllByRecipes(this._localStorage.getLoggedUser().id, this.pageControl).subscribe(
				(apiResponse: ApiResponse) => {
					this.recipesData = apiResponse.data;
					this._loading.hide();
				},
				error => {
					this._loading.hide();
					this.onChangeComponent();
				}
			);
		}
	}

	saibaMais() {
		window.open("https://www.google.com.br", "_blank");
	}

	handleCatEscolhida(id) {
		if (id > 0) {
			this.catEscolhido = id;
		} else {
			this.catEscolhido = null;
		}
		this._loading.hide();
	}

	handleGetCategoria() {
		this.getCategoria();
		this.getResult();
		this._loading.hide();
	}

	categoriesUpdated(categories) {
		this.categories = categories;
		this.getResult();
		this._loading.hide();
	}

	tabChanged({ index }) {
		this.showUpdatePricingButton = index === 1
	}

	orderUsedIngredients(field: string) {
		if (this.sortField === field) {
			if (_.isNil(this.sortDirection)) {
				this.sortDirection = 'DESC';
				this.pageControl.sortDirection = 'DESC';
			} else {
				if (this.sortDirection === 'DESC') {
					this.sortDirection = 'ASC';
					this.pageControl.sortDirection = 'ASC';
				} else if (this.sortDirection === 'ASC') {
					this.sortDirection = 'DESC';
					this.pageControl.sortDirection = 'DESC';
				}
			}
		} else {
			this.sortField = field;
			this.sortDirection = 'ASC';
			this.pageControl.sortField = field;
			this.pageControl.sortDirection = 'ASC';
		}
		this.pageControl.currentPage = this.pagination.currentPage,
			this.getResult();
		this._loading.hide();
	}

	getResult() {
		this._loading.show();
		this.loading = true;
		this._service.getAllByRecipes(this._localStorage.getLoggedUser().id, this.pageControl).subscribe(
			async (apiResponse: ApiResponse) => {
				this.pagination.currentPage = apiResponse.currentPage;
				this.pagination.itensPerPage = apiResponse.itensPerPage;
				this.pagination.totalPages = apiResponse.totalPages;
				this.recipesData = apiResponse.data;
				this.loading = false;
				this._loading.hide();
			},
			error => {
				this.onChangeComponent();
				this._loading.hide();
			}
		);
	}

	onButtonClick(event: any) {
		console.log(event.target.value);
	}

	fetchUsedIngredients(page) {
		this.pageControl.currentPage = this.pagination.currentPage;
		this.getResult();
		this._loading.hide();
	}

	redirectRouter(id?: string) {
		this._router.navigate([CpRoutes.RECIPE, id]);
	}

	openReadyRecipesTutorialDialog(): void {
		const dialogConfig: MatDialogConfig = {
			maxWidth: '90vw',
			width: '587px',
			maxHeight: '95vh',
			hasBackdrop: true,
			closeOnNavigation: true,
			panelClass: 'tutorial-dialog-container'
		};

		this.dialog.open(ReadyRecipesComponent, dialogConfig);
	}

}
