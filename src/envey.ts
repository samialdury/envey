import type { z } from 'zod'
import type {
    CreateConfigResult,
    EnveyOptions,
    EnveySchema,
    InferEnveyConfig,
} from './types.js'
import { EnveyValidationError } from './errors.js'

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

    const envMap = new Map<number | string, string | undefined>()

    for (const key in schema) {
        const field = schema[key] as NonNullable<S[Extract<keyof S, string>]>
        envMap.set(key, field.env)
        config[key] = field.format
        values[key] = field.env ? process.env[field.env] : undefined
    }

    if (validate) {
        const validationResult = zodInstance.object(config).safeParse(values)

        if (!validationResult.success) {
            // @ts-expect-error - This is fine
            return {
                error: new EnveyValidationError(
                    validationResult.error.issues.map((issue) => {
                        const key = issue.path.at(0)
                        return {
                            ...issue,
                            env: key ? envMap.get(key) : undefined,
                        }
                    }),
                    `Invalid configuration`,
                ),
                success: false,
            }
        }

        return {
            config: validationResult.data as InferEnveyConfig<S>,
            success: true,
        }
    }

    return {
        config: values as InferEnveyConfig<S>,
        success: true,
    }
}
