<script setup lang="ts">
import { ref } from 'vue'

defineOptions({ name: 'HomePage' })

const command_install = 'pnpm dlx nuxi@latest module add nuxt-sharekit'
const install_copied = ref(false)

async function copyInstallCommand(): Promise<void> {
	await navigator.clipboard.writeText(command_install)
	install_copied.value = true
}
</script>

<template>
	<main>
		<section class="site-container pb-8 pt-14 sm:pt-20">
			<div class="max-w-3xl">
				<div class="mb-5 flex items-center gap-3">
					<ShareKitLogo compact />
					<span class="rounded-full border border-line bg-surface px-2.5 py-1 text-xs font-medium text-muted">
						Nuxt 4
					</span>
				</div>
				<h1 class="text-balance text-4xl font-semibold tracking-[-0.035em] sm:text-5xl">
					Social sharing that fits your product.
				</h1>
				<p class="mt-4 text-balance text-lg text-muted sm:text-xl">
					Beautiful defaults. Headless when you need it.
				</p>

				<div class="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
					<button
						type="button"
						class="inline-flex min-h-11 items-center justify-center gap-2 rounded-control bg-action px-4 text-sm font-semibold text-white hover:bg-action-hover"
						@click="copyInstallCommand"
					>
						<Icon
							name="lucide:terminal"
							class="size-4"
						/>
						{{ install_copied ? 'Copied' : 'Install' }}
					</button>
					<button
						type="button"
						class="inline-flex min-h-11 max-w-full items-center gap-3 overflow-hidden rounded-control border border-line bg-elevated px-3.5 text-left text-sm text-muted hover:border-action"
						aria-label="Copy install command"
						@click="copyInstallCommand"
					>
						<span class="font-mono text-dimmed">$</span>
						<code class="truncate">{{ command_install }}</code>
						<Icon
							name="lucide:copy"
							class="size-4 shrink-0"
						/>
					</button>
				</div>
			</div>
		</section>

		<section class="site-container">
			<ComponentBuilder />
		</section>

		<section class="site-container mt-5 grid items-start gap-5 lg:grid-cols-[14rem_minmax(0,1fr)]">
			<DocsSidebar class="lg:sticky lg:top-21" />
			<ProviderMatrix :limit="6" />
		</section>
	</main>
</template>
