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
import { showStats, showVersion } from "./utils";

/** Main function of the tool */
async function main() {
  await configure();
  await showVersion();
  await showOutput();
  await showStats();
}

main();
