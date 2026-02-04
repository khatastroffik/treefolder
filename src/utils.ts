/* eslint-disable no-console */
import { exit } from "node:process";
import { parseArgs, styleText } from "node:util";
import { version as packageVersion } from "../package.json";
import { config } from "./config";
import globals from "./globals";

/**
 * Utility function to color a text for console output
 * @param text if text is a string, then use the color blueBright else the color yellow
 * @returns a colored text
 */
export function colorText(text: string | number) {
  return styleText((typeof text === "number") ? "yellow" : "blueBright", `${text}`);
}

/**
 * Retrieve the version label of the latest package version on npmjs.com
 * @returns the string corresponding to the latest version
 */
export async function getLatestVersionFronPackageRepository(): Promise<string> {
  const response = await fetch("https://registry.npmjs.org/@khatastroffik/treefolder");
  await new Promise(resolve => setTimeout(resolve, 100)); // DUE TO A BUG IN NODE.JS
  const data: any = await response.json();
  const latest = data["dist-tags"].latest as string;
  return latest;
}

/**
 * Output the version information of the package/tool
 */
export async function showVersion(): Promise<void> {
  if (config.version) {
    const k11k = `
    ┌─────────────────────────────────────────────┐
    |                                             |
       ╭━┳━╭━╭━╮╮
       ┃┈┈┈┣▄╋▄┫
       ┃┈┃┈╰━╰━━━━━━╮            "K11K"
       ╰┳╯┈┈┈┈┈┈┈┈ ◢█◣    a very pragmatic dog
        ┃┈┈┈┈┈┈┈┈┈┈████
        ┃┈┈┈┈┈┈┈┈┈┈◥█◤
        ┃┈┈┈┈╭━┳━━━━╯
        ┣━━━━━━┫
    |                                             |
    └──────────── made by khatastroffik ──────────┘
  `;
    let update;
    const latestVersion = await getLatestVersionFronPackageRepository();
    if (latestVersion && latestVersion !== packageVersion) {
      update = styleText("yellow", `
┌─────────────────────────────────────────────────────┐
|        A new version of Treefolder is available:    |
|          current: ${packageVersion}  ->  latest: ${latestVersion}          |
|                                                     |
|          Install the latest version with:           |
|   "npm update -g @khatastroffik/treefolder@latest"  |
└─────────────────────────────────────────────────────┘
`);
    }

    console.info(colorText(`
              Treefolder  aka  "tfold"
                   Version ${packageVersion}
               
      https://npmjs.com/@khatastroffik/treefolder
${update ?? k11k}`));
    return exit(0);
  }
}

/**
 * Output additional information on the current run
 */
export async function showStats() {
  if (config.verbose) {
    console.info(colorText("\nCommand line arguments:"));
    console.info(globals.commandLineArgs);
    console.info(colorText("\nTreefolder configuration:"));
    console.info(config, "\n");
    console.info(colorText(`Scanned ${colorText(globals.folderCount)} folders and ${colorText(globals.fileCount)} files.`));
    console.info(colorText(`Filtered out ${colorText(globals.ignoredCount)} items (folders or files).`));
  }
}

/** Options configuration for `util.parseArgs(...)` */
const options = {
  style: { type: "string", default: "none", short: "s" },
  verbose: { type: "boolean", default: false },
  unsorted: { type: "boolean", default: false, short: "u" },
  version: { type: "boolean", default: false, short: "v" },
  list: { type: "boolean", default: false, short: "l" },
} as const;

/**
 * Retrieve and parse all the command line arguments
 * @returns parsed command line arguments
 * @throws throws an error and exit if parsing the arguments did failed.
 */
export function getArguments() {
  try {
    return parseArgs({ options, allowPositionals: true, strict: true });
  }
  catch (err) {
    const error = err as Error;
    console.error(`[${styleText("red", error.name)}]: ${error.message}`);
    return exit(1);
  }
}
