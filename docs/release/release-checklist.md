# Release checklist

## Before publishing

- [ ] Update both package versions and move the changelog entry out of Unreleased.
- [ ] Run `pnpm verify:replacement` on Node.js 22.
- [ ] Confirm the README runtime screenshot matches the committed Playwright snapshot.
- [ ] Confirm package ownership and the `NPM_TOKEN` environment secret.
- [ ] Review provider endpoints whose `verifiedAt` date is older than the release window.

## Publish

- [ ] Run the manual `Release` GitHub Actions workflow.
- [ ] Confirm `@nuxt-sharekit/core` is published before `nuxt-sharekit`.
- [ ] Install `nuxt-sharekit` in a new Nuxt 4 project with `nuxi module add`.
- [ ] Create a GitHub release from the matching version tag.

## Documentation and listing

- [ ] Run the manual `Deploy docs` workflow.
- [ ] Verify light, dark, mobile, keyboard, and no-JavaScript examples.
- [ ] Submit `docs/release/nuxt-modules.yml` to `nuxt/modules`.
- [ ] Confirm the module appears on nuxt.com and the install command succeeds.

Publishing, deployment, and the Nuxt Modules pull request are external actions
and require an authorized maintainer.
