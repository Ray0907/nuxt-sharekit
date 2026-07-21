<script setup lang="ts">
import { useSeoMeta } from '#imports'

defineOptions({ name: 'ChangelogPage' })

useSeoMeta({
	title: 'Changelog — Nuxt ShareKit',
	description: 'Release notes for Nuxt ShareKit.',
})
</script>

<template>
	<main class="site-container max-w-4xl py-12">
		<header class="border-b border-line pb-8">
			<p class="text-sm font-medium text-accent">
				Release notes
			</p>
			<h1 class="mt-2 text-4xl font-semibold tracking-[-0.035em]">
				Changelog
			</h1>
			<p class="mt-4 text-lg text-muted">
				Meaningful changes to providers, API contracts, and accessibility behavior.
			</p>
		</header>

		<section class="mt-10 grid gap-3 sm:grid-cols-[8rem_minmax(0,1fr)]">
			<div>
				<span class="rounded-full border border-line px-2.5 py-1 text-xs font-medium">
					0.1.0
				</span>
			</div>
			<div>
				<h2 class="text-xl font-semibold">
					Initial foundation
				</h2>
				<p class="mt-2 text-muted">
					Framework-agnostic provider engine, Nuxt 4 module, accessible components,
					Reka-powered menu, broad provider coverage, and the documentation workbench.
				</p>
			</div>
		</section>
	</main>
</template>
