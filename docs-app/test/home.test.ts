// @vitest-environment node
import { fileURLToPath } from 'node:url'
import { $fetch, setup } from '@nuxt/test-utils/e2e'
import { describe, expect, it } from 'vitest'

describe('documentation homepage', async () => {
	await setup({
		rootDir: fileURLToPath(new URL('..', import.meta.url)),
		server: true,
	})

	it('renders the approved product story and real component builder', async () => {
		const html_page = await $fetch('/')

		expect(html_page).toContain('Social sharing that fits your product.')
		expect(html_page).toContain('Beautiful defaults. Headless when you need it.')
		expect(html_page).toContain('Component builder')
		expect(html_page).toContain('Provider support')
		expect(html_page).toContain('data-provider="x"')
	})
})
