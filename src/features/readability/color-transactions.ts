import { defineSetting } from "@features/types";
import ColorTransactionsPreview from "./previews/ColorTransactions.svelte";
import { watchDom } from "@lib/utilities/dom-watcher";

const UPCOMING_ATTR = "data-abt-upcoming";
const ROW = '[data-testid="transaction-table"] [data-testid="row"]';

// Marks rows only when their state changes; CSS colours them, so a row Actual reuses for
// another transaction loses the colour with the mark.
function markUpcomingRows() {
	for (const row of document.querySelectorAll(ROW)) {
		const upcoming =
			row.querySelector('[data-testid="category"]')?.firstElementChild?.textContent === "Upcoming";
		if (upcoming !== row.hasAttribute(UPCOMING_ATTR)) {
			row.toggleAttribute(UPCOMING_ATTR, upcoming);
		}
	}
}

function cleanup() {
	for (const row of document.querySelectorAll(`[${UPCOMING_ATTR}]`)) {
		row.removeAttribute(UPCOMING_ATTR);
	}
}

export const colorTransactions = defineSetting({
	type: "checkbox",
	label: "Color Transactions",
	description: "Color negative and positive transactions.",
	group: "Transactions",
	icon: "palette",
	preview: ColorTransactionsPreview,
	context: {
		key: "actual-amountcolors",
		defaultValue: true,
	},
	css: () => `
		*[data-testid='credit'] {
			color: var(--color-numberPositive) !important;
		}
		*[data-testid='debit'] {
			color: var(--color-numberNegative) !important;
		}
		[${UPCOMING_ATTR}] :is([data-testid="date"], [data-testid="account"], [data-testid="payee"], [data-testid="notes"]) {
			color: var(--ctp-peach, var(--color-warningText));
		}
	`,
	init: () => {
		const unwatch = watchDom(markUpcomingRows);

		return () => {
			unwatch();
			cleanup();
		};
	},
});
