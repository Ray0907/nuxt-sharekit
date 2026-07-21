<script setup lang="ts">
import { getShareProvider } from '@nuxt-sharekit/core'
import type { SharePayload } from '@nuxt-sharekit/core'
import {
	computed,
	useRequestURL,
	useRoute,
	useRuntimeConfig,
} from '#imports'
import ShareLink from './ShareLink.vue'

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
}>(), {
	rel: 'nofollow noopener noreferrer',
})

const route_share = useRoute()
const request_url = useRequestURL()
const config_runtime = useRuntimeConfig()
const options_runtime = computed(() => (
	(config_runtime.public.socialShare || {}) as ShareKitRuntimeOptions
))
const provider_share = computed(() => getShareProvider(props.network))
const is_styled = computed(() => props.styled ?? options_runtime.value.styled ?? true)
const has_label = computed(() => props.label ?? options_runtime.value.label ?? true)
const has_icon = computed(() => props.icon ?? options_runtime.value.icon ?? true)
const url_share = computed(() => {
	const base_url = options_runtime.value.baseUrl || request_url.origin
	if (props.url) return new URL(props.url, base_url).href
	if (options_runtime.value.baseUrl) {
		return new URL(route_share.fullPath, options_runtime.value.baseUrl).href
	}
	return request_url.href
})
const payload_share = computed<SharePayload>(() => ({
	url: url_share.value,
	title: props.title,
	text: props.title,
	media: props.image,
	hashtags: props.hashtags?.split(',').map(tag => tag.trim()).filter(Boolean),
	via: props.user,
	prompt: props.prompt,
}))
const label_short = computed(() => {
	switch (provider_share.value?.category) {
		case 'messaging': return 'Send'
		case 'read-later': return 'Save'
		case 'ai': return 'Ask AI'
		default: return 'Share'
	}
})
const label_long = computed(() => {
	const name_provider = provider_share.value?.label || props.network
	switch (provider_share.value?.category) {
		case 'messaging': return `Send with ${name_provider}`
		case 'read-later': return `Save to ${name_provider}`
		case 'ai': return `Ask ${name_provider}`
		default: return `Share on ${name_provider}`
	}
})
</script>

<template>
	<ShareLink
		:provider="network"
		:payload="payload_share"
		:label="label_long"
		:rel="rel"
		:show-icon="has_icon"
		:show-label="has_label"
		:unstyled="!is_styled"
	>
		<template
			v-if="$slots.icon"
			#icon="slot_props"
		>
			<slot
				name="icon"
				v-bind="slot_props"
			/>
		</template>
		<template #default>
			<slot name="label">
				<span>{{ label_short }}</span>
			</slot>
		</template>
	</ShareLink>
</template>
