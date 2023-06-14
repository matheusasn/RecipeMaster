import { Component, OnInit, Inject, ChangeDetectorRef } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef }     from '@angular/material';
import { FormGroup, FormBuilder, Validators }           from '@angular/forms';
import { PERCENT_UUID, Unit, UnitType } from '../../../../../core/models/business/unit';
import { ToastrService } from 'ngx-toastr';
import { CpBaseComponent } from '../../../common/cp-base/cp-base.component';
import { CpLoadingService } from '../../../../../core/services/common/cp-loading.service';
import { unityValidator } from '../../../../../validators/unity.validator';
import { TranslateService } from '@ngx-translate/core';
import { UserDTO } from '../../../../../core/models/security/dto/user-dto';
import { User } from '../../../../../core/models/user';
import { UserService } from '../../../../../core/auth/user.service';
import { CpLocalStorageService } from '../../../../../core/services/common/cp-localstorage.service';

import { RecipeItem }                  from '../../../../../core/models/business/recipeitem';
import { IngredientInfoUnitComponent } from '../../ingredient/ingredient-info-unit/ingredient-info-unit.component';
import { UnitService } from '../../../../../core/services/business/unit.service';
import { ApiResponse } from '../../../../../core/models/api-response';

@Component({
  selector: 'm-recipeitem-info',
  templateUrl: './recipeitem-info.component.html',
  styleUrls: ['./recipeitem-info.component.scss']
})
export class RecipeitemInfoComponent extends CpBaseComponent implements OnInit {

  item:RecipeItem;
  formGroup: FormGroup;
  units: Unit[] = [];
  user: UserDTO;
	private _currentUser: User;

  titleModal: String;
  cifrao: String;

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

  constructor(  @Inject(MAT_DIALOG_DATA) private data,
                private _formBuilder: FormBuilder,
                private _toast: ToastrService,
                private _dialogRef: MatDialogRef<RecipeitemInfoComponent>,
                private _dialog: MatDialog,
                _loading: CpLoadingService,
                private _userService: UserService,
                private _cpLocalStorageService: CpLocalStorageService,
                _cdr: ChangeDetectorRef,
                private translate: TranslateService,
								private _unitService: UnitService) {
    super(_loading, _cdr);
      this.fillUser();
   }


	async fetchUnits() {
		const { data } = await this._unitService.getReduced().toPromise();

		this.units = data
    // this.units = this.data.units;
    this.units[0].name = "INGREDIENT.UNIDADE.TXT1";
    this.units[1].name = "INGREDIENT.UNIDADE.TXT2";
    this.units[2].name = "INGREDIENT.UNIDADE.TXT3";
    this.units[3].name = "INGREDIENT.UNIDADE.TXT4";
    this.units[4].name = "INGREDIENT.UNIDADE.TXT5";
    this.units[5].name = "INGREDIENT.UNIDADE.TXT6";
    this.units[6].name = "INGREDIENT.UNIDADE.TXT7";
	}

  async ngOnInit() {

    this.item = this.data.item;

		this.fetchUnits();

    this.buildForm(this.item);

    this.translate.get('MODAL.DELETE_RECEITA_TITLE').subscribe(
			data => {this.titleModal = data}
    );
  }

  private buildForm(item:RecipeItem) {
    this.formGroup = this._formBuilder.group({
      price: [item.price, [Validators.required]],
      unit: [item.unit, [Validators.required]],
      unityQuantity: [item&&item.unityQuantity?item.unityQuantity:0, [Validators.required]],
      unitUsed: [item.unitUsed, [Validators.required]],
      unityQuantityUsed: [item&&item.unityQuantityUsed?item.unityQuantityUsed:0, [Validators.required]],
    }, { validator: [unityValidator]});
  }

	get isPercentSelected() {
		return this.formGroup.controls.unitUsed.value.uuid === PERCENT_UUID;
	}

  removeItemMenu() {
    this._dialogRef.close({
      item: this.item,
      exclude: true
    });
  }

  cancel() {
	  this._dialogRef.close({
      item: null,
      exclude: null
    });
  }

  doDismiss(event) {
		console.log("não remover ITEM da receita");
  }

  save() {

    if(!this.formGroup.valid) {
      console.log("form invalid");
      this._toast.warning("Formulário com algum erro! Revise as informações.");
      return;
    }

    let values = this.formGroup.value;

    this.item.price = values.price;
    this.item.unit = values.unit;
    this.item.unityQuantity = values.unityQuantity;
    this.item.unitUsed = values.unitUsed;
    this.item.unityQuantityUsed = values.unityQuantityUsed;

		if (this.item.unitUsed.uuid === PERCENT_UUID) {
			this.item.price = 0;
			this.item.unit = this.item.unitUsed;
			this.item.unityQuantity = this.item.unityQuantityUsed;
		}

    this._dialogRef.close({
      item: this.item,
      exclude: false
    });

  }

	openDialogUnit() {
		const dialog = this._dialog.open(IngredientInfoUnitComponent, {
			data: {
				...this.formGroup.value,
				unitType: UnitType.OTHER_COSTS
			},
		});

		dialog.afterClosed().subscribe(async response => {
			if (response) {
				const { unit, unityQuantity } = response;

				await this.fetchUnits();

				this.onChangeComponent();

				this.formGroup.patchValue({
					unit,
					unitUsed: unit,
					unityQuantity
				});
			}
		});
	}

}
