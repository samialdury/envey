import type { ZodIssue } from 'zod'

export class EnveyValidationError extends Error {
	public issues: ZodIssue[]

	constructor(issues: ZodIssue[], message: string) {
		super(message)

		this.name = 'EnveyValidationError'
		this.issues = issues
	}
}
