import { Pipe, PipeTransform } from '@angular/core';
import { Ingredient } from '../core/models/business/ingredient';
import { RecipeIngredient } from '../core/models/business/recipeingredient';
import { Unit } from '../core/models/business/unit';
import * as _ from 'lodash';


@Pipe({
  name: 'unitLabel'
})
export class UnitLabelPipe implements PipeTransform {

  transform(obj: Ingredient|RecipeIngredient|number, units?: Unit[]): string {

    if(!obj || !units) {
      return "?";
    }

    if(this.isRecipeIngredient(obj)) {
      return this.getRecipeIngredientUnit((obj as RecipeIngredient), units);
    }
    else if(this.isIngredient(obj)) {
      return this.getIngredientUnit((obj as Ingredient), units);
    }

    try {

      let label: Unit = _.find(units, ['id', obj]);
      return label?label.abbreviation:'?';

    }
    catch(e) {
      console.warn(e);
      return "?";
    }

  }

  private getIngredientUnit(i: Ingredient, units: Unit[]) {

    if (!_.isNil(i.purchasePrice) && !_.isNil(i.purchasePrice.unit.ingredientId)) {
      const label: Unit = _.find(units, ['id', i.purchasePrice.unit.unitId]);
      return `${i.purchasePrice.unityQuantity * i.purchasePrice.unit.amount} ${label ? label.abbreviation : ''}`;
    }

    try {

      const label: Unit = _.find(units, ['id', i.purchasePrice.unit.id]);

      return `${i.purchasePrice.unityQuantity > 0 ? i.purchasePrice.unityQuantity : 1} ${label ? label.abbreviation : ''}`;

    }
    catch(e) {
      console.warn(e);
      return "?";
    }

  }

	private getRecipeIngredientUnit(recipeIngredient: RecipeIngredient, units: Unit[]) {

		if (!_.isNil(recipeIngredient.unit.ingredientId)) {
			const label: Unit = _.find(units, ['id', recipeIngredient.unit.unitId]);
			return `${recipeIngredient.amount * recipeIngredient.unit.amount} ${label ? label.abbreviation : ''}`;
    }

    return `${recipeIngredient.amount} ${recipeIngredient.unit ? recipeIngredient.unit.abbreviation : ''}`;

	}

  private isIngredient(obj?: any): obj is Ingredient {
    return (((obj as Ingredient).name && (obj as Ingredient).ingredientCategory) || (obj as Ingredient).recipeCopiedId)?true:false;
  }

  private isRecipeIngredient(obj?: any): obj is RecipeIngredient {
    return ((obj as RecipeIngredient).ingredient && (obj as RecipeIngredient).correctionFactor)?true:false;
  }

}
