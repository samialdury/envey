import { z } from 'zod/v4'
import { createConfig } from './envey.js'
import { EnveyValidationError } from './errors.js'
import type { EnveySchema, InferEnveyConfig } from './types.js'

describe('Envey', () => {
    describe('createConfig', () => {
        it('Should be a function', () => {
            expect(typeof createConfig).toBe('function')
        })

        it('Should return default value if env is not present', () => {
            const schema = {
                someEnum: {
                    env: 'SOME_ENUM',
                    format: z
                        .enum(['value1', 'value2', 'value3'])
                        .default('value2'),
                },
            } satisfies EnveySchema

            const result = createConfig(schema, { validate: true })
            type Config = InferEnveyConfig<typeof schema>
            interface Expected {
                readonly someEnum: 'value1' | 'value2' | 'value3'
            }

            if (!result.success) {
                expect.fail('Validation should have passed')
            }

            expect(result.config).toStrictEqual({
                someEnum: 'value2',
            })
            expect(result.config.someEnum).toBe('value2')

            expectTypeOf<Config>().toEqualTypeOf<Expected>()
            expectTypeOf(result.config.someEnum).toEqualTypeOf<
                'value1' | 'value2' | 'value3'
            >()
        })

        it('Should return env value if is present', () => {
            vitest.stubEnv('SOME_ENUM', 'value1')
            onTestFinished(() => {
                vitest.unstubAllEnvs()
            })

            const schema = {
                someEnum: {
                    env: 'SOME_ENUM',
                    format: z
                        .enum(['value1', 'value2', 'value3'])
                        .default('value2'),
                },
            } satisfies EnveySchema

            const result = createConfig(schema, { validate: true })
            type Config = InferEnveyConfig<typeof schema>
            interface Expected {
                readonly someEnum: 'value1' | 'value2' | 'value3'
            }

            if (!result.success) {
                expect.fail('Validation should have passed')
            }

            expect(result.config).toStrictEqual({
                someEnum: 'value1',
            })
            expect(result.config.someEnum).toBe('value1')

            expectTypeOf<Config>().toEqualTypeOf<Expected>()
            expectTypeOf(result.config.someEnum).toEqualTypeOf<
                'value1' | 'value2' | 'value3'
            >()
        })

        it('Should return with possible undefined', () => {
            const schema = {
                someEnum: {
                    env: 'SOME_ENUM',
                    format: z.enum(['value1', 'value2', 'value3']).optional(),
                },
            } satisfies EnveySchema

            const result = createConfig(schema, { validate: true })

            if (!result.success) {
                expect.fail('Validation should have passed')
            }

            type Config = InferEnveyConfig<typeof schema>
            interface Expected {
                readonly someEnum: 'value1' | 'value2' | 'value3' | undefined
            }

            expect(result.config).toStrictEqual({
                someEnum: undefined,
            })
            expect(result.config.someEnum).toBeUndefined()

            expectTypeOf<Config>().toEqualTypeOf<Expected>()
            expectTypeOf(result.config.someEnum).toEqualTypeOf<
                Expected['someEnum']
            >()
        })

        it('Should leave value as undefined', () => {
            const result = createConfig(
                {
                    projectName: {
                        env: undefined,
                        format: z.string().default('envey'),
                    },
                },
                { validate: true },
            )

            if (!result.success) {
                expect.fail('Validation should have passed')
            }

            expect(result.config.projectName).toBe('envey')
        })

        it('Should support nested objects', () => {
            vitest.stubEnv('SOME_ENUM', 'value1')
            onTestFinished(() => {
                vitest.unstubAllEnvs()
            })

            const schema = {
                someEnum: {
                    env: 'SOME_ENUM',
                    format: z
                        .enum(['value1', 'value2', 'value3'])
                        .default('value2'),
                },
                nested: {
                    someString: {
                        env: 'NESTED_STRING',
                        format: z.string().default('default value'),
                    },
                    deeplyNested: {
                        someNumber: {
                            env: 'DEEPLY_NESTED_NUMBER',
                            format: z.number().default(42),
                        },
                    },
                },
            } satisfies EnveySchema

            const result = createConfig(schema, { validate: true })

            if (!result.success) {
                expect.fail('Validation should have passed')
            }

            expect(result.config.someEnum).toBe('value1')
            expect(result.config.nested.someString).toBe('default value')
            expect(result.config.nested.deeplyNested.someNumber).toBe(42)

            // Type checking
            type Config = InferEnveyConfig<typeof schema>
            interface Expected {
                readonly someEnum: 'value1' | 'value2' | 'value3'
                readonly nested: {
                    readonly someString: string
                    readonly deeplyNested: {
                        readonly someNumber: number
                    }
                }
            }

            expectTypeOf(result.config).toEqualTypeOf<Expected>()
            expectTypeOf<Config>().toEqualTypeOf<Expected>()
        })

        it('Should not throw error if validation is disabled', () => {
            const result = createConfig(
                {
                    someKey: {
                        env: 'NON_PRESENT_ENV_VAR',
                        format: z.string(),
                    },
                },
                { validate: false },
            )

            expect(result.success).toBe(true)
            expect(result.config.someKey).toBeUndefined()

            expectTypeOf(result.config.someKey).toEqualTypeOf<string>()
            expectTypeOf(result.config).toEqualTypeOf<
                Readonly<{
                    someKey: string
                }>
            >()
        })

        it('Should throw error if validation is enabled', () => {
            vitest.stubEnv('INVALID_VAR', '3')
            onTestFinished(() => {
                vitest.unstubAllEnvs()
            })

            const result = createConfig(
                {
                    someKey: {
                        env: 'NON_PRESENT_ENV_VAR',
                        format: z.string(),
                    },
                    someKey2: {
                        env: 'INVALID_VAR',
                        format: z.enum(['1', '2']),
                    },
                },
                { validate: true },
            )

            expect(result.success).toBe(false)

            if (result.success) {
                expect.fail('Validation should have failed')
            } else {
                expect(result.error).toBeInstanceOf(EnveyValidationError)
                expect(result.error.name).toBe('EnveyValidationError')
                expect(result.error.message).toBe('Invalid configuration')
                expect(result.error.issues).toEqual([
                    {
                        code: 'invalid_type',
                        expected: 'string',
                        message:
                            'Invalid input: expected string, received undefined',
                        path: ['someKey'],
                        env: 'NON_PRESENT_ENV_VAR',
                    },
                    {
                        code: 'invalid_value',
                        message: 'Invalid option: expected one of "1"|"2"',
                        values: ['1', '2'],
                        path: ['someKey2'],
                        env: 'INVALID_VAR',
                    },
                ])
            }
        })

        describe('custom env parameter', () => {
            it('Should use custom env object instead of process.env', () => {
                const customEnv = {
                    CUSTOM_ENUM: 'value3',
                    CUSTOM_STRING: 'custom value',
                }

                const schema = {
                    someEnum: {
                        env: 'CUSTOM_ENUM',
                        format: z
                            .enum(['value1', 'value2', 'value3'])
                            .default('value1'),
                    },
                    someString: {
                        env: 'CUSTOM_STRING',
                        format: z.string().default('default'),
                    },
                    notInCustomEnv: {
                        env: 'NOT_IN_CUSTOM_ENV',
                        format: z.string().default('fallback'),
                    },
                } satisfies EnveySchema

                const result = createConfig(
                    schema,
                    { validate: true },
                    customEnv,
                )

                if (!result.success) {
                    expect.fail('Validation should have passed')
                }

                expect(result.config.someEnum).toBe('value3')
                expect(result.config.someString).toBe('custom value')
                expect(result.config.notInCustomEnv).toBe('fallback')
            })

            it('Should work with nested objects using custom env', () => {
                const customEnv = {
                    TOP_LEVEL: 'top',
                    NESTED_VALUE: 'nested',
                    DEEP_NUMBER: '999',
                }

                const schema = {
                    topLevel: {
                        env: 'TOP_LEVEL',
                        format: z.string(),
                    },
                    nested: {
                        value: {
                            env: 'NESTED_VALUE',
                            format: z.string(),
                        },
                        deeper: {
                            number: {
                                env: 'DEEP_NUMBER',
                                format: z.coerce.number(),
                            },
                        },
                    },
                } satisfies EnveySchema

                const result = createConfig(
                    schema,
                    { validate: true },
                    customEnv,
                )

                if (!result.success) {
                    expect.fail('Validation should have passed')
                }

                expect(result.config.topLevel).toBe('top')
                expect(result.config.nested.value).toBe('nested')
                expect(result.config.nested.deeper.number).toBe(999)
            })

            it('Should validate against custom env and return errors with env mapping', () => {
                const customEnv = {
                    INVALID_ENUM: 'invalid_value',
                    // MISSING_REQUIRED is intentionally not provided
                }

                const schema = {
                    invalidEnum: {
                        env: 'INVALID_ENUM',
                        format: z.enum(['valid1', 'valid2']),
                    },
                    missingRequired: {
                        env: 'MISSING_REQUIRED',
                        format: z.string(),
                    },
                } satisfies EnveySchema

                const result = createConfig(
                    schema,
                    { validate: true },
                    customEnv,
                )

                expect(result.success).toBe(false)

                if (result.success) {
                    expect.fail('Validation should have failed')
                } else {
                    expect(result.error).toBeInstanceOf(EnveyValidationError)
                    expect(result.error.issues).toEqual([
                        {
                            code: 'invalid_value',
                            message:
                                'Invalid option: expected one of "valid1"|"valid2"',
                            values: ['valid1', 'valid2'],
                            path: ['invalidEnum'],
                            env: 'INVALID_ENUM',
                        },
                        {
                            code: 'invalid_type',
                            expected: 'string',
                            message:
                                'Invalid input: expected string, received undefined',
                            path: ['missingRequired'],
                            env: 'MISSING_REQUIRED',
                        },
                    ])
                }
            })

            it('Should work without validation using custom env', () => {
                const customEnv = {
                    SOME_VAR: 'custom_value',
                }

                const schema = {
                    someVar: {
                        env: 'SOME_VAR',
                        format: z.string(),
                    },
                    missingVar: {
                        env: 'MISSING_VAR',
                        format: z.string(),
                    },
                } satisfies EnveySchema

                const result = createConfig(
                    schema,
                    { validate: false },
                    customEnv,
                )

                expect(result.success).toBe(true)
                expect(result.config.someVar).toBe('custom_value')
                expect(result.config.missingVar).toBeUndefined()
            })

            it('Should work with empty custom env object', () => {
                const customEnv = {}

                const schema = {
                    someVar: {
                        env: 'SOME_VAR',
                        format: z.string().default('default_value'),
                    },
                } satisfies EnveySchema

                const result = createConfig(
                    schema,
                    { validate: true },
                    customEnv,
                )

                if (!result.success) {
                    expect.fail('Validation should have passed')
                }

                expect(result.config.someVar).toBe('default_value')
            })

            it('Should ignore process.env when custom env is provided', () => {
                // Set up process.env value
                vitest.stubEnv('CONFLICT_VAR', 'process_env_value')
                onTestFinished(() => {
                    vitest.unstubAllEnvs()
                })

                const customEnv = {
                    CONFLICT_VAR: 'custom_env_value',
                }

                const schema = {
                    conflictVar: {
                        env: 'CONFLICT_VAR',
                        format: z.string(),
                    },
                } satisfies EnveySchema

                const result = createConfig(
                    schema,
                    { validate: true },
                    customEnv,
                )

                if (!result.success) {
                    expect.fail('Validation should have passed')
                }

                // Should use custom env, not process.env
                expect(result.config.conflictVar).toBe('custom_env_value')
            })

            it('Should work in environments without process.env (like Cloudflare Workers)', () => {
                // Temporarily hide process to simulate non-Node environment
                const originalProcess = globalThis.process
                // @ts-expect-error - Intentionally deleting for test
                delete globalThis.process

                onTestFinished(() => {
                    globalThis.process = originalProcess
                })

                const customEnv = {
                    WORKER_VAR: 'worker_value',
                }

                const schema = {
                    workerVar: {
                        env: 'WORKER_VAR',
                        format: z.string(),
                    },
                    missingVar: {
                        env: 'MISSING_VAR',
                        format: z.string().default('default_value'),
                    },
                } satisfies EnveySchema

                // Should not throw even without process.env available
                const result = createConfig(
                    schema,
                    { validate: true },
                    customEnv,
                )

                if (!result.success) {
                    expect.fail('Validation should have passed')
                }

                expect(result.config.workerVar).toBe('worker_value')
                expect(result.config.missingVar).toBe('default_value')
            })

            it('Should default to empty object when process is undefined and no env provided', () => {
                // Temporarily hide process to simulate non-Node environment
                const originalProcess = globalThis.process
                // @ts-expect-error - Intentionally deleting for test
                delete globalThis.process

                onTestFinished(() => {
                    globalThis.process = originalProcess
                })

                const schema = {
                    someVar: {
                        env: 'SOME_VAR',
                        format: z.string().default('fallback'),
                    },
                } satisfies EnveySchema

                // Call without providing env parameter - should use empty object as default
                const result = createConfig(schema, { validate: true })

                if (!result.success) {
                    expect.fail('Validation should have passed')
                }

                expect(result.config.someVar).toBe('fallback')
            })
        })
    })
})
