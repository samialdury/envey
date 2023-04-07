import { logHelloWorld } from './hello-world.js'

describe('Hello World', () => {
	it('Should log "Hello, World!"', () => {
		const logFn = vi.fn().mockReturnValue(() => null)

		const mockConsole = {
			log: logFn,
		}

		vi.stubGlobal('console', mockConsole)

		logHelloWorld()

		expect(logFn).toHaveBeenCalledOnce()
		expect(logFn).toHaveBeenCalledWith('Hello, World!')
	})
})
