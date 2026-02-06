/* eslint-disable no-console */
import fs from "node:fs";
import path from "node:path";
import util, { styleText } from "node:util";
import { config, space, Style } from "./config";
import globals from "./globals";
import { validateMaxItemsCount } from "./utils";

const readdirPromise = util.promisify(fs.readdir);

interface FormatFolderTextParams {
  indent: string;
  folderPrefix: string;
  foldersymbol: string;
  folderName: string;
}

interface FormatFileTextParams {
  indent: string;
  contentItemPrefix: string;
  entityPrefix: string;
  contentItem: fs.Dirent;
}

let formatFolder: (fmtFolderParams: FormatFolderTextParams) => string;
let formatFile: (fmtFileParams: FormatFileTextParams) => string;

/**
 * Format the text of the leaf for a folder item
 * @param fmtFolderParams parameters for formating
 * @returns formated text
 */
function formatFolderLeaf(fmtFolderParams: FormatFolderTextParams) {
  return `${fmtFolderParams.indent + fmtFolderParams.folderPrefix + fmtFolderParams.foldersymbol + path.basename(fmtFolderParams.folderName)}\n`;
}

/**
 * Format the text of the leaf for a file item
 * @param fmtFileParams parameters for formating
 * @returns formated text
 */
function formatFileLeaf(fmtFileParams: FormatFileTextParams) {
  return `${fmtFileParams.indent + fmtFileParams.contentItemPrefix + fmtFileParams.entityPrefix + fmtFileParams.contentItem.name}\n`;
}

/**
 * Format the text of the list row for a folder item
 * @param fmtFolderParams parameters for formating
 * @returns formated text
 */
function formatFolderListItem(fmtFolderParams: FormatFolderTextParams) {
  let outputName = fmtFolderParams.folderName + path.sep;
  if (config.style === Style.colored)
    outputName = styleText("blueBright", outputName);
  return `${outputName}\n`;
}

/**
 * Format the text of the list row for a file item
 * @param fmtFileParams parameters for formating
 * @returns formated text
 */
function formatFileListItem(fmtFileParams: FormatFileTextParams) {
  const outputName = path.join(fmtFileParams.contentItem.parentPath, fmtFileParams.contentItem.name);
  return `${outputName}\n`;
}

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
  result && globals.ignoredCount++;
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
 * @param folderName path of the folder to be build the tree representation from.
 * @param indent base identation of a tree leaf and its child leaves (according to the recursion depth)
 * @param isHead `true` if the folder is the root leaf, otherwise `false`
 * @param isTail `true` if the folder is the last leaf of its parents content, otherwise `false`
 * @returns the tree representation of the root folder's content.
 */
async function generateOutput(folderName: any, indent: string, isHead: boolean, isTail: boolean) {
  const folderContent = await getFolderContent(folderName);
  const foldersymbol = folderContent.length < 1 ? config.symbols.closed : config.symbols.open;
  const folderPrefix = isHead ? "" : ((isTail ? `└─` : `├─`) + (config.symbols.open ? "" : space));
  let result = formatFolder({ indent, folderPrefix, foldersymbol, folderName });
  const contentItemPrefix = isHead ? "" : isTail ? `${space}${space}${space}` : `│${space}${space}`;
  const tailIndex = folderContent.length - 1;
  for (let index = 0; index < folderContent.length; index++) {
    const contentItem = folderContent[index]!;
    if (contentItem.isDirectory()) {
      result += await generateOutput(path.join(folderName, contentItem.name), indent + contentItemPrefix, false, index === tailIndex);
    };
    if (contentItem.isFile()) {
      globals.incFileCount();
      validateMaxItemsCount();
      const entityPrefix = index === tailIndex ? `└─${config.symbols.file}${space}` : `├─${config.symbols.file}${space}`;
      result += formatFile({ indent, contentItemPrefix, entityPrefix, contentItem });
    }
  };
  globals.incFolderCount();
  validateMaxItemsCount();
  return result;
}

/**
/**
 * Generate the Treeview/List and output the result to the console
 */
export async function showOutput() {
  formatFolder = formatFolderLeaf;
  formatFile = formatFileLeaf;
  if (config.formatAsList) {
    formatFolder = formatFolderListItem;
    formatFile = formatFileListItem;
  }
  const output = await generateOutput(config.root, "", true, true);
  console.info(output);
}
