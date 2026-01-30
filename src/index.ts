#! /usr/bin/env node

/* eslint-disable no-console */
import fs from "node:fs";
import path from "node:path";
import { exit } from "node:process";
import util, { parseArgs, styleText } from "node:util";

const readdirPromise = util.promisify(fs.readdir);

/** make spaces *visible* in template strings */
const space = " ";

enum Style {
  none = "none",
  wireframe = "wireframe",
  black = "black",
  colored = "colored",
}

/** The different symbol sets, depending on the choosen style */
const symbolStyles = {
  none: { closed: "", open: "", file: "" },
  wireframe: { closed: "🗀", open: "🗁", file: "🗋" },
  black: { closed: "🖿", open: "🖿", file: "🗎" },
  colored: { closed: "📁", open: "📂", file: "📄" },
};

/** Options configuration for `util.parseArgs(...)` */
const parseArgsOptionsConfig: util.ParseArgsOptionsConfig = {
  style: { type: "string", default: "none", short: "s" },
  verbose: { type: "boolean", default: false },
  unsorted: { type: "boolean", default: false, short: "u" },
};

/** Default configuration of the *treefolder* tool */
const config = {
  style: Style.none,
  symbols: symbolStyles.none,
  root: ".",
  ignores: ["node_modules", "dist", "build", ".git", ".husky\\_", "logs", ".angular", "coverage"],
  verbose: false,
  unsorted: false,
};

let folderCount = 0;
let fileCount = 0;
let ignoredCount = 0;
let cliArgs = {};

/**
 * Sorting function based on the comparison of the types and names of `fs.Dirent` folder content items.
 *
 * Note: directory items always preceeed file items. The names of the items (of the same type) are compared otherwise.
 *
 * @param item1 first `fs.Dirent` folder content item (directory or file)
 * @param item2 second `fs.Dirent` folder content item (directory or file)
 * @returns `-1` if the first item preceed the second, `1` if the second item preceed the first, otherwise `0` (identical items).
 */
function compareFolderContentItems(item1: fs.Dirent<string>, item2: fs.Dirent<string>): number {
  return item1.isDirectory() ? (item2.isFile() ? -1 : item1.name.localeCompare(item2.name)) : (item2.isDirectory() ? 1 : item1.name.localeCompare(item2.name));
}
/**
 * Check if an item (directory or file) should be ignored i.e. hidden in the tree
 *
 * Note: This is a **SIMPLE** (dumb) solution, which is not intended to cover all possible use cases.
 *
 * @param folder path of the folder containing the item
 * @param itemName name of the item (directory or file) to be checked
 * @returns `true` if the item should be ignored/hidden, otherwise `false`
 */
function isIgnored(folder: string, itemName: string): boolean {
  const result = config.ignores.includes(path.join(folder, itemName));
  result && ignoredCount++;
  return result;
}

/**
 * Retrieve (not recursively) all `fs.Dirent` items contained within a given folder path.
 *
 * - The result list is sorted according to the configuration property `folderFirst`.
 * - The result list is filtered according to the configuration property `ignores`.
 *
 * @param folder path of the folder to retrieve the content from.
 * @returns the (filtered and eventually sorted) list of `fs.Dirent` items contained in the folder.
 */
async function getFolderContent(folder: string): Promise<fs.Dirent<string>[]> {
  const result = (await readdirPromise(folder, { withFileTypes: true })).filter(item => !isIgnored(folder, item.name));
  return !config.unsorted ? result.sort(compareFolderContentItems) : result;
}

/**
 * Recursively build the tree representation of a folder and its content.
 *
 * @param folder path of the folder to be build the tree representation from.
 * @param indent base identation of a tree leaf and its child leaves (according to the recursion depth)
 * @param isHead `true` if the folder is the root leaf, otherwise `false`
 * @param isTail `true` if the folder is the last leaf of its parents content, otherwise `false`
 * @returns the tree representation of the root folder's content.
 */
async function buildTree(folder: any, indent: string, isHead: boolean, isTail: boolean) {
  const folderContent = await getFolderContent(folder);
  const foldersymbol = folderContent.length < 1 ? config.symbols.closed : config.symbols.open;
  const folderName = isHead && config.symbols.open ? `${foldersymbol}${space}${path.basename(folder)}` : path.basename(folder);
  const folderPrefix = isHead ? "" : isTail ? `└─${foldersymbol}${space}` : `├─${foldersymbol}${space}`;
  let result = `${`${indent + folderPrefix}${folderName}`}\n`;
  const contentItemPrefix = isHead ? "" : isTail ? `${space}${space}${space}` : `│${space}${space}`;
  const tailIndex = folderContent.length - 1;
  for (let index = 0; index < folderContent.length; index++) {
    const contentItem = folderContent[index]!;
    if (contentItem.isDirectory()) {
      result += await buildTree(path.join(folder, contentItem.name), indent + contentItemPrefix, false, index === tailIndex);
    };
    if (contentItem.isFile()) {
      fileCount++;
      const entityPrefix = index === tailIndex ? `└─${config.symbols.file}${space}` : `├─${config.symbols.file}${space}`;
      result += `${indent + contentItemPrefix + entityPrefix + contentItem.name}\n`;
    }
  };
  folderCount++;
  return result;
}

/**
 * Parse the command line arguments and set the tool configuration accordingly
 */
async function configure(): Promise<void> {
  let parsed;
  try {
    parsed = parseArgs({ options: parseArgsOptionsConfig, allowPositionals: true, strict: true });
  }
  catch (err) {
    const error = err as Error;
    console.error(`[${styleText("red", error.name)}]: ${error.message}`);
    exit(1);
  }
  const { values, positionals } = parsed;
  // ----- configuration: style and symbols -----
  config.style = Style[values.style as keyof typeof Style] ?? config.style;
  config.symbols = symbolStyles[config.style];
  // ----- configuration: root folder -----
  config.root = path.resolve((positionals.length > 0) ? positionals[0]! : config.root);
  // ----- configuration: resolved ignores -----
  config.ignores = config.ignores.map(item => path.join(config.root, item));
  // ----- configuration: sort folders first -----
  config.unsorted = Boolean(values.unsorted);
  // ----- configuration: verbose output -----
  config.verbose = Boolean(values.verbose);

  cliArgs = { ...values, root: positionals[0] ?? "n/a" };
}

/** Main function of the tool */
async function main() {
  await configure();
  console.info(await buildTree(config.root, "", true, true));
  if (config.verbose) {
    const verboseTextColor = "blueBright";
    const verboseNumberColor = "yellow";
    console.info(styleText(verboseTextColor, "\nCommand line arguments:"));
    console.info(cliArgs);
    console.info(styleText(verboseTextColor, "\nTreefold configuration:"));
    console.info(config, "\n");
    const folders = styleText(verboseNumberColor, `${folderCount}`);
    const files = styleText(verboseNumberColor, `${fileCount}`);
    const ignored = styleText(verboseNumberColor, `${ignoredCount}`);
    console.info(`${styleText(verboseTextColor, `Scanned ${folders} folders and ${files} files.`)}`);
    console.info(`${styleText(verboseTextColor, `Filtered out ${ignored} items (folders or files).`)}`);
  }
}

main();
