# Release checklist

Status for `v0.1.0`, released on 2026-07-21.

## Before publishing

- [x] Update both package versions and move the changelog entry out of Unreleased.
- [x] Run `pnpm verify:replacement` on Node.js 22.
- [x] Confirm the README runtime screenshot matches the committed Playwright snapshot.
- [x] Confirm package ownership and Trusted Publishing for both npm packages.
- [x] Review provider endpoints whose `verifiedAt` date is older than the release window.

## Publish

- [x] Publish `@nuxt-sharekit/core` before `nuxt-sharekit`.
- [x] Confirm both `0.1.0` packages are public with the `latest` dist-tag.
- [x] Install `nuxt-sharekit` from npm in a new Nuxt 4 project with `nuxi module add`.
- [x] Build the clean Nuxt 4 project for production.
- [x] Create the matching `v0.1.0` tag and GitHub release.

## Documentation and listing

- [x] Run the manual `Deploy docs` workflow.
- [x] Verify the public homepage, assets, navigation, canonical metadata, and layout.
- [x] Submit [`nuxt/modules#1555`](https://github.com/nuxt/modules/issues/1555).
- [ ] Confirm the module appears on nuxt.com and the install command succeeds.

Publishing, deployment, and the Nuxt Modules request are external actions
and require an authorized maintainer.
