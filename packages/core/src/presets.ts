import { shareProviders } from './providers.js'

export type SharePresetName = 'recommended' | 'messaging' | 'ask-ai' | 'all'

export const sharePresets: Readonly<Record<SharePresetName, readonly string[]>> = {
	'recommended': ['x', 'linkedin', 'bluesky', 'whatsapp', 'email'],
	'messaging': ['whatsapp', 'telegram', 'line', 'viber', 'email', 'sms'],
	'ask-ai': ['chatgpt', 'claude', 'gemini', 'perplexity', 'grok'],
	'all': shareProviders.map(provider => provider.id),
}

export function getSharePreset(name_preset: string): readonly string[] | undefined {
	return sharePresets[name_preset as SharePresetName]
}
