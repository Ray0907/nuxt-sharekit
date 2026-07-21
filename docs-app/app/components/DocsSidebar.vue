<script setup lang="ts">
import { docs_navigation } from '../data/navigation'
</script>

<template>
	<aside class="rounded-panel border border-line bg-elevated p-3">
		<p class="px-3 pb-2 pt-1 text-xs font-semibold uppercase tracking-[0.08em] text-dimmed">
			Documentation
		</p>
		<nav aria-label="Documentation navigation">
			<ul class="grid gap-0.5">
				<li
					v-for="item_navigation in docs_navigation"
					:key="item_navigation.slug"
				>
					<NuxtLink
						:to="`/docs/${item_navigation.slug}`"
						class="flex min-h-11 items-center gap-2.5 rounded-control px-3 text-sm text-muted hover:bg-surface hover:text-ink [&.router-link-active]:bg-surface [&.router-link-active]:font-semibold [&.router-link-active]:text-accent"
					>
						<Icon
							:name="item_navigation.icon"
							class="size-4 shrink-0"
						/>
						{{ item_navigation.label }}
					</NuxtLink>
				</li>
			</ul>
		</nav>
	</aside>
</template>
