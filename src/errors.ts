import type { z } from 'zod'
import { toDotPath } from 'zod/v4/core'

export class EnveyValidationError extends Error {
    public issues: EnveyIssue[]

    constructor(issues: EnveyIssue[], message: string) {
        super(message)

        this.name = 'EnveyValidationError'
        this.issues = issues
    }
export type EnveyIssue = z.core.$ZodIssue & {
    env: string | undefined
}
