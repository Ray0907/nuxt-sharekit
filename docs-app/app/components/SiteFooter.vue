<template>
	<footer class="mt-24 border-t border-line py-8">
		<div class="site-container flex flex-col gap-4 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
			<div class="flex items-center gap-2">
				<ShareKitLogo compact />
				<span>Built for Nuxt 4. MIT licensed.</span>
			</div>
			<nav
				class="flex flex-wrap gap-5"
				aria-label="Footer navigation"
			>
				<NuxtLink
					to="/docs/accessibility"
					class="hover:text-ink"
				>
					Accessibility
				</NuxtLink>
				<NuxtLink
					to="/providers"
					class="hover:text-ink"
				>
					Provider status
				</NuxtLink>
				<a
					href="https://buymeacoffee.com/raytien"
					target="_blank"
					rel="noopener noreferrer"
					class="hover:text-ink"
				>
					Buy me a coffee
				</a>
			</nav>
		</div>
	</footer>
</template>
