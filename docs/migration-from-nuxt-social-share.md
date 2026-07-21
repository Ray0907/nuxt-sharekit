# Migrate from nuxt-social-share

Nuxt ShareKit ships a compatibility layer for the upstream `SocialShare`
component and `useSocialShare` composable. Compatibility is enabled by default.

## Replace the module

```bash
pnpm remove @stefanobartoletti/nuxt-social-share
pnpm add nuxt-sharekit
```

```ts
export default defineNuxtConfig({
	modules: ['nuxt-sharekit'],
	socialShare: {
		baseUrl: 'https://example.com',
		styled: false,
		label: true,
		icon: true
	}
})
```

Existing component usage can remain unchanged:

```vue
<SocialShare
	network="twitter"
	title="Release notes"
	user="example"
	hashtags="nuxt,vue"
/>
```

Existing composable usage also remains available:

```ts
const share_x = useSocialShare({
	network: 'twitter',
	url: 'https://example.com/release',
	title: 'Release notes'
})
```

The compatibility result retains `name`, `shareUrl`, `icon`, `color`, and
`category`. The `twitter` and `vkontakte` ids resolve to ShareKit's canonical
`x` and `vk` providers. Existing rendered HTML hooks are retained, including
the `social-share-button` classes and local `--color-brand` custom property.
Mastodon continues to work without configuration through an instance chooser;
an explicit instance remains available through the new ShareKit payload.

## Adopt the new APIs incrementally

- Use `ShareLink` when sharing must work without JavaScript.
- Use `ShareButton` for structured popup result states.
- Use `ShareGroup` for provider, copy, and native actions.
- Use `useShare` for typed headless actions.
- Set `shareKit.compatibility` to `false` after legacy calls are removed.

The new ShareKit components are styled by default. The compatibility
`SocialShare` component preserves the upstream unstyled default unless
`socialShare.styled` is enabled.
