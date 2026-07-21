import { createConfigForNuxt } from '@nuxt/eslint-config/flat'

export default createConfigForNuxt({
	features: {
		stylistic: {
			indent: 'tab',
			quotes: 'single',
			semi: false,
		},
	},
}).append({
	ignores: [
		'**/.nuxt/**',
		'**/.output/**',
		'**/dist/**',
		'**/coverage/**',
	],
})
