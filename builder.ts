import { compileFunc, compilerVersion } from "@ton-community/func-js";
import { Cell } from "ton";
import fs from "fs";
import { compileResultToCell } from "./compile";
import path from "path";
import { BUILD_DIR } from "./paths";

async function main() {
  let version = await compilerVersion();
  console.log(version);
  let result = await compileFunc({
    optLevel: 2,
    targets: ["stdlib.fc", "counter.fc"],
    sources: {
      "stdlib.fc": fs.readFileSync("./contracts/imports/stdlib.func", {
        encoding: "utf-8",
      }),
      "counter.fc": fs.readFileSync("./contracts/counter.func", {
        encoding: "utf-8",
      }),
    },
  });
  if (result.status === "error") {
    console.error(result.message);
    return;
  }
  let codeCell = Cell.fromBoc(Buffer.from(result.codeBoc, "base64"))[0];
  let hex = codeCell.toBoc().toString("hex");
  console.log(hex);
}

main();
