# Contributing

## Local setup

1. `pnpm install`
2. `pnpm dev` — starts WXT's dev server, building to `.output/chrome-mv3-dev` and rebuilding on save.
3. Load it as an unpacked extension: `chrome://extensions` → enable Developer Mode → **Load unpacked** → select `.output/chrome-mv3-dev`.
4. Open an Actual Budget instance in a tab (self-hosted, or [app.actualbudget.org](https://actualbudget.org)) and set its URL from the extension's popup if it doesn't detect it automatically.

`pnpm dev:firefox` / `pnpm build:firefox` exist for Firefox, loaded via `about:debugging` → **This Firefox** → **Load Temporary Add-on**.

## Adding a feature

Every feature is one call to `defineSetting()` (see `src/features/types.ts`), exported as a named const and listed in `src/features/index.ts`. Scaffold one:

```
pnpm new-feature <category> <kebab-name> "<Label>" <checkbox|select|custom> [--component]
```

- `category` is `layout` / `readability` / `appearance` / `workflows` — whichever settings-panel section it belongs under.
- `--component` generates a folder + companion `.svelte` file, for a feature that needs its own component rather than a plain checkbox/select row.

This creates the setting file and registers it in `src/features/index.ts` for you. From there, fill in `description`/`icon`, and implement `init`/`css`.

### Desktop and mobile

Below 512px, Actual renders a separate mobile app with its own markup, so a setting declares where it runs with `platform`: `"desktop"` (the default), `"mobile"` or `"all"`. The runtime starts and stops each one as the window crosses that width, and scopes its `css` to match (`desktopOnly()` / `mobileOnly()` in `src/lib/utilities/pages.ts`). Mobile-only tweaks live in `src/features/mobile/` and are listed in the Mobile section of `src/features/index.ts`; `new-feature` doesn't scaffold them yet, so add them by hand.

## Conventions

- **Page-gate inside the watcher, not around it.** Register a permanent `watchDom()` callback (`src/lib/utilities/dom-watcher.ts`) in `init` that checks `matchesPage()` (`src/lib/utilities/pages.ts`) and returns early on the wrong page — not a start/stop pair triggered by route changes.
- **Cleanup is on you.** Whatever `init` sets up (listeners, observers, injected DOM) is only undone by whatever cleanup function you return from it. Toggle the setting off and confirm nothing's left behind before opening a PR.
- **Prefer `data-testid` selectors over structural CSS** where Actual's DOM exposes one — less likely to break on an Actual update than `nth-child`/hashed-class selectors. No `data-testid`? Structural CSS is fine, just know it's the more fragile choice.
- **Conventional commits** (`feat:`, `fix:`, `chore:`) — this repo uses [changelogen](https://github.com/unjs/changelogen), which builds `CHANGELOG.md` and bumps the version from commit messages on every merge to `main`.

The Actual API bridge (`src/lib/utilities/actual-api.ts` — `query`/`send`/`dispatch`/`navigate`) is generic: it forwards whatever table/method name you give it. Typed autocomplete comes from `ActualTable`/`SendMethodMap` in `src/lib/types/actual-schema.ts` — needing an untyped table or method is usually a type-only change there, not a change to the runtime bridge.

## Before opening a PR

Run `pnpm format && pnpm check && pnpm lint` — CI runs the same checks (plus both builds) on every PR. Test against a real Actual instance; none of those checks catch a selector that stopped matching or a popover that doesn't close.
