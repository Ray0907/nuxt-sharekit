import { execFileSync } from 'node:child_process'
import { rm } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'

const path_package = fileURLToPath(new URL('..', import.meta.url))
const path_dist = fileURLToPath(new URL('../dist', import.meta.url))

await rm(path_dist, { recursive: true, force: true })
execFileSync('pnpm', ['exec', 'tsc', '-p', 'tsconfig.build.json'], {
	cwd: path_package,
	stdio: 'inherit',
})
