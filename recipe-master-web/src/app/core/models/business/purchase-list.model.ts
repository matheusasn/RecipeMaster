import { User } from '../user';

export class PurchaseList {

    id?: number;
    nome?: string;
    preco?: number;
    precoMarcado?: number;
    dataCadastro?: string;
    
    totalMarcado?: number;

    user?: User;
    ingredients?: any;

    quantIngredient?: number;
    quantIngredientMarked?: number;

    constructor() {
		  this.ingredients = [];
    }

}