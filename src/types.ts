import type { ZodType } from 'zod'

export interface EnveyField<T> {
    env: string | undefined
    format: ZodType<T>
}

export type EnveySchema = Record<string, EnveyField<unknown>>

export interface EnveyOptions {
    /**
     * Whether to validate the config or not.
     * Throws {@link EnveyValidationError} if validation fails.
     *
     * Defaults to
     * `true`
     */
    validate?: boolean
}

export type EnveySchemaToConfig<S extends EnveySchema> = Readonly<{
    [K in keyof S]: S[K]['format']['_type']
}>

export type InferEnveyConfig<S extends EnveySchema> = Readonly<{
    [K in keyof S]: S[K]['format']['_type'] extends undefined
        ? Exclude<S[K]['format']['_type'], undefined>
        : S[K]['format']['_type']
}>
