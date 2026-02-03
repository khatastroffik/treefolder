# Additional documentation

## Table of Content

- [Styled output examples](#styled-output-examples)
- [List output examples](#list-output-examples)
- [Sources &amp; stories](#sources--stories)

## Styled output examples

### "none" Style &rarr; `--style=none`

This is the **default** style and may be ommited

```shell
treefolder
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

### "colored" Style &rarr; `--style=colored`

```shell
📂 treefolder
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

### "black" Style &rarr; `--style=black`

```shell
🖿 treefolder
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

### "wireframe" Style &rarr; `--style=wireframe`

```shell
🗁 treefolder
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

## List output examples

### Simple list output &rarr; `--list`

This is the **default** format of the list output: it displays the full path of the items and all items are sorted using the _"folder first" principle_.

```shell
C:\development\treefolder\
C:\development\treefolder\.husky\
C:\development\treefolder\.husky\pre-commit
C:\development\treefolder\.vscode\
C:\development\treefolder\.vscode\settings.json
C:\development\treefolder\docs\
C:\development\treefolder\docs\commit-messages-guideline.md
C:\development\treefolder\docs\readme.md
C:\development\treefolder\docs\tfold.jpg
C:\development\treefolder\src\
C:\development\treefolder\src\index.ts
C:\development\treefolder\.gitattributes
C:\development\treefolder\.gitignore
C:\development\treefolder\CHANGELOG.md
C:\development\treefolder\eslint.config.mjs
C:\development\treefolder\jest.config.js
C:\development\treefolder\LICENSE
C:\development\treefolder\package.json
C:\development\treefolder\pnpm-lock.yaml
C:\development\treefolder\pnpm-workspace.yaml
C:\development\treefolder\README.md
C:\development\treefolder\tsconfig.json
```

### Unsorted list output &rarr; `--list --unsorted`

In this use case, the list items are sorted the way the operating system does by default e.g. sorted by their names, regardless of their type (directory or file).

```shell
C:\development\treefolder\
C:\development\treefolder\.gitattributes
C:\development\treefolder\.gitignore
C:\development\treefolder\.husky\
C:\development\treefolder\.husky\pre-commit
C:\development\treefolder\.vscode\
C:\development\treefolder\.vscode\settings.json
C:\development\treefolder\CHANGELOG.md
C:\development\treefolder\docs\
C:\development\treefolder\docs\commit-messages-guideline.md
C:\development\treefolder\docs\readme.md
C:\development\treefolder\docs\tfold.jpg
C:\development\treefolder\eslint.config.mjs
C:\development\treefolder\jest.config.js
C:\development\treefolder\LICENSE
C:\development\treefolder\package.json
C:\development\treefolder\pnpm-lock.yaml
C:\development\treefolder\pnpm-workspace.yaml
C:\development\treefolder\README.md
C:\development\treefolder\src\
C:\development\treefolder\src\index.ts
C:\development\treefolder\tsconfig.json
```

### Colored list output &rarr; `--list --style colored`

In this use case, the list output highlights i.e. colors the _directoy_ items in _bright blue_.

There's no _preview_ of such a generated output at the moment, though.

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

### Other topics

- <https://github.com/absolute-version/commit-and-tag-version>
