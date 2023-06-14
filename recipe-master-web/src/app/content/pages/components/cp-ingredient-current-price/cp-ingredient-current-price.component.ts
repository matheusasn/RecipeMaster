import { Component, OnInit, Input, Inject, Output, EventEmitter, SimpleChanges, OnChanges } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { CpLocalStorageService } from '../../../../core/services/common/cp-localstorage.service';
import { User } from '../../../../core/models/user';

import { Unit } from '../../../../core/models/business/unit';
import { UnitService } from '../../../../core/services/business/unit.service';
import { CpLoadingService } from '../../../../core/services/common/cp-loading.service';
import { Messages } from '../../../../core/constants/messages';
import { IngredientService } from '../../../../core/services/business/ingredient.service';
import { IngredientHistoryDTO } from '../../../../core/models/business/dto/ingredient-history-dto';
import { Ingredient } from '../../../../core/models/business/ingredient';
import { PurchasePrice } from '../../../../core/models/common/purchaseprice';
import moment from 'moment';
import { ApiResponse } from '../../../../core/models/api-response';
import { UnitLabelPipe } from '../../../../pipes/unit-label.pipe';
import { IngredientHistoryService } from '../../../../core/services/business/ingredient-history.service';
import { IngredientHistory } from '../../../../core/models/business/dto/ingredient-history';
import swal, { SweetAlertOptions } from 'sweetalert2';
import { UserService } from '../../../../core/auth/user.service';

@Component({
  selector: 'm-cp-ingredient-current-price',
  templateUrl: './cp-ingredient-current-price.component.html',
  styleUrls: ['./cp-ingredient-current-price.component.scss']
})
export class CpIngredientCurrentPriceComponent implements OnInit {

  @Input() id: String;
  @Input() price: String;
  @Input() name: String;
  @Input() label: String;
  @Input() historyIngredient: IngredientHistoryDTO[];
  @Input() units:Unit[];
  @Input() ingredient:Ingredient;
  @Output() onChange = new EventEmitter();

  unitLabel: string;

  constructor(public dialog: MatDialog, private unitLabelPipe:UnitLabelPipe) { }

  ngOnInit() {

    this.unitLabel = this.unitLabelPipe.transform(this.ingredient, this.units);

  }

  openDialogSaveIngredient(): void {
    let data:UpdateIngredientDialogData = {
      units: this.units,
      ingredient: this.ingredient,
    };

    const dialogRef = this.dialog.open(DialogUpdateIngredientDialog, {
      width: '500px',
      data: data
    });

    dialogRef.afterClosed().subscribe( (response:UpdateIngredientDialogDataResponse) => {

      if(response && response.status == 'OK') {
        this.ingredient = response.ingredient;
        this.onChange.emit(this.ingredient.id);

        this.unitLabel = this.unitLabelPipe.transform(this.ingredient, this.units);

      }

    }, err => console.warn(err));

  }

  openDialogHistoryIngredient(): void {

    let data: ViewIngredientDialogData = {
      units: this.units,
      historyIngredient: this.historyIngredient,
      ingredient: this.ingredient
    };

    const dialogRef = this.dialog.open(DialogHistoryIngredientDialog, {
      width: '500px',
      data: data
    });

		dialogRef.afterClosed().subscribe(response => {
			if (response && response.status === 'OK') {
				this.ingredient = response.ingredient;
				this.onChange.emit(response.ingredient.id);
			}
		})
  }

}

export interface UpdateIngredientDialogDataResponse {
  status:string;
  ingredient: Ingredient;
}

export interface UpdateIngredientDialogData {
  ingredient:Ingredient;
  units:Unit[];
}

export interface ViewIngredientDialogData {
  historyIngredient: IngredientHistoryDTO[];
  units:Unit[];
  ingredient?: Ingredient;
}

export interface HistoryIngredientDialogData {
  name: string;
  label: string;
  historyIngredient: HistoryIngredient[];
}

export interface HistoryIngredient {
  date: string;
  weight: string;
  price: string;
}

@Component({
  selector: 'dialog-update-ingredient',
  templateUrl: 'dialog-update-ingredient.html',
  styleUrls: ['./dialog-update-ingredient.scss']
})
export class DialogUpdateIngredientDialog implements OnInit {

  formGroup: FormGroup;
  cifrao: String = 'R$';
  units: Unit[] = [];
  ingredient:Ingredient;
  private _currentUser: User;
  prefix: String;

  constructor(
    private _unitService: UnitService, private _loading: CpLoadingService,
    private _toast: ToastrService, private _service: IngredientService,
    public dialogRef: MatDialogRef<DialogUpdateIngredientDialog, UpdateIngredientDialogDataResponse>,
    @Inject(MAT_DIALOG_DATA) public data: UpdateIngredientDialogData,
    private fb:FormBuilder, private ingredientHistoryService:IngredientHistoryService,
    private _localStorage: CpLocalStorageService,) {

    this.fillUser();
  }

  ngOnInit(): void {

    this.units = this.data.units;
    this.ingredient = this.data.ingredient;
		if (this.ingredient.purchasePrice.unityQuantity === 0) {
			this.ingredient.purchasePrice.unityQuantity = 1;
		}
    this.formGroup = this.fb.group(this.ingredient.purchasePrice);
    this.setMaskInputCurrency(this.cifrao);

  }

	fillUser() {
		this._currentUser = this._localStorage.getLoggedUser();
		if (this._currentUser) {
			this.cifrao = this._localStorage.getCurrency();
    }
	}

  setMaskInputCurrency(currentCurrency){
    this.prefix = currentCurrency;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  addHistory(ingredient:Ingredient) {

    try {

      let history:IngredientHistory = {
        ingredient: this.ingredient,
        price: ingredient.purchasePrice.price,
        unit: ingredient.purchasePrice.unit,
        unityQuantity: ingredient.purchasePrice.unityQuantity
      };

      this.ingredientHistoryService.add([history]);

    }
    catch(e) {
      console.warn(e);
    }

  }

  save() {

    if(!this.formGroup.valid) {
      this._toast.warning("Preencha o formulário corretamente.");
      return;
    }

    this._loading.show();

    let pp:PurchasePrice = this.formGroup.value;

    this.ingredient.purchasePrice = pp;

    this.addHistory(this.ingredient);

    this._service.update(this.ingredient).subscribe(
      (response:ApiResponse) => {
        this._loading.hide();
        this._toast.success(Messages.SUCCESS);
        this.dialogRef.close({
          status: "OK",
          ingredient: this.ingredient
        });
      },
      error => {
        console.warn(error);
        this._loading.hide();
        this.dialogRef.close();
      }
    )

	}

  cancel() {
		this.dialogRef.close();
  }

}

@Component({
  selector: 'dialog-history-ingredient',
  templateUrl: 'dialog-history-ingredient.html',
  styleUrls: ['./dialog-history-ingredient.scss']
})
export class DialogHistoryIngredientDialog {

  units: Unit[] = [];
  history: IngredientHistoryDTO[];
  ingredient: Ingredient;
	cifrao:string;

  constructor(
    public dialogRef: MatDialogRef<DialogHistoryIngredientDialog>,
    @Inject(MAT_DIALOG_DATA) public data: ViewIngredientDialogData,
		private ingredientHistoryService: IngredientHistoryService,
		private _loading: CpLoadingService,
		private _toast: ToastrService,
		private ingredientService: IngredientService,
		private _localStorage: CpLocalStorageService,
		private _userService: UserService) {}

  ngOnInit(): void {
    this.units = this.data.units;
		this.ingredient = this.data.ingredient;
    this.history = this.data&& this.data.historyIngredient?this.data.historyIngredient.reverse():[];

		const currentUser = this._localStorage.getLoggedUser();
		if (currentUser) {
			this._userService.findByIdReduced(currentUser.id)
			.subscribe((res) => {
					this.cifrao = res.data.currency
				});
		}
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  cancel() {
		this.dialogRef.close();
  }

	delete(id) {
    const op: SweetAlertOptions = {
			title: '',
			text: 'Excluir este histórico de preço?',
			type: 'warning',
			showCancelButton: true,
			confirmButtonColor: '#f4516c',
			cancelButtonColor: '#d2d2d2',
			confirmButtonText: "Excluir",
			cancelButtonText: "Voltar"
    };

    swal(op).then(async (result) => {
			if (result.value) {
				// o array é invertido
				const hasDeletedLastHistory = this.history[0].id === id

				if (hasDeletedLastHistory) {
					const newLastHistory = this.history.filter(item => item.id !== id)[0]

					let pp:PurchasePrice = {
						price: newLastHistory.price,
						unit: this.units.find(unit => unit.id === newLastHistory.unitId),
						unityQuantity: newLastHistory.unityQuantity
					}

					this.ingredient.purchasePrice = pp;

					await this.ingredientService.update(this.ingredient).toPromise()
				}


				this._loading.show();
					this.ingredientHistoryService.remove(id).subscribe((response: ApiResponse) => {
						this._loading.hide();
						this._toast.success(Messages.SUCCESS);
						this.dialogRef.close({
							status: "OK",
							ingredient: this.ingredient
						});
					}, error => {
						console.warn(error);
						this._loading.hide();
						this.dialogRef.close();
					})
        }
    });
	}
}
