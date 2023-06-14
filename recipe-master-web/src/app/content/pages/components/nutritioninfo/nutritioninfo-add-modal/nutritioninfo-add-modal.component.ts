import { Component, OnInit, Inject, ChangeDetectorRef } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Ingredient } from '../../../../../core/models/business/ingredient';
import { CpBaseComponent } from '../../../common/cp-base/cp-base.component';
import { NutritionInfo } from '../../../../../core/models/business/nutritioninfo';
import { CpLoadingService } from '../../../../../core/services/common/cp-loading.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'nutritioninfo-add-modal',
  templateUrl: './nutritioninfo-add-modal.component.html',
  styleUrls: ['./nutritioninfo-add-modal.component.scss']
})
export class NutritioninfoAddModalComponent extends CpBaseComponent implements OnInit {

  ingredient:Ingredient;
  item: NutritionInfo;

  constructor(private _dialog: MatDialogRef<NutritioninfoAddModalComponent>, @Inject(MAT_DIALOG_DATA) private data: any, _loading: CpLoadingService, _cdr: ChangeDetectorRef) {
    super(_loading, _cdr);
    this.ingredient = data.ingredient;
  }

  ngOnInit() {
    this.item = {
      description: this.ingredient.name,
      user: this.ingredient.user
    };
  }

  onClose(event:string) {
    this._dialog.close(
      {
        item: this.item,
        event: event
      }
    );
  }

  onSave(o:NutritionInfo) {
    this.item = o;
    this.onClose('create');
  }

  onCancel(o:any) {
    this.onClose('cancel');
  }

}
