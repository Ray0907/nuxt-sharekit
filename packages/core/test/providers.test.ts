import { describe, expect, it } from 'vitest'
import {
	createShareIntent,
	getShareProvider,
	listShareProviders,
	normalizeSharePayload,
} from '../src/index'

const payload_complete = {
	url: 'https://example.com/launch?ref=home',
	title: 'Launch notes',
	text: 'A calmer sharing toolkit',
	media: 'https://example.com/cover.png',
	hashtags: ['Nuxt', '#Vue', 'Nuxt'],
	via: '@sharekit',
}

describe('provider registry', () => {
	it('ships broad provider coverage without treating browser actions as networks', () => {
		const ids_provider = listShareProviders().map(provider => provider.id)

		expect(ids_provider).toEqual([
			'facebook',
			'x',
			'linkedin',
			'pinterest',
			'reddit',
			'threads',
			'bluesky',
			'mastodon',
			'tumblr',
			'hackernews',
			'whatsapp',
			'telegram',
			'line',
			'viber',
			'email',
			'sms',
			'weibo',
			'qzone',
			'vk',
			'xing',
			'instapaper',
			'raindrop',
			'chatgpt',
			'claude',
			'gemini',
			'perplexity',
			'grok',
		])
		expect(ids_provider).not.toContain('copy')
		expect(ids_provider).not.toContain('native')
	})

	it('exposes capability and fallback metadata', () => {
		const provider_pinterest = getShareProvider('pinterest')

		expect(provider_pinterest?.fields).toEqual(['url', 'text', 'media'])
		expect(provider_pinterest?.fallback).toBe('copy')
		expect(getShareProvider('mastodon')?.status).toBe('active')
	})

	it('covers every field supported by the upstream 24-provider contract', () => {
		const fields_expected = {
			x: ['url', 'text', 'hashtags', 'via'],
			pinterest: ['url', 'text', 'media'],
			reddit: ['url', 'title'],
			threads: ['url', 'text'],
			tumblr: ['url', 'title', 'text', 'media', 'hashtags'],
			hackernews: ['url', 'title'],
			whatsapp: ['url', 'text'],
			telegram: ['url', 'text'],
			line: ['url', 'text'],
			viber: ['url', 'title', 'text'],
			email: ['url', 'title', 'text'],
			mastodon: ['url', 'text', 'instance'],
			raindrop: ['url', 'title'],
			vk: ['url', 'title', 'text', 'media'],
		} as const

		for (const [id_provider, fields_provider] of Object.entries(fields_expected)) {
			expect(getShareProvider(id_provider)?.fields).toEqual(fields_provider)
		}
	})

	it('returns undefined for unknown providers', () => {
		expect(getShareProvider('not-a-provider')).toBeUndefined()
	})
})

describe('payload normalization', () => {
	it('trims content, resolves relative URLs, and normalizes tags and attribution', () => {
		const payload_normalized = normalizeSharePayload({
			url: '/release',
			title: '  Launch notes  ',
			text: '  Ready to share  ',
			hashtags: ['#Nuxt', 'Nuxt', '  Vue  ', ''],
			via: '@sharekit',
			prompt: '  Explain this page:  ',
		}, 'https://example.com/docs/')

		expect(payload_normalized).toEqual({
			url: 'https://example.com/release',
			title: 'Launch notes',
			text: 'Ready to share',
			hashtags: ['Nuxt', 'Vue'],
			via: 'sharekit',
			prompt: 'Explain this page:',
		})
	})

	it('rejects non-web URLs', () => {
		expect(() => normalizeSharePayload({ url: 'javascript:alert(1)' })).toThrow(
			'Share URLs must use http or https',
		)
	})
})

describe('share intents', () => {
	it.each([
		['facebook', 'https://www.facebook.com/sharer/sharer.php?u='],
		['linkedin', 'https://www.linkedin.com/sharing/share-offsite/?url='],
		['reddit', 'https://www.reddit.com/submit?url='],
		['telegram', 'https://t.me/share/url?url='],
	])('encodes %s payloads using its provider endpoint', (id_provider, prefix_expected) => {
		const intent_share = createShareIntent(id_provider, payload_complete)

		expect(intent_share?.url.startsWith(prefix_expected)).toBe(true)
		expect(intent_share?.url).toContain(encodeURIComponent(payload_complete.url))
	})

	it.each([
		['x', 'https://x.com/intent/tweet'],
		['threads', 'https://www.threads.com/intent/post'],
		['xing', 'https://www.xing.com/social/share/spi'],
	])('uses the current canonical endpoint for %s', (id_provider, endpoint_expected) => {
		const intent_share = createShareIntent(id_provider, payload_complete)
		const url_intent = new URL(intent_share?.url ?? '')

		expect(url_intent.origin + url_intent.pathname).toBe(endpoint_expected)
	})

	it('composes human-readable text for Bluesky', () => {
		const intent_share = createShareIntent('bluesky', payload_complete)
		const url_intent = new URL(intent_share?.url ?? '')

		expect(url_intent.origin + url_intent.pathname).toBe(
			'https://bsky.app/intent/compose',
		)
		expect(url_intent.searchParams.get('text')).toBe(
			'A calmer sharing toolkit\nhttps://example.com/launch?ref=home',
		)
	})

	it('uses a Mastodon chooser and accepts an optional safe instance', () => {
		const intent_chooser = createShareIntent('mastodon', payload_complete)
		const intent_instance = createShareIntent('mastodon', {
			...payload_complete,
			instance: 'https://mastodon.social',
		})

		expect(intent_chooser?.url).toContain('https://mastodonshare.com/')
		expect(intent_chooser?.url).toContain('url=')
		expect(intent_instance?.url).toContain('https://mastodon.social/share?')
		expect(() => createShareIntent('mastodon', {
			...payload_complete,
			instance: 'javascript:alert(1)',
		})).toThrow('Mastodon instances must use http or https')
	})

	it('forwards the upstream LINE and Tumblr optional fields', () => {
		const intent_line = createShareIntent('line', payload_complete)
		const intent_tumblr = createShareIntent('tumblr', payload_complete)
		const url_line = new URL(intent_line?.url ?? '')
		const url_tumblr = new URL(intent_tumblr?.url ?? '')

		expect(url_line.searchParams.get('text')).toBe(payload_complete.text)
		expect(url_tumblr.searchParams.get('content')).toBe(payload_complete.media)
		expect(url_tumblr.searchParams.get('tags')).toBe('Nuxt,Vue')
	})

	it('builds mail and SMS intents without forcing popup behavior', () => {
		const intent_email = createShareIntent('email', payload_complete)
		const intent_sms = createShareIntent('sms', payload_complete)

		expect(intent_email).toMatchObject({ target: 'same-tab' })
		expect(intent_email?.url).toContain('mailto:?')
		expect(intent_sms).toMatchObject({ target: 'same-tab' })
		expect(intent_sms?.url).toContain('sms:?')
	})

	it('supports competitor aliases without duplicating canonical providers', () => {
		expect(createShareIntent('twitter', payload_complete)).toMatchObject({
			providerId: 'x',
		})
		expect(createShareIntent('vkontakte', payload_complete)).toMatchObject({
			providerId: 'vk',
		})
	})

	it('builds Viber and opt-in AI destinations', () => {
		const intent_viber = createShareIntent('viber', payload_complete)
		const intent_claude = createShareIntent('claude', {
			...payload_complete,
			prompt: 'Review this:',
		})

		expect(intent_viber).toMatchObject({ target: 'same-tab' })
		expect(intent_viber?.url).toContain('viber://forward?text=')
		expect(new URL(intent_claude?.url ?? '').searchParams.get('q')).toBe(
			'Review this: https://example.com/launch?ref=home',
		)
	})

	it('returns undefined for unknown provider ids', () => {
		expect(createShareIntent('unknown', payload_complete)).toBeUndefined()
	})
})
