import { Component, Input, OnInit } from '@angular/core';
import { Recipe } from '../../../../../../core/models/business/recipe';
import { CommonCalcService } from '../../../../../../core/services/business/common-calc.service';
import * as _ from 'lodash';
import { RecipeItem } from '../../../../../../core/models/business/recipeitem';
import { Menu } from '../../../../../../core/models/business/menu';
import { MenuItem } from '../../../../../../core/models/business/menuitem';
import { User } from '../../../../../../core/models/user';
import { CpLocalStorageService } from '../../../../../../core/services/common/cp-localstorage.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'm-financial',
  templateUrl: './financial.component.html',
  styleUrls: ['./financial.component.scss']
})
export class FinancialComponent implements OnInit {

  @Input() recipe: Recipe;
  @Input() menu: Menu;
	@Input() showFinancial: boolean;

  cifrao:string;
  user: User;

  constructor(
    private calc:CommonCalcService,
    private _localStorage:CpLocalStorageService,
    private translate: TranslateService) {

      this.fillUser();
    }

  ngOnInit() {
  }

  fillUser() {
		this.user = this._localStorage.getLoggedUser();
		if (this.user){
      this.cifrao = this._localStorage.getCurrency();
    }
	}

  get item():Recipe|Menu|null {
    return this.recipe?this.recipe:(this.menu?this.menu:null);
  }

	calcMargemDeLucro(tipo:string = 'total'): number {

		const financial = this.menu ? this.menu.financial : this.recipe.financial;

		let rendimento:number = 1;
		let precoDeVenda:number = financial.totalCostValue;

		if (tipo === 'unitario') {
			precoDeVenda = financial.costUnitValue;
			rendimento = this.menu ? this.menu.unityQuantity : this.recipe.unityQuantity;
		}

		const ingredients = this.menu ? this.menu.ingredients : this.recipe.ingredients

		return this.calc.calcMargemDeLucro(ingredients, precoDeVenda, rendimento, this.getItensTotalCost());
	}

	calcProfit() {
		try {
			return this.menu.financial.totalCostValue - this.getTotalCost();
		}
		catch(e) {
			console.warn(e);
			return 0;
		}
	}

	calcUnitProfit() {
		try {
			return this.menu.financial.costUnitValue - this.getUnitCost();
		}
		catch(e) {
			console.warn(e);
			return 0;
		}
	}

  getTotalCost(): number {
		return this.getTotalIngredients() + this.getItensTotalCost();
  }

  getTotalIngredients(): number {
    if(this.recipe) {
      return this.calc.totalRecipeIngredients(this.recipe.ingredients);
    }
    else {
      return this.calc.totalRecipeIngredients(this.menu.ingredients);
    }

  }

  getItensTotalCost():number {

    if(this.recipe) {

      if(this.recipe.itens && this.recipe.itens.length > 0) {
        return _.reduce(this.recipe.itens, (sum:number, item:RecipeItem) => {
          let valor:number = this.calc.calcRecipeItemPrice(item);
          return sum + valor;
        }, 0);
      }

    }
    else if(this.menu) {

      if(this.menu.itens && this.menu.itens.length > 0) {
        return _.reduce(this.menu.itens, (sum:number, item:MenuItem) => {
          let valor:number = this.calc.calcMenuItemPrice(item);
          return sum + valor;
        }, 0);
      }

    }

		return 0;

  }

  getUnitCost(): number {
    if(this.recipe) {
      return this.getTotalCost() / (this.recipe.unityQuantity?this.recipe.unityQuantity:1)
    }
    else {
      return this.getTotalCost() / (this.menu.unityQuantity?this.menu.unityQuantity:1)
    }

	}

}
