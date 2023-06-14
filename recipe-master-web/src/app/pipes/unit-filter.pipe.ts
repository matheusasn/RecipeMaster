import { Pipe, PipeTransform } from '@angular/core';
import { Unit } from '../core/models/business/unit';
import * as _ from 'lodash';
import { Ingredient } from '../core/models/business/ingredient';


@Pipe({
  name: 'unitFilter'
})
export class UnitFilterPipe implements PipeTransform {

  transform(units: Unit[], args?: any): any {

	const language: string = <string>localStorage.getItem('language');
	const originalUnits = units;

    if(!args) {
      return units;
    }

    let ingredient:Ingredient = args;

    let ingredientUnitId:number = ingredient.unit&&ingredient.unit.ingredientId?ingredient.unit.unitId:(ingredient.unit?ingredient.unit.id:null);
    //sempre exibir 1,5: gramas, unidades

		if (!_.isNil(ingredient.ingredientCategory)) {
			if([1,2,5].includes(ingredientUnitId)) {

				units = _.filter(units, (u:Unit) => {
					return [1,2,5].includes(u.ingredientId?u.unitId:u.id);
				});

			}
			else if([3,4].includes(ingredientUnitId)) {

				units = _.filter(units, (u:Unit) => {
					return [1,3,4,5].includes(u.ingredientId?u.unitId:u.id);
				});

			}
		} else {
			units = _.filter(units, (u:Unit) => {
				return [1,2,3,4,5].includes(u.ingredientId?u.unitId:u.id);
			});
		}

		if (!_.isNil(ingredient.recipeCopiedId)) {
			units = _.filter(units, (u:Unit) => {
				return [1,2].includes(u.ingredientId?u.unitId:u.id);
			});
			units = [...units, ingredient.unit];
		}

		if (language === 'en') {
			const poundUuid = 'ffc216c6-a354-4aeb-9c15-845346c77e14'
			const ounceUuid = 'd847fbc3-4013-46a9-a688-629ad4783b89'
			const fluidOunceUuid = 'fbe1ca86-a6c7-4ca6-ae00-34976f85607e'
			const stickUuid = '245c2c66-7ae7-4353-84b9-109996143ada'
			// Ingredientes líquidos
			if ([3,4].includes(ingredientUnitId)) {
				const fluidOunce = _.find(originalUnits, (u:Unit) => {
					return fluidOunceUuid === u.uuid
				})
				units = [...units, fluidOunce]
			}
			// Manteiga
			else if (254 === ingredient.ingredientCopiedId) {
				const stick = _.find(originalUnits, (u:Unit) => {
					return stickUuid === u.uuid
				})
				units = [...units, stick]
			} else {
				const poundAndOunce = _.filter(originalUnits, (u:Unit) => {
					return poundUuid === u.uuid || ounceUuid === u.uuid
				})
				units = [...units, ...poundAndOunce]
			}
		}
    return units;

    // return units;
  }

}
