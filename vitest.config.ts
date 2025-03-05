import { coverageConfigDefaults, defineConfig } from 'vitest/config'

export default defineConfig({
    test: {
        include: ['./src/**/*.test.ts', './test/**/*.test.ts'],
        globals: true,
        restoreMocks: true,
        unstubEnvs: true,
        coverage: {
            provider: 'v8',
            include: ['src/**/*.ts'],
            exclude: ['src/index.ts', ...coverageConfigDefaults.exclude],
            thresholds: {
                lines: 80,
                functions: 80,
                branches: 80,
                statements: 80,
            },
        },
    },
})
