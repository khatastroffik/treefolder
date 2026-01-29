/* eslint-disable no-console */
import fs from "node:fs";
import path from "node:path";
import { exit } from "node:process";
import util, { parseArgs, styleText } from "node:util";

const readdirPromise = util.promisify(fs.readdir);

const space = " ";

interface Symbols {
  closed: string;
  open: string;
  file: string;
}

enum SymbolStyle {
  none,
  wireframe,
  black,
  colored,
}

type SymbolStyles = {
  [key in keyof typeof SymbolStyle]: Symbols;
};

const symbolStyles: SymbolStyles = {
  none: { closed: "", open: "", file: "" },
  wireframe: { closed: "🗀", open: "🗁", file: "🗋" },
  black: { closed: "🖿", open: "🖿", file: "🗎" },
  colored: { closed: "📁", open: "📂", file: "📄" },
};

const parseArgsOptionsConfig: util.ParseArgsOptionsConfig = {
  "style": { type: "string", default: "none", short: "s" },
  "folder-first": { type: "boolean", default: true, short: "f" },
  "verbose": { type: "boolean", default: false },
};

interface Config {
  symbols: Symbols;
  root: string;
  ignores: string[];
  folderFirst: boolean;
  verbose: boolean;
}

const config: Config = {
  symbols: symbolStyles.none,
  root: ".",
  ignores: ["node_modules", "dist", "build", ".git", ".husky\\_", "logs"],
  folderFirst: false,
  verbose: false,
};

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
  return config.ignores.includes(path.join(folder, itemName));
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

  // if (config.folderFirst) {
  //   console.log("FOLDERFIRST", config.folderFirst, "SORTED");
  //   return result.sort(compareFolderContentItems);
  // }
  // console.log("FOLDERFIRST", config.folderFirst, "UNSORTED");
  // return result;
  return config.folderFirst ? result.sort(compareFolderContentItems) : result;
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
      const entityPrefix = index === tailIndex ? `└─${config.symbols.file}${space}` : `├─${config.symbols.file}${space}`;
      result += `${indent + contentItemPrefix + entityPrefix + contentItem.name}\n`;
    }
  };
  return result;
}
/**
 * Parse the command line arguments and set the tool configuration accordingly
 */
async function configure(): Promise<void> {
  let parsed;
  try {
    parsed = parseArgs({ options: parseArgsOptionsConfig, allowPositionals: true, strict: false });
  }
  catch (error) {
    if (error instanceof TypeError) {
      console.error(`${error.name}: ${error.message}`);
    }
    exit(1);
  }
  const { values, positionals } = parsed;

  // ----- symbols -----
  config.symbols = symbolStyles[values.style! as unknown as SymbolStyle] ?? config.symbols;
  if (!config.symbols) {
    console.error(`Unsupported value of the 'style' option:\n  current value  : '${values.style}'\n  allowed values : 'none', 'wireframe', 'black' or 'colored'\n  default value  : 'none'`);
    exit(1);
  }

  // ----- root folder -----
  config.root = path.resolve(positionals.length === 1 && positionals[0] ? positionals[0] : config.root);

  // ----- resolved ignores -----
  config.ignores = config.ignores.map(item => path.join(config.root, item));

  // ----- sort folders first -----
  config.folderFirst = values["folder-first"] === true;

  // ----- Verbose -----
  config.verbose = values.verbose === true;

  if (config.verbose) {
    console.debug("\nCommand Line arguments:", { ...values, folder: positionals[0] ?? "unknown" });
    console.debug("\nUsed configuration: ", { root: config.root, symbols: config.symbols, folderFirst: config.folderFirst, verbose: config.verbose }, "\n");
  }
}

async function main() {
  await configure();
  const tree = await buildTree(config.root, "", true, true);
  console.info(tree);
  if (config.verbose) {
    console.debug(`${styleText("green", "Success!")}\n`);
  }
}

main();
