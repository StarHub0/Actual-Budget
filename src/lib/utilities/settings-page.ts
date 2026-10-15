/** Actual's settings nav (actualbudget/actual#9110); older Actual lists every setting on one page. */
export const SETTINGS_NAV_LINK = '[role="navigation"] > a[href="/settings/general"]';
export const TWEAKS_HASH = "#tweaks";
/** Where ABT's settings mount while its tab is open. */
export const TWEAKS_HOST_ATTR = "data-abt-tweaks-host";
/** Under ABT's tab in the nav, where its panel lists its sections while open. */
export const TWEAKS_SECTIONS_ATTR = "data-abt-tweaks-sections";

export function settingsNav(): HTMLElement | null {
	return document.querySelector(SETTINGS_NAV_LINK)?.parentElement ?? null;
}

/** Actual 26.11+ splits Settings into pages under /settings/; older Actual has the one page. */
export function hasSettingsPages(): boolean {
	return location.pathname.startsWith("/settings/") || !!settingsNav();
}

/**
 * ABT's settings panel goes in its own tab where Settings has pages, else in place of the second
 * card of the one-page settings.
 */
export function settingsAnchor(): string {
	return hasSettingsPages() ? `[${TWEAKS_HOST_ATTR}]` : "[data-testid='settings'] > :nth-child(2)";
}
