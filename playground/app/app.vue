<script setup lang="ts">
const payload_share = {
	url: 'https://example.com/notes/launching-sharekit',
	title: 'Nuxt ShareKit playground',
	text: 'A calmer, headless-friendly sharing toolkit for Nuxt 4.',
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
			<ShareGroup :payload="payload_share" />
		</section>

		<section aria-labelledby="menu-title">
			<h2 id="menu-title">
				Compact menu
			</h2>
			<ShareMenu :payload="payload_share" />
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
</style>
