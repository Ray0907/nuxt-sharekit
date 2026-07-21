<script setup lang="ts">
import type { ShareActionResult } from '@nuxt-sharekit/core'

const payload_share = {
	url: 'https://example.com/notes/launching-sharekit',
	title: 'Nuxt ShareKit playground',
	text: 'A calmer, headless-friendly sharing toolkit for Nuxt 4.',
}

const result_latest = ref('idle')
const legacy_share = useSocialShare({
	network: 'twitter',
	url: 'https://example.com/legacy-composable',
	title: 'Legacy composable compatibility',
})

useHead({
	title: 'Nuxt ShareKit playground',
	htmlAttrs: { lang: 'en' },
})

onMounted(() => {
	document.documentElement.dataset.hydrated = 'true'
})

function handleResult(result_share: ShareActionResult): void {
	result_latest.value = [
		result_share.method,
		result_share.providerId,
		result_share.status,
	].filter(Boolean).join(':')
}
</script>

<template>
	<main>
		<section aria-labelledby="playground-title">
			<p class="label">
				Nuxt 4 integration fixture
			</p>
			<h1 id="playground-title">
				Nuxt ShareKit playground
			</h1>
			<p>
				These components are auto-registered by the local module build.
			</p>
			<ShareGroup
				:payload="payload_share"
				@result="handleResult"
			/>
			<p
				class="result"
				data-testid="share-result"
				aria-live="polite"
			>
				{{ result_latest }}
			</p>
		</section>

		<section aria-labelledby="menu-title">
			<h2 id="menu-title">
				Compact menu
			</h2>
			<ShareMenu
				:payload="payload_share"
				@result="handleResult"
			/>
		</section>

		<section aria-labelledby="links-title">
			<h2 id="links-title">
				Progressive links and compatibility
			</h2>
			<div class="links">
				<a
					v-if="legacy_share"
					id="legacy-composable-twitter"
					:href="legacy_share.shareUrl"
				>
					Legacy composable
				</a>
				<ShareLink
					id="share-link-x"
					provider="x"
					:payload="payload_share"
				/>
				<ShareLink
					id="share-link-email"
					provider="email"
					:payload="payload_share"
				/>
				<ShareLink
					id="share-link-sms"
					provider="sms"
					:payload="payload_share"
				/>
				<SocialShare
					id="social-share-twitter"
					network="twitter"
					url="https://example.com/compatibility"
					title="Compatibility layer"
					styled
				/>
			</div>
		</section>
	</main>
</template>

<style>
:root {
	font-family: Inter, ui-sans-serif, system-ui, sans-serif;
	color: var(--share-text);
	background: var(--share-bg-muted);
}

body {
	margin: 0;
}

main {
	display: grid;
	max-inline-size: 72rem;
	min-block-size: 100vh;
	align-content: center;
	gap: 1.5rem;
	padding: 2rem;
	margin: auto;
}

section {
	padding: clamp(1.5rem, 4vw, 3rem);
	border: 1px solid var(--share-border);
	border-radius: var(--share-radius-panel);
	background: var(--share-bg);
}

h1,
h2 {
	margin-block: 0 0.75rem;
}

p {
	max-inline-size: 42rem;
	margin-block: 0 1.5rem;
	color: var(--share-text-muted);
}

.label {
	margin-block-end: 0.5rem;
	color: var(--share-primary);
	font-size: 0.75rem;
	font-weight: 700;
	letter-spacing: 0.08em;
	text-transform: uppercase;
}

.links {
	display: flex;
	flex-wrap: wrap;
	gap: 0.75rem;
}

.result {
	margin-block: 1rem 0;
	font-family: ui-monospace, monospace;
	font-size: 0.875rem;
}
</style>
