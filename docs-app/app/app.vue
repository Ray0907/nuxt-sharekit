<script setup lang="ts">
import { computed } from 'vue'
import {
	useHead,
	useRoute,
	useSeoMeta,
} from '#imports'

const route = useRoute()
const url_site = 'https://ray0907.github.io/nuxt-sharekit/'
const url_canonical = computed(() => new URL(
	route.path.replace(/^\//, ''),
	url_site,
).toString())

useHead({
	htmlAttrs: { lang: 'en' },
	link: [{ rel: 'canonical', href: url_canonical }],
})
useSeoMeta({
	ogSiteName: 'Nuxt ShareKit',
	ogType: 'website',
	ogUrl: url_canonical,
	twitterCard: 'summary',
})
</script>

<template>
	<div class="min-h-screen bg-page text-ink">
		<NuxtRouteAnnouncer />
		<SiteHeader />
		<NuxtPage />
		<SiteFooter />
	</div>
</template>
