import { ChildProcess } from "child_process";

export function getResponse(process: ChildProcess): Promise<string> {
  let finalOutput = "";

  return new Promise((resolve, reject) => {
    process.stdout?.on("data", (msg: Buffer) => {
      finalOutput += msg.toString();
    });

    process.stderr?.on("data", (err: Buffer) => {
      reject(err.toString());
    });

    process.on("close", (code: number) => {
      if (code === 0) {
        resolve(finalOutput);
      } else {
        reject(new Error(`Process exited with code ${code}`));
      }
    });
  });
}


