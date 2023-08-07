import { defineConfig } from 'tsup'
import { spawn } from 'child_process'

export default defineConfig({
    clean: true,
    entry: ['./src/index.ts'],
    format: ['cjs', 'esm'],
    bundle: true,
    target: 'es2022',
    outDir: 'dist',
    onSuccess: async () => {
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
