# Nuxt ShareKit Design System

## Design North Star

The interface is a restrained developer workbench: bright, exact, and visibly useful. The
approved homepage mock in `docs/design/nuxt-sharekit-homepage-mock.png` is the visual north
star. The implementation may improve wording and accessibility, but must preserve its density,
hierarchy, and calm green system.

## Brand Scene

- Light mode is the primary scene; dark mode is equally functional.
- White and cool-neutral surfaces carry nearly all visual weight.
- Green occupies less than ten percent of a typical viewport.
- The linked-path mark suggests a payload moving from source to destination.
- The workbench is the hero. Decorative art must never compete with it.

## Color Tokens

All application code uses semantic tokens. Brand scales are defined in OKLCH.

| Token | Light value | Role |
| --- | --- | --- |
| `--ui-bg` | `oklch(1 0 0)` | Page background |
| `--ui-bg-muted` | `oklch(0.984 0.003 247.9)` | Quiet surfaces |
| `--ui-text` | `oklch(0.208 0.040 265.8)` | Primary text |
| `--ui-text-muted` | `oklch(0.446 0.037 257.3)` | Secondary text |
| `--ui-primary` | `oklch(0.524 0.132 154.1)` | Solid actions |
| `--share-signal` | `oklch(0.786 0.192 155.6)` | Logo and status signals |
| `--share-focus` | `oklch(0.36 0.075 205)` | Focus and supporting links |

Signal green is not used for text on white or for filled buttons. Action green always uses a
solid fill; gradients are prohibited.

## Typography

- Geist Sans for interface and documentation text.
- Geist Mono for commands, URLs, and API examples.
- Hero ceiling: `clamp(2rem, 4vw, 3.5rem)` with compact line length.
- Body text is at least 16px and uses comfortable line height.
- Tracking never goes below `-0.04em`.
- Sentence case is the default. Uppercase is reserved for very small structural labels.

## Shape and Depth

- Controls: 8px radius.
- Panels: 12px radius maximum.
- Pills are reserved for removable provider tokens and statuses.
- Borders establish structure; shadows only separate a floating or dominant surface.
- Do not combine prominent borders and prominent shadows on the same element.

## Layout

- Maximum content width: 1440px with fluid gutters.
- Header remains compact and does not float in a pill.
- Hero copy is left aligned; the interactive builder spans the primary content width.
- Documentation content uses a stable sidebar and readable article measure.
- On small screens, builder columns become a single logical sequence and actions remain near
  their affected content.

## Core Components

Tailwind CSS v4 implements the documentation token system. Reka UI is used directly only for
complex accessible primitives such as popovers and menus. Nuxt UI is a visual reference rather
than a dependency, and Nuxt Content is not used.

### Linked-path mark

An original inline SVG built from two connected routes. It is geometric, monochrome by
default, and uses signal green only for its terminal node.

### Component builder

- Tabs: Preview, Code, Accessibility.
- Fields: source, URL, title, provider selection, styled/headless mode.
- Live result: individual share buttons and a copy-component action.
- Status path: Source configured, providers selected, component ready.
- The builder never implies that one click posts to multiple networks.

### Provider matrix

Columns describe real capability: category, URL, text, media/metadata, fallback, and status.

## Interaction and Motion

- Pointer press uses `scale(.97)` for 100–160ms.
- Popovers originate from their trigger and enter from `scale(.97)` plus opacity in about 160ms.
- Easing is ease-out; `ease-in` is prohibited for interface entrances and exits.
- Keyboard-triggered actions do not scale.
- Tooltips use an initial delay, then appear instantly while traversing adjacent controls.
- Prefer CSS transitions on transform and opacity so interactions remain interruptible.
- `prefers-reduced-motion: reduce` removes spatial movement and preserves state clarity.

## Accessibility Contract

- WCAG 2.2 AA contrast and focus appearance.
- Native landmarks, headings, lists, buttons, links, labels, and tables before ARIA.
- Full keyboard support and logical focus order.
- Minimum 44×44px interactive targets.
- Screen-reader announcements for copy, native-share, and failure states.
- Provider icons never carry the only accessible name.
- Errors are expressed in text, not color alone.

## AI-slop Guardrails

No feature-card grid, glass effects, decorative grid background, faux terminal, fake metrics,
giant heading, repeated eyebrow labels, excessive rounding, ambient gradients, or floating
ornamental shapes. Every visible element must clarify installation, configuration, capability,
or outcome.
