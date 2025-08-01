import { OperationEntity } from "src/domain/entity";

export interface IGetOperationTaxUseCaseResponse extends Array<Pick<OperationEntity, "tax">> {}

export interface IGetOperationTaxUseCase {
    calculate(operations: OperationEntity[]): Promise<IGetOperationTaxUseCaseResponse>;
}