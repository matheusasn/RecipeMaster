import { Region } from "./business/region";
import { Plan } from "./business/plan";
import { PerfilEnum } from "./security/perfil.enum";
export interface User {
  id: number;
  email: string;
  name: string;
  inclusion?:any;
  filterByState: string;
  region: Region;
  plan:Plan;
  photo: string;
  password?: string;
  perfis: PerfilEnum[];
  currency: string;
  passwordConfirm?: string;
  nps?: number;
  photoUrl: string;
  migrationStatus?:number;
  migrationDate?:Date;
	discountTimerStartedAt?:Date;
	country: string;
	city: string;
	defaultLanguage?: string;
}
