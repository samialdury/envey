import type { z } from 'zod'
import { toDotPath } from 'zod/v4/core'

export class EnveyValidationError extends Error {
    public issues: EnveyIssue[]

    constructor(issues: EnveyIssue[], message: string) {
        super(message)

        this.name = 'EnveyValidationError'
        this.issues = issues
    }

    /**
     * Zod's prettifyError function modified to display environment variable names.
     *
     * @see {@link https://github.com/colinhacks/zod/blob/c7805073fef5b6b8857307c3d4b3597a70613bc2/packages/zod/src/v4/core/errors.ts#L435}
     */
    prettify(): string {
        const lines: string[] = []
        // sort by path length
        const issues = [...this.issues].sort(
            (a, b) => (a.path ?? []).length - (b.path ?? []).length,
        )

        for (const issue of issues) {
            lines.push(`✖ ${issue.message}`)
            if (issue.path?.length)
                lines.push(`  → at ${toDotPath(issue.path)} (${issue.env})`)
        }

        return lines.join('\n')
    }
}

export type EnveyIssue = z.core.$ZodIssue & {
    env: string | undefined
}
