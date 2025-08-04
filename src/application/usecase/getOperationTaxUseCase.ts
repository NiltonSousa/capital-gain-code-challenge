import { TAX_FREE_THRESHOLD, TAX_RATE } from "src/cli/envs/env";
import { type OperationEntity, OperationType } from "src/domain/entity";
import {
  type IGetOperationTaxUseCase,
  type IGetOperationTaxUseCaseResponse,
} from "src/domain/usecase";

export class GetOperationTaxUseCaseImpl implements IGetOperationTaxUseCase {
  private taxResponse: IGetOperationTaxUseCaseResponse = [];
  private currentAveragePrice: number = 0;
  private currentStockQuantity: number = 0;
  private totalOperationLoss: number = 0;

  /**
   * Calculates the tax for a series of operations according to business rules.
   * @param operations Array of OperationEntity representing sequential operations (buy or sell).
   * @returns Array of tax results per operation.
   */
  calculate(operations: OperationEntity[]): IGetOperationTaxUseCaseResponse {
    this.resetState();

    for (const operation of operations) {
      if (operation.type === OperationType.BUY) {
        this.currentAveragePrice = operation.calculateAveragePrice(
          this.currentAveragePrice,
          this.currentStockQuantity
        );

        this.updateCurrentStockQuantity(operation);

        this.taxResponse.push({ tax: 0.0 });

        continue;
      }

      this.updateCurrentStockQuantity(operation);

      if (operation.unitCost < this.currentAveragePrice) {
        this.accumulateOperationLoss(operation);
        continue;
      }

      const profit = operation.calculateProfit(this.currentAveragePrice);

      if (profit > 0) {
        this.applyTaxableProfit(operation, profit);

        continue;
      }

      this.taxResponse.push({
        tax: operation.calculateTax(this.currentAveragePrice),
      });
    }

    return this.taxResponse;
  }

  private updateCurrentStockQuantity(operation: OperationEntity): number {
    if (operation.type === OperationType.BUY) {
      this.currentStockQuantity += operation.quantity;

      return this.currentStockQuantity;
    }

    this.currentStockQuantity -= operation.quantity;

    return this.currentStockQuantity;
  }

  private accumulateOperationLoss(operation: OperationEntity): void {
    this.totalOperationLoss +=
      (this.currentAveragePrice - operation.unitCost) * operation.quantity;

    this.taxResponse.push({ tax: 0.0 });
  }

  private applyTaxableProfit(operation: OperationEntity, profit: number): void {
    const totalOperationAmount = operation.unitCost * operation.quantity;

    if (totalOperationAmount <= TAX_FREE_THRESHOLD) {
      this.taxResponse.push({ tax: 0.0 });

      return;
    }

    if (this.totalOperationLoss >= profit) {
      this.totalOperationLoss -= profit;

      this.taxResponse.push({ tax: 0.0 });

      return;
    }

    const remainingProfit = profit - this.totalOperationLoss;

    this.totalOperationLoss = 0;

    this.taxResponse.push({ tax: remainingProfit * TAX_RATE });
  }

  private resetState(): void {
    this.currentAveragePrice = 0;
    this.currentStockQuantity = 0;
    this.totalOperationLoss = 0;
    this.taxResponse = [];
  }
}
