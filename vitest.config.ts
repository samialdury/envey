import { defineConfig } from 'vitest/config'

export default defineConfig({
    test: {
        include: ['./src/**/*.test.ts', './test/**/*.test.ts'],
        env: {
            SOME_ENUM: 'value1',
        },
        globals: true,
        restoreMocks: true,
        unstubEnvs: true,
        coverage: {
            provider: 'v8',
            include: ['src/**/*.ts'],
            exclude: ['src/index.ts', 'src/**/types.ts', 'src/**/*.test.ts'],
            all: true,
            lines: 80,
            functions: 80,
            branches: 80,
            statements: 80,
        },
        cache: {
            dir: '.cache/vitest',
        },
    },
})
