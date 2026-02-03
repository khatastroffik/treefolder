# Khatastroffik "Treefolder" aka "tfold"

A **node.js CLI utility** generating a **tree representation** (treeview) of a **folder structure** including its contained files and subfolders.

![GitHub package.json version](https://img.shields.io/github/package-json/v/khatastroffik/treefolder?style=flat&labelColor=darkblue&color=black) ![GitHub code size in bytes](https://img.shields.io/github/languages/code-size/khatastroffik/treefolder?style=flat&labelColor=darkblue&color=black) ![GitHub License](https://img.shields.io/github/license/khatastroffik/treefolder?labelColor=darkblue&color=black&style=flat) ![GitHub package.json dev/peer/optional dependency version](https://img.shields.io/github/package-json/dependency-version/khatastroffik/treefolder/dev/typescript?style=flat&labelColor=darkgreen&color=black) ![GitHub package.json dev/peer/optional dependency version](https://img.shields.io/github/package-json/dependency-version/khatastroffik/treefolder/dev/eslint?style=flat&labelColor=darkgreen&color=black) ![GitHub package.json dev/peer/optional dependency version](https://img.shields.io/github/package-json/dependency-version/khatastroffik/treefolder/dev/jest?style=flat&labelColor=darkgreen&color=black)

![tfold](https://raw.githubusercontent.com/khatastroffik/treefolder/41846124e0e66c899d1ca0e5acf826eb727e4f68/docs/tfold.jpg)

## Installation

### prerequisite

This CLI tool requires `node.js` or a compatible JavaScript runtime environment to execute successfully. `npm`, `pnpm` or `yarn` may be required as well, in case you'd like to install the tool manually and/or to modify the source code.

### Install and use "treefolder" as a globally available CLI tool

This is the recommanded and easiest approach.

1. Install using `pnpm` (see below), `yarn` or `npm`:

   ```ini
   pnpm add --global @khatastroffik/treefolder
   ```

1. start using the CLI tool from any directory:

   ```ini
   # show treeview of the current directory
   tfold
   # or show treeview of any directory
   tfold <some-path-to-be-used-as-tree-root>
   ```

   Note: you may configure the tool using some **options** as needed. See the [Features](#features) list.

## Features

1. [Auto "root folder"](#auto-root-folder)
1. [Auto "ignore paths"](#auto-ignore-paths)
1. [Sort leaves "folders first"](#sort-leaves-folders-first)
1. [Styled output](#styled-output)
1. [Version information](#version-information)
1. [Verbose output](#verbose-output)

### Auto "root folder"

If not specified as a command line argument, the "root folder" of the tree is set to the current working directory aka `.`.

### Auto "ignore paths"

This tool is intentionally ignoring i.e. filtering out a few folder or file items by default and won't proceed with such ignored items i.e. those won't be visible in the resulting treeview.

The following paths (within the root folder) are ignored by default: `node_modules` , `dist`, `build`, `.git`, `.husky\_`, `logs`, `.angular` and `coverage`.

Notes:

- _Glob-syntax_ is not supported at the moment. The ignored paths are matching real folder paths, starting within i.e. resolved into the root folder.
- This filtering cannot be disabled or modified at the moment. Feel free to edit the ignored paths/items directly in the source code of the tool, when suitable.

### Sort leaves "folders first"

By default, the list or the leaves of the treeview are sorted following the _"folders first" principle_: All the folders are listed first, then all the files. All items are alphabetically sorted. This apply at any depth within the tree structure.

This behavior can be _disabled_ using the command line argument `--unsorted`. In this case, all items are sorted the way the operating system does by default e.g. sorted by their names, regardless of their type (directory or file).

### List output

When the command line argument `--list` (short: `-l`) is used, all the folders and files will be displayed as a flat list instead of as a treeview.

Note: the command line arguments `--unsorted` and `--style colored` may also be applied to refine i.e. adapt the list output. See the [List output examples](docs/readme.md#list-output-examples)

### Styled output

The treeview i.e. tree representation can be generated and displayed using 4 different styles: **`none`** (default), **`black`**, **`wireframe`** or **`colored`**.
The style can be defined using the command line argument `--style`or `-s` like so: `--style <name of the style>`.

&rarr; Examples of styled output can be found in the additional documentation: [Styled output examples](docs/readme.md#styled-output-examples)

Notes:

- some shell environments may not display the symbols (which are represented using specific unicode code points like `U+1F5BF` or `U+1F5C1`) properly. Try to change the _font_ used in the shell or to change the code page used by your shell in the background to interpret the chars, in order to display the unicode symbols properly.
- On some shell environments e.g. under Windows OS, the output may still be faulty due to the OS automatically pre-formating the output in an inadequate way. Try to use another shell environment then.

### Version information

Use the command line argument `--version` or `-v` to display the version information about the tool.

### Verbose output

When the flag i.e. command line argument `--verbose` is defined/set, then a few more information will be displayed together with the tree representation.

## Development

### Manually install as a globally available CLI tool `tfold`

1. Clone (e.g. using `git`) or download this repository locally in order to make this tool available in your environment.

   ```ini
     gh repo clone khatastroffik/treefolder
     # or
     git clone https://github.com/khatastroffik/treefolder.git
   ```

1. Navigate to the repo folder:

   ```ini
   cd treefolder
   ```

1. Install the (dev-) dependencies using your favorite package manager and transpile the TypeScript source code into a JavaScript module.

   ```ini
   # first install the development dependencies
   pnpm install
   # then transpile the source code to javascript
   pnpm build
   ```

1. Use your favorite package manager to install the tool globally. For example:

   ```ini
   npm install -g
   # or (YES, TWICE IN A ROW!)
   pnpm link --global
   pnpm link --global
   ```

   Note: _pnpm link_ lacks of refinements (!) as of v10.x, but this seems to work well, despite the warnings...

1. Use the CLI tool alias `tfold`. E.g.:

   ```ini
   # in any directory/folder simply run
   tfold
   # you may use additional arguments too, in order to configure the output
   tfold --verbose -s colored /c/DEV/a-folder-to-be-scanned
   # or
   tfold c:\\DEV\\another-folder --unsorted --style wireframe
   ```

### Running the source code

Within the local clone/copy of the treefolder repository, you may:

#### &rarr; Run the **typescript** code directly (development)

```ini
pnpm tsx src\index.ts
# or
pnpm tsx src\index.ts [root-path] [options]
# or run and watch for code changes
pnpm dev
```

or

#### &rarr; Build and run the **javascript** code (development)

```ini
# at least once
pnpm build
# then
pnpm start
# or
node .
# or
node . ..\..\some-folder
# or
node dist\index.js ..\..\some-folder
# or
node dist\index.js --style=colored --unsorted --verbose c:\test\some-other-folder

```

---

```text
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
```
