# @nuxt-sharekit/core

Framework-agnostic share intent engine used by Nuxt ShareKit.

```ts
import { createShareIntent } from '@nuxt-sharekit/core'

const intent_share = createShareIntent('bluesky', {
	url: 'https://example.com/launch',
	text: 'A calmer sharing toolkit'
})
```

See the workspace [README](../../README.md) for providers, custom registries, actions, and
development instructions.
