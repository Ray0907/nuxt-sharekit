<script setup lang="ts">
import type {
	ShareActionResult,
	SharePayload,
	ShareProvider,
} from '@nuxt-sharekit/core'
import { computed, ref } from 'vue'
import { useShare } from '../composables/useShare'
import ProviderIcon from './ProviderIcon.vue'

const props = withDefaults(defineProps<{
	provider: string
	payload: SharePayload
	providerDefinition?: ShareProvider
	label?: string
	disabled?: boolean
	unstyled?: boolean
}>(), {
	disabled: false,
	unstyled: false,
})

const emit = defineEmits<{
	result: [result: ShareActionResult]
}>()

const share = useShare(() => props.payload, {
	providers: props.providerDefinition ? [props.providerDefinition] : [],
})
const pointer_pressed = ref(false)
const provider_share = computed(() => share.getProvider(props.provider))
const label_button = computed(() => {
	if (props.label) return props.label
	if (!provider_share.value) return 'Unavailable provider'
	return `Share on ${provider_share.value.label}`
})
const disabled_button = computed(() => (
	props.disabled || !provider_share.value || share.status.value === 'pending'
))

function handlePointerDown(event_pointer: PointerEvent): void {
	if (event_pointer.pointerType !== 'mouse' || event_pointer.button === 0) {
		pointer_pressed.value = true
	}
}

function handlePointerEnd(): void {
	pointer_pressed.value = false
}

async function handleShare(): Promise<void> {
	const result_action = await share.execute(props.provider)
	emit('result', result_action)
}
</script>

<template>
	<span class="sharekit-control">
		<button
			type="button"
			:data-provider="provider"
			:data-pointer-pressed="pointer_pressed || undefined"
			:class="unstyled ? undefined : 'sharekit-button'"
			:aria-label="label_button"
			:aria-busy="share.status.value === 'pending' || undefined"
			:disabled="disabled_button"
			@pointerdown="handlePointerDown"
			@pointerup="handlePointerEnd"
			@pointercancel="handlePointerEnd"
			@pointerleave="handlePointerEnd"
			@click="handleShare"
		>
			<slot
				name="icon"
				:provider="provider_share"
			>
				<ProviderIcon
					v-if="provider_share"
					class="sharekit-button__icon"
					:name="provider_share.icon"
					:fallback="provider_share.label"
				/>
			</slot>
			<slot
				v-if="provider_share"
				:provider="provider_share"
				:pending="share.status.value === 'pending'"
			>
				<span>{{ provider_share.label }}</span>
			</slot>
			<span v-else>Unavailable</span>
		</button>
		<span
			class="sharekit-sr-only"
			aria-live="polite"
		>
			{{ share.message.value }}
		</span>
	</span>
</template>
