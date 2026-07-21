# Changelog

All notable changes to this project are documented here.

## 0.1.0 — Unreleased

### Added

- Framework-agnostic provider, preset, custom registry, and browser action engine.
- 27 provider intents with capability, fallback, status, and verification metadata.
- Nuxt 4 module with `ShareButton`, `ShareGroup`, `ShareLink`, `ShareMenu`, and `ShareQr`.
- `useShare` composable with explicit browser result states.
- `SocialShare` and `useSocialShare` compatibility APIs with `twitter` and `vkontakte` aliases.
- No-JavaScript share links, built-in provider icons, and a native disclosure menu.
- WCAG 2.2 AA-oriented semantics, focus, target size, announcements, and reduced motion.
- Nuxt 4 playground and Tailwind CSS v4 + Reka UI documentation workbench.

### Changed

- Reka UI is no longer a runtime dependency of `nuxt-sharekit`.
- Provider popups detach `window.opener` without suppressing the popup handle.
- Legacy output now preserves the upstream component classes, labels, brand variable, and icons.
- Mastodon works through an instance chooser by default, while direct instances remain optional.
- LINE text and Tumblr media and hashtag fields now match the upstream provider contract.
- Browser gates now cover Chromium, Firefox, and WebKit with a cross-platform visual font.
