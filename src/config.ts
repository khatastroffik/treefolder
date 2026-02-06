import path from "node:path";
import globals from "./globals";
import { getArguments, validateMaxItemsArgument } from "./utils";

/** make spaces *visible* in template strings */
export const space = " ";

export enum Style {
  none = "none",
  wireframe = "wireframe",
  black = "black",
  colored = "colored",
}

/** The different symbol sets, depending on the choosen style */
export const symbolStyles = {
  none: { closed: "", open: "", file: "" },
  wireframe: { closed: "🗀  ", open: "🗁  ", file: "🗋" },
  black: { closed: "🖿 ", open: "🖿 ", file: "🗎" },
  colored: { closed: "📁 ", open: "📂 ", file: "📄" },
};

/** Default configuration */
export const config = {
  style: Style.none,
  symbols: symbolStyles.none,
  root: ".",
  ignores: ["node_modules", "dist", "build", ".git", ".husky\\_", "logs", ".angular", "coverage"],
  verbose: false,
  unsorted: false,
  formatAsList: false,
  version: false,
  debug: false,
  help: false,
  maxItems: globals.maxItems,
  clear: false,
};

/**
 * Parse the command line arguments and set the tool configuration accordingly
 */
export async function configure(): Promise<void> {
  const { values, positionals } = getArguments();
  config.version = values.version;
  config.formatAsList = values.list;
  config.style = Style[values.style as keyof typeof Style] ?? config.style;
  config.symbols = symbolStyles[config.style];
  config.root = path.resolve(positionals[0] ?? config.root);
  config.ignores = config.ignores.map(item => path.join(config.root, item));
  config.unsorted = values.unsorted;
  config.verbose = values.verbose;
  config.debug = values.debug;
  config.help = values.help;
  config.maxItems = values["max-items"] ? validateMaxItemsArgument(values["max-items"]) : globals.maxItems;
  config.clear = values.clear;
  globals.maxItems = config.maxItems;
  globals.commandLineArgs = { ...values, root: positionals[0] ?? "n/a" };
}
