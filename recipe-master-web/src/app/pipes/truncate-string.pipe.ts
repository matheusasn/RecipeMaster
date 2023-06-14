import { Pipe, PipeTransform } from '@angular/core';
import { Unit } from '../core/models/business/unit';
import * as _ from 'lodash';
import { NutritionInfo } from '../core/models/business/nutritioninfo';

@Pipe({
  name: 'truncate'
})
export class TruncateStringPipe implements PipeTransform {

  transform(value: string, args?: any): any {
		const limit: number = args;
		return value.length > limit ? value.substring(0, limit) + '...' : value
  }

}
