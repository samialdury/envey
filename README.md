# `envey`

[![CI status](https://github.com/samialdury/envey/actions/workflows/ci.yml/badge.svg)](https://github.com/samialdury/envey/actions/workflows/ci.yml)
[![license](https://img.shields.io/github/license/samialdury/envey)](LICENSE)
[![npm version](https://img.shields.io/npm/v/envey)](https://www.npmjs.com/package/envey)

Envey is a library designed to simplify the process of managing and validating environment variables in Node.js applications. It provides a fully type-safe solution for defining and parsing configuration schemas, leveraging the power of [Zod](https://zod.dev/)'s excellent type system.

## Installation

```sh
pnpm i -E zod envey
```

## Usage

```ts
import { z } from 'zod'
import { createConfig } from 'envey'

const result = createConfig({
    z,
    {
        databaseUrl: {
            env: 'DATABASE_URL',
            format: z.string(),
        },
        port: {
            env: 'PORT',
            format: z.coerce.number().int().positive().max(65535),
        },
    },
    { validate: true },
})

if (!result.success) {
    console.error(result.error.issues)
    // Handle error
}

const { config } = result
//    ^? {
//           readonly databaseUrl: string;
//           readonly port: number;
//       }
```

Supports schema type inference, similar to Zod's [infer](https://zod.dev/?id=type-inference):

```ts
const schema = {
    logLevel: {
        env: 'LOG_LEVEL',
        format: z.enum([
            'fatal',
            'error',
            'warn',
            'info',
            'debug',
            'trace',
            'silent',
        ]),
    },
} satisfies EnveySchema

type Config = InferEnveyConfig<typeof schema>
//   ^? {
//          readonly logLevel:  "fatal" | "error" | "warn" | "info" | "debug" | "trace" | "silent"
//      }
```

## License

[MIT](LICENSE)
