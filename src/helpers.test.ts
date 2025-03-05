import { describe, expect, it } from 'vitest'
import { z } from 'zod'
import { bool } from './helpers.js'

describe('Envey helpers', () => {
    describe('bool', () => {
        it('should transform "true" to true', () => {
            const schema = bool(z, false)
            const result = schema.parse('true')
            expect(result).toBe(true)
        })

        it('should transform "TRUE" to true', () => {
            const schema = bool(z, false)
            const result = schema.parse('TRUE')
            expect(result).toBe(true)
        })

        it('should transform "1" to true', () => {
            const schema = bool(z, false)
            const result = schema.parse('1')
            expect(result).toBe(true)
        })

        it('should transform "false" to false', () => {
            const schema = bool(z, true)
            const result = schema.parse('false')
            expect(result).toBe(false)
        })

        it('should transform "FALSE" to false', () => {
            const schema = bool(z, true)
            const result = schema.parse('FALSE')
            expect(result).toBe(false)
        })

        it('should transform "0" to false', () => {
            const schema = bool(z, true)
            const result = schema.parse('0')
            expect(result).toBe(false)
        })

        it('should use the provided default value when input is undefined', () => {
            const trueSchema = bool(z, true)
            const falseSchema = bool(z, false)

            expect(trueSchema.parse(undefined)).toBe(true)
            expect(falseSchema.parse(undefined)).toBe(false)
        })

        it('should reject invalid values', () => {
            const schema = bool(z, false)

            expect(() => schema.parse('yes')).toThrow()
            expect(() => schema.parse('no')).toThrow()
            expect(() => schema.parse('t')).toThrow()
            expect(() => schema.parse('f')).toThrow()
        })

        it('should have the correct type', () => {
            const schema = bool(z, false)
            const result = schema.parse('true')

            expect(typeof result).toBe('boolean')
            expectTypeOf(result).toEqualTypeOf<boolean>()
        })

        it('should handle safeParse correctly', () => {
            const schema = bool(z, false)

            const validResult = schema.safeParse('true')
            expect(validResult.success).toBe(true)
            if (validResult.success) {
                expect(validResult.data).toBe(true)
            }

            const invalidResult = schema.safeParse('invalid')
            expect(invalidResult.success).toBe(false)
        })
    })
})
