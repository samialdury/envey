import type { z } from 'zod/v4'

export class EnveyValidationError extends Error {
    public issues: z.core.$ZodIssue[]

    constructor(issues: z.core.$ZodIssue[], message: string) {
        super(message)

        this.name = 'EnveyValidationError'
        this.issues = issues
    }
}
