<script setup lang="ts">
import { useSeoMeta } from '#imports'

defineOptions({ name: 'ProvidersPage' })

useSeoMeta({
	title: 'Providers — Nuxt ShareKit',
	description: 'Tested provider capability and fallback matrix for Nuxt ShareKit.',
})
</script>

<template>
	<main class="site-container py-12">
		<header class="max-w-3xl pb-8">
			<p class="text-sm font-medium text-accent">
				Provider registry
			</p>
			<h1 class="mt-2 text-4xl font-semibold tracking-[-0.035em]">
				Broad coverage, explicit capability.
			</h1>
			<p class="mt-4 text-lg text-muted">
				Every row comes from the same core metadata used to create share intents.
			</p>
		</header>
		<ProviderMatrix />
		<p class="mt-4 text-sm text-muted">
			Copy link, Web Share API, and QR payloads are actions, so they are not counted
			as networks in this table.
		</p>
	</main>
</template>
