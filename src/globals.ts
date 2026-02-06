import { stdout } from "node:process";

/**
 * A static class implementing global values and settings, used to implement a singleton pattern.
 */
export default abstract class globals {
  static _folderCount = 0;
  static _fileCount = 0;
  static ignoredCount = 0;
  static commandLineArgs = {};
  static readonly pad = "    ";
  static readonly maxOutputWidth = stdout.columns - globals.pad.length;
  static maxItems = 500;

  static maxItemsCountReached() {
    return globals.totalItemsCount > globals.maxItems;
  }

  static get totalItemsCount() {
    return globals._folderCount + globals._fileCount;
  }

  static get folderCount() {
    return globals._folderCount;
  }

  static incFolderCount() {
    globals._folderCount++;
  }

  static get fileCount() {
    return globals._fileCount;
  }

  static incFileCount() {
    globals._fileCount++;
  }
}
