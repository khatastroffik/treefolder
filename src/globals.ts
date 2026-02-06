import { stdout } from "node:process";

export default abstract class globals {
  static folderCount = 0;
  static fileCount = 0;
  static ignoredCount = 0;
  static commandLineArgs = {};
  static pad = "    ";
  static maxWidth = stdout.columns - this.pad.length;
}
