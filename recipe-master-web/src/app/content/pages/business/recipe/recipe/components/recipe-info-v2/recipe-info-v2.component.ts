import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Recipe } from '../../../../../../../core/models/business/recipe';
import { RecipeCategory } from '../../../../../../../core/models/business/recipecategory';
import { Unit } from '../../../../../../../core/models/business/unit';

@Component({
  selector: 'recipemaster-recipe-info-v2',
  templateUrl: './recipe-info-v2.component.html',
  styleUrls: ['./recipe-info-v2.component.scss']
})
export class RecipeInfoV2Component implements OnInit {

  @Input() form:FormGroup;
  @Input() categories: RecipeCategory[] = [];
  @Input() units: Unit[] = [];
  @Input() recipe:Recipe;
  @Output() onChange:EventEmitter<FormGroup> = new EventEmitter<FormGroup>();

  constructor(private fb:FormBuilder) { }

  ngOnInit() {
    this.buildForm();
  }

  buildForm() {

    let portions:number = this.recipe.portions;
    let totalWeight:number = this.recipe.totalWeight;
    let portionName:string = this.recipe.portionName;
    let portionWeight:number = this.recipe.portionWeight;

    if(this.recipe.unityQuantity) {
      portions = this.recipe.unityQuantity;
    }

    if(this.recipe.unit && [1,2].includes(this.recipe.unit.id)) {

      if(this.recipe.unit.id == 2) {
        totalWeight = this.recipe.unityQuantity * 1000;
      }
      else {
        totalWeight = this.recipe.unityQuantity;
      }

      portions = 1;

    }
    else {

      if(this.recipe.unit && this.recipe.unit.name) {
        portionName = this.recipe.unit.name;
        totalWeight = this.recipe.unityQuantity;
        portions = 1;
      }

    }

    if(portions && portions > 0 && totalWeight) {
      portionWeight = totalWeight / portions;
    }

    let geralGroup: FormGroup = this.fb.group({
      name: [this.recipe ? this.recipe.name : null, []],
      description: [this.recipe ? this.recipe.description : null, []],
      recipeCategory: [this.recipe ? this.recipe.recipeCategory : null, []],
      preparationTime: [this.recipe ? this.recipe.preparationTime : null, []],
      photoUrl: [this.recipe ? this.recipe.photoUrl : null, []],
      // form V1 fields:
      unityQuantity: [null, []], // rendimento
      unit: [null, []], // medida
      // form V2 fields:
      portions: [portions? portions : null, []], // "rendimento"
      totalWeight: [totalWeight ? totalWeight : null, []],
      portionName: [portionName ? portionName : null, []],
      portionWeight: [this.recipe ? this.recipe.portionWeight : null, []]
    });

    this.form.addControl('geral', geralGroup);

    geralGroup.controls.recipeCategory.valueChanges.subscribe( (change) => {

      this.onChange.emit(geralGroup);

    });

    geralGroup.valueChanges.subscribe( (change) => {

      this.onChange.emit(geralGroup);

			// this.onChangeCostValue();
			// this.onChangeCostUnitValue();

			// this.generateChartData();

    });

  }

}
