import {
	copyShareUrl,
	createShareRegistry,
	openShareIntent,
	shareNatively,
} from '@nuxt-sharekit/core'
import type {
	ClipboardAdapter,
	IntentAdapter,
	NativeShareAdapter,
	ShareActionResult,
	SharePayload,
	ShareProvider,
} from '@nuxt-sharekit/core'
import {
	computed,
	ref,
	toValue,
} from 'vue'
import type {
	MaybeRefOrGetter,
	Ref,
} from 'vue'

export type ShareRuntimeStatus = 'idle' | 'pending' | ShareActionResult['status']

export interface UseShareOptions {
	baseUrl?: MaybeRefOrGetter<string | undefined>
	providers?: readonly ShareProvider[]
}

export interface UseShareReturn {
	status: Ref<ShareRuntimeStatus>
	result: Ref<ShareActionResult | undefined>
	message: Readonly<Ref<string>>
	getProvider: (id_provider: string) => ShareProvider | undefined
	execute: (id_provider: string) => Promise<ShareActionResult>
	copy: () => Promise<ShareActionResult>
	native: () => Promise<ShareActionResult>
	reset: () => void
}

const messages_by_status: Record<ShareRuntimeStatus, string> = {
	idle: '',
	pending: 'Preparing share options…',
	copied: 'Link copied',
	shared: 'Shared',
	opened: 'Share window opened',
	cancelled: 'Share cancelled',
	blocked: 'Pop-up blocked. Copy the link instead.',
	unsupported: 'Sharing is not supported in this browser.',
	failed: 'Sharing failed. Try copying the link.',
}

function createNativeData(payload_share: SharePayload): ShareData {
	const data_native: ShareData = { url: payload_share.url }
	if (payload_share.title) data_native.title = payload_share.title
	if (payload_share.text) data_native.text = payload_share.text
	return data_native
}

function createFailedResult(id_provider?: string, error?: unknown): ShareActionResult {
	const result_action: ShareActionResult = {
		method: 'provider',
		status: 'failed',
	}
	if (id_provider) result_action.providerId = id_provider
	if (error) result_action.error = error
	return result_action
}

export function useShare(
	payload_input: MaybeRefOrGetter<SharePayload>,
	options_share: UseShareOptions = {},
): UseShareReturn {
	const registry_share = createShareRegistry(options_share.providers)
	const status_share = ref<ShareRuntimeStatus>('idle')
	const result_share = ref<ShareActionResult>()
	const message_share = computed(() => messages_by_status[status_share.value])

	function getPayload(): SharePayload {
		return toValue(payload_input)
	}

	function getBaseUrl(): string | undefined {
		return options_share.baseUrl ? toValue(options_share.baseUrl) : undefined
	}

	function setResult(result_action: ShareActionResult): ShareActionResult {
		result_share.value = result_action
		status_share.value = result_action.status
		return result_action
	}

	async function execute(id_provider: string): Promise<ShareActionResult> {
		status_share.value = 'pending'

		try {
			const intent_share = registry_share.createIntent(
				id_provider,
				getPayload(),
				getBaseUrl(),
			)
			if (!intent_share) return setResult(createFailedResult(id_provider))

			const adapter_intent: IntentAdapter = {}
			if (typeof window !== 'undefined') {
				adapter_intent.openPopup = (url, name, features) => (
					window.open(url, name, features)
				)
				adapter_intent.navigate = url => window.location.assign(url)
			}
			return setResult(openShareIntent(intent_share, adapter_intent))
		}
		catch (error) {
			return setResult(createFailedResult(id_provider, error))
		}
	}

	async function copy(): Promise<ShareActionResult> {
		status_share.value = 'pending'
		const adapter_clipboard: ClipboardAdapter = {}
		if (typeof navigator !== 'undefined' && navigator.clipboard) {
			adapter_clipboard.writeText = navigator.clipboard.writeText.bind(
				navigator.clipboard,
			)
		}
		const result_action = await copyShareUrl(
			getPayload(),
			adapter_clipboard,
			getBaseUrl(),
		)
		return setResult(result_action)
	}

	async function native(): Promise<ShareActionResult> {
		status_share.value = 'pending'
		const adapter_native: NativeShareAdapter = {}
		if (typeof navigator !== 'undefined' && navigator.canShare) {
			adapter_native.canShare = payload => navigator.canShare(
				createNativeData(payload),
			)
		}
		if (typeof navigator !== 'undefined' && navigator.share) {
			adapter_native.share = payload => navigator.share(createNativeData(payload))
		}
		const result_action = await shareNatively(
			getPayload(),
			adapter_native,
			getBaseUrl(),
		)
		return setResult(result_action)
	}

	function reset(): void {
		status_share.value = 'idle'
		result_share.value = undefined
	}

	return {
		status: status_share,
		result: result_share,
		message: message_share,
		getProvider: registry_share.get,
		execute,
		copy,
		native,
		reset,
	}
}
