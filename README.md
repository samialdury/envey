# `envey`

[![CI status](https://github.com/samialdury/envey/actions/workflows/ci.yml/badge.svg)](https://github.com/samialdury/envey/actions/workflows/ci.yml)
[![license](https://img.shields.io/github/license/samialdury/envey)](LICENSE)
[![npm version](https://img.shields.io/npm/v/envey)](https://www.npmjs.com/package/envey)

Envey is a library designed to simplify the process of managing and validating environment variables in JavaScript applications. It provides a fully type-safe solution for defining and parsing configuration schemas, leveraging the power of [Zod](https://zod.dev/)'s excellent type system and validation features.

**Works everywhere:** Node.js, Cloudflare Workers, browsers, React Native, and any JavaScript runtime.

As of v2.6.0, it also **supports nested objects**. See [here](#nested-objects) for more details.

## Why

I was looking for something like [convict](https://github.com/mozilla/node-convict), but with the type safety and validation features of [Zod](https://zod.dev/). Hence, I decided to create this library.

## Installation

```sh
pnpm i -E zod envey
```

## Usage

```ts
import { z } from 'zod/v4'
import { createConfig } from 'envey'

const result = createConfig(
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

### Custom environment variables

By default, `createConfig` reads environment variables from `process.env`. However, you can provide a custom environment object as the fourth parameter. This is particularly useful for:

- **Non-Node.js environments** (Cloudflare Workers, browsers, React Native)
- **Testing** with mock environment variables
- **Multi-tenant applications** with different configurations

```ts
import { z } from 'zod/v4'
import { createConfig } from 'envey'

const schema = {
    apiKey: {
        env: 'API_KEY',
        format: z.string(),
    },
    port: {
        env: 'PORT',
        format: z.coerce.number().default(3000),
    },
} satisfies EnveySchema

// Default behavior - uses process.env (Node.js)
const config1 = createConfig(schema, { validate: true })

// Custom environment object
const customEnv = {
    API_KEY: 'custom-api-key',
    PORT: '8080',
}
const config2 = createConfig(schema, { validate: true }, customEnv)

// Works in Cloudflare Workers (no process.env)
const config3 = createConfig(schema, { validate: true }, {
    API_KEY: env.API_KEY, // Cloudflare Workers env binding
    PORT: '3000',
})

// Testing with mock data
const config4 = createConfig(schema, { validate: true }, {
    API_KEY: 'test-key',
    // PORT not provided - will use default value
})
```

**Environment compatibility:**
- **Node.js**: Automatically uses `process.env` when available
- **Cloudflare Workers**: Provide custom env object (no `process.env` available)
- **Browsers/React Native**: Provide custom env object or empty object for defaults
- **Testing**: Mock environment variables without affecting `process.env`

### Nested objects

```ts
import { z } from 'zod/v4'
import { createConfig } from 'envey'

const result = createConfig(
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
