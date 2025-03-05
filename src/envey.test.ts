import { z } from 'zod'
import type { EnveySchema, InferEnveyConfig } from './types.js'
import { createConfig } from './envey.js'
import { EnveyValidationError } from './errors.js'

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

            const result = createConfig(z, schema, { validate: true })
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

            const result = createConfig(z, schema, { validate: true })
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

            const result = createConfig(z, schema, { validate: true })

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
                z,
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

            const result = createConfig(z, schema, { validate: true })

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
                z,
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
                z,
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
                        message: 'Required',
                        path: ['someKey'],
                        env: 'NON_PRESENT_ENV_VAR',
                        received: 'undefined',
                    },
                    {
                        code: 'invalid_enum_value',
                        message:
                            "Invalid enum value. Expected '1' | '2', received '3'",
                        options: ['1', '2'],
                        path: ['someKey2'],
                        env: 'INVALID_VAR',
                        received: '3',
                    },
                ])
            }
        })
    })
})
