import { createConfigForNuxt } from '@nuxt/eslint-config/flat'

export default createConfigForNuxt({
	features: {
		stylistic: {
			indent: 'tab',
			quotes: 'single',
			semi: false,
		},
	},
}).append(
	{
		ignores: [
			'**/.nuxt/**',
			'**/.output/**',
			'**/dist/**',
			'**/coverage/**',
		],
	},
	{
		files: ['packages/nuxt/src/runtime/provider-icons.ts'],
		rules: {
			'@stylistic/comma-dangle': 'off',
			'@stylistic/quote-props': 'off',
			'@stylistic/quotes': 'off',
		},
	},
)
