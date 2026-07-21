<script setup lang="ts">
import { getSharePreset } from '@nuxt-sharekit/core'
import type {
	ShareActionResult,
	SharePayload,
} from '@nuxt-sharekit/core'
import { nextTick, ref } from 'vue'
import { useShare } from '../composables/useShare'
import ProviderIcon from './ProviderIcon.vue'

const props = withDefaults(defineProps<{
	payload: SharePayload
	providers?: readonly string[]
	label?: string
	unstyled?: boolean
}>(), {
	providers: () => getSharePreset('recommended') ?? [],
	label: 'Open share menu',
	unstyled: false,
})

const emit = defineEmits<{
	result: [result: ShareActionResult]
}>()

const share = useShare(() => props.payload)
const details_menu = ref<HTMLDetailsElement>()
const trigger_menu = ref<HTMLElement>()
const pointer_pressed = ref(false)

async function closeMenu(): Promise<void> {
	if (details_menu.value) details_menu.value.open = false
	await nextTick()
	trigger_menu.value?.focus()
}

async function handleProvider(id_provider: string): Promise<void> {
	await closeMenu()
	emit('result', await share.execute(id_provider))
}

async function handleCopy(): Promise<void> {
	await closeMenu()
	emit('result', await share.copy())
}

function handleKeydown(event_keyboard: KeyboardEvent): void {
	if (event_keyboard.key !== 'Escape' || !details_menu.value?.open) return
	event_keyboard.preventDefault()
	void closeMenu()
}
</script>

<template>
	<details
		ref="details_menu"
		:class="unstyled ? undefined : 'sharekit-menu-shell'"
		@keydown="handleKeydown"
	>
		<summary
			ref="trigger_menu"
			:aria-label="label"
			:class="unstyled ? undefined : 'sharekit-button sharekit-button--primary sharekit-menu__trigger'"
			:data-pointer-pressed="pointer_pressed || undefined"
			@pointerdown="pointer_pressed = true"
			@pointerup="pointer_pressed = false"
			@pointercancel="pointer_pressed = false"
			@pointerleave="pointer_pressed = false"
		>
			<slot name="trigger">
				<span>Share</span>
				<span aria-hidden="true">⌄</span>
			</slot>
		</summary>

		<div
			:class="unstyled ? undefined : 'sharekit-menu'"
			role="group"
			aria-label="Share with"
		>
			<p :class="unstyled ? undefined : 'sharekit-menu__label'">
				Share with
			</p>
			<button
				v-for="id_provider in providers"
				:key="id_provider"
				type="button"
				:class="unstyled ? undefined : 'sharekit-menu__item'"
				:disabled="share.status.value === 'pending'"
				@click="handleProvider(id_provider)"
			>
				<slot
					name="item"
					:provider="share.getProvider(id_provider)"
				>
					<ProviderIcon
						v-if="share.getProvider(id_provider)"
						class="sharekit-button__icon"
						:name="share.getProvider(id_provider)!.icon"
						:fallback="share.getProvider(id_provider)!.label"
					/>
					<span>{{ share.getProvider(id_provider)?.label }}</span>
				</slot>
			</button>
			<div :class="unstyled ? undefined : 'sharekit-menu__separator'" />
			<button
				type="button"
				:class="unstyled ? undefined : 'sharekit-menu__item'"
				:disabled="share.status.value === 'pending'"
				@click="handleCopy"
			>
				Copy link
			</button>
		</div>

		<span
			class="sharekit-sr-only"
			aria-live="polite"
		>
			{{ share.message.value }}
		</span>
	</details>
</template>
