import { ChildProcess } from "child_process";

export function getResponseFromCompiler(responseCompiler: ChildProcess) {
  let errorOutput = "";
  return new Promise<void>((resolve, reject) => {
    responseCompiler.stderr?.on("data", (data: Buffer) => {
      errorOutput += data.toString();
    })

    responseCompiler.on("error", (err) => {
      reject(err);
    })

    responseCompiler.on("close", (code) => {
      if(code === 0) {
        resolve();
      } else {
        reject(new Error(`Compilation Failed ${errorOutput}`));
      }
    })
  });
}

