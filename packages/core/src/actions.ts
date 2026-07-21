import { normalizeSharePayload } from './providers.js'
import type { ShareIntent, SharePayload } from './types.js'

export type ShareActionMethod = 'copy' | 'native' | 'provider'
export type ShareActionStatus
	= | 'copied'
		| 'shared'
		| 'opened'
		| 'cancelled'
		| 'blocked'
		| 'unsupported'
		| 'failed'

export interface ShareActionResult {
	method: ShareActionMethod
	status: ShareActionStatus
	providerId?: string
	error?: unknown
}

export interface ClipboardAdapter {
	writeText?: (value_text: string) => Promise<void>
}

export interface NativeShareAdapter {
	canShare?: (payload: SharePayload) => boolean
	share?: (payload: SharePayload) => Promise<void>
}

export interface IntentAdapter {
	openPopup?: (
		url_intent: string,
		name_window: string,
		features_window: string,
	) => unknown | null
	navigate?: (url_intent: string) => void
}

export async function copyShareUrl(
	payload_input: SharePayload,
	adapter_clipboard: ClipboardAdapter,
	base_url?: string,
): Promise<ShareActionResult> {
	if (!adapter_clipboard.writeText) {
		return { method: 'copy', status: 'unsupported' }
	}

	try {
		const payload_share = normalizeSharePayload(payload_input, base_url)
		await adapter_clipboard.writeText(payload_share.url)
		return { method: 'copy', status: 'copied' }
	}
	catch (error) {
		return { method: 'copy', status: 'failed', error }
	}
}

export async function shareNatively(
	payload_input: SharePayload,
	adapter_native: NativeShareAdapter,
	base_url?: string,
): Promise<ShareActionResult> {
	if (!adapter_native.share) {
		return { method: 'native', status: 'unsupported' }
	}

	const payload_share = normalizeSharePayload(payload_input, base_url)
	if (adapter_native.canShare && !adapter_native.canShare(payload_share)) {
		return { method: 'native', status: 'unsupported' }
	}

	try {
		await adapter_native.share(payload_share)
		return { method: 'native', status: 'shared' }
	}
	catch (error) {
		if (error instanceof Error && error.name === 'AbortError') {
			return { method: 'native', status: 'cancelled' }
		}
		return { method: 'native', status: 'failed', error }
	}
}

export function openShareIntent(
	intent_share: ShareIntent,
	adapter_intent: IntentAdapter,
): ShareActionResult {
	if (intent_share.target === 'same-tab') {
		if (!adapter_intent.navigate) {
			return {
				method: 'provider',
				providerId: intent_share.providerId,
				status: 'unsupported',
			}
		}

		adapter_intent.navigate(intent_share.url)
		return {
			method: 'provider',
			providerId: intent_share.providerId,
			status: 'opened',
		}
	}

	if (!adapter_intent.openPopup) {
		return {
			method: 'provider',
			providerId: intent_share.providerId,
			status: 'unsupported',
		}
	}

	const popup_opened = adapter_intent.openPopup(
		intent_share.url,
		`nuxt-sharekit-${intent_share.providerId}`,
		'popup=yes,width=640,height=560',
	)

	return {
		method: 'provider',
		providerId: intent_share.providerId,
		status: popup_opened ? 'opened' : 'blocked',
	}
}
