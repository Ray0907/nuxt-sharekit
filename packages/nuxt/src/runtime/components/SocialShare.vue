<script setup lang="ts">
import {
	computed,
	useRuntimeConfig,
} from '#imports'
import { useSocialShare } from '../composables/useSocialShare'

interface ShareKitRuntimeOptions {
	baseUrl?: string
	styled?: boolean
	label?: boolean
	icon?: boolean
}

const props = withDefaults(defineProps<{
	network: string
	styled?: boolean
	label?: boolean
	icon?: boolean
	url?: string
	title?: string
	user?: string
	hashtags?: string
	image?: string
	rel?: string
	prompt?: string
	popup?: boolean
	windowWidth?: number
	windowHeight?: number
}>(), {
	styled: undefined,
	label: undefined,
	icon: undefined,
	rel: 'nofollow noopener noreferrer',
	popup: false,
	windowWidth: 640,
	windowHeight: 560,
})

const emit = defineEmits<{
	share: [event: MouseEvent]
	blocked: []
}>()

function onShareClick(event: MouseEvent) {
	emit('share', event)
	if (event.defaultPrevented) return
	if (!props.popup) return
	const url_share = network_selected.value?.shareUrl
	if (!url_share || typeof window === 'undefined') return
	// Same-tab providers (email, sms, viber) resolve their scheme handler natively.
	if (network_selected.value?.target === 'same-tab') return

	event.preventDefault()
	const features_window = [
		'popup=yes',
		`width=${props.windowWidth}`,
		`height=${props.windowHeight}`,
	].join(',')
	const popup_share = window.open('', `nuxt-sharekit-${props.network}`, features_window)
	if (!popup_share) {
		emit('blocked')
		return
	}
	popup_share.opener = null
	popup_share.location.replace(url_share)
}

const config_runtime = useRuntimeConfig()
const options_runtime = computed(() => (
	(config_runtime.public.socialShare || {}) as ShareKitRuntimeOptions
))
const is_styled = computed(() => props.styled ?? options_runtime.value.styled ?? true)
const has_label = computed(() => props.label ?? options_runtime.value.label ?? true)
const has_icon = computed(() => props.icon ?? options_runtime.value.icon ?? true)
const network_selected = useSocialShare({
	network: props.network,
	url: props.url,
	title: props.title,
	user: props.user,
	hashtags: props.hashtags,
	image: props.image,
	prompt: props.prompt,
})
const label_short = computed(() => {
	switch (network_selected.value?.category) {
		case 'messaging': return 'Send'
		case 'bookmark': return 'Save'
		case 'ai': return 'Ask AI'
		default: return 'Share'
	}
})
const label_long = computed(() => {
	const name_provider = network_selected.value?.name || props.network
	switch (network_selected.value?.category) {
		case 'messaging': return `Send with ${name_provider}`
		case 'bookmark': return `Save to ${name_provider}`
		case 'ai': return `Ask ${name_provider}`
		default: return `Share on ${name_provider}`
	}
})
</script>

<template>
	<a
		v-if="network_selected"
		class="social-share-button"
		:class="[
			`social-share-button--${network}`,
			{ 'social-share-button--styled': is_styled },
		]"
		:href="network_selected.shareUrl"
		:style="{ '--color-brand': network_selected.color }"
		:aria-label="label_long"
		:rel="rel"
		target="_blank"
		@click="onShareClick"
	>
		<template v-if="has_icon">
			<slot name="icon">
				<svg
					class="social-share-button__icon"
					xmlns="http://www.w3.org/2000/svg"
					aria-hidden="true"
					role="img"
					width="1em"
					height="1em"
					:viewBox="network_selected.icon.viewBox"
				>
					<path
						fill="currentColor"
						fill-rule="evenodd"
						:d="network_selected.icon.path"
					/>
				</svg>
			</slot>
		</template>
		<span
			v-if="has_label"
			class="social-share-button__label"
		>
			<slot name="label">
				{{ label_short }}
			</slot>
		</span>
	</a>
</template>

<style>
@layer components {
	.social-share-button {
		display: flex;
		width: min-content;
		align-items: center;
		gap: 0.5em;
		text-decoration: none;
	}

	.social-share-button__icon {
		font-size: 1.5em;
	}

	.social-share-button--styled {
		--color-hover: color-mix(in srgb, var(--color-brand), #000 15%);
		padding: 0.5rem;
		border-radius: 0.25rem;
		background-color: var(--color-brand);
		color: white;
		font-size: 0.875rem;
		line-height: normal;
		transition:
			background-color 0.25s ease-out,
			transform 0.16s cubic-bezier(0.23, 1, 0.32, 1);
	}

	.social-share-button--styled:hover {
		background-color: var(--color-hover);
	}

	.social-share-button--styled:active {
		transform: scale(0.97);
	}

	@media (prefers-reduced-motion: reduce) {
		.social-share-button--styled {
			transition: background-color 0.25s ease-out;
		}

		.social-share-button--styled:active {
			transform: none;
		}
	}

	.social-share-button--styled:focus-visible {
		outline: 2px solid var(--color-brand);
		outline-offset: 2px;
	}

	.social-share-button--styled .social-share-button__label {
		padding: 0 0.5rem;
		white-space: nowrap;
	}
}
</style>
