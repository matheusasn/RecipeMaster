import { Financial } from "./financial";
import { CpFilter } from "../common/filter";

export interface FinancialHistory {
    id?: number;
    inclusion?: Date;

    financial: Financial;

    totalCost: number; // custo da receita (ingredientes, outros custos...)
    salePrice: number; // totalCostValue
    profit: number; // lucro (salePrice - totalCost)

    // dados unitários
    unitCost: number; // custo da receita / rendimentoo
    unitSalePrice: number; // costUnitValue
    unitProfit: number; // lucro unitario (unitSalePrice - unitCost)
}

export interface FinancialHistoryFilter extends CpFilter{
    includeFinancial?: boolean;
}

export interface FinancialHistoryDTO {
    id?: number;
    inclusion: Date;

    financialId: number; 

    totalCost: number; // custo da receita (ingredientes, outros custos...)
    salePrice: number; // totalCostValue
    profit: number; // lucro (salePrice - totalCost)

    // dados unitários
    unitCost: number; // custo da receita / rendimentoo
    unitSalePrice: number; // costUnitValue
    unitProfit: number; // lucro unitario (unitSalePrice - unitCost)
}