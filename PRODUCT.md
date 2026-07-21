# Product

## Register

Brand.

## Platform

Web, delivered as a Nuxt 4 module with a framework-agnostic TypeScript core.

## Users

- Nuxt developers who want a dependable share feature without rebuilding provider URLs.
- Frontend and design-system teams that need slots, semantic tokens, and headless primitives.
- Documentation and content teams that need a visible provider compatibility contract.

## Product Purpose

Nuxt ShareKit is a production-ready Nuxt 4 sharing toolkit. It combines calm, accessible
defaults with a headless API, custom providers, typed payloads, and broad provider coverage.
It supports styled components, composables, native share, copy link, QR payload generation,
and explicit fallbacks. Nuxt 3 is not supported.

## Positioning

The most customizable Nuxt sharing toolkit, with broad, tested network coverage and no
design-system lock-in.

## Architecture

- `@nuxt-sharekit/core`: provider definitions and share intent generation without Vue/Nuxt.
- `nuxt-sharekit`: Nuxt 4 module, composables, and accessible Vue components.
- `playground`: local integration fixture.
- `docs-app`: Nuxt 4, Tailwind CSS v4, and Reka UI documentation workbench.
- A future React/Next adapter may consume the core package; it is not part of the first release.

Nuxt UI and Nuxt Content are not runtime or documentation dependencies. The visual language is
compatible with Nuxt-oriented products without requiring users to adopt a specific UI system.

## Conversion and Proof

The primary action is installation. The secondary action is exploring the builder and docs.
Proof comes from executable provider tests, a capability matrix, and accessible live examples,
not fabricated customers, testimonials, or usage metrics.

## Brand Personality

Precise, kinetic, and composed. It should feel like a broadcast surface with excellent signal
clarity, not a theatrical terminal or a generic SaaS template.

## Design Principles

1. Show the component before explaining it.
2. Make the simplest API obvious, then reveal advanced control progressively.
3. Treat provider support as a tested contract, not a logo wall.
4. Keep motion purposeful, interruptible, and optional.
5. Make documentation calmer than the product demo.

## Anti-references

- Stock Nuxt-green documentation templates.
- Repeated icon-card grids and floating decorative pills.
- Terminal cosplay, glassmorphism, beige dashboards, or high-chroma surfaces.
- Fake metrics, fabricated testimonials, and vague marketing superlatives.
- Large rounded containers nested inside other large rounded containers.

## Accessibility and Inclusion

WCAG 2.2 AA is the release baseline. Every flow must support keyboard navigation, visible
focus, screen readers, 44px touch targets, zoom, high contrast, and reduced motion.
