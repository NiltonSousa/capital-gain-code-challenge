export enum OperationType {
    BUY = "buy",
    SELL = "sell",
}

export class OperationEntity {
    constructor(
        public readonly type: OperationType,
        public readonly unitCost: number,
        public readonly quantity: number,
        public tax: number | null
    ) {}

    calculateAveragePrice(pastAveragePrice: number = 0, currentQuantity: number = 0): number {
        if (this.type !== OperationType.BUY) {
            return pastAveragePrice;
        }

        const totalCost = (pastAveragePrice * currentQuantity) + (this.unitCost * this.quantity);
        const totalQuantity = currentQuantity + this.quantity;

        return parseFloat((totalCost / totalQuantity).toFixed(2));
    }

    calculateProfit(averagePrice: number): number {
        return (this.unitCost - averagePrice) * this.quantity;
    }

    calculateTax(averagePrice: number): number {
        if (this.tax !== null) {
            return this.tax;
        }

        const profit = this.calculateProfit(averagePrice);

        this.tax = profit > 0 ? profit * 0.2 : 0;

        return this.tax;
    }
}