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

  it("Case #1", async () => {
    const operations = [
      mockOperationEntity({ type: OperationType.BUY, unitCost: 10.00, quantity: 100 }),
      mockOperationEntity({ type: OperationType.SELL, unitCost: 15.00, quantity: 50 }),
      mockOperationEntity({ type: OperationType.SELL, unitCost: 15.00, quantity: 50 })
    ];


    const result = await sut.calculate(operations);


    expect(result).toEqual([{ "tax": 0.0 }, { "tax": 0.0 }, { "tax": 0.0 }]);
  });

  it("Case #2", async () => {
    const operations = [
      mockOperationEntity({ type: OperationType.BUY, unitCost: 10.00, quantity: 10000 }),
      mockOperationEntity({ type: OperationType.SELL, unitCost: 20.00, quantity: 5000 }),
      mockOperationEntity({ type: OperationType.SELL, unitCost: 5.00, quantity: 5000 })
    ];


    const result = await sut.calculate(operations);


    expect(result).toEqual([{ "tax": 0.0 }, { "tax": 10000.0 }, { "tax": 0.0 }]);
  });

  it("Case #1 + Case #2", async () => {
    const operationsCaseOne = [
      mockOperationEntity({ type: OperationType.BUY, unitCost: 10.00, quantity: 100 }),
      mockOperationEntity({ type: OperationType.SELL, unitCost: 15.00, quantity: 50 }),
      mockOperationEntity({ type: OperationType.SELL, unitCost: 15.00, quantity: 50 })
    ];

    const operationsCaseTwo = [
      mockOperationEntity({ type: OperationType.BUY, unitCost: 10.00, quantity: 10000 }),
      mockOperationEntity({ type: OperationType.SELL, unitCost: 20.00, quantity: 5000 }),
      mockOperationEntity({ type: OperationType.SELL, unitCost: 5.00, quantity: 5000 })
    ];



    const resultOne = await sut.calculate(operationsCaseOne);
    const resultTwo = await sut.calculate(operationsCaseTwo);


    expect(resultOne).toEqual([{ "tax": 0.0 }, { "tax": 0.0 }, { "tax": 0.0 }]);
    expect(resultTwo).toEqual([{ "tax": 0.0 }, { "tax": 10000.0 }, { "tax": 0.0 }]);
  });

  it("Case #3", async () => {
    const operations = [
      mockOperationEntity({ type: OperationType.BUY, unitCost: 10.00, quantity: 10000 }),
      mockOperationEntity({ type: OperationType.SELL, unitCost: 5.00, quantity: 5000 }),
      mockOperationEntity({ type: OperationType.SELL, unitCost: 20.00, quantity: 3000 }),
    ];

    const result = await sut.calculate(operations);

    expect(result).toEqual([
      { tax: 0.0 },
      { tax: 0.0 },
      { tax: 1000.0 },
    ]);
  });

  it("Case #4", async () => {
    const operations = [
      mockOperationEntity({ type: OperationType.BUY, unitCost: 10.00, quantity: 10000 }),
      mockOperationEntity({ type: OperationType.BUY, unitCost: 25.00, quantity: 5000 }),
      mockOperationEntity({ type: OperationType.SELL, unitCost: 15.00, quantity: 10000 }),
    ];

    const result = await sut.calculate(operations);

    expect(result).toEqual([
      { tax: 0.0 },
      { tax: 0.0 },
      { tax: 0.0 },
    ]);
  });

  it("Case #5", async () => {
    const operations = [
      mockOperationEntity({ type: OperationType.BUY, unitCost: 10.00, quantity: 10000 }),
      mockOperationEntity({ type: OperationType.BUY, unitCost: 25.00, quantity: 5000 }),
      mockOperationEntity({ type: OperationType.SELL, unitCost: 15.00, quantity: 10000 }),
      mockOperationEntity({ type: OperationType.SELL, unitCost: 25.00, quantity: 5000 }),
    ];

    const result = await sut.calculate(operations);

    expect(result).toEqual([
      { tax: 0.0 },
      { tax: 0.0 },
      { tax: 0.0 },
      { tax: 10000.0 },
    ]);
  });

  it("Case #6", async () => {
    const operations = [
      mockOperationEntity({ type: OperationType.BUY, unitCost: 10.00, quantity: 10000 }),
      mockOperationEntity({ type: OperationType.SELL, unitCost: 2.00, quantity: 5000 }),
      mockOperationEntity({ type: OperationType.SELL, unitCost: 20.00, quantity: 2000 }),
      mockOperationEntity({ type: OperationType.SELL, unitCost: 20.00, quantity: 2000 }),
      mockOperationEntity({ type: OperationType.SELL, unitCost: 25.00, quantity: 1000 }),
    ];

    const result = await sut.calculate(operations);

    expect(result).toEqual([
      { tax: 0.0 },
      { tax: 0.0 },
      { tax: 0.0 },
      { tax: 0.0 },
      { tax: 3000.0 },
    ]);
  });

  it("Case #7", async () => {
    const operations = [
      mockOperationEntity({ type: OperationType.BUY, unitCost: 10.00, quantity: 10000 }),
      mockOperationEntity({ type: OperationType.SELL, unitCost: 2.00, quantity: 5000 }),
      mockOperationEntity({ type: OperationType.SELL, unitCost: 20.00, quantity: 2000 }),
      mockOperationEntity({ type: OperationType.SELL, unitCost: 20.00, quantity: 2000 }),
      mockOperationEntity({ type: OperationType.SELL, unitCost: 25.00, quantity: 1000 }),
      mockOperationEntity({ type: OperationType.BUY, unitCost: 20.00, quantity: 10000 }),
      mockOperationEntity({ type: OperationType.SELL, unitCost: 15.00, quantity: 5000 }),
      mockOperationEntity({ type: OperationType.SELL, unitCost: 30.00, quantity: 4350 }),
      mockOperationEntity({ type: OperationType.SELL, unitCost: 30.00, quantity: 650 }),
    ];

    const result = await sut.calculate(operations);

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

  it("Case #8", async () => {
    const operations = [
      mockOperationEntity({ type: OperationType.BUY, unitCost: 10.00, quantity: 10000 }),
      mockOperationEntity({ type: OperationType.SELL, unitCost: 50.00, quantity: 10000 }),
      mockOperationEntity({ type: OperationType.BUY, unitCost: 20.00, quantity: 10000 }),
      mockOperationEntity({ type: OperationType.SELL, unitCost: 50.00, quantity: 10000 }),
    ];

    const result = await sut.calculate(operations);

    expect(result).toEqual([
      { tax: 0.0 },
      { tax: 80000.0 },
      { tax: 0.0 },
      { tax: 60000.0 },
    ]);
  });

  it("Case #9", async () => {
    const operations = [
      mockOperationEntity({ type: OperationType.BUY, unitCost: 5000.00, quantity: 10 }),
      mockOperationEntity({ type: OperationType.SELL, unitCost: 4000.00, quantity: 5 }),
      mockOperationEntity({ type: OperationType.BUY, unitCost: 15000.00, quantity: 5 }),
      mockOperationEntity({ type: OperationType.BUY, unitCost: 4000.00, quantity: 2 }),
      mockOperationEntity({ type: OperationType.BUY, unitCost: 23000.00, quantity: 2 }),
      mockOperationEntity({ type: OperationType.SELL, unitCost: 20000.00, quantity: 1 }),
      mockOperationEntity({ type: OperationType.SELL, unitCost: 12000.00, quantity: 10 }),
      mockOperationEntity({ type: OperationType.SELL, unitCost: 15000.00, quantity: 3 }),
    ];

    const result = await sut.calculate(operations);

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