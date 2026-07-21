import { beforeEach, describe, expect, it, vi } from 'vitest'

import module_sharekit from '../src/module'

const mocks_kit = vi.hoisted(() => ({
	addComponent: vi.fn(),
	addImports: vi.fn(),
	createResolver: vi.fn(() => ({
		resolve: (path_runtime: string) => `/resolved/${path_runtime}`,
	})),
}))

vi.mock('@nuxt/kit', () => ({
	addComponent: mocks_kit.addComponent,
	addImports: mocks_kit.addImports,
	createResolver: mocks_kit.createResolver,
	defineNuxtModule: (definition: unknown) => definition,
}))

interface ModuleDefinition {
	meta: {
		name: string
		configKey: string
		compatibility: { nuxt: string }
	}
	defaults: {
		componentPrefix: string
		styled: boolean
	}
	setup: (
		options: { componentPrefix: string, styled: boolean },
		nuxt: { options: { css: string[] } },
	) => void
}

const definition_module = module_sharekit as unknown as ModuleDefinition

describe('Nuxt ShareKit module', () => {
	beforeEach(() => {
		vi.clearAllMocks()
	})

	it('declares a Nuxt 4-only module contract', () => {
		expect(definition_module.meta).toEqual({
			name: 'nuxt-sharekit',
			configKey: 'shareKit',
			compatibility: { nuxt: '>=4.0.0' },
		})
		expect(definition_module.defaults).toEqual({
			componentPrefix: 'Share',
			styled: true,
		})
	})

	it('registers components, the composable, and optional styles', () => {
		const nuxt_stub = { options: { css: [] as string[] } }

		definition_module.setup(definition_module.defaults, nuxt_stub)

		expect(mocks_kit.addComponent.mock.calls.map(call => call[0].name)).toEqual([
			'ShareButton',
			'ShareGroup',
			'ShareMenu',
			'ShareQr',
		])
		expect(mocks_kit.addImports).toHaveBeenCalledWith({
			name: 'useShare',
			as: 'useShare',
			from: '/resolved/runtime/composables/useShare',
		})
		expect(nuxt_stub.options.css).toEqual(['/resolved/runtime/sharekit.css'])
	})

	it('supports custom component prefixes and headless-only installation', () => {
		const nuxt_stub = { options: { css: [] as string[] } }

		definition_module.setup({
			componentPrefix: 'Social',
			styled: false,
		}, nuxt_stub)

		expect(mocks_kit.addComponent.mock.calls.map(call => call[0].name)).toEqual([
			'SocialButton',
			'SocialGroup',
			'SocialMenu',
			'SocialQr',
		])
		expect(nuxt_stub.options.css).toEqual([])
	})
})
