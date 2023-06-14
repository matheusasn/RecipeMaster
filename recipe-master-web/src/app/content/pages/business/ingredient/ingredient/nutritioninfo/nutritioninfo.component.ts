import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog, MatTabChangeEvent } from '@angular/material';
import { ApiResponse } from '../../../../../../core/models/api-response';
import { NutritionInfoFilter, NutritionInfoOrigin } from '../../../../../../core/models/business/dto/nutritioninfo-filter';
import { Ingredient } from '../../../../../../core/models/business/ingredient';
import { NutritionInfo, ForbiddenItems } from '../../../../../../core/models/business/nutritioninfo';
import { NutritionInfoService } from '../../../../../../core/services/business/nutritioninfo.service';
import { NutritioninfoAddModalComponent } from '../../../../components/nutritioninfo/nutritioninfo-add-modal/nutritioninfo-add-modal.component';
import * as _ from 'lodash';
import { NutritioninfoCustomComponent } from '../../../../components/nutritioninfo/nutritioninfo-custom/nutritioninfo-custom.component';
import { TranslationService } from '../../../../../../core/metronic/services/translation.service';


@Component({
  selector: 'm-nutritioninfo',
  templateUrl: './nutritioninfo.component.html',
  styleUrls: ['./nutritioninfo.component.scss'],
	encapsulation: ViewEncapsulation.None
})
export class NutritioninfoComponent implements OnInit {

  @Input() ingredient:Ingredient;
  origin:NutritionInfoOrigin;
  nutritionalInfos:NutritionInfo[];
  form:FormGroup;
  lastSelected:NutritionInfo|null = null;
  tables:NutritionInfoOrigin[] = [
    NutritionInfoOrigin.TACO,
    NutritionInfoOrigin.IBGE,
    NutritionInfoOrigin.USDA
  ];
	lang:string;


  constructor(private nutritionService: NutritionInfoService,
		private fb:FormBuilder,
		private dialog:MatDialog,
		private translationService:TranslationService) { }

  ngOnInit() {

    this.origin = NutritionInfoOrigin.TACO;

		this.translationService.getSelectedLanguage().subscribe(lang => {
			this.lang = lang;
		});

    this.fetchNutritionInfo();

    this.form = this.fb.group({
      nutritionInfo: [null]
    });

  }

  onSelectedTabChange(ev:MatTabChangeEvent) {
    this.origin = this.tables[ev.index];

    this.form.reset();

    this.fetchNutritionInfo();

  }

  isNutritionInfo(ni:any): ni is NutritionInfo {

    if(ni == null) {
      return false;
    }

    return (ni.origin) != undefined;

  }

  onChange() {
    let selected:NutritionInfo|number|null = this.form.value.nutritionInfo;

    if(_.isNil(selected)) {
      this.lastSelected = selected;
      return;
    }

    if( this.isNutritionInfo(selected) ) {
      this.lastSelected = selected;
      return;
    }

    switch(+selected) {
      case -1: //criar
        this.openAddNutritionInfoModal();
        break;
      case -2: //editar
        this.openCustomNutritionInfoModal();
        break;
    }

  }

  private openCustomNutritionInfoModal() {

    const customNutritionInfoAddRef = this.dialog.open(NutritioninfoCustomComponent, {
      panelClass: 'custom-modalbox',
      data: {
        ingredient: this.ingredient,
        items: this.nutritionalInfos,
        selectedItem: this.lastSelected
      }
    });

    customNutritionInfoAddRef.afterClosed().subscribe( (response:any) => {

      try {

        if(!response) {

          this.form.patchValue( {
            nutritionInfo: this.lastSelected
          } );

          return;

        }

        this.form.patchValue( {
          nutritionInfo: response.item
        } );

      }
      catch(e) {
        console.warn(e.message);
      }

      try {

        if( ! _.isNil(response.items) ) {
          this.nutritionalInfos = response.items;
        }

      }
      catch(e) {
        console.warn(e.message);
      }

    });

  }

  private openAddNutritionInfoModal() {

    const nutritionInfoAddRef = this.dialog.open(NutritioninfoAddModalComponent, {
      data: {
        ingredient: this.ingredient
      },
      panelClass: 'custom-modalbox'
    });

    nutritionInfoAddRef.afterClosed().subscribe( (response:any) => {

      if(!response) {

        this.form.patchValue( {
          nutritionInfo: this.lastSelected
        } );

        return;

      }

      if (response.event == 'create') {
        this.nutritionalInfos.push(response.item);

        this.nutritionalInfos = _.orderBy(this.nutritionalInfos, ['user','id']);

        this.form.patchValue( {
          nutritionInfo: response.item
        } );

      }
      else if (response.event == 'cancel') {
        console.log("cancelou...");
      }

    });

  }

  private async fetchNutritionInfo() {

		if (this.lang === 'en' || this.lang === 'es') {
			this.origin = NutritionInfoOrigin.USDA;
		}

    let filter:NutritionInfoFilter = {
      description: this.ingredient.name,
      origin: this.origin,
      currentPage: 1,
      itensPerPage: this.origin === NutritionInfoOrigin.USDA ? 1000 : 20,
			lang: this.lang
    };

    this.nutritionService.getByFilter(filter).subscribe( (response:ApiResponse) => {
			 this.nutritionalInfos = _.filter(response.data, (ni:NutritionInfo) => {
				if (!ni.enDescription) return true;
				return !ForbiddenItems.some(item => ni.enDescription.toLowerCase().includes(item))
			});

    });

  }

}
