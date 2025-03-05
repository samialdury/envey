# `envey`

[![CI status](https://github.com/samialdury/envey/actions/workflows/ci.yml/badge.svg)](https://github.com/samialdury/envey/actions/workflows/ci.yml)
[![license](https://img.shields.io/github/license/samialdury/envey)](LICENSE)
[![npm version](https://img.shields.io/npm/v/envey)](https://www.npmjs.com/package/envey)

Envey is a library designed to simplify the process of managing and validating environment variables in Node.js applications. It provides a fully type-safe solution for defining and parsing configuration schemas, leveraging the power of [Zod](https://zod.dev/)'s excellent type system.

**Now supports also nested objects**, see [here](#nested-objects).

> [!NOTE]
> Inspired by [convict](https://github.com/mozilla/node-convict).

## Installation

```sh
pnpm i -E zod envey
```

## Usage

```ts
import { z } from 'zod'
import { createConfig } from 'envey'

const result = createConfig(
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
)

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

### Nested objects

```ts
import { z } from 'zod'
import { createConfig } from 'envey'

const result = createConfig(
    z,
    {
        postgres: {
            host: {
                env: 'PG_HOST',
                format: z.string().default('localhost'),
            },
            port: {
                env: 'PG_PORT',
                format: z.coerce.number().int().positive().max(65535).default(5432),
            }
            user: {
                env: 'PG_USER',
                format: z.string().default('postgres'),
            },
            password: {
                env: 'PG_PASSWORD',
                format: z.string().min(1),
            },
            database: {
                env: 'PG_DATABASE',
                format: z.string().min(1),
            },
        }
    },
    { validate: true },
)

if (!result.success) {
    console.error(result.error.issues)
    // Handle error
}

const { postgres } = result.config
//    ^? {
//           readonly host: string;
//           readonly port: number;
//           readonly user: string;
//           readonly password: string;
//           readonly database: string;
//       }
```

## License

[MIT](LICENSE)
