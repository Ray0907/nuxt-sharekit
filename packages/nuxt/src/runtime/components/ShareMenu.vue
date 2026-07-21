<script setup lang="ts">
import { getSharePreset } from '@nuxt-sharekit/core'
import type {
	ShareActionResult,
	SharePayload,
} from '@nuxt-sharekit/core'
import {
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuPortal,
	DropdownMenuRoot,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from 'reka-ui'
import { ref } from 'vue'
import { useShare } from '../composables/useShare'

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
const pointer_pressed = ref(false)

async function handleProvider(id_provider: string): Promise<void> {
	emit('result', await share.execute(id_provider))
}

async function handleCopy(): Promise<void> {
	emit('result', await share.copy())
}
</script>

<template>
	<DropdownMenuRoot>
		<DropdownMenuTrigger as-child>
			<button
				type="button"
				:aria-label="label"
				:class="unstyled ? undefined : 'sharekit-button sharekit-button--primary'"
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
			</button>
		</DropdownMenuTrigger>

		<DropdownMenuPortal>
			<DropdownMenuContent
				:class="unstyled ? undefined : 'sharekit-menu'"
				:side-offset="8"
				align="end"
			>
				<DropdownMenuLabel :class="unstyled ? undefined : 'sharekit-menu__label'">
					Share with
				</DropdownMenuLabel>
				<DropdownMenuItem
					v-for="id_provider in providers"
					:key="id_provider"
					:class="unstyled ? undefined : 'sharekit-menu__item'"
					@select="handleProvider(id_provider)"
				>
					<slot
						name="item"
						:provider="share.getProvider(id_provider)"
					>
						<span
							class="sharekit-button__mark"
							aria-hidden="true"
						>
							{{ share.getProvider(id_provider)?.label.slice(0, 1) }}
						</span>
						<span>{{ share.getProvider(id_provider)?.label }}</span>
					</slot>
				</DropdownMenuItem>
				<DropdownMenuSeparator
					:class="unstyled ? undefined : 'sharekit-menu__separator'"
				/>
				<DropdownMenuItem
					:class="unstyled ? undefined : 'sharekit-menu__item'"
					@select="handleCopy"
				>
					Copy link
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenuPortal>

		<span
			class="sharekit-sr-only"
			aria-live="polite"
		>
			{{ share.message.value }}
		</span>
	</DropdownMenuRoot>
</template>
