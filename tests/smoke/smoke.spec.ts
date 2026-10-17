import { type Page, expect, test } from "@playwright/test";

/**
 * Opens every page Actual has with every ABT tweak on, and fails on ABT errors or on a marker ABT
 * should have set. Catches the breakage type checks can't: an Actual release that moves an anchor.
 */

const PASSWORD = "abt-smoke-test";
const ABT_SCRIPT = "/abt/";

let page: Page;
const errors: string[] = [];

function watchErrors(p: Page): void {
	p.on("pageerror", (error) => {
		if (error.stack?.includes(ABT_SCRIPT)) {
			errors.push(`uncaught: ${error.message}`);
		}
	});
	p.on("console", (message) => {
		if (message.type() === "error" && message.text().includes("ABT")) {
			errors.push(`console: ${message.text()}`);
		}
	});
}

function expectNoErrors(): void {
	expect(errors.splice(0), "ABT errors on this page").toEqual([]);
}

/** Sets the server password the first time, then signs in. */
async function signIn(p: Page): Promise<void> {
	await p.goto("/");
	const confirm = p.getByRole("textbox", { name: "Confirm password" });
	const signInBox = p.locator('input[type="password"]');
	await expect(confirm.or(p.getByRole("button", { name: "Sign in" }))).toBeVisible();
	if (await confirm.isVisible()) {
		await p.getByRole("textbox", { name: "Password", exact: true }).fill(PASSWORD);
		await confirm.fill(PASSWORD);
		await confirm.press("Enter");
	}
	await expect(p.getByRole("button", { name: "Sign in" })).toBeVisible();
	await signInBox.fill(PASSWORD);
	await signInBox.press("Enter");
}

/** A fresh budget with an on-budget and an off-budget account, so the sidebar has both sections. */
async function openBudget(p: Page): Promise<void> {
	await p.getByRole("button", { name: "Start budgeting" }).click();
	await expect(p.locator('[data-testid="budget-table"]')).toBeVisible();
	await p.waitForFunction(() => typeof (window as { $send?: unknown }).$send === "function");
	await p.evaluate(async () => {
		const send = (
			window as unknown as { $send: (name: string, args?: unknown) => Promise<unknown> }
		).$send;
		await send("account-create", { name: "Checking", balance: 250000, offBudget: false });
		await send("account-create", { name: "House", balance: 30000000, offBudget: true });
	});
}

/** ABT's settings: their own tab where Actual's settings have pages, else a card on the one page. */
async function openTweaks(p: Page): Promise<void> {
	await p.goto("/settings");
	const tab = p.locator("[data-abt-tweaks-link]");
	const panel = p.locator(".settings-page");
	await expect(tab.or(panel).first()).toBeVisible();
	if (await tab.isVisible()) {
		await tab.click();
	}
	await expect(panel).toBeVisible();
}

/**
 * Turns on every switch in ABT's settings, one at a time so each feature starts on its own. A
 * setting that needs another one on sits in an inert row until that one is on.
 */
async function enableEverything(p: Page): Promise<void> {
	for (let guard = 0; guard < 200; guard++) {
		// Marked as tried, so a switch that stays off (a sub-option of a picker, say) isn't retried.
		const clicked = await p.evaluate(() => {
			const next = document.querySelector<HTMLInputElement>(
				'.settings-page input[type="checkbox"]:not(:checked):not(:disabled):not([inert] input):not([data-smoke-tried])',
			);
			next?.setAttribute("data-smoke-tried", "");
			next?.click();
			return !!next;
		});
		if (!clicked) {
			return;
		}
		// Lets the row it unlocks (a setting that needs this one) leave its inert state.
		await p.waitForTimeout(50);
	}
	throw new Error("More switches than expected; the settings list may be re-rendering");
}

test.describe.serial("ABT on every page", () => {
	test.beforeAll(async ({ browser }) => {
		test.setTimeout(180_000);
		page = await browser.newPage({ viewport: { width: 1400, height: 900 } });
		watchErrors(page);
		await signIn(page);
		await openBudget(page);
		await openTweaks(page);
		await enableEverything(page);
		errors.length = 0;
	});

	test.afterAll(async () => {
		await page.close();
	});

	test.afterEach(async () => {
		await test.info().attach("page", { body: await page.screenshot(), contentType: "image/png" });
	});

	test("budget", async () => {
		await page.goto("/budget");
		await expect(page.locator('[data-testid="budget-table"]')).toBeVisible();
		await expect(page.locator("[data-abt-live-sidebar]")).toBeAttached();
		await expect(page.locator("[data-abt-header]")).toBeAttached();
		await expect(page.locator("[data-abt-content-grid]")).toBeAttached();
		expectNoErrors();
	});

	test("accounts", async () => {
		await page.goto("/accounts");
		await expect(page.locator('[data-abt-page="accounts"]')).toBeAttached();
		await expect(page.locator("[data-abt-live-sidebar]")).toContainText("House");
		expectNoErrors();
	});

	test("reports", async () => {
		await page.goto("/reports");
		await expect(page.locator('[data-testid="reports-page"]')).toBeVisible();
		await expect(page.locator("[data-abt-reports-dashboard]")).toBeAttached();
		expectNoErrors();
	});

	test("schedules", async () => {
		await page.goto("/schedules");
		await expect(page.locator('[data-abt-page="schedules"]')).toBeAttached();
		expectNoErrors();
	});

	// Newer Actual moves these under /settings/ and redirects the old addresses there.
	for (const name of ["payees", "rules", "tags"]) {
		test(name, async () => {
			await page.goto(`/${name}`);
			await expect(page.locator(`[data-abt-page="${name}"]`)).toBeAttached();
			expectNoErrors();
		});
	}

	test("settings", async () => {
		await openTweaks(page);
		await expect(page.locator(".settings-page .settings-section").first()).toBeVisible();
		expectNoErrors();
	});

	test("mobile", async () => {
		await page.setViewportSize({ width: 420, height: 850 });
		await page.goto("/budget");
		await expect(page.locator("[data-abt-content-grid]")).toBeAttached();
		await openTweaks(page);
		expectNoErrors();
		await page.setViewportSize({ width: 1400, height: 900 });
	});
});
