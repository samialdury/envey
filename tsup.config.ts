import { defineConfig } from 'tsup'

export default defineConfig({
    clean: true,
    entry: ['./src/index.ts'],
    format: ['cjs', 'esm'],
    dts: true,
    bundle: true,
    target: 'es2022',
    outDir: 'dist',
})
