import { type OperationEntity } from "src/domain/entity";

export interface IGetOperationTaxUseCaseResponse
  extends Array<{ tax: number }> {}

export interface IGetOperationTaxUseCase {
  calculate(operations: OperationEntity[]): IGetOperationTaxUseCaseResponse;
}
