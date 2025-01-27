import { z } from 'zod'
import type { EnveySchema, InferEnveyConfig } from './types.js'
import { createConfig } from './envey.js'
import { EnveyValidationError } from './errors.js'

describe('Envey', () => {
    describe('createConfig', () => {
        it('Should be a function', () => {
            expect(typeof createConfig).toBe('function')
        })

        it('Should return ENV value', () => {
            const result = createConfig(
                z,
                {
                    someEnum: {
                        env: 'SOME_ENUM',
                        format: z
                            .enum(['value1', 'value2', 'value3'])
                            .default('value2'),
                    },
                },
                { validate: true },
            )

            if (!result.success) {
                expect.fail('Validation should have passed')
            }

            expect(result.config.someEnum).toBe('value1')
            expectTypeOf(result.config.someEnum).toEqualTypeOf<
                'value1' | 'value2' | 'value3'
            >()
        })

        it('Should return with possible undefined', () => {
            const result = createConfig(
                z,
                {
                    someEnum: {
                        env: 'SOME_ENUM',
                        format: z
                            .enum(['value1', 'value2', 'value3'])
                            .optional(),
                    },
                },
                { validate: true },
            )

            if (!result.success) {
                expect.fail('Validation should have passed')
            }

            expect(result.config.someEnum).toBe('value1')
            expectTypeOf(result.config.someEnum).toEqualTypeOf<
                'value1' | 'value2' | 'value3' | undefined
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

        describe('Validation', () => {
            it('Should not throw error if validation is set to false', () => {
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
            })

            it('Should throw error if validation is set to true', () => {
                vitest.stubEnv('INVALID_VAR', '3')

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

        describe('Types', () => {
            it('Should infer type of schema', () => {
                const schema = {
                    someEnum: {
                        env: 'SOME_ENUM',
                        format: z
                            .enum(['value1', 'value2', 'value3'])
                            .default('value2'),
                    },
                } satisfies EnveySchema

                let config: InferEnveyConfig<typeof schema>

                // @ts-expect-error - just for testing
                expectTypeOf(config).toEqualTypeOf<
                    Readonly<{
                        someEnum: 'value1' | 'value2' | 'value3'
                    }>
                >()
            })

            it('Should infer with optional with undefined', () => {
                const schema = {
                    someValue: {
                        env: undefined,
                        format: z.string().optional(),
                    },
                } satisfies EnveySchema

                let config: InferEnveyConfig<typeof schema>

                // @ts-expect-error - just for testing
                expectTypeOf(config).toEqualTypeOf<
                    Readonly<{
                        someValue: string | undefined
                    }>
                >()
            })
        })
    })
})
