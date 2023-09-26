import type { z } from 'zod'

export function bool(
    zodInstance: typeof z,
    defaultValue: boolean,
): z.ZodBoolean {
    return zodInstance
        .enum(['true', 'false', '1', '0', 'TRUE', 'FALSE'])
        .transform(
            (value) => value === 'true' || value === '1' || value === 'TRUE',
        )
        .default(defaultValue.toString() as never) as unknown as z.ZodBoolean
}
