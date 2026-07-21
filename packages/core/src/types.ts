export type ShareField
	= | 'url'
		| 'title'
		| 'text'
		| 'media'
		| 'hashtags'
		| 'via'
		| 'instance'
		| 'prompt'

export type ShareProviderCategory
	= | 'social'
		| 'professional'
		| 'messaging'
		| 'communication'
		| 'ai'
		| 'read-later'

export type ShareFallback = 'copy' | 'native' | 'none'
export type ShareIntentTarget = 'popup' | 'same-tab'
export type ShareProviderStatus = 'active' | 'setup-required'

export interface SharePayload {
	url: string
	title?: string
	text?: string
	media?: string
	hashtags?: readonly string[]
	via?: string
	instance?: string
	prompt?: string
}

export interface ShareIntent {
	providerId: string
	url: string
	target: ShareIntentTarget
}

export interface ShareProvider<TId extends string = string> {
	id: TId
	label: string
	category: ShareProviderCategory
	icon: string
	fields: readonly ShareField[]
	fallback: ShareFallback
	status: ShareProviderStatus
	verifiedAt: string
	buildIntent: (payload: SharePayload) => ShareIntent
}
