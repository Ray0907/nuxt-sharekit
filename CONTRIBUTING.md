# Contributing

## Local setup

Requirements: Node.js 22 or newer and pnpm 10.

```bash
pnpm install
pnpm dev
```

## Quality checks

```bash
pnpm lint
pnpm test
pnpm typecheck
pnpm build
```

Provider changes must include an intent test, capability update, and live endpoint check. UI
changes must be verified in desktop/mobile and light/dark scenes, with keyboard and reduced
motion enabled.

Keep Nuxt UI and Nuxt Content out of runtime and documentation dependencies. Use native HTML
first and Reka UI only when a complex interaction needs managed focus or keyboard behavior.
