# Nuxt ShareKit Product and Interface Design

## Decision

Build Nuxt ShareKit as a Nuxt 4-first module backed by a framework-agnostic core. The first
release optimizes for Nuxt adoption and design-system flexibility. A Next adapter remains a
credible future package because share intent generation does not depend on Nuxt, but building
both adapters now would dilute documentation and accessibility quality.

## User Journey

1. A developer sees a real share component in the first viewport.
2. They change the payload and providers in the builder.
3. They switch between styled and headless output.
4. They copy an install command or component example.
5. They verify provider capabilities and fallbacks in the matrix.
6. They open focused docs for module options, composables, slots, custom providers, and a11y.

## Technical Shape

The core package owns payload normalization, providers, presets, and intent generation. It has
no Vue or browser dependency. The Nuxt module auto-registers runtime components, composables,
and CSS. Browser actions such as clipboard, native share, popup opening, and QR generation live
behind injected adapters so SSR stays deterministic and tests remain fast.

## Provider Model

Each provider declares its id, label, category, icon, intent builder, supported payload fields,
and fallback. Initial coverage includes Facebook, X, LinkedIn, Pinterest, Reddit, Threads,
Bluesky, Mastodon, Tumblr, Hacker News, WhatsApp, Telegram, LINE, Email, SMS, Weibo, Qzone, VK,
Xing, Instapaper, and Raindrop.io. Copy link, Web Share API, QR, and custom definitions
are first-class actions rather than pretending to be social networks.

## Visual Shape

The approved mock establishes a calm white page, compact navigation, modest hero copy, a dense
component builder, and a provider table. Nuxt green appears as a signal, while a deeper green
provides accessible solid actions. Tailwind CSS v4 supplies the design tokens and Reka UI is
used directly for complex accessible interactions. Nuxt UI and Nuxt Content are not dependencies.

## Accessibility

WCAG 2.2 AA is a product requirement rather than a final audit. Semantics, focus, keyboard
operation, 44px targets, announcements, and reduced motion are encoded in component tests and
documentation examples.

## Motion Review

| Before | After | Why |
| --- | --- | --- |
| Generic hover transitions | Interruptible transform/opacity transitions | Keeps response immediate |
| Same motion for every input | Keyboard activation remains still | Avoids unexpected spatial motion |
| Popovers fade from nowhere | Origin-aware `.97` scale and fade | Preserves spatial causality |
| Repeated tooltip delays | One initial delay, instant adjacent discovery | Improves toolbar exploration |
| Motion always enabled | Reduced-motion path removes movement | Meets accessibility expectations |

## Acceptance Signals

- A developer can install and render a share group in a clean Nuxt 4 app.
- Styled and headless usage share the same typed payload and provider definitions.
- Provider intent tests confirm encoding and fallback behavior.
- The docs build, typecheck, and expose a capability matrix from source data.
- Keyboard and screen-reader flows work without provider icons or motion.
