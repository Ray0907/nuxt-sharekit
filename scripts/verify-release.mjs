import { execFileSync } from 'node:child_process'
import {
	mkdtemp,
	readFile,
	readdir,
	rm,
} from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'
import { strict as assert } from 'node:assert'

const path_root = resolve(import.meta.dirname, '..')
const path_temp = await mkdtemp(join(tmpdir(), 'nuxt-sharekit-release-'))
const package_core = JSON.parse(await readFile(
	join(path_root, 'packages/core/package.json'),
	'utf8',
))
const package_nuxt = JSON.parse(await readFile(
	join(path_root, 'packages/nuxt/package.json'),
	'utf8',
))
const upstream_networks = [
	'facebook',
	'x',
	'linkedin',
	'pinterest',
	'reddit',
	'bluesky',
	'threads',
	'mastodon',
	'vkontakte',
	'xing',
	'tumblr',
	'hackernews',
	'whatsapp',
	'telegram',
	'line',
	'viber',
	'email',
	'instapaper',
	'raindrop',
	'chatgpt',
	'claude',
	'gemini',
	'perplexity',
	'grok',
]
const files_required = [
	'CHANGELOG.md',
	'README.md',
	'.github/workflows/ci.yml',
	'.github/workflows/docs.yml',
	'.github/workflows/release.yml',
	'docs/migration-from-nuxt-social-share.md',
	'docs/replacement-matrix.md',
	'docs/release/nuxt-modules.yml',
	'docs/release/release-checklist.md',
	'test/browser/replacement.spec.ts-snapshots/default-runtime.png',
]

function runCommand(command_name, args_command, cwd_command) {
	execFileSync(command_name, args_command, {
		cwd: cwd_command,
		stdio: 'pipe',
	})
}

try {
	assert.equal(package_core.version, package_nuxt.version)
	assert.equal(package_core.license, 'MIT')
	assert.equal(package_nuxt.license, 'MIT')
	assert.equal(package_nuxt.peerDependencies.nuxt, '^4.0.0')
	assert.equal(package_nuxt.dependencies['reka-ui'], undefined)
	assert.match(package_nuxt.repository.url, /Ray0907\/nuxt-sharekit/)

	for (const path_file of files_required) {
		await readFile(join(path_root, path_file))
	}

	const core_built = await import(join(path_root, 'packages/core/dist/index.js'))
	assert.ok(core_built.listShareProviders().length >= 27)
	for (const id_network of upstream_networks) {
		assert.ok(core_built.getShareProvider(id_network), `Missing provider: ${id_network}`)
	}

	runCommand('pnpm', ['pack', '--pack-destination', path_temp], join(path_root, 'packages/core'))
	runCommand('pnpm', ['pack', '--pack-destination', path_temp], join(path_root, 'packages/nuxt'))
	const files_pack = await readdir(path_temp)
	assert.equal(files_pack.filter(name_file => name_file.endsWith('.tgz')).length, 2)

	const name_nuxt = files_pack.find(name_file => /^nuxt-sharekit-\d/.test(name_file))
	assert.ok(name_nuxt)
	const archive_list = execFileSync(
		'tar',
		['-tzf', join(path_temp, name_nuxt)],
		{ encoding: 'utf8' },
	)
	assert.match(archive_list, /package\/dist\/module\.mjs/)
	assert.match(archive_list, /package\/dist\/runtime\/components\/ShareLink\.vue/)
	assert.match(archive_list, /package\/dist\/runtime\/composables\/useSocialShare\.js/)

	console.log('Release artifacts, provider parity, and package contents verified.')
}
finally {
	await rm(path_temp, { recursive: true, force: true })
}
