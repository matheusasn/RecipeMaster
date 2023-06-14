import { Component, OnInit, Inject, ChangeDetectorRef } from '@angular/core';
import { CpBaseComponent } from '../../../common/cp-base/cp-base.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { CpLoadingService } from '../../../../../core/services/common/cp-loading.service';
import { PurchaseListIngredient } from '../../../../../core/models/business/purchase-list-ingredient';
import { UnitService } from '../../../../../core/services/business/unit.service';
import { ApiResponse } from '../../../../../core/models/api-response';
import { Unit } from '../../../../../core/models/business/unit';
import { FormBuilder, FormGroup } from '@angular/forms';
import * as _ from 'lodash';
import { Ingredient } from '../../../../../core/models/business/ingredient';
import { IngredientService } from '../../../../../core/services/business/ingredient.service';

@Component({
  selector: 'm-amount-modal',
  templateUrl: './amount-modal.component.html',
  styleUrls: ['./amount-modal.component.scss']
})
export class AmountModalComponent extends CpBaseComponent implements OnInit {

  item = {
    amount: 0,
    medida: null
  };
  obj: any;
  units: Unit[] = [];
  ingredientSelect: Ingredient;
  recipe: boolean = false;
  idIngredient: number;
  recipeUnit: any;

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any,
    _loading: CpLoadingService,
    _cdr: ChangeDetectorRef, 
    private _formBuilder: FormBuilder,
    private _dialog: MatDialogRef<PurchaseListIngredient>,
    private _unitService: UnitService,
    private _ingredientService: IngredientService
  ) { 
    super(_loading, _cdr);
    this.obj = data.value;
    this.idIngredient = (this.obj.create) ? this.idIngredient = 0 : this.idIngredient = this.obj.id;
    if(this.obj.type == "recipe"){
      this.recipe = true;
      this.recipeUnit = this.obj.unitRecipe;
    }else{
      this.recipe = false;
      this.recipeUnit = null;
    }
  }

  ngOnInit() {
    this.fetchUnits();
    if(this.recipeUnit != null){
      this.item.medida = this.recipeUnit;
    }
    this.buildForm();
  }

  private fetchUnits() {
		this._unitService.getReducedByIngredient(this.idIngredient).subscribe(
			(apiResponse: ApiResponse) => {
        this.units = apiResponse.data;
        this.units[0].name = "INGREDIENT.UNIDADE.TXT1";
				this.units[1].name = "INGREDIENT.UNIDADE.TXT2";
				this.units[2].name = "INGREDIENT.UNIDADE.TXT3";
				this.units[3].name = "INGREDIENT.UNIDADE.TXT4";
				this.units[4].name = "INGREDIENT.UNIDADE.TXT5";
				this.units[5].name = "INGREDIENT.UNIDADE.TXT6";
        this.units[6].name = "INGREDIENT.UNIDADE.TXT7";
        
        if(this.obj.create) {
          this.fetchUnitsAbbreviated();
        }else{
          //Trecho de código para mostrar Grama/Quilograma ou Litro/Mililitros
          this._ingredientService.getById(this.obj.id).subscribe(
            (ApiResponse: ApiResponse) => {
              this.ingredientSelect = ApiResponse.data;
  
              if(!this.recipe && this.ingredientSelect.unit != null){
                let ingredientUnitId:number = this.ingredientSelect.unit.ingredientId ? this.ingredientSelect.unit.unitId : this.ingredientSelect.unit.id;
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
            }
          );
        }
			},
			(apiResponse: ApiResponse) => { }
		)
  }
  
  private fetchUnitsAbbreviated() {
		this._unitService.getAbbreviated().subscribe(
			(apiResponse: ApiResponse) => {
				this.units.forEach((x, i) => x.abbreviation = apiResponse.data[i].name)
			},
			(apiResponse: ApiResponse) => { }
		)
  }

  private buildForm() {this.formGroup = this._formBuilder.group({
      amountView: [this.item.amount],
      medidaView: [this.item.medida]
    });

    if(this.recipe){
      this.formGroup.controls['medidaView'].disable();
    }
  }

  btnExit() {
		this._dialog.close();
  }

  save() {
    if(!this.recipe){
      this._unitService.getReducedByIngredient(this.idIngredient).subscribe(
        (apiResponse: ApiResponse) => {
          this.units = apiResponse.data;
          this.fetchUnitsAbbreviated();
          
          this.units.forEach(e => {
            if(!_.isNull(this.formGroup.value.medidaView)){
              if(e.id == this.formGroup.value.medidaView.id){
                this.item.medida = e;
              }
            }
          });
          this.item.amount = this.formGroup.value.amountView;
      
          this._dialog.close({
            item: this.item
          });
        }
      )
    }else{
      this.item.amount = this.formGroup.value.amountView;
      
          this._dialog.close({
            item: this.item
          });
    }
    
  }

}
