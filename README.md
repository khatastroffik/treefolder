# Khatastroffik Treefolder

A node.js CLI utility to display a tree representation (treeview) of a folder structure including files and subfolders.

## Installation

1. Clone (e.g. using `git`) or download this repository locally in order to make this tool available in your environment.
   Note: this tool requires `node.js` (and `npm`, `pnpm` or `yarn`) or a compatible JavaScript running environment to execute.

1. Install the (dev-) dependencies using your favorite package manager within the cloned folder e.g. with `pnpm install` in order to transpile the TypeScript source code in a JavaScript module.
   Note: A "_ready-to-use installation_" procedure (a pre-transpiled tool) will be made available in short.

## Usage

&rarr; **Run the tool directly (after installation)**

This feature is not implemented at the moment.

&rarr; **Run the typescript code directly**

```shell
pnpm tsx .
# or
pnpm tsx src\index.ts
# or
pnpm tsx . ..\..\some-folder
# or
pnpm tsx . --style=colored --folder-first=false --verbose c:\test\some-other-folder
# or
...
```

or

&rarr; **Build and run the javascript code**

```shell
pnpm build    # at least once
# then
pnpm start
# or
node .
# or
node . ..\..\some-folder
# or
node dist\index.js ..\..\some-folder
# or
node dist\index.js --style=colored --folder-first=false --verbose c:\test\some-other-folder

```

or

&rarr; **Run and watch for code changes during development**

```shell
pnpm dev
```

## Features

### Auto "root folder"

If not specified when calling this tool, the target "root folder" is set to the current working directory aka `.`.

### Auto "ignore paths"

The tool is ignoring a few folder items by default and won't proceed with ignored items i.e. they won't be visible in the resulting treeview.

The following paths (within the root folder) are ignored by default: `node_modules` , `dist`, `build`, `.git`, `.husky\_` and `logs`.

Notes:

- _Glob-syntax_ is not supported at the moment. The ignored paths are matching real folder paths, starting within the root folder.
- This filtering cannot be disabled or modified at the moment. Feel free to edit the ignored paths directly in the source code of the tool, when required.

### Sort folders first

By default, the list i.e. the leaves of the treeview are sorted following the _"folders first" principle_: All the folders are listed first, then all the files. All items are alphabetically sorted. This apply at any depth within the tree structure.

This behavior can be _disabled_ using the command line option `--folder-first=false`. In this case, all items are sorted by their names, regardless of their type (directory or file).

#### Verbose

if the flag i.e. command line option `--verbose` is defined/set, then a few more information will be displayed together with the tree representation.

### Style

The treeview can be generated and displayed using 4 different styles.

The style can be defined using the command line option `--style=<name of the style>`.

Note: some environments i.e. shells may not display the symbols properly. Try to change the _font_ used in the shell in order to display the correct symbols.

<style>pre {line-height:1.0rem !important;}</style>

#### "none" Style &rarr; `--style=none`

This is the **default** style and may be ommited

```text
treefold
├─ .husky
│  └─ pre-commit
├─ .vscode
│  └─ settings.json
├─ docs
│  └─ readme.md
├─ src
│  ├─ testfolder
│  └─ index.ts
├─ .gitignore
├─ eslint.config.mjs
├─ jest.config.js
├─ package.json
├─ pnpm-lock.yaml
├─ pnpm-workspace.yaml
├─ README.md
└─ tsconfig.json
```

#### "colored" Style &rarr; `--style=colored`

```text
📂 treefold
├─📂 .husky
│  └─📄 pre-commit
├─📂 .vscode
│  └─📄 settings.json
├─📂 docs
│  └─📄 readme.md
├─📂 src
│  ├─📁 testfolder
│  └─📄 index.ts
├─📄 .gitignore
├─📄 eslint.config.mjs
├─📄 jest.config.js
├─📄 package.json
├─📄 pnpm-lock.yaml
├─📄 pnpm-workspace.yaml
├─📄 README.md
└─📄 tsconfig.json
```

#### "black" Style &rarr; `--style=black`

```text
🖿 treefold
├─🖿 .husky
│  └─🗎 pre-commit
├─🖿 .vscode
│  └─🗎 settings.json
├─🖿 docs
│  └─🗎 readme.md
├─🖿 src
│  ├─🖿 testfolder
│  └─🗎 index.ts
├─🗎 .gitignore
├─🗎 eslint.config.mjs
├─🗎 jest.config.js
├─🗎 package.json
├─🗎 pnpm-lock.yaml
├─🗎 pnpm-workspace.yaml
├─🗎 README.md
└─🗎 tsconfig.json
```

#### "wireframe" Style &rarr; `--style=wireframe`

```text
🗁 treefold
├─🗁 .husky
│  └─🗋 pre-commit
├─🗁 .vscode
│  └─🗋 settings.json
├─🗁 docs
│  └─🗋 readme.md
├─🗁 src
│  ├─🗀 testfolder
│  └─🗋 index.ts
├─🗋 .gitignore
├─🗋 eslint.config.mjs
├─🗋 jest.config.js
├─🗋 package.json
├─🗋 pnpm-lock.yaml
├─🗋 pnpm-workspace.yaml
├─🗋 README.md
└─🗋 tsconfig.json
```

<!--

## Sources &amp; stories

### From trees and leaves

- <https://willcarh.art/blog/how-to-print-file-trees-on-the-command-line>
- <https://stackoverflow.com/questions/41472161/fs-readdir-ignore-directories>
- <https://www.geeksforgeeks.org/node-js/node-js-fs-readdirsync-method/>
- <https://www.npmjs.com/package/recursive-readdir>

### From Glob patterns and .gitignore

- <https://github.com/isaacs/node-glob>
- <https://github.com/micromatch/picomatch>
- <https://github.com/sindresorhus/globby>

-->
