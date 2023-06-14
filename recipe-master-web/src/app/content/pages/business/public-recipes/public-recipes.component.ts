import { AfterViewInit, ChangeDetectorRef, Component, OnChanges, OnInit, QueryList, ViewChild, ViewChildren } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import _, { chain, groupBy } from "lodash";
import { DragScrollComponent } from "ngx-drag-scroll";
import { UserService } from "../../../../core/auth/user.service";
import { CpRoutes } from "../../../../core/constants/cp-routes";
import { ApiResponse } from "../../../../core/models/api-response";
import { RecipeDTO } from "../../../../core/models/business/dto/recipe-dto";
import { RecipeCategory } from "../../../../core/models/business/recipecategory";
import { User } from "../../../../core/models/user";
import { RecipeService } from "../../../../core/services/business/recipe.service";
import { CpLoadingService } from "../../../../core/services/common/cp-loading.service";
import { CpLocalStorageService } from "../../../../core/services/common/cp-localstorage.service";
import { CpBaseComponent } from "../../common/cp-base/cp-base.component";
import { CpCustomDragScrollComponent } from "../../components/cp-custom-drag-scroll/cp-custom-drag-scroll.component";

@Component({
    selector: 'm-public-recipes',
    templateUrl: './public-recipes.component.html',
    styleUrls: ['./public-recipes.component.scss']
})
export class PublicRecipesComponent extends CpBaseComponent implements OnInit, OnChanges {

	recipes: any[] = [];
	grouppedRecipes: any[] = [];
	searchTerm: string;
	categories: RecipeCategory[] = [];
	catEscolhido: number = -1;
	linguagem: string = 'pt';
	changed = false;
	first = false;
	ready = false;
	showInfo: boolean = false;
	totalRecipes: number;
	selectedRecipes = [];
	user: User;

	isScreenReady = false;

	constructor(
		protected _loading: CpLoadingService,
		protected _cdr: ChangeDetectorRef,
		private _service: RecipeService,
		private _localStorage: CpLocalStorageService,
		private _router: Router,
		private _route: ActivatedRoute,
		private translate: TranslateService,
		private userService: UserService,
	) {
		super(_loading, _cdr);
	}

	ngOnChanges(){
		this.fetchRecipes();
	}

	async ngOnInit() {
		this._route.queryParams.subscribe( params => {
			if (params['reload']) {
				// @ts-ignore
				window.location = window.location.href.split("?")[0];
			}
			this.user = this._localStorage.getLoggedUser();
			this.fetchRecipes();
			this.getLanguage();
			this.populateTotalRecipes();
		})
	}


	get screenWidth() {
		return +window.innerWidth
	}

	populateTotalRecipes() {
		this._service.countByUser("?publicRecipes=true").subscribe(response => {
			this.totalRecipes = response.data;
		})
	}

	getLanguage() {
		this.translate.get('TRANSLATOR.LINGUAGEM').subscribe(
			data => {
				this.linguagem = data;
				this.fetchCategories();
			}
		);
	}

	async onClickButtonTemplateScreen() {
		if (this.isSomeRecipeSelectedOnTemplateScreen) {
			await this.copyFromPublicRecipes();
		} else {
			this._router.navigate([CpRoutes.RECIPES]);
		}
	}

	async copyFromPublicRecipes() {
		this._loading.show();
		const selectedRecipesIds = this.recipes.filter(recipe => recipe.checked).map(recipe => recipe.id);
		await this._service.copyPublicRecipes(selectedRecipesIds).toPromise()
		this._loading.hide();
		this._router.navigate([CpRoutes.RECIPES]);
	}

	get isSomeRecipeSelectedOnTemplateScreen() {
		return this.recipes.filter(recipe => recipe.checked).length > 0;
	}

	onSearch(apiResponse) {
		this.ready = false;
		this.recipes = apiResponse.data;
		this.groupRecipes(apiResponse.data);
	}

	onChangeSearch(term: string) {
		this.searchTerm = term;
		if (term === '') {
			this.fetchRecipes();
		}
	}

	private groupRecipes(recipes: any) {
		const attributeName =
		this.linguagem === 'pt' ?
			'name' : this.linguagem === 'en' ?
			'namees' : 'namees'

		const grouppedRecipes = chain(recipes)
			.filter(recipe => !!recipe.recipeCategory)
			.groupBy((recipe) => recipe.recipeCategory.id)
			.map((value, key) => ({
				categoryId: key,
				caregoryName: value[0].recipeCategory[attributeName],
				recipes: value
			}))
			.value()

		this.grouppedRecipes = grouppedRecipes;

		this.onChangeComponent();
	}

	fetchRecipes(name?: string): any {
		this._loading.show();
		this._service.getAllByUser(this._localStorage.getLoggedUser().id, {
			currentPage: this.pagination.currentPage,
			name,
			publicRecipe: true
		}).subscribe(
			async (apiResponse: ApiResponse) => {
				this.recipes = apiResponse.data;

				this.groupRecipes(apiResponse.data);

				this._loading.hide();

				this.isScreenReady = true;
			},
			error => {
				this._loading.hide();
				this.onChangeComponent();
			}
		);
	}

	// navigate back to recipes
	goToPublicRecipes() {
		this._router.navigate([CpRoutes.RECIPES]);
	}

	private fetchCategories() {
		this._service.getCategoriesByUserLanguage(this.linguagem, "?publicCategories=true").subscribe(
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
			this.recipes = [];
			this.fetchRecipes();
			this.catEscolhido = -1;
		} else {
			this._loading.show();
			this._service.getCategoryRecipe(this.catEscolhido, this._localStorage.getLoggedUser().id, {
				currentPage: this.pagination.currentPage,
				name
			}).subscribe(
				(apiResponse: ApiResponse) => {
					if (apiResponse.data.length > 0) {
						this.recipes = apiResponse.data;
						this.groupRecipes(apiResponse.data);
						this.fillPaginationWithApiResponse(apiResponse);
						this._loading.hide();
						this.onChangeComponent();

						this.ready = true;

						this.populateTotalRecipes();

					} else {
						this.recipes = [];
						this.grouppedRecipes = []
						this._loading.hide();
					}

				},
				error => {
					this._loading.hide();
					this.onChangeComponent();
				}
			);
		}
	}

	handleCatEscolhida(id) {
		this.catEscolhido = id;
	}

	handleGetCategoria() {
		this.getCategoria();
	}

	categoriesUpdated(categories) {
		this.categories = categories;
		this.onChangeComponent();
	}

}
