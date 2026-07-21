<script setup lang="ts">
import {
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuPortal,
	DropdownMenuRoot,
	DropdownMenuTrigger,
} from 'reka-ui'
import { useColorMode } from '#imports'

const color_mode = useColorMode()
const links_navigation = [
	{ label: 'Docs', to: '/docs/overview' },
	{ label: 'Guides', to: '/docs/quickstart' },
	{ label: 'Providers', to: '/providers' },
	{ label: 'API', to: '/docs/api' },
	{ label: 'Examples', to: '/#builder' },
	{ label: 'Changelog', to: '/changelog' },
]

function toggleColorMode(): void {
	color_mode.preference = color_mode.value === 'dark' ? 'light' : 'dark'
}
</script>

<template>
	<header class="sticky top-0 z-50 border-b border-line bg-page">
		<nav
			class="site-container flex h-16 items-center justify-between"
			aria-label="Primary navigation"
		>
			<ShareKitLogo />

			<ul class="hidden items-center gap-1 lg:flex">
				<li
					v-for="link_navigation in links_navigation"
					:key="link_navigation.to"
				>
					<NuxtLink
						:to="link_navigation.to"
						class="inline-flex min-h-11 items-center rounded-control px-3 text-sm text-muted hover:bg-surface hover:text-ink"
					>
						{{ link_navigation.label }}
					</NuxtLink>
				</li>
			</ul>

			<div class="flex items-center gap-1.5">
				<a
					href="https://github.com"
					target="_blank"
					rel="noreferrer"
					class="hidden size-11 place-items-center rounded-control text-muted hover:bg-surface hover:text-ink sm:grid"
					aria-label="Open GitHub"
				>
					<Icon
						name="simple-icons:github"
						class="size-5"
					/>
				</a>
				<ClientOnly>
					<button
						type="button"
						class="grid size-11 place-items-center rounded-control text-muted hover:bg-surface hover:text-ink"
						:aria-label="color_mode.value === 'dark' ? 'Use light mode' : 'Use dark mode'"
						@click="toggleColorMode"
					>
						<Icon
							:name="color_mode.value === 'dark' ? 'lucide:sun' : 'lucide:moon'"
							class="size-5"
						/>
					</button>
				</ClientOnly>
				<NuxtLink
					to="/docs/quickstart"
					class="hidden min-h-11 items-center gap-2 rounded-control border border-line px-4 text-sm font-semibold text-ink hover:border-action sm:inline-flex"
				>
					<Icon
						name="lucide:arrow-up-right"
						class="size-4 text-accent"
					/>
					Get started
				</NuxtLink>

				<DropdownMenuRoot>
					<DropdownMenuTrigger as-child>
						<button
							type="button"
							class="grid size-11 place-items-center rounded-control text-muted hover:bg-surface hover:text-ink lg:hidden"
							aria-label="Open navigation"
						>
							<Icon
								name="lucide:menu"
								class="size-5"
							/>
						</button>
					</DropdownMenuTrigger>
					<DropdownMenuPortal>
						<DropdownMenuContent
							class="reka-popover p-1"
							:side-offset="8"
							align="end"
						>
							<DropdownMenuItem
								v-for="link_navigation in links_navigation"
								:key="link_navigation.to"
								as-child
							>
								<NuxtLink
									:to="link_navigation.to"
									class="flex min-h-11 items-center rounded-control px-3 text-sm outline-none data-[highlighted]:bg-surface"
								>
									{{ link_navigation.label }}
								</NuxtLink>
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenuPortal>
				</DropdownMenuRoot>
			</div>
		</nav>
	</header>
</template>
