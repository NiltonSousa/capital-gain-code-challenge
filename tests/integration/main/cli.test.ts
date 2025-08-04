import { handler } from "src/main/cli/cli";
import { runWithInputStream } from "src/main/common";
import { Readable } from "stream";

describe("Integration - main.ts by stdin", () => {
  let inputStream: Readable;

  beforeEach(() => {
    inputStream = new Readable({ read() {} });
  });

  afterEach(() => {
    inputStream.destroy();
  });

  afterAll(() => {
    jest.clearAllMocks();
    process.stdin.destroy();
  });

  it("should process mocked stdin", (done) => {
    const input =
      JSON.stringify([
        { operation: "buy", "unit-cost": 10, quantity: 100 },
        { operation: "sell", "unit-cost": 15, quantity: 50 },
      ]) + "\n";

    inputStream.push(input);
    inputStream.push(null);

    runWithInputStream(inputStream, handler, (outputs) => {
      expect(outputs[0]).toBe('[{"tax":0},{"tax":0}]');

      done();
    });
  });

  it("Case #1", (done) => {
    const input =
      JSON.stringify([
        { operation: "buy", "unit-cost": 10.0, quantity: 100 },
        { operation: "sell", "unit-cost": 15.0, quantity: 50 },
        { operation: "sell", "unit-cost": 15.0, quantity: 50 },
      ]) + "\n";

    inputStream.push(input);
    inputStream.push(null);

    runWithInputStream(inputStream, handler, (outputs) => {
      expect(outputs[0]).toBe(
        JSON.stringify([{ tax: 0 }, { tax: 0 }, { tax: 0 }])
      );

      done();
    });
  });

  it("Case #2", (done) => {
    const input =
      JSON.stringify([
        { operation: "buy", "unit-cost": 10.0, quantity: 10000 },
        { operation: "sell", "unit-cost": 20.0, quantity: 5000 },
        { operation: "sell", "unit-cost": 5.0, quantity: 5000 },
      ]) + "\n";

    inputStream.push(input);
    inputStream.push(null);

    runWithInputStream(inputStream, handler, (outputs) => {
      expect(outputs[0]).toBe(
        JSON.stringify([{ tax: 0 }, { tax: 10000 }, { tax: 0 }])
      );

      done();
    });
  });

  it("Case #1 + Case #2", (done) => {
    const input1 =
      JSON.stringify([
        { operation: "buy", "unit-cost": 10.0, quantity: 100 },
        { operation: "sell", "unit-cost": 15.0, quantity: 50 },
        { operation: "sell", "unit-cost": 15.0, quantity: 50 },
      ]) + "\n";
    const input2 =
      JSON.stringify([
        { operation: "buy", "unit-cost": 10.0, quantity: 10000 },
        { operation: "sell", "unit-cost": 20.0, quantity: 5000 },
        { operation: "sell", "unit-cost": 5.0, quantity: 5000 },
      ]) + "\n";

    inputStream.push(input1);
    inputStream.push(input2);
    inputStream.push(null);

    runWithInputStream(inputStream, handler, (outputs) => {
      expect(outputs[0]).toBe(
        JSON.stringify([{ tax: 0 }, { tax: 0 }, { tax: 0 }])
      );
      expect(outputs[1]).toBe(
        JSON.stringify([{ tax: 0 }, { tax: 10000 }, { tax: 0 }])
      );

      done();
    });
  });

  it("Case #3", (done) => {
    const input =
      JSON.stringify([
        { operation: "buy", "unit-cost": 10.0, quantity: 10000 },
        { operation: "sell", "unit-cost": 5.0, quantity: 5000 },
        { operation: "sell", "unit-cost": 20.0, quantity: 3000 },
      ]) + "\n";

    inputStream.push(input);
    inputStream.push(null);
    runWithInputStream(inputStream, handler, (outputs) => {
      expect(outputs[0]).toBe(
        JSON.stringify([{ tax: 0 }, { tax: 0 }, { tax: 1000 }])
      );

      done();
    });
  });

  it("Case #4", (done) => {
    const input =
      JSON.stringify([
        { operation: "buy", "unit-cost": 10.0, quantity: 10000 },
        { operation: "buy", "unit-cost": 25.0, quantity: 5000 },
        { operation: "sell", "unit-cost": 15.0, quantity: 10000 },
      ]) + "\n";

    inputStream.push(input);
    inputStream.push(null);
    runWithInputStream(inputStream, handler, (outputs) => {
      expect(outputs[0]).toBe(
        JSON.stringify([{ tax: 0 }, { tax: 0 }, { tax: 0 }])
      );

      done();
    });
  });

  it("Case #5", (done) => {
    const input =
      JSON.stringify([
        { operation: "buy", "unit-cost": 10.0, quantity: 10000 },
        { operation: "buy", "unit-cost": 25.0, quantity: 5000 },
        { operation: "sell", "unit-cost": 15.0, quantity: 10000 },
        { operation: "sell", "unit-cost": 25.0, quantity: 5000 },
      ]) + "\n";

    inputStream.push(input);
    inputStream.push(null);
    runWithInputStream(inputStream, handler, (outputs) => {
      expect(outputs[0]).toBe(
        JSON.stringify([{ tax: 0 }, { tax: 0 }, { tax: 0 }, { tax: 10000 }])
      );

      done();
    });
  });

  it("Case #6", (done) => {
    const input =
      JSON.stringify([
        { operation: "buy", "unit-cost": 10.0, quantity: 10000 },
        { operation: "sell", "unit-cost": 2.0, quantity: 5000 },
        { operation: "sell", "unit-cost": 20.0, quantity: 2000 },
        { operation: "sell", "unit-cost": 20.0, quantity: 2000 },
        { operation: "sell", "unit-cost": 25.0, quantity: 1000 },
      ]) + "\n";

    inputStream.push(input);
    inputStream.push(null);

    runWithInputStream(inputStream, handler, (outputs) => {
      expect(outputs[0]).toBe(
        JSON.stringify([
          { tax: 0 },
          { tax: 0 },
          { tax: 0 },
          { tax: 0 },
          { tax: 3000 },
        ])
      );

      done();
    });
  });

  it("Case #7", (done) => {
    const input =
      JSON.stringify([
        { operation: "buy", "unit-cost": 10.0, quantity: 10000 },
        { operation: "sell", "unit-cost": 2.0, quantity: 5000 },
        { operation: "sell", "unit-cost": 20.0, quantity: 2000 },
        { operation: "sell", "unit-cost": 20.0, quantity: 2000 },
        { operation: "sell", "unit-cost": 25.0, quantity: 1000 },
        { operation: "buy", "unit-cost": 20.0, quantity: 10000 },
        { operation: "sell", "unit-cost": 15.0, quantity: 5000 },
        { operation: "sell", "unit-cost": 30.0, quantity: 4350 },
        { operation: "sell", "unit-cost": 30.0, quantity: 650 },
      ]) + "\n";

    inputStream.push(input);
    inputStream.push(null);

    runWithInputStream(inputStream, handler, (outputs) => {
      expect(outputs[0]).toBe(
        JSON.stringify([
          { tax: 0 },
          { tax: 0 },
          { tax: 0 },
          { tax: 0 },
          { tax: 3000 },
          { tax: 0 },
          { tax: 0 },
          { tax: 3700 },
          { tax: 0 },
        ])
      );

      done();
    });
  });

  it("Case #8", (done) => {
    const input =
      JSON.stringify([
        { operation: "buy", "unit-cost": 10.0, quantity: 10000 },
        { operation: "sell", "unit-cost": 50.0, quantity: 10000 },
        { operation: "buy", "unit-cost": 20.0, quantity: 10000 },
        { operation: "sell", "unit-cost": 50.0, quantity: 10000 },
      ]) + "\n";

    inputStream.push(input);
    inputStream.push(null);

    runWithInputStream(inputStream, handler, (outputs) => {
      expect(outputs[0]).toBe(
        JSON.stringify([{ tax: 0 }, { tax: 80000 }, { tax: 0 }, { tax: 60000 }])
      );

      done();
    });
  });

  it("Case #9", (done) => {
    const input =
      JSON.stringify([
        { operation: "buy", "unit-cost": 5000.0, quantity: 10 },
        { operation: "sell", "unit-cost": 4000.0, quantity: 5 },
        { operation: "buy", "unit-cost": 15000.0, quantity: 5 },
        { operation: "buy", "unit-cost": 4000.0, quantity: 2 },
        { operation: "buy", "unit-cost": 23000.0, quantity: 2 },
        { operation: "sell", "unit-cost": 20000.0, quantity: 1 },
        { operation: "sell", "unit-cost": 12000.0, quantity: 10 },
        { operation: "sell", "unit-cost": 15000.0, quantity: 3 },
      ]) + "\n";

    inputStream.push(input);
    inputStream.push(null);

    runWithInputStream(inputStream, handler, (outputs) => {
      expect(outputs[0]).toBe(
        JSON.stringify([
          { tax: 0 },
          { tax: 0 },
          { tax: 0 },
          { tax: 0 },
          { tax: 0 },
          { tax: 0 },
          { tax: 1000 },
          { tax: 2400 },
        ])
      );

      done();
    });
  });
});
