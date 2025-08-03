import { faker } from "@faker-js/faker";
import { OperationEntity, OperationType } from "src/domain/entity";

export function mockOperationEntity(
  overrides?: Partial<OperationEntity>
): OperationEntity {
  return new OperationEntity(
    overrides?.type != null ? overrides.type : OperationType.BUY,
    overrides?.unitCost ?? faker.number.float({ min: 1, max: 100 }),
    overrides?.quantity ?? faker.number.float({ min: 1, max: 100 })
  );
}
