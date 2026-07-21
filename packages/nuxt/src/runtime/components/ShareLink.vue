<script setup lang="ts">
import {
	createShareRegistry,
} from '@nuxt-sharekit/core'
import type {
	SharePayload,
	ShareProvider,
} from '@nuxt-sharekit/core'
import { computed } from 'vue'
import ProviderIcon from './ProviderIcon.vue'

const props = withDefaults(defineProps<{
	provider: string
	payload: SharePayload
	providerDefinition?: ShareProvider
	baseUrl?: string
	label?: string
	rel?: string
	showIcon?: boolean
	showLabel?: boolean
	unstyled?: boolean
}>(), {
	rel: 'nofollow noopener noreferrer',
	showIcon: true,
	showLabel: true,
	unstyled: false,
})

const registry_share = computed(() => createShareRegistry(
	props.providerDefinition ? [props.providerDefinition] : [],
))
const provider_share = computed(() => registry_share.value.get(props.provider))
const intent_share = computed(() => {
	try {
		return registry_share.value.createIntent(
			props.provider,
			props.payload,
			props.baseUrl,
		)
	}
	catch {
		return undefined
	}
})
const label_link = computed(() => (
	props.label || `Share on ${provider_share.value?.label || props.provider}`
))
</script>

<template>
	<a
		v-if="provider_share && intent_share"
		:data-provider="provider"
		:href="intent_share.url"
		:target="intent_share.target === 'popup' ? '_blank' : undefined"
		:rel="rel"
		:aria-label="label_link"
		:class="unstyled ? undefined : 'sharekit-button sharekit-link'"
	>
		<slot
			v-if="showIcon"
			name="icon"
			:provider="provider_share"
		>
			<ProviderIcon
				class="sharekit-button__icon"
				:name="provider_share.icon"
				:fallback="provider_share.label"
			/>
		</slot>
		<slot
			v-if="showLabel"
			:provider="provider_share"
		>
			<span>{{ provider_share.label }}</span>
		</slot>
	</a>
	<span
		v-else
		aria-disabled="true"
		:class="unstyled ? undefined : 'sharekit-button'"
	>
		Unavailable
	</span>
</template>
