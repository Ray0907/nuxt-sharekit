import { describe, expect, it } from 'vitest'
import {
	createShareRegistry,
	defineShareProvider,
	getSharePreset,
	listShareProviders,
} from '../src/index'

describe('provider presets', () => {
	it('keeps the recommended preset focused', () => {
		expect(getSharePreset('recommended')).toEqual([
			'x',
			'linkedin',
			'bluesky',
			'whatsapp',
			'email',
		])
	})

	it('offers a focused messaging preset', () => {
		expect(getSharePreset('messaging')).toEqual([
			'whatsapp',
			'telegram',
			'line',
			'viber',
			'email',
			'sms',
		])
	})

	it('keeps AI destinations in an explicit opt-in preset', () => {
		expect(getSharePreset('ask-ai')).toEqual([
			'chatgpt',
			'claude',
			'gemini',
			'perplexity',
			'grok',
		])
	})

	it('keeps all preset ids synchronized with the provider registry', () => {
		const ids_all = getSharePreset('all')
		const ids_provider = listShareProviders().map(provider => provider.id)

		expect(ids_all).toEqual(ids_provider)
	})

	it('returns undefined for unknown presets', () => {
		expect(getSharePreset('unknown')).toBeUndefined()
	})
})

describe('custom providers', () => {
	it('adds typed providers to an isolated registry', () => {
		const provider_acme = defineShareProvider({
			id: 'acme',
			label: 'Acme Social',
			category: 'social',
			icon: 'lucide:send',
			fields: ['url', 'text'],
			buildUrl: payload => `https://share.acme.test/?${new URLSearchParams({
				url: payload.url,
				text: payload.text ?? '',
			})}`,
		})
		const registry_share = createShareRegistry([provider_acme])
		const intent_share = registry_share.createIntent('acme', {
			url: 'https://example.com/post',
			text: 'Read this',
		})

		expect(registry_share.get('acme')?.label).toBe('Acme Social')
		expect(intent_share).toMatchObject({
			providerId: 'acme',
			target: 'popup',
		})
	})

	it('rejects invalid ids and missing labels', () => {
		expect(() => defineShareProvider({
			id: 'Not Valid',
			label: 'Invalid',
			category: 'social',
			icon: 'lucide:send',
			fields: ['url'],
			buildUrl: payload => payload.url,
		})).toThrow('Provider ids must use lowercase letters, numbers, and hyphens')

		expect(() => defineShareProvider({
			id: 'empty-label',
			label: '  ',
			category: 'social',
			icon: 'lucide:send',
			fields: ['url'],
			buildUrl: payload => payload.url,
		})).toThrow('Provider labels are required')
	})

	it('rejects duplicate ids and unsafe generated URLs', () => {
		const provider_duplicate = defineShareProvider({
			id: 'x',
			label: 'Duplicate X',
			category: 'social',
			icon: 'lucide:send',
			fields: ['url'],
			buildUrl: payload => payload.url,
		})

		expect(() => createShareRegistry([provider_duplicate])).toThrow(
			'Duplicate provider id: x',
		)

		const provider_alias = defineShareProvider({
			id: 'twitter',
			label: 'Duplicate Twitter',
			category: 'social',
			icon: 'lucide:send',
			fields: ['url'],
			buildUrl: payload => payload.url,
		})
		expect(() => createShareRegistry([provider_alias])).toThrow(
			'Duplicate provider id: twitter',
		)

		const provider_unsafe = defineShareProvider({
			id: 'unsafe',
			label: 'Unsafe',
			category: 'social',
			icon: 'lucide:send',
			fields: ['url'],
			buildUrl: () => 'javascript:alert(1)',
		})
		const registry_share = createShareRegistry([provider_unsafe])

		expect(() => registry_share.createIntent('unsafe', {
			url: 'https://example.com',
		})).toThrow('Provider intent URLs must use http or https')
	})
})
