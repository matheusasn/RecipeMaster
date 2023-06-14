import { Pipe, PipeTransform } from '@angular/core';
import { NutritionInfo } from '../core/models/business/nutritioninfo';
import * as _ from 'lodash';

@Pipe({
  name: 'customNutritionalinfo'
})
export class CustomNutritionalinfoPipe implements PipeTransform {

  transform(items: NutritionInfo[], args?: any): any {

    return _.filter(items, (ni:NutritionInfo) => {
      return ! _.isNil(ni.user);
    })

  }

}
