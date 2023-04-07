import { defineConfig } from 'vitest/config'

export default defineConfig({
	test: {
		include: ['./src/**/*.test.ts', './test/**/*.test.ts'],
		env: {},
		globals: true,
		restoreMocks: true,
		unstubEnvs: true,
		coverage: {
			provider: 'c8',
			include: ['src/**/*.ts'],
			all: true,
			lines: 50,
			functions: 50,
			branches: 50,
			statements: 50,
		},
	},
})
