#!/usr/bin/env node
import { OperationEntity } from "src/domain/entity";
import { makeGetOperationTaxUseCase } from "src/main/factory/application";

function handler(stdin: string): void {
  const useCase = makeGetOperationTaxUseCase();
  const lines = stdin.trim().split("\n");

  for (const line of lines) {
    if (!line.trim()) continue;

    const inputObject = JSON.parse(line);

    const operations = OperationEntity.build(inputObject as object[]);

    const response = useCase.calculate(operations);

    console.log(JSON.stringify(response));
  }
}

function main(): void {
  let input = "";

  process.stdin.setEncoding("utf8");
  process.stdin.on("data", (chunk: any) => (input += chunk));
  process.stdin.on("end", () => {
    handler(input);
  });
}

main();
