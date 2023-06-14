import { Component, OnInit, Inject, ChangeDetectorRef } from '@angular/core';
import { CpBaseComponent } from '../../../common/cp-base/cp-base.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { CpLoadingService } from '../../../../../core/services/common/cp-loading.service';
import { PurchaseListIngredient } from '../../../../../core/models/business/purchase-list-ingredient';
import { UnitService } from '../../../../../core/services/business/unit.service';
import { ApiResponse } from '../../../../../core/models/api-response';
import { TranslateService } from '@ngx-translate/core';
import { Unit } from '../../../../../core/models/business/unit';
import { FormBuilder, FormGroup } from '@angular/forms';
import { UserService } from '../../../../../core/auth/user.service';
import { User } from '../../../../../core/models/user';
import { CpLocalStorageService } from '../../../../../core/services/common/cp-localstorage.service';
import { UserDTO } from '../../../../../core/models/security/dto/user-dto';
import * as _ from 'lodash';
import { IngredientHistoryDTO } from '../../../../../core/models/business/dto/ingredient-history-dto';
import { Ingredient } from '../../../../../core/models/business/ingredient';
import { ActivatedRoute } from '@angular/router';
import { IngredientHistoryService } from '../../../../../core/services/business/ingredient-history.service';
import moment from 'moment';

@Component({
  selector: 'm-ingredient-info-purchase',
  templateUrl: './ingredient-info-purchase.component.html',
  styleUrls: ['./ingredient-info-purchase.component.scss']
})
export class IngredientInfoPurchaseComponent extends CpBaseComponent implements OnInit {

  item: any;
  units: Unit[] = [];
  formGroupIngredientPurchase: FormGroup;
  cifrao: String;
  private _currentUser: User;
  user: UserDTO;
  titleModal: String;
  idIngredient: number;
  elementId: HTMLElement;
  ingredient: Ingredient;
  priceHistory:IngredientHistoryDTO[];
  mockData: number[] = [7, 2, 5, 2, 1.8];
	mockLabels: string[] = ['Text', 'Text', 'Text', 'Text', 'Text'];
	chartData: number[];
	chartLabels: string[];
  lineChartOpacity:number = 0.7;


  constructor(
      @Inject(MAT_DIALOG_DATA) private data: any,_loading: CpLoadingService,
      _cdr: ChangeDetectorRef,
      private _dialog: MatDialogRef<PurchaseListIngredient>,
      private _unitService: UnitService,
      private _formBuilder: FormBuilder,
      private _userService: UserService,
      private _cpLocalStorageService: CpLocalStorageService,
      private translate: TranslateService,
      private _route: ActivatedRoute,
      private ingredientHistoryService: IngredientHistoryService

  ) {
    super(_loading, _cdr);
    this.item = data.item;
    this.idIngredient = (this.item.ingredient.create) ? this.idIngredient = 0 : this.idIngredient = this.item.ingredient.id;
    this.fillUser();
   }

   ngOnInit() {
    this.translate.get('MODAL.DELETE_INGREDIENTE_TITLE').subscribe(
			data => {this.titleModal = data}
    );
    this.fetchUnits();
    this.buildForm();
    this.loadPriceHistoryData();
    this.ingredient = this.item.ingredient;
  }

  doDismiss(event) {

  }

  removeRecipeIngredient() {
    this._dialog.close({
      item: this.item,
      exclude: true
    });
  }

  private getIngredientId() : number {
    if(this.item.ingredient.id == null){
      return this.item.ingredient.ingredientCopiedId;
    }else{
      return this.item.ingredient.id;
    }
  }

  private fetchUnits() {
    let ingredientId = this.getIngredientId();
    if(_.isUndefined(ingredientId)){
      ingredientId = this.idIngredient;
    }

		this._unitService.getReducedByIngredient(ingredientId).subscribe(
			(apiResponse: ApiResponse) => {
        this.units = apiResponse.data;
        this.units[0].name = "INGREDIENT.UNIDADE.TXT1";
				this.units[1].name = "INGREDIENT.UNIDADE.TXT2";
				this.units[2].name = "INGREDIENT.UNIDADE.TXT3";
				this.units[3].name = "INGREDIENT.UNIDADE.TXT4";
				this.units[4].name = "INGREDIENT.UNIDADE.TXT5";
				this.units[5].name = "INGREDIENT.UNIDADE.TXT6";
				this.units[6].name = "INGREDIENT.UNIDADE.TXT7";

        //Trecho de código para mostrar Grama/Quilograma ou Litro/Mililitros
        if(this.item.ingredient.unit != null) {
          let ingredientUnitId:number = this.item.ingredient.unit.ingredientId ? this.item.ingredient.unit.unitId : this.item.ingredient.unit.id;
          let unitsValids: any;
          if([1,2].includes(ingredientUnitId)) {
            unitsValids = _.filter(this.units, (u:Unit) => {
              return [1,2].includes(u.ingredientId?u.unitId:u.id);
            });
          }
          else if([3,4].includes(ingredientUnitId)) {
            unitsValids = _.filter(this.units, (u:Unit) => {
              return [3,4].includes(u.ingredientId?u.unitId:u.id);
            });
          }

          if(unitsValids != undefined)
            this.units = unitsValids;
        }

        this.fetchUnitsAbbreviated();
			},
			(apiResponse: ApiResponse) => { }
		)
  }

  private fetchUnitsAbbreviated() {
		this._unitService.getAbbreviated().subscribe(
			(apiResponse: ApiResponse) => {
				this.units.forEach((x, i) => {
          let position = x.id - 1;
          x.abbreviation = apiResponse.data[position].name;
        })
			},
			(apiResponse: ApiResponse) => { }
		)
  }

  private buildForm() {
    this.formGroupIngredientPurchase = this._formBuilder.group({
      qCompra: [this.item.quantCompra],
      medida1: [this.item.unitCompra],

      preco: [this.item.ingredient.purchasePrice.price],
      quantidade: [this.item.amount],
      unit: [this.item.unit],
      name: "ingredientPurchase"
    });
  }

  fillUser() {
		this._currentUser = this._cpLocalStorageService.getLoggedUser();
		if (this._currentUser) {
			this._userService.findByIdReduced(this._currentUser.id)
				.subscribe((res) => {
          this.user = res.data;
          this.cifrao = this.user.currency;
				}, err => {
				});
		}
  }

  save() {

    this.item.quantCompra = this.formGroupIngredientPurchase.value.qCompra;
    this.item.unitCompra = this.formGroupIngredientPurchase.value.medida1;
    this.item.ingredient.purchasePrice.price = this.formGroupIngredientPurchase.value.preco;
    this.item.amount = this.formGroupIngredientPurchase.value.quantidade;
    this.item.unit = this.formGroupIngredientPurchase.value.unit;

    this._dialog.close({
      item: this.item,
      exclude: false
    });

  }

  cancel() {
	  this._dialog.close({
      item: null,
      exclude: null
    });
  }

	private loadPriceHistoryData() {
		this.ingredientHistoryService.getByIngredient(this.getIngredientId()).subscribe( ({ priceHistory, chartData, chartLabels }) => {
			this.priceHistory = priceHistory;
			this.chartData = chartData;
			this.chartLabels = chartLabels;

			this.onChangeComponent();
		}, err => console.warn(err) );

	}
}
