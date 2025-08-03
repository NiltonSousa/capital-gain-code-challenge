import { describe } from "node:test";
import { GetOperationTaxUseCaseImpl } from "src/application/usecase";
import { OperationType } from "src/domain/entity";
import { mockOperationEntity } from "../mock/domain/operation";

describe("GetOperationTaxUseCase", () => {
  let sut: GetOperationTaxUseCaseImpl;

  beforeEach(() => {
    jest.clearAllMocks();

    sut = new GetOperationTaxUseCaseImpl();
  });

  it("Case #1", () => {
    const operations = [
      mockOperationEntity({
        type: OperationType.BUY,
        unitCost: 10.0,
        quantity: 100,
      }),
      mockOperationEntity({
        type: OperationType.SELL,
        unitCost: 15.0,
        quantity: 50,
      }),
      mockOperationEntity({
        type: OperationType.SELL,
        unitCost: 15.0,
        quantity: 50,
      }),
    ];

    const result = sut.calculate(operations);

    expect(result).toEqual([{ tax: 0.0 }, { tax: 0.0 }, { tax: 0.0 }]);
  });

  it("Case #2", () => {
    const operations = [
      mockOperationEntity({
        type: OperationType.BUY,
        unitCost: 10.0,
        quantity: 10000,
      }),
      mockOperationEntity({
        type: OperationType.SELL,
        unitCost: 20.0,
        quantity: 5000,
      }),
      mockOperationEntity({
        type: OperationType.SELL,
        unitCost: 5.0,
        quantity: 5000,
      }),
    ];

    const result = sut.calculate(operations);

    expect(result).toEqual([{ tax: 0.0 }, { tax: 10000.0 }, { tax: 0.0 }]);
  });

  it("Case #1 + Case #2", () => {
    const operationsCaseOne = [
      mockOperationEntity({
        type: OperationType.BUY,
        unitCost: 10.0,
        quantity: 100,
      }),
      mockOperationEntity({
        type: OperationType.SELL,
        unitCost: 15.0,
        quantity: 50,
      }),
      mockOperationEntity({
        type: OperationType.SELL,
        unitCost: 15.0,
        quantity: 50,
      }),
    ];

    const operationsCaseTwo = [
      mockOperationEntity({
        type: OperationType.BUY,
        unitCost: 10.0,
        quantity: 10000,
      }),
      mockOperationEntity({
        type: OperationType.SELL,
        unitCost: 20.0,
        quantity: 5000,
      }),
      mockOperationEntity({
        type: OperationType.SELL,
        unitCost: 5.0,
        quantity: 5000,
      }),
    ];

    const resultOne = sut.calculate(operationsCaseOne);
    const resultTwo = sut.calculate(operationsCaseTwo);

    expect(resultOne).toEqual([{ tax: 0.0 }, { tax: 0.0 }, { tax: 0.0 }]);
    expect(resultTwo).toEqual([{ tax: 0.0 }, { tax: 10000.0 }, { tax: 0.0 }]);
  });

  it("Case #3", () => {
    const operations = [
      mockOperationEntity({
        type: OperationType.BUY,
        unitCost: 10.0,
        quantity: 10000,
      }),
      mockOperationEntity({
        type: OperationType.SELL,
        unitCost: 5.0,
        quantity: 5000,
      }),
      mockOperationEntity({
        type: OperationType.SELL,
        unitCost: 20.0,
        quantity: 3000,
      }),
    ];

    const result = sut.calculate(operations);

    expect(result).toEqual([{ tax: 0.0 }, { tax: 0.0 }, { tax: 1000.0 }]);
  });

  it("Case #4", () => {
    const operations = [
      mockOperationEntity({
        type: OperationType.BUY,
        unitCost: 10.0,
        quantity: 10000,
      }),
      mockOperationEntity({
        type: OperationType.BUY,
        unitCost: 25.0,
        quantity: 5000,
      }),
      mockOperationEntity({
        type: OperationType.SELL,
        unitCost: 15.0,
        quantity: 10000,
      }),
    ];

    const result = sut.calculate(operations);

    expect(result).toEqual([{ tax: 0.0 }, { tax: 0.0 }, { tax: 0.0 }]);
  });

  it("Case #5", () => {
    const operations = [
      mockOperationEntity({
        type: OperationType.BUY,
        unitCost: 10.0,
        quantity: 10000,
      }),
      mockOperationEntity({
        type: OperationType.BUY,
        unitCost: 25.0,
        quantity: 5000,
      }),
      mockOperationEntity({
        type: OperationType.SELL,
        unitCost: 15.0,
        quantity: 10000,
      }),
      mockOperationEntity({
        type: OperationType.SELL,
        unitCost: 25.0,
        quantity: 5000,
      }),
    ];

    const result = sut.calculate(operations);

    expect(result).toEqual([
      { tax: 0.0 },
      { tax: 0.0 },
      { tax: 0.0 },
      { tax: 10000.0 },
    ]);
  });

  it("Case #6", () => {
    const operations = [
      mockOperationEntity({
        type: OperationType.BUY,
        unitCost: 10.0,
        quantity: 10000,
      }),
      mockOperationEntity({
        type: OperationType.SELL,
        unitCost: 2.0,
        quantity: 5000,
      }),
      mockOperationEntity({
        type: OperationType.SELL,
        unitCost: 20.0,
        quantity: 2000,
      }),
      mockOperationEntity({
        type: OperationType.SELL,
        unitCost: 20.0,
        quantity: 2000,
      }),
      mockOperationEntity({
        type: OperationType.SELL,
        unitCost: 25.0,
        quantity: 1000,
      }),
    ];

    const result = sut.calculate(operations);

    expect(result).toEqual([
      { tax: 0.0 },
      { tax: 0.0 },
      { tax: 0.0 },
      { tax: 0.0 },
      { tax: 3000.0 },
    ]);
  });

  it("Case #7", () => {
    const operations = [
      mockOperationEntity({
        type: OperationType.BUY,
        unitCost: 10.0,
        quantity: 10000,
      }),
      mockOperationEntity({
        type: OperationType.SELL,
        unitCost: 2.0,
        quantity: 5000,
      }),
      mockOperationEntity({
        type: OperationType.SELL,
        unitCost: 20.0,
        quantity: 2000,
      }),
      mockOperationEntity({
        type: OperationType.SELL,
        unitCost: 20.0,
        quantity: 2000,
      }),
      mockOperationEntity({
        type: OperationType.SELL,
        unitCost: 25.0,
        quantity: 1000,
      }),
      mockOperationEntity({
        type: OperationType.BUY,
        unitCost: 20.0,
        quantity: 10000,
      }),
      mockOperationEntity({
        type: OperationType.SELL,
        unitCost: 15.0,
        quantity: 5000,
      }),
      mockOperationEntity({
        type: OperationType.SELL,
        unitCost: 30.0,
        quantity: 4350,
      }),
      mockOperationEntity({
        type: OperationType.SELL,
        unitCost: 30.0,
        quantity: 650,
      }),
    ];

    const result = sut.calculate(operations);

    expect(result).toEqual([
      { tax: 0.0 },
      { tax: 0.0 },
      { tax: 0.0 },
      { tax: 0.0 },
      { tax: 3000.0 },
      { tax: 0.0 },
      { tax: 0.0 },
      { tax: 3700.0 },
      { tax: 0.0 },
    ]);
  });

  it("Case #8", () => {
    const operations = [
      mockOperationEntity({
        type: OperationType.BUY,
        unitCost: 10.0,
        quantity: 10000,
      }),
      mockOperationEntity({
        type: OperationType.SELL,
        unitCost: 50.0,
        quantity: 10000,
      }),
      mockOperationEntity({
        type: OperationType.BUY,
        unitCost: 20.0,
        quantity: 10000,
      }),
      mockOperationEntity({
        type: OperationType.SELL,
        unitCost: 50.0,
        quantity: 10000,
      }),
    ];

    const result = sut.calculate(operations);

    expect(result).toEqual([
      { tax: 0.0 },
      { tax: 80000.0 },
      { tax: 0.0 },
      { tax: 60000.0 },
    ]);
  });

  it("Case #9", () => {
    const operations = [
      mockOperationEntity({
        type: OperationType.BUY,
        unitCost: 5000.0,
        quantity: 10,
      }),
      mockOperationEntity({
        type: OperationType.SELL,
        unitCost: 4000.0,
        quantity: 5,
      }),
      mockOperationEntity({
        type: OperationType.BUY,
        unitCost: 15000.0,
        quantity: 5,
      }),
      mockOperationEntity({
        type: OperationType.BUY,
        unitCost: 4000.0,
        quantity: 2,
      }),
      mockOperationEntity({
        type: OperationType.BUY,
        unitCost: 23000.0,
        quantity: 2,
      }),
      mockOperationEntity({
        type: OperationType.SELL,
        unitCost: 20000.0,
        quantity: 1,
      }),
      mockOperationEntity({
        type: OperationType.SELL,
        unitCost: 12000.0,
        quantity: 10,
      }),
      mockOperationEntity({
        type: OperationType.SELL,
        unitCost: 15000.0,
        quantity: 3,
      }),
    ];

    const result = sut.calculate(operations);

    expect(result).toEqual([
      { tax: 0.0 },
      { tax: 0.0 },
      { tax: 0.0 },
      { tax: 0.0 },
      { tax: 0.0 },
      { tax: 0.0 },
      { tax: 1000.0 },
      { tax: 2400.0 },
    ]);
  });
});
