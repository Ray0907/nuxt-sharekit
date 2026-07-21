import {
	normalizeSharePayload,
	shareProviderAliases,
	shareProviders,
} from './providers.js'
import type {
	ShareIntent,
	ShareIntentTarget,
	SharePayload,
	ShareProvider,
} from './types.js'

export interface ShareProviderDefinition extends Omit<
	ShareProvider,
	'buildIntent' | 'fallback' | 'status' | 'verifiedAt'
> {
	fallback?: ShareProvider['fallback']
	status?: ShareProvider['status']
	verifiedAt?: string
	target?: ShareIntentTarget
	buildUrl: (payload: SharePayload) => string
}

export interface ShareRegistry {
	list: () => readonly ShareProvider[]
	get: (id_provider: string) => ShareProvider | undefined
	createIntent: (
		id_provider: string,
		payload: SharePayload,
		base_url?: string,
	) => ShareIntent | undefined
}

function validateProviderUrl(value_url: string): string {
	let url_intent: URL

	try {
		url_intent = new URL(value_url)
	}
	catch {
		throw new TypeError('Provider intent URLs must be valid URLs')
	}

	if (!['http:', 'https:'].includes(url_intent.protocol)) {
		throw new TypeError('Provider intent URLs must use http or https')
	}

	return url_intent.toString()
}

export function defineShareProvider(definition: ShareProviderDefinition): ShareProvider {
	if (!/^[a-z][a-z0-9-]*$/.test(definition.id)) {
		throw new TypeError('Provider ids must use lowercase letters, numbers, and hyphens')
	}
	if (!definition.label.trim()) {
		throw new TypeError('Provider labels are required')
	}
	if (!definition.icon.trim()) {
		throw new TypeError('Provider icons are required')
	}

	return {
		id: definition.id,
		label: definition.label.trim(),
		category: definition.category,
		icon: definition.icon,
		fields: [...definition.fields],
		fallback: definition.fallback ?? 'copy',
		status: definition.status ?? 'active',
		verifiedAt: definition.verifiedAt ?? new Date().toISOString().slice(0, 10),
		buildIntent(payload) {
			return {
				providerId: definition.id,
				url: validateProviderUrl(definition.buildUrl(payload)),
				target: definition.target ?? 'popup',
			}
		},
	}
}

export function createShareRegistry(
	providers_custom: readonly ShareProvider[] = [],
): ShareRegistry {
	const providers_all = [...shareProviders, ...providers_custom]
	const providers_by_id = new Map<string, ShareProvider>()

	for (const provider_share of providers_all) {
		if (providers_by_id.has(provider_share.id)) {
			throw new TypeError(`Duplicate provider id: ${provider_share.id}`)
		}
		providers_by_id.set(provider_share.id, provider_share)
	}

	for (const [id_alias, id_provider] of Object.entries(shareProviderAliases)) {
		if (providers_by_id.has(id_alias)) {
			throw new TypeError(`Duplicate provider id: ${id_alias}`)
		}
		const provider_share = providers_by_id.get(id_provider)
		if (provider_share) providers_by_id.set(id_alias, provider_share)
	}

	return {
		list: () => providers_all,
		get: id_provider => providers_by_id.get(id_provider),
		createIntent(id_provider, payload_input, base_url) {
			const provider_share = providers_by_id.get(id_provider)
			if (!provider_share) return undefined

			return provider_share.buildIntent(normalizeSharePayload(payload_input, base_url))
		},
	}
}
