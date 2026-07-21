# nuxt-sharekit

Accessible, headless-friendly social sharing for Nuxt 4.

```bash
pnpm dlx nuxi@latest module add nuxt-sharekit
```

```vue
<ShareGroup
	:payload="{
		url: 'https://example.com/launch',
		title: 'Launch notes'
	}"
/>
```

The module registers `ShareButton`, `ShareGroup`, `ShareLink`, `ShareMenu`, and `ShareQr`, and
auto-imports `useShare`. See the
[full documentation](https://github.com/Ray0907/nuxt-sharekit#readme) for the API, provider
matrix, headless usage, accessibility contract, and migration guide.
