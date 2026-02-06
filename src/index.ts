#! /usr/bin/env node
/*!
 * @khatastroffik/treefolder
 *
 * License: MIT
 * Copyright (c) 2026, Loïs Bégué
 *
 */

import { configure } from "./config";
import { showOutput } from "./engine";
import { showDebug, showHelp, showStats, showVersion } from "./utils";

/** Main function of the tool */
async function main() {
  await configure();
  await showHelp();
  await showVersion();
  await showOutput();
  await showDebug();
  await showStats();
}

main();
