<script setup lang="ts">
import {
	createError,
	useRoute,
	useSeoMeta,
} from '#imports'
import { getDocPage } from '../../data/docs'

defineOptions({ name: 'DocumentationPage' })

const route = useRoute()
const slug_page = String(route.params.slug)
const page_doc = getDocPage(slug_page)

if (!page_doc) {
	throw createError({
		statusCode: 404,
		statusMessage: 'Documentation page not found',
	})
}

useSeoMeta({
	title: `${page_doc.title} — Nuxt ShareKit`,
	description: page_doc.description,
})
</script>

<template>
	<main class="site-container grid items-start gap-8 py-10 lg:grid-cols-[14rem_minmax(0,1fr)]">
		<DocsSidebar class="lg:sticky lg:top-24" />
		<article class="docs-prose min-w-0 pb-16">
			<header class="border-b border-line pb-8">
				<p class="text-sm font-medium text-accent">
					Documentation
				</p>
				<h1 class="mt-2 text-4xl font-semibold tracking-[-0.035em]">
					{{ page_doc.title }}
				</h1>
				<p class="mt-4 text-lg text-muted">
					{{ page_doc.description }}
				</p>
			</header>

			<section
				v-for="section_doc in page_doc.sections"
				:key="section_doc.title"
			>
				<h2>{{ section_doc.title }}</h2>
				<p>{{ section_doc.body }}</p>
				<ul
					v-if="section_doc.items"
					class="mt-4"
				>
					<li
						v-for="item_doc in section_doc.items"
						:key="item_doc"
					>
						{{ item_doc }}
					</li>
				</ul>
				<pre
					v-if="section_doc.code"
					class="code-block mt-5"
				><code>{{ section_doc.code }}</code></pre>
			</section>
		</article>
	</main>
</template>
