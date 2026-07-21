<script setup lang="ts">
import { getSharePreset } from '@nuxt-sharekit/core'
import type {
	ShareActionResult,
	SharePayload,
} from '@nuxt-sharekit/core'
import { ref } from 'vue'
import { useShare } from '../composables/useShare'
import ShareButton from './ShareButton.vue'

const props = withDefaults(defineProps<{
	payload: SharePayload
	providers?: readonly string[]
	label?: string
	showCopy?: boolean
	showNative?: boolean
	unstyled?: boolean
}>(), {
	providers: () => getSharePreset('recommended') ?? [],
	label: 'Share this page',
	showCopy: true,
	showNative: true,
	unstyled: false,
})

const emit = defineEmits<{
	result: [result: ShareActionResult]
}>()

const share = useShare(() => props.payload)
const action_pressed = ref<'copy' | 'native'>()

function handlePointerDown(action_name: 'copy' | 'native'): void {
	action_pressed.value = action_name
}

function handlePointerEnd(): void {
	action_pressed.value = undefined
}

async function handleCopy(): Promise<void> {
	emit('result', await share.copy())
}

async function handleNative(): Promise<void> {
	emit('result', await share.native())
}
</script>

<template>
	<div
		role="group"
		:aria-label="label"
		:class="unstyled ? undefined : 'sharekit-group'"
	>
		<ul :class="unstyled ? undefined : 'sharekit-group__providers'">
			<li
				v-for="id_provider in providers"
				:key="id_provider"
			>
				<slot
					name="provider"
					:provider="id_provider"
					:payload="payload"
				>
					<ShareButton
						:provider="id_provider"
						:payload="payload"
						:unstyled="unstyled"
						@result="emit('result', $event)"
					/>
				</slot>
			</li>
		</ul>

		<div
			v-if="showCopy || showNative"
			:class="unstyled ? undefined : 'sharekit-group__actions'"
		>
			<button
				v-if="showCopy"
				type="button"
				:class="unstyled ? undefined : 'sharekit-button sharekit-button--quiet'"
				:data-pointer-pressed="action_pressed === 'copy' || undefined"
				:disabled="share.status.value === 'pending'"
				@pointerdown="handlePointerDown('copy')"
				@pointerup="handlePointerEnd"
				@pointercancel="handlePointerEnd"
				@pointerleave="handlePointerEnd"
				@click="handleCopy"
			>
				<span aria-hidden="true">↗</span>
				<span>Copy link</span>
			</button>
			<button
				v-if="showNative"
				type="button"
				:class="unstyled ? undefined : 'sharekit-button sharekit-button--primary'"
				:data-pointer-pressed="action_pressed === 'native' || undefined"
				:disabled="share.status.value === 'pending'"
				@pointerdown="handlePointerDown('native')"
				@pointerup="handlePointerEnd"
				@pointercancel="handlePointerEnd"
				@pointerleave="handlePointerEnd"
				@click="handleNative"
			>
				<span>More options</span>
			</button>
		</div>

		<span
			class="sharekit-sr-only"
			aria-live="polite"
		>
			{{ share.message.value }}
		</span>
	</div>
</template>
