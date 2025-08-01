import { OperationEntity, OperationType } from "src/domain/entity";
import { IGetOperationTaxUseCase, IGetOperationTaxUseCaseResponse } from "src/domain/usecase";

export class GetOperationTaxUseCaseImpl implements IGetOperationTaxUseCase {
    private readonly taxFreeTrashould = 20000;
    private currentAveragePrice: number = 0;
    private currentQuantity: number = 0;
    private totalOperationLoss: number = 0;
    private response: IGetOperationTaxUseCaseResponse = [];

    async calculate(operations: OperationEntity[]): Promise<IGetOperationTaxUseCaseResponse> {
        this.resetState();

        for (const operation of operations) {
            if (operation.type === OperationType.BUY) {
                this.currentAveragePrice = operation.calculateAveragePrice(this.currentAveragePrice, this.currentQuantity);

                this.calculateTotalStocksQuantity(operation);

                this.response.push({ tax: 0.0 });

                continue;
            }

            this.calculateTotalStocksQuantity(operation);

            // Verifica se tem prejuízo
            if (operation.unitCost < this.currentAveragePrice) {
                this.sumTotalOperationLoss(operation);

                this.response.push({ tax: 0.0 });

                continue;
            }

            // Verifica se tem lucro
            const profit = operation.calculateProfit(this.currentAveragePrice);

            if (profit > 0) {
                const totalOperationAmount = operation.unitCost * operation.quantity;

                if (totalOperationAmount <= this.taxFreeTrashould) {
                    this.response.push({ tax: 0.0 });

                    continue;
                }

                if (this.totalOperationLoss >= profit) {
                    this.totalOperationLoss -= profit;

                    this.response.push({ tax: 0.0 });

                    continue;
                } else {
                    const remainingProfit = profit - this.totalOperationLoss;

                    this.totalOperationLoss = 0;

                    this.response.push({ tax: remainingProfit * 0.2 });

                    continue;
                }
            }

            this.response.push({ tax: operation.calculateTax(this.currentAveragePrice) });
        }

        return this.response;
    }

    private calculateTotalStocksQuantity(operation: OperationEntity): number {
        if (operation.type === OperationType.BUY) {
            this.currentQuantity += operation.quantity;

            return this.currentQuantity;
        }

        this.currentQuantity -= operation.quantity;

        return this.currentQuantity;
    }

    private sumTotalOperationLoss(operation: OperationEntity): void {
        this.totalOperationLoss += (this.currentAveragePrice - operation.unitCost) * operation.quantity;
    }

    private resetState(): void {
        this.currentAveragePrice = 0;
        this.currentQuantity = 0;
        this.totalOperationLoss = 0;
        this.response = [];
    }
}