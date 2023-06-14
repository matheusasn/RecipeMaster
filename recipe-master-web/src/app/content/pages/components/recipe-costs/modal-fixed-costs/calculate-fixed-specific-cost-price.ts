import { SpecificCostType } from "../../../../../core/models/business/fixed-specific-cost";

export function calculateFixedSpecificCostPrice(item: any) {
	if (item.type === SpecificCostType.EQUIPMENT || (item.fixedSpecificCost && item.fixedSpecificCost.type === SpecificCostType.EQUIPMENT)) {
		const consumptionName = item.consumptionUnit.name
		const time = item.quantityUnit.abbreviation === 'min' ? item.quantity/60 : item.quantity;
		if (consumptionName === 'W' || consumptionName === 'kWh') {
			const consumption = item.consumptionUnit.name === 'W' ? item.consumptionAmount/1000 : item.consumptionAmount;
			return consumption * time * item.price
		} else {
			return item.consumptionAmount * time * (item.price/item.priceUnitQuantity)
		}
	} else {
		const price = item.priceUnit.abbreviation === 'min' ? item.price/60 : item.price;
		const quantity = item.quantityUnit.abbreviation === 'min' ? item.quantity/60 : item.quantity;
		return (price * item.priceUnitQuantity) * quantity;
	 }
}
