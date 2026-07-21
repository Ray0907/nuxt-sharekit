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
}

const colors_legacy: Readonly<Record<string, string>> = {
	facebook: '#0866ff',
	x: '#000000',
	linkedin: '#0a66c2',
	pinterest: '#bd081c',
	reddit: '#ff4500',
	bluesky: '#1185fe',
	threads: '#000000',
	mastodon: '#6364ff',
	vk: '#0077ff',
	xing: '#0698a0',
	tumblr: '#001f38',
	hackernews: '#f0652f',
	whatsapp: '#25d366',
	telegram: '#26a5e4',
	line: '#06c655',
	viber: '#7360f2',
	email: '#7e7e7e',
	instapaper: '#1f1f1f',
	raindrop: '#0b7ed0',
	chatgpt: '#0d0d0d',
	claude: '#d97757',
	gemini: '#9177c7',
	perplexity: '#21808d',
	grok: '#000000',
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
	options_share: LegacySocialShareOptions,
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

		if (!intent_share || !icon_provider) return null

		return {
			name: provider_share.id === 'vk' ? 'VKontakte' : provider_share.label,
			shareUrl: intent_share.url,
			icon: {
				viewBox: icon_provider.viewBox,
				path: getLegacyPath(icon_provider.body),
			},
			color: colors_legacy[provider_share.id] || '#176b4d',
			category: getLegacyCategory(provider_share.category),
		}
	})
}
