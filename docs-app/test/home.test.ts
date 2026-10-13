// @vitest-environment node
import { fileURLToPath } from 'node:url'
import { listShareProviders } from '@nuxt-sharekit/core'
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

	it('offers one install control that names its real action', async () => {
		const html_page = await $fetch<string>('/')

		expect(html_page.match(/aria-label="Copy install command"/g)).toHaveLength(1)
		expect(html_page).not.toContain('>Install<')
		expect(html_page).toContain('Nuxt 4 only')
	})

	it('does not decorate the builder with status that carries no information', async () => {
		const html_page = await $fetch<string>('/')
		const html_builder = html_page.slice(
			html_page.indexOf('Component builder'),
			html_page.indexOf('Provider support'),
		)

		expect(html_builder).not.toContain('bg-signal')
		expect(html_builder).not.toContain('>Configured<')
		expect(html_builder).not.toContain('>Ready<')
	})

	it('hides provider columns whose value is identical in every row', async () => {
		const html_page = await $fetch<string>('/')

		expect(html_page).not.toMatch(/Fallback\s*<\/th>/)
		expect(html_page).not.toMatch(/Status\s*<\/th>/)
		expect(html_page).toMatch(/URL\s*<\/th>/)
		expect(html_page).toMatch(/Media\s*<\/th>/)
	})

	it('keeps the capability columns on small screens and drops the rest', async () => {
		const html_page = await $fetch<string>('/')

		expect(html_page).toContain('md:table-cell')
		expect(html_page).not.toContain('min-w-4xl')
	})

	it('does not repeat the docs sidebar next to the provider table', async () => {
		const html_page = await $fetch<string>('/')

		expect(html_page).not.toContain('aria-label="Documentation navigation"')
	})

	it('shows the real component before the builder, styled and headless', async () => {
		const html_page = await $fetch<string>('/')
		const html_hero = html_page.slice(0, html_page.indexOf('Component builder'))

		expect(html_hero.match(/data-provider="x"/g)).toHaveLength(2)
		expect(html_hero).toMatch(/>\s*Styled\s*</)
		expect(html_hero).toMatch(/>\s*Headless\s*</)
		expect(html_hero).toContain('headless-demo')
	})

	it('derives the provider count from the registry', async () => {
		const html_page = await $fetch<string>('/')

		expect(html_page).toContain(`Nuxt 4 only · ${listShareProviders().length} providers`)
	})

	it('uses flat ring surfaces instead of border plus shadow panels', async () => {
		const html_page = await $fetch<string>('/')

		expect(html_page).not.toContain('shadow-panel')
		expect(html_page.match(/ring-1 ring-line/g)?.length).toBeGreaterThanOrEqual(3)
	})

	it('keeps the hero demo to provider buttons without an orphaned copy action', async () => {
		const html_page = await $fetch<string>('/')
		const html_hero = html_page.slice(0, html_page.indexOf('Component builder'))

		expect(html_hero).not.toContain('Copy link')
	})
})
