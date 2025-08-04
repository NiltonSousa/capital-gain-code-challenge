#!/usr/bin/env node
import { OperationEntity } from "src/domain/entity";
import { runWithInputStream } from "src/main/common";
import { makeGetOperationTaxUseCase } from "src/main/factory/application";

export function handler(stdin: string): string[] {
  const useCase = makeGetOperationTaxUseCase();
  const lines = stdin.trim().split("\n");
  const outputs: string[] = [];

  for (const line of lines) {
    if (!line.trim()) continue;
    const inputObject = JSON.parse(line);
    const operations = OperationEntity.build(inputObject as object[]);
    const response = useCase.calculate(operations);
    outputs.push(JSON.stringify(response));
  }

  return outputs;
}

runWithInputStream(process.stdin, handler, (outputs) => {
  outputs.forEach((o) => {
    console.log(o);
  });
});
