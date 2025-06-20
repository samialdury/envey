import { z } from 'zod/v4'
import { EnveyValidationError } from './errors.js'
import type {
    CreateConfigResult,
    EnveyField,
    EnveyOptions,
    EnveySchema,
    InferEnveyConfig,
} from './types.js'

/**
 * Constructs a config object from schema with optional validation.
 *
 * `schema` - See {@link EnveySchema}.
 *
 * `options` - See {@link EnveyOptions}.
 *
 * `env` - Environment variables object. Defaults to `process.env`.
 */
export function createConfig<
    S extends EnveySchema,
    O extends EnveyOptions = EnveyOptions,
>(
    schema: S,
    options: O,
    env: Record<string, string | undefined> = typeof process !== 'undefined'
        ? process.env
        : {},
): CreateConfigResult<O, EnveyValidationError, InferEnveyConfig<S>> {
    const { validate } = options

    // Process schema to build validation schema and collect env mappings
    const { zodSchema, envMap, values } = processSchema(schema, '', env)

    if (validate) {
        const validationResult = zodSchema.safeParse(values)

        if (!validationResult.success) {
            // @ts-expect-error - Complex conditional type inference
            return {
                error: new EnveyValidationError(
                    validationResult.error.issues.map((issue) => {
                        const path = issue.path.join('.')
                        return {
                            ...issue,
                            env: envMap.get(path),
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

type SchemaShape = Record<string, z.ZodType>

interface ProcessSchemaResult {
    zodSchema: z.ZodObject<SchemaShape>
    envMap: Map<string, string | undefined>
    values: Record<string, unknown>
}

/**
 * Recursively processes the schema to build Zod validation schema and collect env mappings
 */
function processSchema(
    schema: EnveySchema,
    parentPath = '',
    env: Record<string, string | undefined> = typeof process !== 'undefined'
        ? process.env
        : {},
): ProcessSchemaResult {
    const zodSchemaShape: SchemaShape = {}
    const values: Record<string, unknown> = {}
    const envMap = new Map<string, string | undefined>()

    for (const key in schema) {
        const field = schema[key]
        if (!field) continue

        const currentPath = parentPath ? `${parentPath}.${key}` : key

        // Check if this is a leaf node (EnveyField) or a nested object
        if ('env' in field && 'format' in field) {
            // This is an EnveyField
            const typedField = field as EnveyField<unknown>
            envMap.set(currentPath, typedField.env)
            zodSchemaShape[key] = typedField.format
            values[key] = typedField.env ? env[typedField.env] : undefined
        } else {
            // This is a nested object
            const {
                zodSchema,
                envMap: nestedEnvMap,
                values: nestedValues,
            } = processSchema(field, currentPath, env)

            // Merge the nested env mappings into the current map
            for (const [path, envVariable] of Array.from(
                nestedEnvMap.entries(),
            )) {
                envMap.set(path, envVariable)
            }

            // Extract the shape from the nested schema
            zodSchemaShape[key] = zodSchema
            values[key] = nestedValues
        }
    }

    return {
        zodSchema: z.object(zodSchemaShape),
        envMap,
        values,
    }
}
