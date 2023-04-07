# Create NPM Library

[![Latest release](https://badgen.net/github/release/samialdury/create-npm-library)](https://github.com/samialdury/create-npm-library/releases/latest)
[![Latest tag](https://badgen.net/github/tag/samialdury/create-npm-library)](https://github.com/samialdury/create-npm-library/tags)
[![License](https://badgen.net/github/license/samialdury/create-npm-library)](LICENSE)
[![CI status](https://github.com/samialdury/create-npm-library/actions/workflows/ci.yaml/badge.svg)](https://github.com/samialdury/create-npm-library/actions/workflows/ci.yaml)

This is a template repository for setting up new NPM library based on my personal preference.

Ships with typings and supports CJS & ESM.

## Quick start

The easiest way to get started is either by [creating a new Github repository from this template](https://github.com/samialdury/create-npm-library/generate) or cloning it with [tiged](https://github.com/tiged/tiged):

```sh
pnpm dlx tiged github:samialdury/create-npm-library my-library

cd my-library
git init
make install

make help
```

## Stack

- [Node.js](https://github.com/nodejs/node) & [Typescript](https://github.com/microsoft/TypeScript) (ESM)
- [tsup](https://github.com/egoist/tsup) for bundling
- [pnpm](https://github.com/pnpm/pnpm) package manager
- [Vitest](https://github.com/vitest-dev/vitest) for testing (coverage via [c8](https://github.com/bcoe/c8))
- [Prettier](https://github.com/prettier/prettier) formatter
- [ESLint](https://github.com/eslint/eslint) linter
- [Husky](https://github.com/typicode/husky) Git hooks
- [Changesets](https://github.com/changesets/changesets) for versioning

## License

[MIT](LICENSE)
