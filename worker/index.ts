import { spawn } from "child_process";
import { createClient } from "redis";
import fs from "fs";
import { getResponseFromCompiler } from "./getResponseFromCompiler";
import { getResponse } from "./getResponse";
import { add_output_to_DB } from "./add_output_to_DB";

const client = createClient();
client.connect().then(async () => {
  console.log("Connected to Worker Client!");
  while (1) {
    let submissionId = ""
    try {
      const response = await client.brPop("submission", 0);

      const responseParsed = JSON.parse(response!.element);
      const language = responseParsed.language;
      const code = responseParsed.code;
      submissionId = responseParsed.submissionId;

      let filePath = `${__dirname}/code/`;
      let finalOutput = "";

      let outputFile = "./code/out";

      // JAVA
      if (language === "java") {
        console.log(`Running user's Java Code`);
        filePath += "a.java";

        fs.writeFileSync(filePath, code);

        const responseCompiler = spawn("javac", [filePath]);
        await getResponseFromCompiler(responseCompiler);

        const process = spawn("java", [filePath]);
        const finalOutput = await getResponse(process);
        console.log(finalOutput);

        await add_output_to_DB(finalOutput, submissionId, true);
      }

      // CPP
      if (language === "cpp") {
        console.log(`RUNNING user's cpp Code`);
        filePath += "a.cpp";

        fs.writeFileSync(filePath, code);

        const responseCompiler = spawn("g++", [filePath, "-o", outputFile]);
        await getResponseFromCompiler(responseCompiler);

        const process = spawn(outputFile);
        finalOutput = await getResponse(process);
        console.log(finalOutput);
        await add_output_to_DB(finalOutput, submissionId, true);
      }

      // RUST
      if (language === "rust") {
        console.log("Running user's Rust Code");
        filePath += "a.rs";

        fs.writeFileSync(filePath, code);
        const responseCompiler = spawn("rustc", [filePath, "-o", outputFile]);
        await getResponseFromCompiler(responseCompiler);

        const process = spawn(outputFile);
        const finalOutput = await getResponse(process);
        console.log(finalOutput);
        await add_output_to_DB(finalOutput, submissionId, true);
      }

      // JS
      if (language === "js") {
        console.log(`RUNNING user's js Code`);
        filePath += "a.js";

        fs.writeFileSync(filePath, code);

        const process = spawn("node", [filePath]);
        finalOutput = await getResponse(process);
        console.log(finalOutput);
        await add_output_to_DB(finalOutput, submissionId, true);
      }

      // PY
      if (language === "py") {
        console.log(`Running user's py Code`);

        filePath += "a.py";

        fs.writeFileSync(filePath, code);

        const process = spawn("python3", [filePath]);
        finalOutput = await getResponse(process);
        console.log(finalOutput);
        await add_output_to_DB(finalOutput, submissionId, true);
      }
    } catch (err) {
      console.log(err);
      await add_output_to_DB(String(err), submissionId, false);
    }
  }
});
