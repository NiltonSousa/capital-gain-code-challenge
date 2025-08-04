import { TAX_RATE } from "src/cli/envs/env";

export enum OperationType {
  BUY = "buy",
  SELL = "sell",
}

export interface OperationInputDTO {
  operation: OperationType;
  "unit-cost": number;
  quantity: number;
}

export class OperationEntity {
  constructor(
    public readonly type: OperationType,
    public readonly unitCost: number,
    public readonly quantity: number
  ) {}

  /**
   * Builds a list of OperationEntity objects from an array of plain objects (e.g. parsed from JSON).
   * @throws Error if input properties are missing or invalid
   */
  static build(inputObject: OperationInputDTO[]): OperationEntity[] {
    return inputObject.map((input) => {
      if (
        !("operation" in input) ||
        !("unit-cost" in input) ||
        !("quantity" in input)
      ) {
        throw new Error("Input must contain type, unitCost, and quantity");
      }

      return new OperationEntity(
        input.operation,
        input["unit-cost"],
        input.quantity
      );
    });
  }

  calculateAveragePrice(
    pastAveragePrice: number = 0,
    currentQuantity: number = 0
  ): number {
    const totalCost =
      pastAveragePrice * currentQuantity + this.unitCost * this.quantity;
    const totalQuantity = currentQuantity + this.quantity;

    return parseFloat((totalCost / totalQuantity).toFixed(2));
  }

  calculateProfit(averagePrice: number): number {
    return (this.unitCost - averagePrice) * this.quantity;
  }

  calculateTax(averagePrice: number): number {
    const profit = this.calculateProfit(averagePrice);

    return profit > 0 ? profit * TAX_RATE : 0;
  }
}
