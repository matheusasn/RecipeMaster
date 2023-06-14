import { Region } from "../../business/region";
import { PerfilEnum } from "../perfil.enum";

export interface UserDTO {

    id: number;

    name: String;

    email: String;

    filterByState: Boolean;

    region: Region;

    amountOfIngredients: number;

    amountOfRecipes: number;

    amountOfMenus: number;

    photo?: string;
    photoUrl?: string;
    perfis?: PerfilEnum[];

    currency: string;

    migrationStatus?:number;

		showHomeMeasureUnit: boolean;

		defaultLanguage?: string;
}
