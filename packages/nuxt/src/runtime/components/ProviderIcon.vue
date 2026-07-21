<script setup lang="ts">
import { computed } from 'vue'
import { providerIcons } from '../provider-icons'

const props = defineProps<{
	name: string
	fallback: string
}>()

const icon_provider = computed(() => providerIcons[props.name])
</script>

<template>
	<svg
		v-if="icon_provider"
		:viewBox="icon_provider.viewBox"
		aria-hidden="true"
		focusable="false"
	>
		<!-- eslint-disable-next-line vue/no-v-html -->
		<g v-html="icon_provider.body" />
	</svg>
	<span
		v-else
		aria-hidden="true"
	>
		{{ fallback.slice(0, 1) }}
	</span>
</template>
