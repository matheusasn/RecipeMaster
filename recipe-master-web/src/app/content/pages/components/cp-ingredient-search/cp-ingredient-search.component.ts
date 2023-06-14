import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef, Renderer, Output, Input, EventEmitter} from '@angular/core';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { forkJoin, of } from 'rxjs';
import { debounceTime, switchMap, merge } from 'rxjs/operators';
import { RecipeService } from '../../../../core/services/business/recipe.service';
import { CpLocalStorageService } from '../../../../core/services/common/cp-localstorage.service';
import { IngredientService } from '../../../../core/services/business/ingredient.service';
import { CpBaseComponent } from '../../common/cp-base/cp-base.component';
import { ApiResponse } from '../../../../core/models/api-response';
import { CpLoadingService } from '../../../../core/services/common/cp-loading.service';
import { Ingredient } from '../../../../core/models/business/ingredient';
import * as _ from 'lodash';
import { Recipe } from '../../../../core/models/business/recipe';
import { RecipeIngredient } from '../../../../core/models/business/recipeingredient';
import { PurchasePrice } from '../../../../core/models/common/purchaseprice';
import { User } from '../../../../core/models/user';
import { Unit } from '../../../../core/models/business/unit';
import { CommonCalcService } from '../../../../core/services/business/common-calc.service';
import { MenuService } from '../../../../core/services/business/menu.service';
import { TranslateService } from '@ngx-translate/core';
import { PurchaseListService } from '../../../../core/services/business/purchase-list.service';
import { MatDialog, MatDialogRef } from '@angular/material';
import { AmountModalComponent } from '../../business/purchase-list/amount-modal/amount-modal.component';
import { PurchaseListIngredient } from '../../../../core/models/business/purchase-list-ingredient';
import { IngredientRecipe } from '../../../../core/models/business/Ingredientrecipe';

const RECIPE_TYPE:string = 'recipe';
const INGREDIENT_TYPE:string = 'ingredient';

@Component({
  selector: 'm-cp-ingredient-search',
  templateUrl: './cp-ingredient-search.component.html',
  styleUrls: ['./cp-ingredient-search.component.scss']
})
export class CpIngredientSearchComponent extends CpBaseComponent implements OnInit {

  searchForm:FormGroup;

  @ViewChild('searchInput') searchInput: ElementRef;

  searchResult:any[] = [];

	showCreate = false;

  @Input()
  internalRecipe = false;

  @Input() copied:boolean;
  @Input() responseType:string = 'recipe-ingredient'; // ingredient ou recipe ou recipe-ingredient
  @Input() behavior:string = "search"; // search ou autocomplete
  @Input() ingredients:any[] = []; // RecipeIngredient[] ou IngredientDTO[]
  @Input() units:Unit[];
  @Input() emptySearchBehavior:string = "show";
  @Input() placeholder:string = "Digite aqui..."; //'INGREDIENT.SEARCH.PLACEHOLDER'
	@Input() isTemplateRecipesScreenActive: boolean;
  @Input() activeViewType:string = "LIST"; // search ou autocomplete

  @Output() selected = new EventEmitter();
  @Output() onSearch = new EventEmitter();
  @Output() onChange = new EventEmitter();
	@Output() onSearchIconClicked = new EventEmitter();
	@Output() onChangeViewType = new EventEmitter<string>();

  private user:User;

  amountModalRef: MatDialogRef<AmountModalComponent>;
  amountObj = {
    amount: 0,
    medida: null
  };

  linguagem: string;

  constructor(  _cdr: ChangeDetectorRef,
                _loading: CpLoadingService,
                private renderer: Renderer,
                private _formBuilder: FormBuilder,
                private _recipeService: RecipeService,
                private _ingredientService: IngredientService,
                private _localStorage: CpLocalStorageService,
                private calc:CommonCalcService,
                private _menuService: MenuService,
                private translate: TranslateService,
                private _purchaseListService: PurchaseListService,
                private _dialogIngredientInfo: MatDialog,) {
    super(_loading, _cdr);

    this.createForm();
    this.user = this._localStorage.getLoggedUser();

  }

  ngOnInit() {
    this.translate.get('TRANSLATOR.LINGUAGEM').subscribe(
			data => {
				this.linguagem = data;
			}
		);
  }

	changeViewType(type) {
		this.onChangeViewType.emit(type);
	}

	searchIconClicked() {
		this.onSearchIconClicked.emit('');
	}

  private createForm() {

    this.searchForm = this._formBuilder.group({
      searchTerm: ''
    });

    this.searchForm.get('searchTerm')
      .valueChanges
      .pipe(
        debounceTime(400),
        switchMap( (name:string = "") => {

					this.showCreate = false;

          // this._loading.show();

          if((this.behavior == 'autocomplete' || this.behavior == 'listCompra') && this.emptySearchBehavior == "hide" && _.isEmpty(name)) {
            this.onChange.emit('');
            return of([]);
          }
          else {

            this.onChange.emit(name);

            if(this.responseType == 'ingredient') {
              return this._ingredientService.getByUserIdioma(this._localStorage.getLoggedUser().id, this.linguagem, {
                currentPage: this.pagination.currentPage,
                name,
                copied: this.copied,
								historyLimit: this.copied ? 2 : 0
              });
            } else if(this.responseType == 'copied-ingredient') {
              return this._ingredientService.getCopiedByUserIdioma(this._localStorage.getLoggedUser().id, this.linguagem, {
                currentPage: this.pagination.currentPage,
                name,
                copied: this.copied,
								historyLimit: this.copied ? 2 : 0
              });
            }
            else if(this.responseType == 'recipe' && name !== '') {
              return this._recipeService.getByUser(this._localStorage.getLoggedUser().id, {
                currentPage: this.pagination.currentPage,
                name,
								publicRecipe: this.isTemplateRecipesScreenActive
              });
            }
            else if(this.responseType == 'recipe-ingredient') {
              let response1 = this._ingredientService.getByUserIdioma(this._localStorage.getLoggedUser().id, this.linguagem, {
                  currentPage: this.pagination.currentPage,
                  name
                });

              let response2 = this._recipeService.getByUser(this._localStorage.getLoggedUser().id, {
                  currentPage: this.pagination.currentPage,
                  name
                });

              return forkJoin([response1, response2]);
            }
            else if(this.responseType == 'menu') {
              return this._menuService.getByUser(this._localStorage.getLoggedUser().id, {
                currentPage: this.pagination.currentPage,
                name
              });
            }
            else if (this.responseType == 'listaCompraGeralUser') {
              return this._purchaseListService.getAllByUserPesquisa(this._localStorage.getLoggedUser().id, {
                currentPage: this.pagination.currentPage,
                name
              });
            }
            else if (this.responseType == 'listaCompra'){
              let response1 = this._ingredientService.getByUserIdioma(this._localStorage.getLoggedUser().id, this.linguagem, {
                currentPage: this.pagination.currentPage,
                name
              });
              let response2 = this._recipeService.getByUser(this._localStorage.getLoggedUser().id, {
                  currentPage: this.pagination.currentPage,
                  name
              });

              return forkJoin([response1, response2]);
            }

          }

        } )
      ).subscribe( (apiResponse: any) => {
        if(typeof apiResponse[1] !== 'undefined') {
          let request1 = apiResponse[0].data;
          request1 = _.map(request1, (item) => {
            item.type = INGREDIENT_TYPE;
            return item;
          });

          let request2 = apiResponse[1].data;
          request2 = _.map(request2, (item) => {
            item.type = RECIPE_TYPE;
            return item;
          });

          let mergedObj = <any>{};
          mergedObj.data = [];
          // Remover receitas que são ingredientes compostos
          request1 = _.filter(request1, (ingr) => {
            let ingredienteComposto = _.find(request2, (recipe:Recipe) => { return ingr.recipeCopiedId == recipe.id});
            return ingredienteComposto == null;
          });
          mergedObj.data = request1.concat(request2);
          this.buildResponse(mergedObj);
        }
        else {
          this.buildResponse(apiResponse);
        }

        this._loading.hide();

      }, (apiResponse: ApiResponse) => {
        this._loading.hide();
      });

  }

  private buildResponse(apiResponse) {
    if (this.behavior == 'autocomplete') {
      this.searchResult = apiResponse.data;
			const searchTerm = this.searchForm.get('searchTerm').value;
			if (this.responseType == 'recipe-ingredient' && searchTerm) {
				const ingredientName = searchTerm.trim();
				if (apiResponse.data && apiResponse.data.length > 0) {
					const found = apiResponse.data.filter(item => item.name.toLowerCase() === ingredientName.toLowerCase())
					if (found) {
						this.showCreate = false;
					} else {
						this.showCreate = true;
					}
				} else {
					this.showCreate = true;
				}
			} else {
				this.showCreate = true;
			}
    }
    else { // search

      if(this.responseType == 'recipe') {
        this.searchResult = apiResponse.data;
        this.onSearch.emit(apiResponse);
      }
      else if(this.responseType == 'ingredient') {
        this.searchResult = apiResponse.data;
        this.onSearch.emit(apiResponse);
      }
			else if(this.responseType == 'copied-ingredient') {
        this.searchResult = apiResponse;
        this.onSearch.emit(apiResponse);
      }
      else if(this.responseType == 'recipe-ingredient') {
        this.searchResult = apiResponse.data;
      }
      else if(this.responseType == 'menu') {
        this.searchResult = apiResponse.data;
        this.onSearch.emit(apiResponse);
      }
      else if (this.responseType == 'listaCompraGeralUser') {
        this.searchResult = apiResponse.data;
        this.onSearch.emit(apiResponse);
      }
      else if(this.responseType == 'listaCompra') {
        this.searchResult = apiResponse.data;
        this.onSearch.emit(apiResponse);
      }

    }

  }

  async createItem() {

    let unit:Unit = this.units[4];

    let item:any = {
      type: INGREDIENT_TYPE,
      name: this.searchForm.get('searchTerm').value,
      user: this.user,
      unit: unit
    };

    this.selectItem(item);
  }

  async selectItem(item:any) {

    let objectToEmit:RecipeIngredient = null;

	  if (this.responseType == 'recipe-ingredient') {

		  if (item.type == INGREDIENT_TYPE) {

			  if (!_.isNil(item.id)) {
				  let resp: ApiResponse = await this._ingredientService.getById(item.id).toPromise();
				  switch (this.linguagem) {
					  case 'en':
						  if (resp.data.ingredientCopiedId == null && resp.data.nameen != null) {
							  resp.data.name = resp.data.nameen;
						  }
						  break;
					  case 'es':
						  if (resp.data.ingredientCopiedId == null && resp.data.namees != null) {
							  resp.data.name = resp.data.namees;
						  }
						  break;
					  /*Inserir próxima case aqui quando tiver mais linguagem*/
				  }
				  objectToEmit = this.addIngredient(resp.data);
			  } else {
				  objectToEmit = this.addIngredient(item);
			  }

		  } else if (item.type == RECIPE_TYPE) {
			  let resp: ApiResponse = await this._recipeService.getById(item.id).toPromise();
			  objectToEmit = await this.addRecipe(resp.data);
		  }

	  } else if (this.responseType == 'ingredient') {
		  // this.ingredients.push(item);
		  objectToEmit = item;
	  } else { // recipe
		  // this.ingredients.push(item);
		  // objectToEmit = item;
		  const resp: ApiResponse = await this._recipeService.getById(item.id).toPromise();
		  objectToEmit = await this.addRecipe(resp.data);
	  }

    this.selected.emit(objectToEmit);

    this.searchResult = [];
    this.searchForm.reset();
    this.renderer.invokeElementMethod(this.searchInput.nativeElement,'focus');

    this.onChangeComponent();

  }

  private async addRecipe(recipe: Recipe):Promise<RecipeIngredient> {

    let unit:Unit = recipe.unit?recipe.unit:this.units[4];

    let purchasePrice:PurchasePrice = {
      price: this.calc.recipeUnitCost(recipe.ingredients, recipe.itens, recipe.unityQuantity),
      unit: unit,
      unityQuantity: 1
    };

    let ingredient:Ingredient = null;

    try {

      let response:ApiResponse = await this._ingredientService.getIngredientByRecipeCopiedId(recipe.id).toPromise();

      if(response && response.data) {

        let ics:Ingredient[] = response.data;

        if(ics && ics.length > 0) {
          ingredient = ics[0];
        }

      }

    }
    catch(e) {
      console.warn(e);
    }

    if(_.isNil(ingredient)) {
      ingredient = {
        id: null,
        name: recipe.name,
        ingredientCategory: null,
				recipeCategory: recipe.recipeCategory,
        purchasePrice,
        unit: unit,
        description: recipe.description,
        user: this.user,
        ingredientCopiedId:null,
        recipeCopiedId: recipe.id,
      };
    }

    ingredient.purchasePrice = purchasePrice;

    let recipeIngredient:RecipeIngredient = {
      amount: 1,
      unit: unit,
      correctionFactor: {
        grossWeight: 1,
        netWeight: 1
      },
      ingredient,
			saleValue: recipe.financial.costUnitValue
    };

    this.ingredients.push(recipeIngredient);

    return recipeIngredient;
  }

  private addIngredient(ingredient: Ingredient):RecipeIngredient {
    let unit:Unit = ingredient.unit?ingredient.unit:this.units[4];
		const saleValue = ingredient ? ingredient.saleValue : 0;

    if(_.isNil(ingredient.user)) {
      ingredient.ingredientCopiedId = ingredient.id;
      delete ingredient.id;
      ingredient.user = this.user;

      if(!_.isNil(ingredient.purchasePrice)) {
        delete ingredient.purchasePrice.id;
      }

    }

    if(_.isNil(ingredient.purchasePrice)) {

      let purchasePrice:PurchasePrice = {
        price: 0,
        unit: unit,
        unityQuantity: 1
      };

      ingredient.purchasePrice = purchasePrice;

    }

    let recipeIngredient:RecipeIngredient = {
      amount: ingredient.lastAmount?ingredient.lastAmount:1,
      unit: ingredient.lastUnit?ingredient.lastUnit:unit,
      correctionFactor: {
        grossWeight: ingredient.lastGrossWeight?ingredient.lastGrossWeight:1,
        netWeight: ingredient.lastNetWeight?ingredient.lastNetWeight:1
      },
      ingredient,
			saleValue
    };

		this.ingredients.push(recipeIngredient);

    return recipeIngredient;

  }

  async createItemListCompra() {

    let unit:Unit = this.units[4];

    let item:any = {
      type:       INGREDIENT_TYPE,
      name:       this.searchForm.get('searchTerm').value,
      user:       this.user,
      unit:       unit,
      rendimento: 1,
      create:     true
    };

    this.selectItemListCompra(item);
  }

  async selectItemListCompra(item:any){
    if(item.type == "recipe"){
      let resultRecipeUnit;

      this._recipeService.getById(item.id).subscribe(
        (res) => {
          resultRecipeUnit = res.data;
          item.unitRecipe = resultRecipeUnit.unit;
          item.rendimento = resultRecipeUnit.unityQuantity;
          this.modalData(item);
        }
      );
    }else{
      this.modalData(item);
    }
  }

  private modalData(item:any){
    this.amountModalRef = this._dialogIngredientInfo.open(AmountModalComponent, {
			data: {
				value: item
			}
		});

    this.amountModalRef.afterClosed().subscribe( async (amountModalData) => {
			if(!amountModalData || !amountModalData.item) {
				return;
      }

      this.amountObj = amountModalData.item;

      let objectToEmit:PurchaseListIngredient = null;

      if(this.responseType == 'listaCompra') {
        if(item.type == INGREDIENT_TYPE) {
          if(!_.isNil(item.id) && item.id != undefined) {
            let resp:ApiResponse = await this._ingredientService.getById(item.id).toPromise();
            switch(this.linguagem) {
              case "en":
                if(resp.data.ingredientCopiedId == null && resp.data.nameen != null){
                  resp.data.name = resp.data.nameen;
                }
                break;
              case "es":
                if(resp.data.ingredientCopiedId == null && resp.data.namees != null){
                  resp.data.name = resp.data.namees;
                }
                break;
              /*Inserir próxima case aqui quando tiver mais linguagem*/
            }
            objectToEmit = this.addIngredientListCompra(resp.data, this.amountObj, item);
          }
          else {
            objectToEmit = this.addIngredientListCompra(item, this.amountObj, item);
          }

        }
        else if(item.type == RECIPE_TYPE) {
          let resp:ApiResponse = await this._ingredientService.getRecipeIngredients(item.id).toPromise();

          resp.data.forEach(async e => {
            objectToEmit = this.addIngredientListCompra(e, this.amountObj, item);
          });
        }
      }
      this.selected.emit(objectToEmit);
      this.searchResult = [];
      this.searchForm.reset();
      this.renderer.invokeElementMethod(this.searchInput.nativeElement,'focus');
      this.onChangeComponent();
    });
  }

  private addIngredientListCompra(ingredient: IngredientRecipe, amountObj: any, item: any):PurchaseListIngredient {
    let unit:Unit

    if(_.isNil(ingredient.purchasePrice)) {
      unit = null;
    }else {
      unit = ingredient.purchasePrice.unit?ingredient.purchasePrice.unit:this.units[4];
    }

    if(_.isNil(ingredient.user)) {
      ingredient.ingredientCopiedId = ingredient.id;
      delete ingredient.id;
      ingredient.user = this.user;

      if(!_.isNil(ingredient.purchasePrice)) {
        delete ingredient.purchasePrice.id;
      }
    }

    if(_.isNil(ingredient.purchasePrice)) {
      let purchasePrice:PurchasePrice = {
        price: 0,
        unit: unit,
        unityQuantity: 1
      };
      ingredient.purchasePrice = purchasePrice;
    }

    let recipeIngredient:PurchaseListIngredient = {
      amount: ingredient.lastAmount?ingredient.lastAmount:1,
      unit: ingredient.lastUnit?ingredient.lastUnit:unit,
      correctionFactor: {
        grossWeight: ingredient.lastGrossWeight?ingredient.lastGrossWeight:1,
        netWeight: ingredient.lastNetWeight?ingredient.lastNetWeight:1
      },
      ingredient
    };

    if(item.type == INGREDIENT_TYPE){
      if(amountObj.amount > 0){
        recipeIngredient.quantCompra = amountObj.amount;
      }
      recipeIngredient.unitCompra = amountObj.medida;
    }
    if(item.type == RECIPE_TYPE){
      if(amountObj.amount > 0){
        let redimento = _.isNil(item.rendimento) ? 1 : item.rendimento;

        recipeIngredient.quantCompra = (amountObj.amount * ingredient.amountPurchase) / redimento;
      }
      recipeIngredient.unitCompra = ingredient.unitRecipeIngredient;
    }

    this.ingredients.push(recipeIngredient);
    return recipeIngredient;

  }

}
