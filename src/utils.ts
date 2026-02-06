/* eslint-disable no-console */
import type { ParseArgsConfig, ParseArgsOptionDescriptor } from "node:util";
import { exit, stdout } from "node:process";
import { parseArgs, styleText } from "node:util";
import { version as packageVersion } from "../package.json";
import { config } from "./config";
import globals from "./globals";

/**
 * Options configuration of type {@link ParseArgsConfig} for `util.parseArgs(...)`
 */
const options = {
  "style": { type: "string", default: "none", short: "s", description: "The style value can be set to 'none', 'colored', 'black' or 'wireframe' (without the quotes) e.g. \"-style colored\". The default style is 'none' and may be ommited." },
  "verbose": { type: "boolean", default: false, short: "b", description: "Display extended information about the result after the standard output." },
  "unsorted": { type: "boolean", default: false, short: "u", description: "Do not enforce sorting folders first i.e. on top of the result. Instead, rely on the OS i.e. command line environment native sorting algorythm." },
  "version": { type: "boolean", default: false, short: "v", description: "Display version information about the tool and eventually inform about the availability of an updated version." },
  "list": { type: "boolean", default: false, short: "l", description: "Display the result as a simple list (with full path) instead of as a treeview." },
  "debug": { type: "boolean", default: false, short: "d", description: "Display some hints about the configuration used to generate the resulting output." },
  "help": { type: "boolean", default: false, short: "h", description: "Display THIS help information about the usage of treefolder." },
  "max-items": { type: "string", default: "", short: "m", description: "Define the maximum numbers of processable items (folders + files). If this limit is reached, the tool will exit with an error and won't display any result.\n-> Min value: 1\n-> Max value: 32768" },
  "clear": { type: "boolean", default: false, short: "c", description: "Clear the (stdout) screen prior displaying the result." },
} as const;

/**
 * @interface ParseArgsOptionWithDescription Extend the {@link ParseArgsOptionDescriptor} type to include a description
 */
interface ParseArgsOptionWithDescription extends ParseArgsOptionDescriptor { readonly description: string };

/**
 * Utility function to color a text in yellow for console output
 * @param text input value as string or number
 * @returns a text colored in yellow
 */
function yellow(text: string | number): string {
  return styleText("yellow", `${text}`);
}

/**
 * Utility function to color a text in blue for console output
 * @param text input string
 * @returns a text colored in blue
 */
function blue(text: string | number): string {
  return styleText("blueBright", `${text}`);
}

/**
 * Utility function to color a text in red for console output
 * @param text input string
 * @returns a text colored in red
 */
function red(text: string | number): string {
  return styleText("redBright", `${text}`);
}

/**
 * Retrieve the version label of the latest package version on npmjs.com
 * @returns the string corresponding to the latest version
 */
async function getLatestVersionFronPackageRepository(): Promise<string> {
  const response = await fetch("https://registry.npmjs.org/@khatastroffik/treefolder");
  await new Promise(resolve => setTimeout(resolve, 100)); // DUE TO A BUG IN NODE.JS
  const data: any = await response.json();
  const latest = data["dist-tags"].latest as string;
  return latest;
}

/**
 * format the input text to be left padded and wrapped if it's too long.
 * @param text text to be  left padded and wrapped
 * @returns wrapped and padded text
 */
function wrap(text: string) {
  return text.replace(new RegExp(`(?![^\\n]{1,${globals.maxOutputWidth}}$)([^\\n]{1,${globals.maxOutputWidth}})\\s`, "g"), `${globals.pad}$1\n`);
}

/**
 * Generate the help text for a single option/flag. The text is formated to be automatically wrapped according to the actual width of the command line environment.
 * @param {string} name - Name of the option.
 * @param {ParseArgsOptionWithDescription} optionDetails - The object of type {@link ParseArgsOptionWithDescription} containing all properties of the option.
 * @returns {string} The formated string, usable for output in the current command line environment.
 */
function generateHelpOptionText(name: string, optionDetails: ParseArgsOptionWithDescription): string {
  const short = optionDetails.short ? `-${optionDetails.short}, ` : "";
  const optionValue = optionDetails.type === "string" ? ` <${name}-value>` : "";
  return wrap(yellow(`${short}--${name}${optionValue}\n`)) + wrap(`${optionDetails.description}\n\n`);
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

    console.info(blue(`
              Treefolder  aka  "tfold"
                   Version ${packageVersion}
               
      https://npmjs.com/@khatastroffik/treefolder
${update ?? k11k}`));
    return exit(0);
  }
}

/**
 * Validates the amount of processed items. This function exits the tool if the limit is reached.
 */
export function validateMaxItemsCount() {
  if (globals.maxItemsCountReached()) {
    console.error(red("[LIMIT REACHED] The maximum number of processible items has been reached:\n"));
    showItemsCountDebug();
    console.error(red(`Please define a higher limit using the ${yellow("'--max-items'")} command line argument if you want to output more items in the result.`));
    exit (1);
  }
}

export function validateMaxItemsArgument(maxItems: string): number {
  const argValue = Number.parseInt(maxItems, 10);
  if (Number.isNaN(argValue) || argValue < 1 || argValue > 32768) {
    console.info(red(`[BAD LIMIT] The value of the ${yellow("'--maxItems'")} command line argument must be a valid number and must not be below ${yellow("1")} or above ${yellow("32768")}. The current argument value is ${yellow(maxItems)}.\n`));
    exit(1);
  }
  return argValue;
}

export async function showItemsCountDebug() {
  console.info(blue("Processed items (so far):"));
  const processed = {
    folderCount: globals.folderCount,
    fileCount: globals.fileCount,
    totalItemsCount: globals.totalItemsCount,
    maxItems: globals.maxItems,
    ignoredCount: globals.ignoredCount,
  };
  console.info(processed);
}

/**
 * Output additional information about the used configuration and the result.
 */
export async function showDebug() {
  if (config.debug) {
    console.info(blue("Command line arguments:"));
    console.info(globals.commandLineArgs);
    console.info(blue("Treefolder configuration:"));
    console.info(config);
    showItemsCountDebug();
  }
}

/**
 * Output additional information on the current run
 */
export async function showStats() {
  if (config.verbose) {
    console.info(blue(`Scanned      : ${yellow(globals.folderCount.toString())} folders and ${yellow(globals.fileCount.toString())} files.`));
    console.info(blue(`Filtered out : ${yellow(globals.ignoredCount.toString())} folders or files.`));
  }
}

/**
 * Output extended help about the tool usage
 */
export async function showHelp() {
  if (config.help) {
    const toolDesc = blue(`Treefolder version ${packageVersion}\n`);

    let helpHeader = blue("Usage:\n\n");
    helpHeader += wrap("tfold [flags] [options] [root folder]\n");
    helpHeader += wrap(blue("or\n"));
    helpHeader += wrap("treefolder [flags] [options] [root folder]\n");

    let example = `${blue("Example:\n\n")}`;
    example += wrap(yellow("tfold -s colored --verbose -du\n"));
    example += wrap("This command line outputs a colored treeview representation of the current directory content. The leaves are \"unsorted\". The output includes additional infos and debug hints.\n");

    let notes = `${blue("Notes:\n\n")}`;
    notes += wrap("The position of the [flags], [options] and [root folder] command line arguments doesn't matter as long as those are well-formed/valid.\n\n");
    notes += wrap("The positional argument [root folder] may be ommited. In this case, the current working directory will be processed.\n");

    let optionsText = blue("Options and Flags:\n\n");
    optionsText += Object.keys(options).reduce((txt: string, key: string) => txt + generateHelpOptionText(key as string, options[key as keyof typeof options]), "");

    console.info([toolDesc, helpHeader, example, optionsText, notes].join(`\n`));
    exit(0);
  }
}

/**
 * Clear the output screen (stdout).
 */
export function clearScreen() {
  if (config.clear) {
    // console.clear(); // BUGGY - NOT WORKING PROPERLY!
    stdout.write("\x1Bc");
  }
}

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
