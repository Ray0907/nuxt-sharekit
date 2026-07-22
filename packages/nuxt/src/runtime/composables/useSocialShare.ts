import {
	createShareIntent,
	getShareProvider,
} from '@nuxt-sharekit/core'
import type {
	SharePayload,
	ShareProviderCategory,
} from '@nuxt-sharekit/core'
import {
	useRequestURL,
	useRoute,
	useRuntimeConfig,
} from 'nuxt/app'
import { computed } from 'vue'
import type { ComputedRef } from 'vue'
import { providerIcons } from '../provider-icons'

export interface LegacySocialShareOptions {
	network: string
	url?: string
	title?: string
	user?: string
	hashtags?: string
	image?: string
	prompt?: string
}

export interface LegacySocialShareNetwork {
	name: string
	shareUrl: string
	icon: {
		viewBox: string
		path: string
	}
	color: string
	category: 'social' | 'messaging' | 'ai' | 'bookmark' | 'other'
	target: 'popup' | 'same-tab'
}

const options_default: LegacySocialShareOptions = { network: '' }

const colors_legacy: Readonly<Record<string, string>> = {
	facebook: '#0866FF',
	x: '#000000',
	linkedin: '#0A66C2',
	pinterest: '#BD081C',
	reddit: '#FF4500',
	bluesky: '#1185FE',
	threads: '#000000',
	mastodon: '#6364FF',
	vk: '#0077FF',
	xing: '#0698A0',
	tumblr: '#001F38',
	hackernews: '#F0652F',
	whatsapp: '#25D366',
	telegram: '#26A5E4',
	line: '#06C655',
	viber: '#7360F2',
	email: '#7E7E7E',
	instapaper: '#1F1F1F',
	raindrop: '#0B7ED0',
	chatgpt: '#0D0D0D',
	claude: '#D97757',
	gemini: '#9177C7',
	perplexity: '#21808D',
	grok: '#000000',
}

const names_legacy: Readonly<Record<string, string>> = {
	raindrop: 'Raindrop',
	vk: 'VKontakte',
}

const icons_legacy: Readonly<Partial<Record<string, {
	viewBox: string
	path: string
}>>> = {
	email: {
		viewBox: '0 0 24 24',
		path: [
			'M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6',
			'c0-1.1-.9-2-2-2m-.4 4.25l-6.54 4.09c-.65.41-1.47.41-2.12 0L4.4 8.25',
			'a.85.85 0 1 1 .9-1.44L12 11l6.7-4.19a.85.85 0 1 1 .9 1.44',
		].join(''),
	},
	raindrop: {
		viewBox: '0 0 48 48',
		path: [
			'M24 7.14c-3.65 0-7.3 1.4-10.06 4.17-2.23 2.22-3.56 5-4 7.9',
			'A11.3 11.3 0 0 0 3 29.6c0 6.2 5.05 11.25 11.25 11.25h19.5',
			'c6.2 0 11.25-5.05 11.25-11.24 0-4.67-2.87-8.7-6.94-10.39',
			'a14 14 0 0 0-4-7.9v-.01A14.2 14.2 0 0 0 24 7.14m0 2.98',
			'c2.87 0 5.74 1.1 7.94 3.3v.01a11 11 0 0 1 2.9 4.98q-.53-.05-1.09-.05',
			'c-4.25 0-7.84 2.47-9.75 5.97a11.2 11.2 0 0 0-9.74-5.97l-.01-.01',
			'q-.56 0-1.1.05c.5-1.82 1.47-3.54 2.9-4.97h.01c2.2-2.2 5.07-3.3 7.94-3.3',
			'm-9.76 11.23a8.23 8.23 0 0 1 8.25 8.25v6.14l-6.44-6.44',
			'a11.2 11.2 0 0 1-3.3-7.82q.72-.12 1.48-.13m19.51 0q.77 0 1.5.14',
			'a11.2 11.2 0 0 1-3.3 7.8h-.01l-6.44 6.45V29.6a8.23 8.23 0 0 1 8.25-8.24',
			'M9.83 22.63a14 14 0 0 0 4.11 8.8l6.43 6.43h-6.12A8.23 8.23 0 0 1 6 29.6',
			'a8.2 8.2 0 0 1 3.83-6.98m28.34.01A8.2 8.2 0 0 1 42 29.61',
			'a8.23 8.23 0 0 1-8.25 8.25h-6.13l6.44-6.44a14 14 0 0 0 4.1-8.79',
		].join(''),
	},
}

function getLegacyCategory(
	category_provider: ShareProviderCategory,
): LegacySocialShareNetwork['category'] {
	if (category_provider === 'read-later') return 'bookmark'
	if (category_provider === 'communication') return 'messaging'
	if (category_provider === 'professional') return 'social'
	return category_provider
}

function getLegacyPath(body_icon: string): string {
	return [...body_icon.matchAll(/\sd="([^"]+)"/g)]
		.map(match_path => match_path[1])
		.filter(Boolean)
		.join(' ')
}

export function useSocialShare(
	options_share: LegacySocialShareOptions = options_default,
): ComputedRef<LegacySocialShareNetwork | null> {
	const route_share = useRoute()
	const request_url = useRequestURL()
	const config_runtime = useRuntimeConfig()
	const provider_share = getShareProvider(options_share.network)

	if (!provider_share) {
		console.warn(`[nuxt-sharekit] Network "${options_share.network}" is not valid.`)
		return computed(() => null)
	}

	return computed(() => {
		const config_legacy = (config_runtime.public.socialShare || {}) as {
			baseUrl?: string
		}
		const base_url = config_legacy.baseUrl || request_url.origin
		const url_share = options_share.url
			? new URL(options_share.url, base_url).href
			: new URL(route_share.fullPath, base_url).href
		const payload_share: SharePayload = { url: url_share }
		const hashtags_share = options_share.hashtags
			?.split(',')
			.map(tag => tag.trim())
			.filter(Boolean)
		if (options_share.title) {
			payload_share.title = options_share.title
			payload_share.text = options_share.title
		}
		if (options_share.image) payload_share.media = options_share.image
		if (hashtags_share?.length) payload_share.hashtags = hashtags_share
		if (options_share.user) payload_share.via = options_share.user
		if (options_share.prompt) payload_share.prompt = options_share.prompt

		const intent_share = createShareIntent(provider_share.id, payload_share)
		const icon_provider = providerIcons[provider_share.icon]
		const icon_legacy = icons_legacy[provider_share.id] || (icon_provider && {
			viewBox: icon_provider.viewBox,
			path: getLegacyPath(icon_provider.body),
		})

		if (!intent_share || !icon_legacy) return null

		return {
			name: names_legacy[provider_share.id] || provider_share.label,
			shareUrl: intent_share.url,
			icon: icon_legacy,
			color: colors_legacy[provider_share.id] || '#176b4d',
			category: getLegacyCategory(provider_share.category),
			target: intent_share.target,
		}
	})
}
