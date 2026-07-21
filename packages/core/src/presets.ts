import { shareProviders } from './providers.js'

export type SharePresetName = 'recommended' | 'messaging' | 'all'

export const sharePresets: Readonly<Record<SharePresetName, readonly string[]>> = {
	recommended: ['x', 'linkedin', 'bluesky', 'whatsapp', 'email'],
	messaging: ['whatsapp', 'telegram', 'line', 'email', 'sms'],
	all: shareProviders.map(provider => provider.id),
}

export function getSharePreset(name_preset: string): readonly string[] | undefined {
	return sharePresets[name_preset as SharePresetName]
}
