export interface Allergen {
	id: number;
	name: string;
	description: string;
	enName: string;
	enDescription: string;
	esName: string;
	esDescription: string;
}

export enum AllergenType {
 	CONTAINS = "CONTAINS",
	MAY_CONTAIN = "MAY_CONTAIN"
}
