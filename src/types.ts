import type { ZodType } from 'zod'

export interface EnveyField<T> {
    env: string | undefined
    format: ZodType<T>
}

export interface EnveyNestedSchema {
    [key: string]: EnveyField<unknown> | EnveyNestedSchema
}

export type EnveySchema = EnveyNestedSchema

export interface EnveyOptions {
    /**
     * Whether to validate the config or not.
     */
    validate?: boolean
}

// Helper type to handle nested objects
type ExtractNestedConfig<S extends EnveyNestedSchema> = Readonly<{
    [K in keyof S]: S[K] extends EnveyField<unknown>
        ? S[K]['format']['_type'] extends undefined
            ? Exclude<S[K]['format']['_type'], undefined>
            : S[K]['format']['_type']
        : S[K] extends EnveyNestedSchema
          ? ExtractNestedConfig<S[K]>
          : never
}>

export type InferEnveyConfig<S extends EnveySchema> = ExtractNestedConfig<S>

// Keeping this for backward compatibility
export type EnveySchemaToConfig<S extends EnveySchema> = InferEnveyConfig<S>

export interface SuccessResult<T> {
    config: T
    success: true
}

export interface FailureResult<E> {
    error: E
    success: false
}

export type CreateConfigResult<O extends EnveyOptions, E, T> = O extends {
    validate: true
}
    ? FailureResult<E> | SuccessResult<T>
    : SuccessResult<T>
