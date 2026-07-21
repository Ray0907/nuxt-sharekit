export {
	createShareIntent,
	getShareProvider,
	listShareProviders,
	normalizeSharePayload,
	shareProviderAliases,
	shareProviders,
} from './providers.js'

export {
	copyShareUrl,
	openShareIntent,
	shareNatively,
} from './actions.js'

export {
	createShareRegistry,
	defineShareProvider,
} from './custom.js'

export {
	getSharePreset,
	sharePresets,
} from './presets.js'

export type {
	ShareFallback,
	ShareField,
	ShareIntent,
	ShareIntentTarget,
	SharePayload,
	ShareProvider,
	ShareProviderCategory,
	ShareProviderStatus,
} from './types.js'

export type {
	ClipboardAdapter,
	IntentAdapter,
	NativeShareAdapter,
	ShareActionMethod,
	ShareActionResult,
	ShareActionStatus,
} from './actions.js'

export type {
	ShareProviderDefinition,
	ShareRegistry,
} from './custom.js'

export type { SharePresetName } from './presets.js'
