export interface DocSection {
	title: string
	body: string
	items?: readonly string[]
	code?: string
}

export interface DocPage {
	slug: string
	title: string
	description: string
	sections: readonly DocSection[]
}

export const docs_pages: readonly DocPage[] = [
	{
		slug: 'overview',
		title: 'Overview',
		description: 'One typed share payload, styled components, and headless control.',
		sections: [
			{
				title: 'Why ShareKit',
				body: 'Social share URLs look simple until encoding, fallbacks, SSR, and provider drift meet a real design system.',
				items: [
					'Nuxt 4-only module with auto-registered components and composables.',
					'Framework-agnostic core with no Vue or browser dependency.',
					'WCAG 2.2 AA interaction contract and reduced-motion behavior.',
					'Broad provider registry with explicit capability metadata.',
				],
			},
			{
				title: 'Architecture',
				body: 'The core creates normalized share intents. The Nuxt adapter owns browser actions and accessible Vue components. This keeps future adapters possible without weakening the Nuxt experience.',
			},
		],
	},
	{
		slug: 'quickstart',
		title: 'Quickstart',
		description: 'Install the module and render a working share group in minutes.',
		sections: [
			{
				title: 'Install',
				body: 'Add the module with the Nuxt CLI. The command updates your Nuxt configuration.',
				code: 'pnpm dlx nuxi@latest module add nuxt-sharekit',
			},
			{
				title: 'Render a group',
				body: 'Pass one payload to every provider. Relative URLs can be resolved from the current page when using the composable.',
				code: `<script setup lang="ts">
const payload_share = {
\turl: 'https://example.com/launch',
\ttitle: 'Launch notes',
\ttext: 'A calmer sharing toolkit'
}
</script>

<template>
\t<ShareGroup :payload="payload_share" />
</template>`,
			},
		],
	},
	{
		slug: 'configuration',
		title: 'Configuration',
		description: 'Keep defaults, rename components, or install the runtime without styles.',
		sections: [
			{
				title: 'Module options',
				body: 'The module intentionally has a small configuration surface. Provider selection stays close to each component.',
				code: `export default defineNuxtConfig({
\tmodules: ['nuxt-sharekit'],
\tshareKit: {
\t\tcomponentPrefix: 'Share',
\t\tstyled: true
\t}
})`,
			},
			{
				title: 'No UI framework lock-in',
				body: 'Set styled to false to skip the package stylesheet. Nuxt UI, Tailwind, and Nuxt Content are not runtime dependencies.',
			},
		],
	},
	{
		slug: 'components',
		title: 'Components',
		description: 'Buttons, groups, QR, and an accessible Reka-powered share menu.',
		sections: [
			{
				title: 'ShareButton',
				body: 'Renders a native button, resolves the provider, opens a safe intent, and announces the result.',
				code: `<ShareButton
\tprovider="linkedin"
\t:payload="payload_share"
\t@result="handleResult"
/>
`,
			},
			{
				title: 'ShareGroup and ShareMenu',
				body: 'ShareGroup exposes provider slots and copy/native actions. ShareMenu uses Reka UI for focus management and menu keyboard behavior.',
			},
			{
				title: 'ShareQr',
				body: 'Generates an SSR-safe SVG QR code for the normalized share URL without adding a network provider.',
				code: '<ShareQr :payload="payload_share" :size="192" />',
			},
		],
	},
	{
		slug: 'composables',
		title: 'Composables',
		description: 'Use the same registry and action states in your own interface.',
		sections: [
			{
				title: 'useShare',
				body: 'The composable is SSR-safe and only reads browser APIs when an action runs.',
				code: `const share = useShare(() => payload_share)

await share.execute('bluesky')
await share.copy()
await share.native()

console.log(share.status.value)
console.log(share.message.value)`,
			},
			{
				title: 'Result states',
				body: 'Actions resolve to copied, shared, opened, cancelled, blocked, unsupported, or failed. They do not hide pop-up blockers or missing browser APIs.',
			},
		],
	},
	{
		slug: 'headless',
		title: 'Headless usage',
		description: 'Own every visual decision while preserving the provider engine.',
		sections: [
			{
				title: 'Unstyled components',
				body: 'Disable module CSS globally or pass unstyled to an individual component. Native semantics and accessible names remain.',
				code: `<ShareGroup
\t:payload="payload_share"
\t:providers="['x', 'linkedin', 'email']"
\tunstyled
>
\t<template #provider="{ provider, payload }">
\t\t<ShareButton
\t\t\t:provider="provider"
\t\t\t:payload="payload"
\t\t\tunstyled
\t\t/>
\t</template>
</ShareGroup>`,
			},
			{
				title: 'Semantic contract',
				body: 'If you replace the visuals, retain a 44px target, visible focus, a useful accessible name, and a live result announcement.',
			},
		],
	},
	{
		slug: 'custom-providers',
		title: 'Custom providers',
		description: 'Extend an isolated registry without patching global state.',
		sections: [
			{
				title: 'Define and register',
				body: 'Custom ids and generated URLs are validated. Duplicate built-in ids and javascript URLs are rejected.',
				code: `const provider_acme = defineShareProvider({
\tid: 'acme',
\tlabel: 'Acme Social',
\tcategory: 'social',
\ticon: 'lucide:send',
\tfields: ['url', 'text'],
\tbuildUrl: payload =>
\t\t\`https://share.acme.test/?url=\${encodeURIComponent(payload.url)}\`
})

const registry_share = createShareRegistry([provider_acme])`,
			},
			{
				title: 'Provider safety',
				body: 'Custom web intents must resolve to HTTP or HTTPS. Copy and native actions are separate APIs rather than custom networks.',
			},
		],
	},
	{
		slug: 'accessibility',
		title: 'Accessibility',
		description: 'WCAG 2.2 AA behavior is part of the component contract.',
		sections: [
			{
				title: 'Included behavior',
				body: 'ShareKit starts with native semantics and uses ARIA only where it clarifies state.',
				items: [
					'Keyboard-operable buttons and Reka-managed menu focus.',
					'Visible 3px focus rings and minimum 44px targets.',
					'Accessible names independent from provider icons.',
					'Polite announcements for success, cancellation, and failure.',
					'Reduced-motion styles that remove scale and popover movement.',
				],
			},
			{
				title: 'Your responsibility',
				body: 'Headless styling must preserve target size, contrast, focus appearance, reading order, and the meaning of result messages.',
			},
		],
	},
	{
		slug: 'api',
		title: 'API reference',
		description: 'Small typed primitives for providers, payloads, presets, and actions.',
		sections: [
			{
				title: 'Core exports',
				body: 'The core package can be used without Nuxt or Vue.',
				code: `import {
\tcreateShareIntent,
\tcreateShareRegistry,
\tdefineShareProvider,
\tgetSharePreset,
\tlistShareProviders,
\tnormalizeSharePayload
} from '@nuxt-sharekit/core'`,
			},
			{
				title: 'Nuxt exports',
				body: 'The module auto-imports useShare and registers ShareButton, ShareGroup, and ShareMenu with a configurable prefix.',
			},
		],
	},
]

export function getDocPage(slug_page: string): DocPage | undefined {
	return docs_pages.find(page_doc => page_doc.slug === slug_page)
}
