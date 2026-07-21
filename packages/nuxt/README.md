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

The module registers `ShareButton`, `ShareGroup`, `ShareMenu`, and `ShareQr`, and auto-imports
`useShare`. See the workspace [README](../../README.md) for the full API and provider matrix.
