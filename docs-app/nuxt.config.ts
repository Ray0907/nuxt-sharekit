import tailwindcss from '@tailwindcss/vite'
import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
	modules: [
		'@nuxt/icon',
		'@nuxtjs/color-mode',
		'nuxt-sharekit',
	],
	devtools: { enabled: false },
	app: {
		head: {
			title: 'Nuxt ShareKit — sharing that fits your product',
			meta: [
				{
					name: 'description',
					content: 'Accessible and headless-friendly social sharing for Nuxt 4.',
				},
			],
		},
	},
	css: ['~/assets/css/main.css'],
	compatibilityDate: '2026-07-21',
	vite: {
		plugins: [tailwindcss()],
	},
	shareKit: {
		componentPrefix: 'Share',
		styled: true,
	},
})
