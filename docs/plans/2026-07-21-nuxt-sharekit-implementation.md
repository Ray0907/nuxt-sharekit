# Nuxt ShareKit Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan.

**Goal:** Ship a production-ready Nuxt 4 sharing module with a framework-agnostic provider
engine, accessible styled/headless components, a playground, and polished Nuxt 4 docs.

**Architecture:** A pnpm workspace separates pure TypeScript provider logic from the Nuxt 4
adapter. The Nuxt package auto-registers components, composables, and semantic CSS. The docs
and playground consume the local package exactly as users will.

**Tech Stack:** Node 22, pnpm 10, TypeScript 5.9, Vitest 4, Vue 3.5, Nuxt 4.5,
Tailwind CSS 4, and Reka UI. Nuxt UI and Nuxt Content are intentionally not dependencies.

---

## Task 1: Workspace and design contract

**Files:** `.editorconfig`, `.gitignore`, `.npmrc`, `package.json`, `pnpm-workspace.yaml`,
`PRODUCT.md`, `DESIGN.md`, `docs/design/*`, `docs/plans/*`.

1. Pin Node, pnpm, and current Nuxt 4-compatible package versions.
2. Save the approved mock and written product/design decisions.
3. Install dependencies with `pnpm install`.
4. Verify the workspace with `pnpm exec eslint --version` and `git status --short`.

## Task 2: Core provider contract

**Files:** `packages/core/package.json`, `packages/core/tsconfig.json`,
`packages/core/test/providers.test.ts`, `packages/core/src/types.ts`,
`packages/core/src/providers.ts`, `packages/core/src/index.ts`.

1. Write tests for payload normalization, URL encoding, capability metadata, and provider lookup.
2. Run `pnpm --filter @nuxt-sharekit/core test`; confirm the missing implementation fails.
3. Implement the smallest typed provider model and initial provider definitions.
4. Re-run the targeted tests until green.
5. Add build and typecheck scripts, then verify both.

## Task 3: Presets and custom providers

**Files:** `packages/core/test/presets.test.ts`, `packages/core/src/presets.ts`,
`packages/core/src/custom.ts`.

1. Test default, messaging, and full presets.
2. Test duplicate ids, unsafe protocols, missing labels, and custom intent builders.
3. Run the new tests and confirm failure.
4. Implement presets and custom-provider validation.
5. Re-run the core test suite and typecheck.

## Task 4: Share actions

**Files:** `packages/core/test/actions.test.ts`, `packages/core/src/actions.ts`.

1. Test copy link, native share, popup intent, unsupported browser paths, and result states.
2. Run the new tests and confirm failure.
3. Implement actions through injected browser adapters so SSR imports stay safe.
4. Re-run tests and build.

## Task 5: Nuxt 4 module

**Files:** `packages/nuxt/package.json`, `packages/nuxt/tsconfig.json`,
`packages/nuxt/src/module.ts`, `packages/nuxt/src/runtime/plugin.ts`,
`packages/nuxt/src/runtime/types.ts`, `packages/nuxt/test/module.test.ts`.

1. Test module defaults and component/composable registration.
2. Run the module test and confirm failure.
3. Implement a Nuxt 4-only module using `@nuxt/kit` and `@nuxt/module-builder`.
4. Expose typed runtime config and the core provider registry.
5. Verify module tests, typecheck, and package build.

## Task 6: Accessible Vue runtime

**Files:** `packages/nuxt/test/runtime.test.ts`,
`packages/nuxt/src/runtime/composables/useShare.ts`,
`packages/nuxt/src/runtime/components/ShareButton.vue`,
`packages/nuxt/src/runtime/components/ShareGroup.vue`,
`packages/nuxt/src/runtime/sharekit.css`.

1. Test accessible names, native button semantics, disabled states, announcements, and slots.
2. Confirm tests fail before creating the components.
3. Implement the composable and headless-friendly components.
4. Add semantic-token CSS, 44px targets, focus visibility, and reduced motion.
5. Re-run runtime tests and package validation.

## Task 7: Nuxt integration playground

**Files:** `playground/package.json`, `playground/nuxt.config.ts`, `playground/app.vue`,
`playground/assets/css/main.css`.

1. Configure the local module through Nuxt config.
2. Render styled, headless, native-share, copy-link, and custom-provider examples.
3. Run `pnpm --filter nuxt-sharekit-playground typecheck` and build.
4. Smoke-test the generated page in a browser.

## Task 8: Documentation shell and homepage

**Files:** `docs-app/package.json`, `docs-app/nuxt.config.ts`, `docs-app/app.config.ts`,
`docs-app/app.vue`, `docs-app/assets/css/main.css`, `docs-app/pages/index.vue`,
`docs-app/components/ShareKitLogo.vue`, `docs-app/components/ComponentBuilder.vue`,
`docs-app/components/ProviderMatrix.vue`.

1. Implement the approved header, hero, builder, documentation rail, and provider matrix.
2. Use Tailwind v4 semantic tokens, Geist, the original linked-path SVG, and solid action green.
3. Add responsive, dark-mode, keyboard, focus, loading, empty, and error states.
4. Run docs typecheck and build.
5. Render desktop and mobile screenshots and compare them with the approved mock.

## Task 9: Documentation content

**Files:** `docs-app/data/docs.ts`, `docs-app/data/navigation.ts`,
`docs-app/pages/docs/[slug].vue`.

1. Document installation, quickstart, configuration, composables, components, headless usage,
   custom providers, provider capability, accessibility, and migration boundaries.
2. Generate provider tables from source metadata rather than duplicating compatibility facts.
3. Verify internal links, code examples, typed route data, and production build.

## Task 10: Release quality gate

**Files:** `README.md`, `LICENSE`, `CHANGELOG.md`, `.github/workflows/ci.yml`.

1. Add concise API-first README content and package metadata.
2. Configure CI for install, lint, tests, typecheck, and build on Node 22.
3. Run fresh `pnpm lint`, `pnpm test`, `pnpm typecheck`, and `pnpm build`.
4. Inspect desktop/mobile light/dark views, keyboard flow, focus, clipping, and reduced motion.
5. Review `git diff --check`, package contents, and status before declaring completion.
