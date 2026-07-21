import type {
	ShareField,
	ShareIntent,
	ShareIntentTarget,
	SharePayload,
	ShareProvider,
	ShareProviderCategory,
	ShareProviderStatus,
} from './types.js'

interface ProviderDefinition {
	id: string
	label: string
	category: ShareProviderCategory
	icon: string
	fields: readonly ShareField[]
	fallback?: ShareProvider['fallback']
	status?: ShareProviderStatus
	verifiedAt?: string
	target?: ShareIntentTarget
	buildUrl: (payload: SharePayload) => string
}

function normalizeOptional(value_input: string | undefined): string | undefined {
	const value_normalized = value_input?.trim()
	return value_normalized || undefined
}

function resolveWebUrl(value_input: string, base_url?: string, label = 'Share URLs'): string {
	let url_resolved: URL

	try {
		url_resolved = new URL(value_input, base_url)
	}
	catch {
		throw new TypeError(`${label} must be valid URLs`)
	}

	if (!['http:', 'https:'].includes(url_resolved.protocol)) {
		throw new TypeError(`${label} must use http or https`)
	}

	return url_resolved.toString()
}

export function normalizeSharePayload(
	payload_input: SharePayload,
	base_url?: string,
): SharePayload {
	const payload_normalized: SharePayload = {
		url: resolveWebUrl(payload_input.url, base_url),
	}
	const title_normalized = normalizeOptional(payload_input.title)
	const text_normalized = normalizeOptional(payload_input.text)
	const media_normalized = normalizeOptional(payload_input.media)
	const via_normalized = normalizeOptional(payload_input.via)?.replace(/^@+/, '')
	const instance_normalized = normalizeOptional(payload_input.instance)
	const prompt_normalized = normalizeOptional(payload_input.prompt)
	const hashtags_normalized = [
		...new Set(
			(payload_input.hashtags ?? [])
				.map(tag => tag.trim().replace(/^#+/, ''))
				.filter(Boolean),
		),
	]

	if (title_normalized) payload_normalized.title = title_normalized
	if (text_normalized) payload_normalized.text = text_normalized
	if (media_normalized) {
		payload_normalized.media = resolveWebUrl(media_normalized, base_url, 'Media URLs')
	}
	if (hashtags_normalized.length) payload_normalized.hashtags = hashtags_normalized
	if (via_normalized) payload_normalized.via = via_normalized
	if (instance_normalized) payload_normalized.instance = instance_normalized
	if (prompt_normalized) payload_normalized.prompt = prompt_normalized

	return payload_normalized
}

function createWebIntentUrl(endpoint: string, params_input: Record<string, string | undefined>) {
	const url_intent = new URL(endpoint)

	for (const [name_param, value_param] of Object.entries(params_input)) {
		if (value_param) url_intent.searchParams.set(name_param, value_param)
	}

	return url_intent.toString()
}

function composeShareText(payload: SharePayload, include_url = true): string {
	return [payload.text || payload.title, include_url ? payload.url : undefined]
		.filter(Boolean)
		.join('\n')
}

function composeAiPrompt(payload: SharePayload): string {
	const prompt_default = 'Read this page so I can ask questions about it:'
	return `${payload.prompt || prompt_default} ${payload.url}`
}

function defineProvider(definition: ProviderDefinition): ShareProvider {
	return {
		id: definition.id,
		label: definition.label,
		category: definition.category,
		icon: definition.icon,
		fields: definition.fields,
		fallback: definition.fallback ?? 'copy',
		status: definition.status ?? 'active',
		verifiedAt: definition.verifiedAt ?? '2026-07-21',
		buildIntent(payload) {
			return {
				providerId: definition.id,
				url: definition.buildUrl(payload),
				target: definition.target ?? 'popup',
			}
		},
	}
}

export const shareProviders: readonly ShareProvider[] = [
	defineProvider({
		id: 'facebook',
		label: 'Facebook',
		category: 'social',
		icon: 'simple-icons:facebook',
		fields: ['url'],
		buildUrl: payload => createWebIntentUrl(
			'https://www.facebook.com/sharer/sharer.php',
			{ u: payload.url },
		),
	}),
	defineProvider({
		id: 'x',
		label: 'X',
		category: 'social',
		icon: 'simple-icons:x',
		fields: ['url', 'text', 'hashtags', 'via'],
		buildUrl: payload => createWebIntentUrl('https://x.com/intent/tweet', {
			url: payload.url,
			text: payload.text || payload.title,
			hashtags: payload.hashtags?.join(','),
			via: payload.via,
		}),
	}),
	defineProvider({
		id: 'linkedin',
		label: 'LinkedIn',
		category: 'professional',
		icon: 'simple-icons:linkedin',
		fields: ['url'],
		buildUrl: payload => createWebIntentUrl(
			'https://www.linkedin.com/sharing/share-offsite/',
			{ url: payload.url },
		),
	}),
	defineProvider({
		id: 'pinterest',
		label: 'Pinterest',
		category: 'social',
		icon: 'simple-icons:pinterest',
		fields: ['url', 'text', 'media'],
		buildUrl: payload => createWebIntentUrl(
			'https://pinterest.com/pin/create/button/',
			{
				url: payload.url,
				description: payload.text || payload.title,
				media: payload.media,
			},
		),
	}),
	defineProvider({
		id: 'reddit',
		label: 'Reddit',
		category: 'social',
		icon: 'simple-icons:reddit',
		fields: ['url', 'title'],
		buildUrl: payload => createWebIntentUrl('https://www.reddit.com/submit', {
			url: payload.url,
			title: payload.title || payload.text,
		}),
	}),
	defineProvider({
		id: 'threads',
		label: 'Threads',
		category: 'social',
		icon: 'simple-icons:threads',
		fields: ['url', 'text'],
		buildUrl: payload => createWebIntentUrl('https://www.threads.com/intent/post', {
			text: composeShareText(payload),
		}),
	}),
	defineProvider({
		id: 'bluesky',
		label: 'Bluesky',
		category: 'social',
		icon: 'simple-icons:bluesky',
		fields: ['url', 'text'],
		buildUrl: payload => createWebIntentUrl('https://bsky.app/intent/compose', {
			text: composeShareText(payload),
		}),
	}),
	defineProvider({
		id: 'mastodon',
		label: 'Mastodon',
		category: 'social',
		icon: 'simple-icons:mastodon',
		fields: ['url', 'text', 'instance'],
		status: 'setup-required',
		buildUrl(payload) {
			if (!payload.instance) throw new TypeError('Mastodon requires an instance URL')

			const instance_url = resolveWebUrl(
				payload.instance,
				undefined,
				'Mastodon instances',
			)
			return createWebIntentUrl(new URL('/share', instance_url).toString(), {
				text: composeShareText(payload),
			})
		},
	}),
	defineProvider({
		id: 'tumblr',
		label: 'Tumblr',
		category: 'social',
		icon: 'simple-icons:tumblr',
		fields: ['url', 'title', 'text'],
		buildUrl: payload => createWebIntentUrl(
			'https://www.tumblr.com/widgets/share/tool',
			{
				canonicalUrl: payload.url,
				title: payload.title,
				caption: payload.text,
			},
		),
	}),
	defineProvider({
		id: 'hackernews',
		label: 'Hacker News',
		category: 'social',
		icon: 'simple-icons:ycombinator',
		fields: ['url', 'title'],
		buildUrl: payload => createWebIntentUrl(
			'https://news.ycombinator.com/submitlink',
			{ u: payload.url, t: payload.title || payload.text },
		),
	}),
	defineProvider({
		id: 'whatsapp',
		label: 'WhatsApp',
		category: 'messaging',
		icon: 'simple-icons:whatsapp',
		fields: ['url', 'text'],
		buildUrl: payload => createWebIntentUrl('https://api.whatsapp.com/send', {
			text: composeShareText(payload),
		}),
	}),
	defineProvider({
		id: 'telegram',
		label: 'Telegram',
		category: 'messaging',
		icon: 'simple-icons:telegram',
		fields: ['url', 'text'],
		buildUrl: payload => createWebIntentUrl('https://t.me/share/url', {
			url: payload.url,
			text: payload.text || payload.title,
		}),
	}),
	defineProvider({
		id: 'line',
		label: 'LINE',
		category: 'messaging',
		icon: 'simple-icons:line',
		fields: ['url'],
		buildUrl: payload => createWebIntentUrl(
			'https://social-plugins.line.me/lineit/share',
			{ url: payload.url },
		),
	}),
	defineProvider({
		id: 'viber',
		label: 'Viber',
		category: 'messaging',
		icon: 'simple-icons:viber',
		fields: ['url', 'title', 'text'],
		target: 'same-tab',
		buildUrl: payload => createWebIntentUrl('viber://forward', {
			text: composeShareText(payload),
		}),
	}),
	defineProvider({
		id: 'email',
		label: 'Email',
		category: 'communication',
		icon: 'lucide:mail',
		fields: ['url', 'title', 'text'],
		target: 'same-tab',
		buildUrl(payload) {
			const params_email = new URLSearchParams({
				subject: payload.title ?? '',
				body: composeShareText(payload),
			})
			return `mailto:?${params_email}`
		},
	}),
	defineProvider({
		id: 'sms',
		label: 'SMS',
		category: 'communication',
		icon: 'lucide:message-square',
		fields: ['url', 'text'],
		target: 'same-tab',
		buildUrl(payload) {
			return `sms:?${new URLSearchParams({ body: composeShareText(payload) })}`
		},
	}),
	defineProvider({
		id: 'weibo',
		label: 'Weibo',
		category: 'social',
		icon: 'simple-icons:sinaweibo',
		fields: ['url', 'title', 'media'],
		buildUrl: payload => createWebIntentUrl(
			'https://service.weibo.com/share/share.php',
			{ url: payload.url, title: payload.title || payload.text, pic: payload.media },
		),
	}),
	defineProvider({
		id: 'qzone',
		label: 'Qzone',
		category: 'social',
		icon: 'simple-icons:qzone',
		fields: ['url', 'title', 'text', 'media'],
		buildUrl: payload => createWebIntentUrl(
			'https://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey',
			{
				url: payload.url,
				title: payload.title,
				summary: payload.text,
				pics: payload.media,
			},
		),
	}),
	defineProvider({
		id: 'vk',
		label: 'VK',
		category: 'social',
		icon: 'simple-icons:vk',
		fields: ['url', 'title', 'text', 'media'],
		buildUrl: payload => createWebIntentUrl('https://vk.com/share.php', {
			url: payload.url,
			title: payload.title,
			description: payload.text,
			image: payload.media,
		}),
	}),
	defineProvider({
		id: 'xing',
		label: 'Xing',
		category: 'professional',
		icon: 'simple-icons:xing',
		fields: ['url'],
		buildUrl: payload => createWebIntentUrl('https://www.xing.com/social/share/spi', {
			url: payload.url,
		}),
	}),
	defineProvider({
		id: 'instapaper',
		label: 'Instapaper',
		category: 'read-later',
		icon: 'simple-icons:instapaper',
		fields: ['url', 'title', 'text'],
		buildUrl: payload => createWebIntentUrl('https://www.instapaper.com/edit', {
			url: payload.url,
			title: payload.title,
			description: payload.text,
		}),
	}),
	defineProvider({
		id: 'raindrop',
		label: 'Raindrop.io',
		category: 'read-later',
		icon: 'lucide:bookmark',
		fields: ['url', 'title'],
		buildUrl: payload => createWebIntentUrl('https://app.raindrop.io/add', {
			link: payload.url,
			title: payload.title,
		}),
	}),
	defineProvider({
		id: 'chatgpt',
		label: 'ChatGPT',
		category: 'ai',
		icon: 'simple-icons:openai',
		fields: ['url', 'prompt'],
		buildUrl: payload => createWebIntentUrl('https://chatgpt.com/', {
			prompt: composeAiPrompt(payload),
		}),
	}),
	defineProvider({
		id: 'claude',
		label: 'Claude',
		category: 'ai',
		icon: 'simple-icons:claude',
		fields: ['url', 'prompt'],
		buildUrl: payload => createWebIntentUrl('https://claude.ai/new', {
			q: composeAiPrompt(payload),
		}),
	}),
	defineProvider({
		id: 'gemini',
		label: 'Gemini',
		category: 'ai',
		icon: 'simple-icons:googlegemini',
		fields: ['url', 'prompt'],
		buildUrl: payload => createWebIntentUrl('https://www.google.com/search', {
			udm: '50',
			aep: '11',
			q: composeAiPrompt(payload),
		}),
	}),
	defineProvider({
		id: 'perplexity',
		label: 'Perplexity',
		category: 'ai',
		icon: 'simple-icons:perplexity',
		fields: ['url', 'prompt'],
		buildUrl: payload => createWebIntentUrl('https://www.perplexity.ai/search', {
			q: composeAiPrompt(payload),
		}),
	}),
	defineProvider({
		id: 'grok',
		label: 'Grok',
		category: 'ai',
		icon: 'simple-icons:x',
		fields: ['url', 'prompt'],
		buildUrl: payload => createWebIntentUrl('https://x.com/i/grok', {
			text: composeAiPrompt(payload),
		}),
	}),
]

export const shareProviderAliases: Readonly<Record<string, string>> = {
	twitter: 'x',
	vkontakte: 'vk',
}

const providers_by_id = new Map(shareProviders.map(provider => [provider.id, provider]))

for (const [id_alias, id_provider] of Object.entries(shareProviderAliases)) {
	const provider_share = providers_by_id.get(id_provider)
	if (provider_share) providers_by_id.set(id_alias, provider_share)
}

export function listShareProviders(): readonly ShareProvider[] {
	return shareProviders
}

export function getShareProvider(id_provider: string): ShareProvider | undefined {
	return providers_by_id.get(id_provider)
}

export function createShareIntent(
	id_provider: string,
	payload_input: SharePayload,
	base_url?: string,
): ShareIntent | undefined {
	const provider_share = getShareProvider(id_provider)
	if (!provider_share) return undefined

	return provider_share.buildIntent(normalizeSharePayload(payload_input, base_url))
}
