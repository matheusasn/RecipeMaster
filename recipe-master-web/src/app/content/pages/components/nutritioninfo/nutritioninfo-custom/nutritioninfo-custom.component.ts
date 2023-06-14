import { Component, OnInit, Inject } from '@angular/core';
import { NutritionInfo } from '../../../../../core/models/business/nutritioninfo';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Ingredient } from '../../../../../core/models/business/ingredient';
import * as _ from 'lodash';

@Component({
  selector: 'm-nutritioninfo-custom',
  templateUrl: './nutritioninfo-custom.component.html',
  styleUrls: ['./nutritioninfo-custom.component.scss']
})
export class NutritioninfoCustomComponent implements OnInit {

  items: NutritionInfo[];
  item: NutritionInfo;
  ingredient: Ingredient;
  selectedItem: NutritionInfo;

  constructor(private _dialog: MatDialogRef<NutritioninfoCustomComponent>, @Inject(MAT_DIALOG_DATA) private data: any) {
    this.items = data.items;
    this.ingredient = data.ingredient;
    this.selectedItem = data.selectedItem;
  }

  ngOnInit() { }

  onClose() {

    this._dialog.close(
      {
        items: this.items,
        item: this.selectedItem
      }
    );

  }

  onEdit(o:NutritionInfo) {
    this.item = o;
  }

  onSave(o:NutritionInfo) {

    this.item = null;
    this.selectedItem = o;

    let index = _.findIndex(this.items, {'id': o.id});

    if(index > -1 ) {
      this.items[index] = o;
    }

  }

  onCancel(o:any) {
    this.item = null;
  }

  onDelete(item:NutritionInfo) {

    this.items = _.filter(this.items, (ni:NutritionInfo) => {

      if(!_.isNil(this.selectedItem) && !_.isNil(this.item) && this.item.id == ni.id) {
        this.item = null;
      }

      return ni.id != item.id;

    });

  }

}
