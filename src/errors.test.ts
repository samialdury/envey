import { type EnveyIssue, EnveyValidationError } from './errors.js'

function issue(
    message: string,
    path: (string | number)[],
    env: string | undefined,
): EnveyIssue {
    return {
        code: 'custom',
        message,
        path,
        env,
    } as EnveyIssue
}

describe('EnveyValidationError', () => {
    describe('prettify', () => {
        it('Should render a single flat-path issue with env on location line', () => {
            const err = new EnveyValidationError(
                [issue('Expected string', ['port'], 'PORT')],
                'Invalid configuration',
            )

            expect(err.prettify()).toBe('✖ Expected string\n  → at port (PORT)')
        })

        it('Should dot-join nested paths', () => {
            const err = new EnveyValidationError(
                [
                    issue(
                        'Invalid enum',
                        ['nested', 'deeper', 'kind'],
                        'DEEP_ENUM',
                    ),
                ],
                'Invalid configuration',
            )

            expect(err.prettify()).toBe(
                '✖ Invalid enum\n  → at nested.deeper.kind (DEEP_ENUM)',
            )
        })

        it('Should omit location line when path is empty', () => {
            const err = new EnveyValidationError(
                [issue('Root-level failure', [], undefined)],
                'Invalid configuration',
            )

            expect(err.prettify()).toBe('✖ Root-level failure')
        })

        it('Should sort issues by path length ascending', () => {
            const err = new EnveyValidationError(
                [
                    issue('Deep', ['a', 'b', 'c'], 'DEEP'),
                    issue('Shallow', ['x'], 'SHALLOW'),
                    issue('Mid', ['a', 'b'], 'MID'),
                ],
                'Invalid configuration',
            )

            expect(err.prettify()).toBe(
                [
                    '✖ Shallow',
                    '  → at x (SHALLOW)',
                    '✖ Mid',
                    '  → at a.b (MID)',
                    '✖ Deep',
                    '  → at a.b.c (DEEP)',
                ].join('\n'),
            )
        })

        it('Should render (undefined) when issue env is undefined', () => {
            const err = new EnveyValidationError(
                [issue('Missing value', ['noEnvField'], undefined)],
                'Invalid configuration',
            )

            expect(err.prettify()).toBe(
                '✖ Missing value\n  → at noEnvField (undefined)',
            )
        })

        it('Should not mutate issues array', () => {
            const issues = [
                issue('Deep', ['a', 'b', 'c'], 'DEEP'),
                issue('Shallow', ['x'], 'SHALLOW'),
            ]
            const err = new EnveyValidationError(
                issues,
                'Invalid configuration',
            )
            const beforeOrder = err.issues.map((i) => i.message)

            err.prettify()

            expect(err.issues.map((i) => i.message)).toEqual(beforeOrder)
        })
    })
})
