import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
	modules: ['nuxt-sharekit'],
	devtools: { enabled: true },
	compatibilityDate: '2026-07-21',
	shareKit: {
		componentPrefix: 'Share',
		styled: true,
	},
})
