<script setup lang="ts">
withDefaults(defineProps<{
	compact?: boolean
}>(), {
	compact: false,
})
</script>

<template>
	<NuxtLink
		to="/"
		class="inline-flex min-h-11 items-center gap-2.5 rounded-control font-semibold text-ink"
		aria-label="Nuxt ShareKit home"
	>
		<svg
			class="h-7 w-9 shrink-0"
			viewBox="0 0 44 32"
			fill="none"
			aria-hidden="true"
		>
			<path
				d="M4 23h4.5c5 0 5.6-14 11-14s6 14 11 14H40"
				stroke="currentColor"
				stroke-width="3.25"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
			<circle
				cx="4"
				cy="23"
				r="3"
				class="fill-signal"
			/>
			<circle
				cx="40"
				cy="23"
				r="3"
				class="fill-action"
			/>
		</svg>
		<span v-if="!compact">Nuxt ShareKit</span>
	</NuxtLink>
</template>
