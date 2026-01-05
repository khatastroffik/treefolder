import fs from "node:fs";
import path from "node:path";
import util from "node:util";

const readdirPromise = util.promisify(fs.readdir);
const statPromise = util.promisify(fs.stat);

async function buildTree(entity: any, indent: string, isHead: boolean, isTail: boolean, result: string) {
  const stats = await statPromise(entity);
  let files: string[] = [];
  if (stats.isDirectory()) {
    files = await readdirPromise(entity);
  }

  // keep track of line prefixes
  let entityPrefix = isTail === true ? "└─ " : "├─ ";
  let contentPrefix = isTail === true ? "   " : "│   ";
  if (isHead === true) {
    entityPrefix = "";
    contentPrefix = "";
  }

  // add entity to the output
  result += `${indent + entityPrefix + path.basename(entity)}\n`;

  // if entity is a directory, recurse through its contents
  for (let index = 0; index < files.length - 1; index++) {
    result = await buildTree(path.join(entity, files[index]!), indent + contentPrefix, false, false, result);
  }
  if (files.length > 0) {
    result = await buildTree(path.join(entity, files[files.length - 1]!), indent + contentPrefix, false, true, result);
  }
  return result;
}

async function generateFileTree(entity: any) {
  const tree = await buildTree(entity, "", true, true, "");
  console.log(tree); // eslint-disable-line no-console
}

async function main() {
  await generateFileTree(".");
}

main();
