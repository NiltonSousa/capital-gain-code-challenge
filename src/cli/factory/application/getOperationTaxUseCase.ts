import { GetOperationTaxUseCaseImpl } from "src/application";
import { type IGetOperationTaxUseCase } from "src/domain/usecase";

export function makeGetOperationTaxUseCase(): IGetOperationTaxUseCase {
  return new GetOperationTaxUseCaseImpl();
}
