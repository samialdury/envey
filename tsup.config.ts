import { spawn } from 'node:child_process'
import { defineConfig } from 'tsup'

export default defineConfig({
    clean: true,
    entry: ['./src/index.ts'],
    format: ['cjs', 'esm'],
    bundle: true,
    target: 'es2022',
    outDir: 'dist',
    dts: true,
    sourcemap: true,
    onSuccess: async () => {
        // Sleep for 3 sec, workaround for:
        // https://github.com/egoist/tsup/issues/700
        await new Promise((resolve) => setTimeout(resolve, 3000))

        return new Promise((resolve) => {
            console.log('\nBuild succeeded!\n')
            console.log('Generating declaration files...\n')

            spawn(
                './node_modules/.bin/tsc',
                ['--emitDeclarationOnly', '--declaration'],
                {
                    stdio: 'inherit',
                    shell: true,
                },
            )
                .on('error', (err) => {
                    console.error(err)
                })
                .on('exit', (code) => {
                    if (code === 0) {
                        console.log('Declaration files generated!')
                        resolve()
                    }
                })
        })
    },
})
