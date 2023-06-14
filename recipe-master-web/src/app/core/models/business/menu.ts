import { MenuIngredient } from './menuingredient';
import { Financial } from './financial';
import { User } from '../user';

export class Menu {
	id: number;
	name: string;
	photo: string;
	photoUrl: string;
	inclusion: Date;

	// preparationTime: number;
	unityQuantity: number;
	unit: any;
	description: string;
	financial: Financial;

	ingredients: MenuIngredient[];
	user?:User;
	// Adicionados posteriormente para atender componente Drag&Drop -> passiveis de mudanca
	costPrice: number;
	sellValue: number;
	image: string;

	itens: any[];

}
