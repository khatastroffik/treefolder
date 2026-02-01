# Additional documentation

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

- https://github.com/absolute-version/commit-and-tag-version
