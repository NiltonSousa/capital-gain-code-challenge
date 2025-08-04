#!/usr/bin/env node
import { runWithInputStream } from "src/cli/common";
import { makeGetOperationTaxUseCase } from "src/cli/factory/application";
import { OperationEntity } from "src/domain/entity";

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
