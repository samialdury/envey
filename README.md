# Envey

[![NPM version](https://img.shields.io/npm/v/envey)](https://www.npmjs.com/package/envey)
[![CI status](https://github.com/samialdury/envey/actions/workflows/ci.yaml/badge.svg)](https://github.com/samialdury/envey/actions/workflows/ci.yaml)

Envey is a library designed to simplify the process of managing and validating environment variables in Node.js applications. It provides a fully type-safe solution for defining and parsing configuration schemas, leveraging the power of [Zod's](https://zod.dev/) excellent type system.

## Usage

```sh
pnpm i zod envey
```

```ts
import { z } from 'zod'
import { createConfig } from 'envey'

const config = createConfig({
  z,
  {
    nodeEnv: {
      env: 'NODE_ENV',
      format: z
        .enum(['production', 'development', 'test'])
        .default('production'),
    },
    port: {
      env: 'PORT',
      format: z.coerce.number().int().positive().max(65535),
    },
  },
  { validate: true }
})
// ^? {
//      readonly nodeEnv: "production" | "development" | "test";
//      readonly port: number;
//    }
```

Supports schema type inference, similar to Zod's [infer](https://zod.dev/?id=type-inference):

```ts
const schema = {
  nodeEnv: {
    env: 'NODE_ENV',
    format: z
      .enum(['production', 'test', 'development'])
      .default('production'),
  },
} satisfies EnveySchema

type Config = InferEnveyConfig<typeof schema>
//   ^? {
//        readonly nodeEnv: "production" | "development" | "test";
//      }
```

## License

[MIT](LICENSE)
