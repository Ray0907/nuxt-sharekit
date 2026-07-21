import { execFileSync } from 'node:child_process'
import {
	mkdir,
	mkdtemp,
	readdir,
	rm,
	writeFile,
} from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'

const path_root = resolve(import.meta.dirname, '..')
const path_temp = await mkdtemp(join(tmpdir(), 'nuxt-sharekit-install-'))
const path_packs = join(path_temp, 'packs')
const path_project = join(path_temp, 'project')

function runCommand(command_name, args_command, cwd_command) {
	execFileSync(command_name, args_command, {
		cwd: cwd_command,
		stdio: 'inherit',
	})
}

try {
	await mkdir(path_packs, { recursive: true })
	await mkdir(path_project, { recursive: true })
	runCommand('pnpm', ['pack', '--pack-destination', path_packs], join(path_root, 'packages/core'))
	runCommand('pnpm', ['pack', '--pack-destination', path_packs], join(path_root, 'packages/nuxt'))

	const names_pack = await readdir(path_packs)
	const name_core = names_pack.find(name_file => name_file.includes('nuxt-sharekit-core'))
	const name_nuxt = names_pack.find(name_file => /^nuxt-sharekit-\d/.test(name_file))
	if (!name_core || !name_nuxt) throw new Error('Expected both package tarballs')

	await writeFile(join(path_project, 'package.json'), JSON.stringify({
		name: 'nuxt-sharekit-clean-install',
		private: true,
		type: 'module',
		packageManager: 'pnpm@10.33.2',
		dependencies: {
			'@nuxt-sharekit/core': `file:${join(path_packs, name_core)}`,
			'nuxt': '4.5.0',
			'nuxt-sharekit': `file:${join(path_packs, name_nuxt)}`,
			'vue': '3.5.40',
		},
		pnpm: {
			overrides: {
				'@nuxt-sharekit/core': `file:${join(path_packs, name_core)}`,
			},
		},
	}, null, '\t'))
	await writeFile(join(path_project, 'nuxt.config.ts'), `export default defineNuxtConfig({
\tmodules: ['nuxt-sharekit'],
})
`)
	await writeFile(join(path_project, 'app.vue'), `<template>
\t<ShareLink provider="x" :payload="{ url: 'https://example.com' }" />
</template>
`)

	runCommand('pnpm', ['install', '--ignore-scripts'], path_project)
	runCommand('pnpm', ['exec', 'nuxt', 'build'], path_project)
}
finally {
	await rm(path_temp, { recursive: true, force: true })
}
