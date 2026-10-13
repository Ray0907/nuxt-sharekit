<script setup lang="ts">
import { listShareProviders } from '@nuxt-sharekit/core'
import { ref } from 'vue'

defineOptions({ name: 'HomePage' })

const command_install = 'pnpm dlx nuxi@latest module add nuxt-sharekit'
const install_copied = ref(false)
const count_providers = listShareProviders().length
const ids_demo = ['x', 'linkedin', 'bluesky', 'email', 'whatsapp']
const payload_demo = {
	url: 'https://example.com/blog/launching-sharekit',
	title: 'Just shipped Nuxt ShareKit',
}

async function copyInstallCommand(): Promise<void> {
	try {
		await navigator.clipboard.writeText(command_install)
		install_copied.value = true
		setTimeout(() => (install_copied.value = false), 2000)
	}
	catch {
		install_copied.value = false
	}
}
</script>

<template>
	<main>
		<section class="site-container grid items-center gap-10 pb-8 pt-14 sm:pt-20 lg:grid-cols-[minmax(0,1fr)_minmax(0,30rem)]">
			<div class="max-w-3xl">
				<h1 class="text-balance text-4xl font-semibold tracking-[-0.035em] sm:text-5xl">
					Social sharing that fits your product.
				</h1>
				<p class="mt-4 text-balance text-lg text-muted sm:text-xl">
					Beautiful defaults. Headless when you need it.
				</p>

				<div class="mt-7 flex flex-col gap-2">
					<button
						type="button"
						class="inline-flex min-h-12 w-fit max-w-full items-center gap-3 rounded-control bg-action px-4 py-2 text-left text-sm text-white hover:bg-action-hover"
						aria-label="Copy install command"
						@click="copyInstallCommand"
					>
						<code>{{ command_install }}</code>
						<Icon
							:name="install_copied ? 'lucide:check' : 'lucide:copy'"
							class="size-4 shrink-0"
						/>
					</button>
					<p
						class="text-sm text-muted"
						role="status"
					>
						{{ install_copied ? 'Copied to clipboard' : `Nuxt 4 only · ${count_providers} providers` }}
					</p>
				</div>
			</div>

			<div class="rounded-panel bg-elevated ring-1 ring-line md:divide-y md:divide-line">
				<div class="p-5">
					<p class="mb-3 text-xs font-medium text-muted">
						Styled
					</p>
					<ShareGroup
						:payload="payload_demo"
						:providers="ids_demo"
						:show-copy="false"
						:show-native="false"
					/>
				</div>
				<div class="hidden p-5 md:block">
					<p class="mb-3 text-xs font-medium text-muted">
						Headless
					</p>
					<ShareGroup
						class="headless-demo"
						:payload="payload_demo"
						:providers="ids_demo"
						:show-copy="false"
						:show-native="false"
						unstyled
					/>
				</div>
			</div>
		</section>

		<section class="site-container">
			<ComponentBuilder />
		</section>

		<section class="site-container mt-5">
			<ProviderMatrix :limit="6" />
		</section>
	</main>
</template>
