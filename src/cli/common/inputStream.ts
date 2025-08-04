import type stream from "stream";

// Common utility to run a handler with an input stream(stdin or integration test mock)
export function runWithInputStream(
  inputStream: stream.Readable,
  handler: (stdin: string) => string[],
  onComplete: (outputs: string[]) => void
): void {
  let input = "";

  inputStream.setEncoding("utf8");

  inputStream.on("data", (chunk: any) => (input += chunk));

  inputStream.on("end", () => {
    const outputs = handler(input);
    onComplete(outputs);
  });
}
