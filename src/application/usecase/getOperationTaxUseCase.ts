import { TAX_FREE_THRESHOLD } from "src/cli/envs/env";
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

        this.taxResponse.push({ tax: 0.0 });

        continue;
      }

      const profit = operation.calculateProfit(this.currentAveragePrice);

      if (profit > 0) {
        const totalOperationAmount = operation.unitCost * operation.quantity;

        if (totalOperationAmount <= TAX_FREE_THRESHOLD) {
          this.taxResponse.push({ tax: 0.0 });

          continue;
        }

        if (this.totalOperationLoss >= profit) {
          this.totalOperationLoss -= profit;

          this.taxResponse.push({ tax: 0.0 });

          continue;
        }

        const remainingProfit = profit - this.totalOperationLoss;

        this.totalOperationLoss = 0;

        this.taxResponse.push({ tax: remainingProfit * 0.2 });

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
  }

  private resetState(): void {
    this.currentAveragePrice = 0;
    this.currentStockQuantity = 0;
    this.totalOperationLoss = 0;
    this.taxResponse = [];
  }
}
