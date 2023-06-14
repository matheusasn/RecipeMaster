export enum FinancialFixedCostCalculationType {
	GENERAL = "GENERAL",
	PERCENTAGE = "PERCENTAGE",
	SPECIFIC = "SPECIFIC"
}

export interface Financial {
    id?:number;
    totalCostValue?: number;
    totalCostPerc?: number;
    costUnitValue?: number;
    costUnitPerc?: number;
		totalMonthlyBilling?: number;

		fixedCostPercentage?: number,
		fixedCostCalculationType?: FinancialFixedCostCalculationType
}
