<script setup lang="ts">
import { listShareProviders } from '@nuxt-sharekit/core'
import { computed } from 'vue'

const props = withDefaults(defineProps<{
	limit?: number
	showHeader?: boolean
}>(), {
	showHeader: true,
})

const labels_category = {
	'social': 'Social',
	'professional': 'Professional',
	'messaging': 'Messaging',
	'communication': 'Communication',
	'read-later': 'Read later',
} as const

const providers_visible = computed(() => {
	const providers_all = listShareProviders()
	return props.limit ? providers_all.slice(0, props.limit) : providers_all
})

function getStatusLabel(status_provider: string): string {
	return status_provider === 'setup-required' ? 'Setup required' : 'Active'
}

function supportsField(fields_provider: readonly string[], field_name: string): boolean {
	return fields_provider.includes(field_name)
}
</script>

<template>
	<section
		class="min-w-0 overflow-hidden rounded-panel border border-line bg-elevated"
		aria-labelledby="providers-title"
	>
		<div
			v-if="showHeader"
			class="border-b border-line px-5 py-4"
		>
			<h2
				id="providers-title"
				class="text-base font-semibold"
			>
				Provider support
			</h2>
			<p class="mt-1 text-sm text-muted">
				Capability metadata is generated from the tested core registry.
			</p>
		</div>

		<div class="overflow-x-auto">
			<table class="w-full min-w-4xl border-collapse text-left text-sm">
				<thead class="bg-surface text-xs text-muted">
					<tr>
						<th
							scope="col"
							class="px-5 py-3 font-medium"
						>
							Provider
						</th>
						<th
							scope="col"
							class="px-4 py-3 font-medium"
						>
							Category
						</th>
						<th
							scope="col"
							class="px-4 py-3 text-center font-medium"
						>
							URL
						</th>
						<th
							scope="col"
							class="px-4 py-3 text-center font-medium"
						>
							Text
						</th>
						<th
							scope="col"
							class="px-4 py-3 text-center font-medium"
						>
							Media
						</th>
						<th
							scope="col"
							class="px-4 py-3 font-medium"
						>
							Fallback
						</th>
						<th
							scope="col"
							class="px-5 py-3 font-medium"
						>
							Status
						</th>
					</tr>
				</thead>
				<tbody>
					<tr
						v-for="provider_share in providers_visible"
						:key="provider_share.id"
						class="border-t border-line"
					>
						<th
							scope="row"
							class="px-5 py-3 font-medium"
						>
							<span class="flex items-center gap-2.5">
								<span class="grid size-7 place-items-center rounded-md bg-surface">
									<Icon
										:name="provider_share.icon"
										class="size-4"
									/>
								</span>
								{{ provider_share.label }}
							</span>
						</th>
						<td class="px-4 py-3 text-muted">
							{{ labels_category[provider_share.category] }}
						</td>
						<td
							v-for="field_name in ['url', 'text', 'media']"
							:key="field_name"
							class="px-4 py-3 text-center"
						>
							<Icon
								:name="supportsField(provider_share.fields, field_name)
									? 'lucide:circle-check'
									: 'lucide:minus'"
								:class="supportsField(provider_share.fields, field_name)
									? 'size-4 text-accent'
									: 'size-4 text-dimmed'"
								:aria-label="supportsField(provider_share.fields, field_name)
									? `Supports ${field_name}`
									: `Does not support ${field_name}`"
							/>
						</td>
						<td class="px-4 py-3 capitalize text-muted">
							{{ provider_share.fallback }}
						</td>
						<td class="px-5 py-3">
							<span
								class="inline-flex items-center gap-2 text-muted"
								:title="`Endpoint verified ${provider_share.verifiedAt}`"
							>
								<span
									class="size-2 rounded-full"
									:class="provider_share.status === 'active'
										? 'bg-signal'
										: 'bg-dimmed'"
									aria-hidden="true"
								/>
								{{ getStatusLabel(provider_share.status) }}
							</span>
						</td>
					</tr>
				</tbody>
			</table>
		</div>

		<div
			v-if="limit"
			class="border-t border-line px-5 py-3"
		>
			<NuxtLink
				to="/providers"
				class="inline-flex min-h-11 items-center gap-2 text-sm font-medium text-accent hover:underline"
			>
				View all providers
				<Icon
					name="lucide:arrow-right"
					class="size-4"
				/>
			</NuxtLink>
		</div>
	</section>
</template>
