import type { z } from 'zod'

import { EnveyValidationError } from './errors.js'
import type { EnveyOptions, EnveySchema, InferEnveyConfig } from './types.js'

/**
 * Constructs a config object from schema with optional validation.
 *
 * `zodInstance` - {@link https://www.npmjs.com/package/zod | Zod} instance to use.
 *
 * `schema` - See {@link EnveySchema}.
 *
 * `options` - See {@link EnveyOptions}.
 *
 * Throws {@link EnveyValidationError} if validation fails.
 */
export function createConfig<S extends EnveySchema>(
    zodInstance: typeof z,
    schema: S,
    options?: EnveyOptions,
): InferEnveyConfig<S> {
    const { validate = true } = options ?? {}

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const config: Record<string, any> = {}
    const values: Record<string, unknown> = {}

    for (const key in schema) {
        const field = schema[key] as NonNullable<S[Extract<keyof S, string>]>

        config[key] = field.format
        values[key] = field.env ? process.env[field.env] : undefined
    }

    if (validate) {
        const validationResult = zodInstance.object(config).safeParse(values)

        if (!validationResult.success) {
            throw new EnveyValidationError(
                validationResult.error.issues,
                `Invalid configuration`,
            )
        }

        return validationResult.data as InferEnveyConfig<S>
    }

    return values as InferEnveyConfig<S>
}
