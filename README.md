# Envey

[![Latest release](https://badgen.net/github/release/samialdury/envey)](https://github.com/samialdury/envey/releases/latest)
[![Latest tag](https://badgen.net/github/tag/samialdury/envey)](https://github.com/samialdury/envey/tags)
[![License](https://badgen.net/github/license/samialdury/envey)](LICENSE)
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
      format: z.coerce.number().positive().default(8000),
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

## Stack

This project has been scaffolded with [create-npm-library](https://github.com/samialdury/create-npm-library).

## License

[MIT](LICENSE)
