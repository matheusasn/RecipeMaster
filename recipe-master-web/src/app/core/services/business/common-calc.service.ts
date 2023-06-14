import { Injectable } from "@angular/core";
import { RecipeIngredient } from "../../models/business/recipeingredient";
import * as _ from 'lodash';
import { MenuIngredient } from "../../models/business/menuingredient";
import { MenuItem } from "../../models/business/menuitem";
import { Financial } from "../../models/business/financial";
import { RecipeItem } from "../../models/business/recipeitem";
import { PERCENT_UUID } from "../../models/business/unit";
import { RecipeVariableCost, VariableCost } from "../../models/variablecost";

@Injectable({
    providedIn: 'root'
})
export class CommonCalcService {

  constructor() {}

  public recipeUnitCost(ingredients: RecipeIngredient[], itens: RecipeItem[], unityQuantity?: number): number {
    return (this.totalRecipeIngredients(ingredients) + this.getItensTotalCost(itens)) / (unityQuantity?unityQuantity:1);
  }

  public totalRecipeIngredients(ingredients: any[]): number {

    if(!ingredients) {
      return 0;
    }

    return ingredients.map( (ingred) => {
      return this.calcIngredientPrice(ingred);
    }).reduce((a, b) => a + b, 0);

  }

	getItensTotalCost(itens: RecipeItem[]): number {
		if (!itens) {
			return 0;
		}

		return _.reduce(itens, (sum: number, item: RecipeItem) => {
			const valor: number = this.calcRecipeItemPrice(item);
			return sum + valor;
		}, 0);
	}

  public calcMargemDeLucro(ingredients: RecipeIngredient[]|MenuIngredient[], precoDeVenda: number, rendimento:number, totalCost:number = 0):number {

    let precoDeCusto:number = (this.totalRecipeIngredients(ingredients)+totalCost)/rendimento;

    let lucro:number = precoDeVenda - precoDeCusto;

    if(lucro <= 0 || precoDeVenda <=0) {
      return 0;
    }

    return (lucro / precoDeVenda) * 100;
  }

  public calcRecipeItemPrice(item:RecipeItem): number {
      return this.calcItemPrice(item);
  }

  public calcMenuItemPrice(item:MenuItem): number {
      return this.calcItemPrice(item);
  }

	public calcRecipeVariableCostPrice(typeOfCostSelected: string, recipeVariableCost: RecipeVariableCost, salePrice?: number): number {
		if (recipeVariableCost.variableCost.priceUnit.uuid === PERCENT_UUID) {
			return salePrice * (recipeVariableCost.variableCost.priceUnitQuantity / 100);
		}

    let price:number = recipeVariableCost.variableCost.price?recipeVariableCost.variableCost.price:0;
    let quantityUsed:number = recipeVariableCost.unityQuantityUsed?recipeVariableCost.unityQuantityUsed:1;

		const priceUnitQuantity = recipeVariableCost.variableCost.priceUnitQuantity

    let unityQuantity:number = priceUnitQuantity && priceUnitQuantity>0?priceUnitQuantity:1;
    let itemUnitUsed:number = recipeVariableCost.unitUsed.id;
    let itemUnit:number;

		if (typeOfCostSelected === "UNIT") {
			quantityUsed = recipeVariableCost.unitCostUnityQuantityUsed?recipeVariableCost.unitCostUnityQuantityUsed:1;
			itemUnitUsed = recipeVariableCost.unitCostUnitUsed ? recipeVariableCost.unitCostUnitUsed.id : itemUnitUsed;
		}

    try {
      itemUnit = recipeVariableCost.variableCost.priceUnit.id;
    }
    catch(e) {
      itemUnit = null;
    }

    if(itemUnitUsed==1 && itemUnit==2) {
      unityQuantity *= 1000;
    }
    else if(itemUnitUsed==4 && itemUnit==3) {
      unityQuantity /= 1000;
    }
    else if(itemUnitUsed==3 && itemUnit==4) {
      unityQuantity *= 1000;
    }
    else if(itemUnitUsed==2 && itemUnit==1) {
      unityQuantity /= 1000;
    }

    return (quantityUsed) * (price / unityQuantity);

  }

  private calcItemPrice(menuItem:MenuItem|RecipeItem): number {

    let price:number = menuItem.price?menuItem.price:0;
    let quantityUsed:number = menuItem.unityQuantityUsed?menuItem.unityQuantityUsed:1;
    let unityQuantity:number = menuItem.unityQuantity && menuItem.unityQuantity>0?menuItem.unityQuantity:1;
    let itemUnitUsed:number = menuItem.unitUsed.id;
    let itemUnit:number;

		if (menuItem.unitUsed.uuid === PERCENT_UUID) {
			return price;
		}

    try {
      itemUnit = menuItem.unit.id;
    }
    catch(e) {
      itemUnit = null;
    }

    if(itemUnitUsed==1 && itemUnit==2) {
      unityQuantity *= 1000;
    }
    else if(itemUnitUsed==4 && itemUnit==3) {
      unityQuantity /= 1000;
    }
    else if(itemUnitUsed==3 && itemUnit==4) {
      unityQuantity *= 1000;
    }
    else if(itemUnitUsed==2 && itemUnit==1) {
      unityQuantity /= 1000;
    }

    return (quantityUsed) * (price / unityQuantity);

  }

  public calcIngredientPrice(recipeIngredient:RecipeIngredient|MenuIngredient): number {

    let amount:number = recipeIngredient.amount?recipeIngredient.amount:0;
    let price:number = recipeIngredient.ingredient && recipeIngredient.ingredient.purchasePrice?recipeIngredient.ingredient.purchasePrice.price:0;
    let pesoBruto:number;
    let pesoLimpo:number;
    let fatorCorrecao:number;

    try {

      let ri:any = recipeIngredient;

      if(!_.isNil(ri.correctionFactor)) {
        pesoBruto = ri.correctionFactor.grossWeight?ri.correctionFactor.grossWeight:1;
        pesoLimpo = ri.correctionFactor.netWeight?ri.correctionFactor.netWeight:1;
        fatorCorrecao = pesoBruto / pesoLimpo;
      }
      else {
        fatorCorrecao = 1;
      }

    }
    catch(e) {
      fatorCorrecao = 1;
    }

    let unityQuantity:number = recipeIngredient.ingredient && recipeIngredient.ingredient.purchasePrice && recipeIngredient.ingredient.purchasePrice.unityQuantity>0?recipeIngredient.ingredient.purchasePrice.unityQuantity:0;

    let recipeUnit:number = recipeIngredient.unit&&recipeIngredient.unit.ingredientId?recipeIngredient.unit.unitId:(recipeIngredient.unit?recipeIngredient.unit.id:null);
    let ingredientUnit:number;

    if(recipeIngredient.unit.ingredientId) {
      amount *= recipeIngredient.unit.amount;
    }

    try {
      ingredientUnit = recipeIngredient.ingredient.purchasePrice.unit.ingredientId?recipeIngredient.ingredient.purchasePrice.unit.unitId:recipeIngredient.ingredient.purchasePrice.unit.id;

      if(recipeIngredient.ingredient.purchasePrice.unit.ingredientId) {
        unityQuantity *= recipeIngredient.ingredient.purchasePrice.unit.amount;
      }

    }
    catch(e) {
      ingredientUnit = null;
    }

    if(unityQuantity == 0 || ingredientUnit == null || recipeUnit == null) {
      return 0;
    }

    if(recipeUnit==1 && ingredientUnit==2) {
      unityQuantity *= 1000;
    }
    else if(recipeUnit==4 && ingredientUnit==3) {
      unityQuantity /= 1000;
    }
    else if(recipeUnit==3 && ingredientUnit==4) {
      unityQuantity *= 1000;
    }
    else if(recipeUnit==2 && ingredientUnit==1) {
      unityQuantity /= 1000;
    }

    return (amount) * (price / unityQuantity) * fatorCorrecao;

  }


	calcIngredientPricePurchaseList(recipeIngredient): number {
		let amount:number = recipeIngredient.quantCompra ? recipeIngredient.quantCompra : 0;
		let price:number = recipeIngredient.ingredient && recipeIngredient.ingredient.purchasePrice ? recipeIngredient.ingredient.purchasePrice.price : 0;
		let pesoBruto:number;
		let pesoLimpo:number;
		let fatorCorrecao:number;

		try {

		  let ri:any = recipeIngredient;

		  if(!_.isNil(ri.correctionFactor)) {
			pesoBruto = ri.correctionFactor.grossWeight > 0 ? ri.correctionFactor.grossWeight : 1;
			pesoLimpo = ri.correctionFactor.netWeight > 0 ? ri.correctionFactor.netWeight : 1;
			fatorCorrecao = pesoBruto / pesoLimpo;
		  }
		  else {
			fatorCorrecao = 1;
		  }
		}
		catch(e) {
		  fatorCorrecao = 1;
		}

		let unityQuantity:number = recipeIngredient.ingredient && recipeIngredient.ingredient.purchasePrice && recipeIngredient.ingredient.purchasePrice.unityQuantity > 0 ? recipeIngredient.ingredient.purchasePrice.unityQuantity : 0;

		let recipeUnit:number = recipeIngredient.unitCompra&&recipeIngredient.unitCompra.ingredientId?recipeIngredient.unitCompra.unitId:(recipeIngredient.unitCompra?recipeIngredient.unitCompra.id:null);
		let ingredientUnit:number;

		if(recipeIngredient.unitCompra.ingredientId) {
			amount *= recipeIngredient.unitCompra.amount;
		}

		try {
		  ingredientUnit = recipeIngredient.ingredient.purchasePrice.unit.ingredientId ? recipeIngredient.ingredient.purchasePrice.unit.unitId : recipeIngredient.ingredient.purchasePrice.unit.id;

		  if(recipeIngredient.ingredient.purchasePrice.unit.ingredientId) {
			unityQuantity *= recipeIngredient.ingredient.purchasePrice.unit.amount;
		  }

		}
		catch(e) {
		  ingredientUnit = null;
		}

		if(unityQuantity == 0 || ingredientUnit == null || recipeUnit == null) {
			return 0;
		}

		if(recipeUnit==1 && ingredientUnit==2) {
		  unityQuantity *= 1000;
		}
		else if(recipeUnit==4 && ingredientUnit==3) {
		  unityQuantity /= 1000;
		}
		else if(recipeUnit==3 && ingredientUnit==4) {
		  unityQuantity *= 1000;
		}
		else if(recipeUnit==2 && ingredientUnit==1) {
		  unityQuantity /= 1000;
		}

		return (amount) * (price / unityQuantity) * fatorCorrecao;
	}


}
