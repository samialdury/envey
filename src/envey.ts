import type { z } from 'zod'

import { EnveyValidationError } from './errors.js'
import type {
    CreateConfigResult,
    EnveyOptions,
    EnveySchema,
    InferEnveyConfig,
} from './types.js'

/**
 * Constructs a config object from schema with optional validation.
 *
 * `zodInstance` - {@link https://www.npmjs.com/package/zod | Zod} instance to use.
 *
 * `schema` - See {@link EnveySchema}.
 *
 * `options` - See {@link EnveyOptions}.
 */
export function createConfig<
    S extends EnveySchema,
    O extends EnveyOptions = EnveyOptions,
>(
    zodInstance: typeof z,
    schema: S,
    options: O,
): CreateConfigResult<O, EnveyValidationError, InferEnveyConfig<S>> {
    const { validate } = options

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
            // @ts-expect-error - This is fine
            return {
                success: false,
                error: new EnveyValidationError(
                    validationResult.error.issues,
                    `Invalid configuration`,
                ),
            }
        }

        return {
            success: true,
            config: validationResult.data as InferEnveyConfig<S>,
        }
    }

    return {
        success: true,
        config: values as InferEnveyConfig<S>,
    }
}
