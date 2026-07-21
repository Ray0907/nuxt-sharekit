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
}

declare module '@nuxt/schema' {
	interface NuxtConfig {
		shareKit?: Partial<ModuleOptions>
	}

	interface NuxtOptions {
		shareKit: ModuleOptions
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
	},
	setup(options_module, nuxt) {
		const resolver_module = createResolver(import.meta.url)
		const components_share = ['Button', 'Group', 'Menu', 'Qr'] as const

		for (const name_component of components_share) {
			addComponent({
				name: `${options_module.componentPrefix}${name_component}`,
				filePath: resolver_module.resolve(
					`runtime/components/Share${name_component}.vue`,
				),
			})
		}

		addImports({
			name: 'useShare',
			as: 'useShare',
			from: resolver_module.resolve('runtime/composables/useShare'),
		})

		if (options_module.styled) {
			nuxt.options.css.push(resolver_module.resolve('runtime/sharekit.css'))
		}
	},
})

export default module_sharekit
