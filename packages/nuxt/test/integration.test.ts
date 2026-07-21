// @vitest-environment node
import { fileURLToPath } from 'node:url'
import { $fetch, setup } from '@nuxt/test-utils/e2e'
import { describe, expect, it } from 'vitest'

describe('Nuxt 4 integration', async () => {
	await setup({
		rootDir: fileURLToPath(new URL('../../../playground', import.meta.url)),
		server: true,
	})

	it('auto-registers runtime components in SSR output', async () => {
		const html_page = await $fetch('/')

		expect(html_page).toContain('Nuxt ShareKit playground')
		expect(html_page).toContain('data-provider="x"')
		expect(html_page).toContain('Copy link')
		expect(html_page).toContain('social-share-button--twitter')
		expect(html_page).toContain('Send with Email')
		expect(html_page).toContain('https://mastodonshare.com/')
	})
})
