<script setup lang="ts">
import {
	getShareProvider,
	listShareProviders,
} from '@nuxt-sharekit/core'
import {
	CheckboxIndicator,
	CheckboxRoot,
	PopoverContent,
	PopoverPortal,
	PopoverRoot,
	PopoverTrigger,
	TabsContent,
	TabsList,
	TabsRoot,
	TabsTrigger,
} from 'reka-ui'
import { computed, ref } from 'vue'

const tab_active = ref('preview')
const mode_component = ref<'styled' | 'headless'>('styled')
const source_page = ref('current')
const url_share = ref('https://example.com/blog/launching-sharekit')
const title_share = ref(
	'Just shipped Nuxt ShareKit — beautiful defaults, headless when you need it.',
)
const ids_selected = ref(['x', 'linkedin', 'bluesky', 'email', 'whatsapp'])
const status_copy = ref<'idle' | 'copied' | 'failed'>('idle')
const providers_available = listShareProviders()

const payload_preview = computed(() => ({
	url: url_share.value,
	title: title_share.value,
	text: title_share.value,
}))

const code_component = computed(() => {
	const providers_code = ids_selected.value.map(id => `'${id}'`).join(', ')
	const unstyled_code = mode_component.value === 'headless' ? '\n\tunstyled' : ''

	return `<ShareGroup
\t:payload="{
\t\turl: '${url_share.value}',
\t\ttitle: '${title_share.value.replaceAll('\'', '\\\'')}'
\t}"
\t:providers="[${providers_code}]"${unstyled_code}
/>`
})

function getProviderIcon(id_provider: string): string {
	return getShareProvider(id_provider)?.icon ?? 'lucide:circle-help'
}

function getProviderLabel(id_provider: string): string {
	return getShareProvider(id_provider)?.label ?? id_provider
}

function toggleProvider(id_provider: string, checked_provider: boolean | 'indeterminate'): void {
	if (checked_provider === true && !ids_selected.value.includes(id_provider)) {
		ids_selected.value = [...ids_selected.value, id_provider]
		return
	}

	if (checked_provider === false) {
		ids_selected.value = ids_selected.value.filter(id => id !== id_provider)
	}
}

function removeProvider(id_provider: string): void {
	ids_selected.value = ids_selected.value.filter(id => id !== id_provider)
}

async function copyComponent(): Promise<void> {
	try {
		await navigator.clipboard.writeText(code_component.value)
		status_copy.value = 'copied'
	}
	catch {
		status_copy.value = 'failed'
	}
}
</script>

<template>
	<section
		id="builder"
		class="scroll-mt-24 overflow-hidden rounded-panel border border-line bg-elevated shadow-panel"
		aria-labelledby="builder-title"
	>
		<TabsRoot v-model="tab_active">
			<div class="flex flex-col gap-3 border-b border-line px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
				<div>
					<h2
						id="builder-title"
						class="font-semibold"
					>
						Component builder
					</h2>
					<p class="mt-1 text-sm text-muted">
						Configure a real ShareKit component, then copy the result.
					</p>
				</div>
				<TabsList
					class="inline-flex w-fit rounded-control border border-line bg-surface p-1"
					aria-label="Builder view"
				>
					<TabsTrigger
						v-for="tab_item in [
							{ value: 'preview', label: 'Preview' },
							{ value: 'code', label: 'Code' },
							{ value: 'accessibility', label: 'Accessibility' },
						]"
						:key="tab_item.value"
						:value="tab_item.value"
						class="min-h-9 rounded-md px-3 text-sm text-muted outline-none data-[state=active]:bg-elevated data-[state=active]:font-medium data-[state=active]:text-ink"
					>
						{{ tab_item.label }}
					</TabsTrigger>
				</TabsList>
			</div>

			<TabsContent
				value="preview"
				class="outline-none"
			>
				<div class="builder-grid">
					<fieldset class="builder-fieldset">
						<legend class="builder-label">
							Source
							<span
								class="size-2 rounded-full bg-signal"
								aria-hidden="true"
							/>
						</legend>
						<label
							class="sr-only"
							for="source-page"
						>Share source</label>
						<select
							id="source-page"
							v-model="source_page"
							class="builder-input"
						>
							<option value="current">
								Current page
							</option>
							<option value="custom">
								Custom URL
							</option>
						</select>
						<p class="mt-2 truncate font-mono text-xs text-dimmed">
							/blog/launching-sharekit
						</p>
					</fieldset>

					<fieldset class="builder-fieldset builder-compose">
						<legend class="builder-label">
							Compose
							<span
								class="size-2 rounded-full bg-signal"
								aria-hidden="true"
							/>
						</legend>
						<label
							class="sr-only"
							for="share-url"
						>Share URL</label>
						<div class="relative">
							<Icon
								name="lucide:link-2"
								class="pointer-events-none absolute left-3 top-3.5 size-4 text-dimmed"
							/>
							<input
								id="share-url"
								v-model="url_share"
								type="url"
								class="builder-input builder-input--icon"
							>
						</div>
						<label
							class="sr-only"
							for="share-title"
						>Share text</label>
						<div class="relative mt-2">
							<textarea
								id="share-title"
								v-model="title_share"
								maxlength="280"
								rows="3"
								class="builder-input resize-none pb-7"
							/>
							<span class="absolute bottom-2 right-3 text-xs text-dimmed">
								{{ title_share.length }}/280
							</span>
						</div>
					</fieldset>

					<fieldset class="builder-fieldset builder-providers">
						<legend class="builder-label">
							Providers
							<span
								class="size-2 rounded-full bg-signal"
								aria-hidden="true"
							/>
						</legend>
						<ul class="flex flex-wrap gap-1.5">
							<li
								v-for="id_provider in ids_selected"
								:key="id_provider"
							>
								<button
									type="button"
									class="inline-flex min-h-11 items-center gap-2 rounded-control border border-line bg-surface px-2.5 text-sm hover:border-action"
									:aria-label="`Remove ${getProviderLabel(id_provider)}`"
									@click="removeProvider(id_provider)"
								>
									<Icon
										:name="getProviderIcon(id_provider)"
										class="size-4"
									/>
									{{ getProviderLabel(id_provider) }}
									<Icon
										name="lucide:x"
										class="size-3.5 text-dimmed"
									/>
								</button>
							</li>
						</ul>

						<PopoverRoot>
							<PopoverTrigger as-child>
								<button
									type="button"
									class="mt-2 flex min-h-11 w-full items-center justify-between rounded-control border border-line px-3 text-left text-sm text-muted hover:border-action"
								>
									Select providers…
									<Icon
										name="lucide:chevron-down"
										class="size-4"
									/>
								</button>
							</PopoverTrigger>
							<PopoverPortal>
								<PopoverContent
									class="reka-popover"
									:side-offset="8"
									align="start"
								>
									<p class="px-2 pb-2 pt-1 text-xs font-semibold text-muted">
										Choose providers
									</p>
									<label
										v-for="provider_share in providers_available"
										:key="provider_share.id"
										class="flex min-h-11 items-center gap-3 rounded-control px-2 text-sm hover:bg-surface"
									>
										<CheckboxRoot
											:model-value="ids_selected.includes(provider_share.id)"
											class="grid size-5 place-items-center rounded border border-line data-[state=checked]:border-action data-[state=checked]:bg-action data-[state=checked]:text-white"
											@update:model-value="toggleProvider(provider_share.id, $event)"
										>
											<CheckboxIndicator>
												<Icon
													name="lucide:check"
													class="size-3.5"
												/>
											</CheckboxIndicator>
										</CheckboxRoot>
										<Icon
											:name="provider_share.icon"
											class="size-4"
										/>
										<span class="flex-1">{{ provider_share.label }}</span>
										<span class="text-xs capitalize text-dimmed">
											{{ provider_share.category }}
										</span>
									</label>
								</PopoverContent>
							</PopoverPortal>
						</PopoverRoot>
					</fieldset>

					<fieldset class="builder-fieldset builder-options">
						<legend class="builder-label">
							Options
							<span
								class="size-2 rounded-full bg-signal"
								aria-hidden="true"
							/>
						</legend>
						<div
							class="inline-flex rounded-control border border-line p-1"
							role="radiogroup"
							aria-label="Component styling"
						>
							<button
								v-for="mode_item in ['styled', 'headless'] as const"
								:key="mode_item"
								type="button"
								role="radio"
								:aria-checked="mode_component === mode_item"
								class="min-h-9 rounded-md px-3 text-sm capitalize text-muted"
								:class="mode_component === mode_item
									? 'bg-surface font-medium text-accent'
									: ''"
								@click="mode_component = mode_item"
							>
								{{ mode_item }}
							</button>
						</div>
					</fieldset>

					<div class="builder-fieldset builder-output">
						<p class="builder-label">
							Live preview
							<span
								class="size-2 rounded-full bg-signal"
								aria-hidden="true"
							/>
						</p>
						<div
							class="builder-preview"
							:class="mode_component === 'headless' ? 'builder-headless' : ''"
						>
							<ShareButton
								v-for="id_provider in ids_selected"
								:key="id_provider"
								:provider="id_provider"
								:payload="payload_preview"
								:unstyled="mode_component === 'headless'"
							/>
						</div>
						<button
							type="button"
							class="mt-4 inline-flex min-h-11 items-center gap-2 rounded-control bg-action px-4 text-sm font-semibold text-white hover:bg-action-hover"
							@click="copyComponent"
						>
							<Icon
								name="lucide:copy"
								class="size-4"
							/>
							{{ status_copy === 'copied' ? 'Copied component' : 'Copy component' }}
						</button>
						<p
							v-if="status_copy === 'failed'"
							class="mt-2 text-sm text-danger"
						>
							Clipboard access failed. Copy from the Code tab instead.
						</p>
					</div>
				</div>

				<div class="builder-path">
					<div>
						<span
							class="builder-path__dot"
							aria-hidden="true"
						/>
						<span><strong>Source</strong><small>Configured</small></span>
					</div>
					<div>
						<span
							class="builder-path__dot"
							aria-hidden="true"
						/>
						<span>
							<strong>Provider selection</strong>
							<small>{{ ids_selected.length }} providers</small>
						</span>
					</div>
					<div>
						<span
							class="builder-path__dot"
							aria-hidden="true"
						/>
						<span><strong>Component</strong><small>Ready</small></span>
					</div>
				</div>
			</TabsContent>

			<TabsContent
				value="code"
				class="p-5 outline-none"
			>
				<div class="flex items-center justify-between gap-4 pb-4">
					<p class="text-sm text-muted">
						Generated from the current builder state.
					</p>
					<button
						type="button"
						class="inline-flex min-h-11 items-center gap-2 rounded-control border border-line px-3 text-sm font-medium hover:border-action"
						@click="copyComponent"
					>
						<Icon
							name="lucide:copy"
							class="size-4"
						/>
						Copy
					</button>
				</div>
				<pre class="code-block"><code>{{ code_component }}</code></pre>
			</TabsContent>

			<TabsContent
				value="accessibility"
				class="p-5 outline-none"
			>
				<div class="grid gap-4 md:grid-cols-2">
					<div
						v-for="item_a11y in [
							['Keyboard', 'Native buttons and disclosure focus behavior.'],
							['Targets', 'Every interactive target is at least 44×44px.'],
							['Announcements', 'Copy, share, blocked, and failure states use a live region.'],
							['Motion', 'Reduced motion removes scale and popover movement.'],
						]"
						:key="item_a11y[0]"
						class="border-l-2 border-action pl-4"
					>
						<h3 class="font-semibold">
							{{ item_a11y[0] }}
						</h3>
						<p class="mt-1 text-sm text-muted">
							{{ item_a11y[1] }}
						</p>
					</div>
				</div>
			</TabsContent>
		</TabsRoot>
	</section>
</template>

<style scoped>
.builder-grid {
	display: grid;
}

.builder-fieldset {
	min-inline-size: 0;
	padding: 1.25rem;
	border-block-end: 1px solid var(--site-line);
}

.builder-label {
	display: flex;
	align-items: center;
	gap: 0.5rem;
	margin-block-end: 0.875rem;
	color: var(--site-muted);
	font-size: 0.75rem;
	font-weight: 650;
	letter-spacing: 0.06em;
	text-transform: uppercase;
}

.builder-input {
	inline-size: 100%;
	min-block-size: 2.75rem;
	padding: 0.625rem 0.75rem;
	border: 1px solid var(--site-line);
	border-radius: 0.5rem;
	background: var(--site-bg);
	color: var(--site-ink);
	font: inherit;
	font-size: 0.875rem;
}

.builder-input:focus {
	border-color: var(--site-focus);
}

.builder-input--icon {
	padding-inline-start: 2.25rem;
}

.builder-preview {
	display: flex;
	align-items: center;
	flex-wrap: wrap;
	gap: 0.5rem;
}

.builder-headless :deep(.sharekit-control > button) {
	display: inline-flex;
	min-block-size: 2.75rem;
	align-items: center;
	gap: 0.5rem;
	padding: 0.625rem 0.75rem;
	border: 0;
	border-block-end: 2px solid var(--site-action);
	background: transparent;
	color: var(--site-ink);
	font: inherit;
	font-size: 0.875rem;
	font-weight: 600;
}

.builder-path {
	display: grid;
	gap: 1rem;
	padding: 1rem 1.25rem;
	background: var(--site-surface);
}

.builder-path > div {
	display: flex;
	align-items: center;
	gap: 0.75rem;
}

.builder-path__dot {
	inline-size: 0.5rem;
	block-size: 0.5rem;
	border-radius: 999px;
	background: var(--site-action);
}

.builder-path span:last-child {
	display: grid;
	gap: 0.125rem;
}

.builder-path strong {
	font-size: 0.8125rem;
	font-weight: 600;
}

.builder-path small {
	color: var(--site-muted);
	font-size: 0.75rem;
}

@media (min-width: 48rem) {
	.builder-grid {
		grid-template-columns: repeat(2, minmax(0, 1fr));
	}

	.builder-fieldset {
		border-inline-end: 1px solid var(--site-line);
	}

	.builder-output {
		grid-column: 1 / -1;
	}

	.builder-path {
		grid-template-columns: repeat(3, minmax(0, 1fr));
	}
}

@media (min-width: 75rem) {
	.builder-grid {
		grid-template-columns: 0.8fr 1.7fr 1.35fr 0.8fr;
	}

	.builder-output {
		grid-column: 1 / -1;
	}

	.builder-fieldset {
		border-block-end: 0;
	}
}
</style>
