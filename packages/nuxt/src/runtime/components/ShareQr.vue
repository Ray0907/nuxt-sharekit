<script setup lang="ts">
import {
	normalizeSharePayload,
} from '@nuxt-sharekit/core'
import type { SharePayload } from '@nuxt-sharekit/core'
import { encode } from 'uqr'
import { computed } from 'vue'

const props = withDefaults(defineProps<{
	payload: SharePayload
	label?: string
	size?: number
	unstyled?: boolean
}>(), {
	size: 192,
	unstyled: false,
})

const border_qr = 4
const code_qr = computed(() => encode(normalizeSharePayload(props.payload).url))
const size_viewbox = computed(() => code_qr.value.size + border_qr * 2)
const label_qr = computed(() => (
	props.label ?? `QR code for ${props.payload.title || props.payload.url}`
))
const path_qr = computed(() => {
	const commands_path: string[] = []

	for (let index_y = 0; index_y < code_qr.value.data.length; index_y += 1) {
		const row_qr = code_qr.value.data[index_y]
		if (!row_qr) continue

		for (let index_x = 0; index_x < row_qr.length; index_x += 1) {
			if (!row_qr[index_x]) continue
			commands_path.push(
				`M${index_x + border_qr} ${index_y + border_qr}h1v1h-1z`,
			)
		}
	}

	return commands_path.join('')
})
</script>

<template>
	<figure :class="unstyled ? undefined : 'sharekit-qr'">
		<svg
			:width="size"
			:height="size"
			:viewBox="`0 0 ${size_viewbox} ${size_viewbox}`"
			role="img"
			:aria-label="label_qr"
			shape-rendering="crispEdges"
		>
			<rect
				width="100%"
				height="100%"
				fill="white"
			/>
			<path
				:d="path_qr"
				fill="oklch(0.16 0.02 260)"
			/>
		</svg>
		<figcaption class="sharekit-sr-only">
			{{ label_qr }}
		</figcaption>
	</figure>
</template>
