import {
	addComponent,
	addImports,
	createResolver,
	defineNuxtModule,
} from '@nuxt/kit'
import type { NuxtModule } from '@nuxt/schema'

export interface ModuleOptions {
	componentPrefix: string
	styled: boolean
	baseUrl: string
	label: boolean
	icon: boolean
	compatibility: boolean
}

export interface LegacySocialShareOptions {
	baseUrl?: string
	styled?: boolean
	label?: boolean
	icon?: boolean
}

declare module '@nuxt/schema' {
	interface NuxtConfig {
		shareKit?: Partial<ModuleOptions>
		socialShare?: LegacySocialShareOptions
	}

	interface NuxtOptions {
		shareKit: ModuleOptions
		socialShare?: LegacySocialShareOptions
	}
}

const module_sharekit: NuxtModule<ModuleOptions> = defineNuxtModule<ModuleOptions>({
	meta: {
		name: 'nuxt-sharekit',
		configKey: 'shareKit',
		compatibility: {
			nuxt: '>=4.0.0',
		},
	},
	defaults: {
		componentPrefix: 'Share',
		styled: true,
		baseUrl: '',
		label: true,
		icon: true,
		compatibility: true,
	},
	setup(options_module, nuxt) {
		const resolver_module = createResolver(import.meta.url)
		const components_share = ['Button', 'Group', 'Link', 'Menu', 'Qr'] as const
		const options_legacy = nuxt.options.socialShare || {}
		const options_runtime = {
			baseUrl: options_legacy.baseUrl ?? options_module.baseUrl,
			styled: options_legacy.styled ?? false,
			label: options_legacy.label ?? options_module.label,
			icon: options_legacy.icon ?? options_module.icon,
		}

		nuxt.options.runtimeConfig.public.shareKit = {
			...((nuxt.options.runtimeConfig.public.shareKit || {}) as object),
			baseUrl: options_module.baseUrl,
			styled: options_module.styled,
			label: options_module.label,
			icon: options_module.icon,
		}
		nuxt.options.runtimeConfig.public.socialShare = {
			...((nuxt.options.runtimeConfig.public.socialShare || {}) as object),
			...options_runtime,
		}

		for (const name_component of components_share) {
			addComponent({
				name: `${options_module.componentPrefix}${name_component}`,
				filePath: resolver_module.resolve(
					`runtime/components/Share${name_component}.vue`,
				),
			})
		}

		if (options_module.compatibility) {
			addComponent({
				name: 'SocialShare',
				filePath: resolver_module.resolve('runtime/components/SocialShare.vue'),
			})
		}

		addImports({
			name: 'useShare',
			as: 'useShare',
			from: resolver_module.resolve('runtime/composables/useShare'),
		})
		if (options_module.compatibility) {
			addImports({
				name: 'useSocialShare',
				as: 'useSocialShare',
				from: resolver_module.resolve('runtime/composables/useSocialShare'),
			})
		}

		if (options_module.styled) {
			nuxt.options.css.push(resolver_module.resolve('runtime/sharekit.css'))
		}
	},
})

export default module_sharekit
