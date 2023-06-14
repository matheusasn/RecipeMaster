import {DisplayColumns} from './displaycolumns';
import {Recipe} from '../../models/business/recipe';
import { Menu } from '../../models/business/menu';

export class RecipeReportOptions {
  private display: DisplayColumns;
  public recipe: Recipe|Menu;

  constructor() {
    this.display = {    
      general: true,
      steps: true,
      menuItens: true,
      financial: true,
      ingredients: true,
      nutrition: true
    };
  }

  setDisplay(value: DisplayColumns) {
    this.display = value;
  }

  getDisplay(): DisplayColumns {
    return this.display;
  }

  setItem(value: Recipe|Menu) {
    this.recipe = value;
  }

}
