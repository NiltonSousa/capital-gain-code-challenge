export enum OperationType {
    BUY = "buy",
    SELL = "sell",
}

export class OperationEntity {
    constructor(
        public readonly type: OperationType,
        public readonly unitCost: number,
        public readonly quantity: number,
    ) {}

    calculateAveragePrice(pastAveragePrice: number = 0, currentQuantity: number = 0): number {
        const totalCost = (pastAveragePrice * currentQuantity) + (this.unitCost * this.quantity);
        const totalQuantity = currentQuantity + this.quantity;

        return parseFloat((totalCost / totalQuantity).toFixed(2));
    }

    calculateProfit(averagePrice: number): number {
        return (this.unitCost - averagePrice) * this.quantity;
    }

    calculateTax(averagePrice: number): number {
        const profit = this.calculateProfit(averagePrice);

        return profit > 0 ? profit * 0.2 : 0;
    }
}