import { compileFunc, compilerVersion } from "@ton-community/func-js";
import { Cell } from "ton";
import fs from "fs";
import { writeFile } from "fs/promises";
import { compileResultToCell } from "./compile";
import path from "path";
import { BUILD_DIR } from "./paths";

async function main() {
  let version = await compilerVersion();
  const buildArtifactPath = path.join(BUILD_DIR, `.compiled.json`);
  console.log(version);
  try {
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
    let cell = Cell.fromBoc(Buffer.from(result.codeBoc, "base64"))[0];
    let hex = cell.toBoc().toString("hex");

    console.log(hex);

    await writeFile(
      buildArtifactPath,
      JSON.stringify({
        hex: hex,
      })
    );
  } catch (e) {
    process.exit(1);
  }
}

main();