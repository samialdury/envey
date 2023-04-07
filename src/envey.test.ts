import { z } from 'zod'

import { createConfig } from './envey.js'
import { EnveyValidationError } from './errors.js'

describe('Envey', () => {
	describe('createConfig', () => {
		it('Should be a function', () => {
			expect(typeof createConfig).toBe('function')
		})

		it('Should return ENV value', () => {
			const config = createConfig(z, {
				nodeEnv: {
					env: 'NODE_ENV',
					format: z
						.enum(['production', 'development', 'test'])
						.default('production'),
				},
			})

			expect(config.nodeEnv).toBe('test')
			expectTypeOf(config.nodeEnv).toEqualTypeOf<
				'production' | 'development' | 'test'
			>()
		})

		it('Should leave value as undefined', () => {
			const config = createConfig(z, {
				projectName: {
					env: undefined,
					format: z.string().default('envey'),
				},
			})

			expect(config.projectName).toBe('envey')
		})

		describe('Validation', () => {
			it('Should not throw error if validation is set to false', () => {
				const config = createConfig(
					z,
					{
						someKey: {
							env: 'NON_PRESENT_ENV_VAR',
							format: z.string(),
						},
					},
					{ validate: false }
				)

				expect(config.someKey).toBeUndefined()
			})

			it('Should throw error if validation is set to true', () => {
				vitest.stubEnv('INVALID_VAR', '3')

				try {
					createConfig(
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
						{ validate: true }
					)
				} catch (err) {
					if (err instanceof EnveyValidationError) {
						expect(err.name).toBe('EnveyValidationError')
						expect(err.message).toBe('Invalid configuration')
						expect(err.issues).toEqual([
							{
								code: 'invalid_type',
								expected: 'string',
								received: 'undefined',
								path: ['someKey'],
								message: 'Required',
							},
							{
								code: 'invalid_enum_value',
								message: "Invalid enum value. Expected '1' | '2', received '3'",
								options: ['1', '2'],
								path: ['someKey2'],
								received: '3',
							},
						])
					} else {
						expect.fail('Error is not an instance of EnveyValidationError')
					}
				}
			})

			it('Should validate by default, if no options are set', () => {
				try {
					createConfig(
						z,
						{
							someKey: {
								env: 'NON_PRESENT_ENV_VAR',
								format: z.string(),
							},
						},
						{ validate: true }
					)
				} catch (err) {
					if (err instanceof EnveyValidationError) {
						expect(err.message).toBe('Invalid configuration')
						expect(err.issues).toEqual([
							{
								code: 'invalid_type',
								expected: 'string',
								received: 'undefined',
								path: ['someKey'],
								message: 'Required',
							},
						])
					} else {
						expect.fail('Error is not an instance of EnveyValidationError')
					}
				}
			})
		})
	})
})
