# Nuxt Modules submission

The candidate database entry is `docs/release/nuxt-modules.yml`. After the npm
package and public docs URL are live:

1. Fork and clone [`nuxt/modules`](https://github.com/nuxt/modules).
2. Run `pnpm sync sharekit Ray0907/nuxt-sharekit` in that repository.
3. Compare the generated `modules/sharekit.yml` with the candidate file.
4. Run the upstream build and validation commands.
5. Open a pull request with installation and documentation links.

Do not submit before the npm package exists: the Nuxt database automatically
syncs npm metadata and cannot validate an unpublished package.
