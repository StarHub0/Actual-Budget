import { defineSetting } from "@features/types";
import { BUDGET_SCROLLER, BUDGET_SUMMARY, BUDGET_TOTALS } from "@lib/actual-dom";

export const budgetPageBorders = defineSetting({
	type: "checkbox",
	label: "Budget Page Borders",
	description: "Add borders around sections of the budget table.",
	group: "Budget",
	icon: "square",
	context: {
		key: "budget-page-borders",
		defaultValue: true,
	},
	css: () => `
		/* /budget -- budget cards */
		${BUDGET_SUMMARY} {
			border: var(--border);
		}

		/* /budget -- table header */
		${BUDGET_TOTALS} {
			border: var(--border);
		}

		/* /budget -- table body. */
		${BUDGET_SCROLLER} > div > div {
			border: var(--border);
			border-top: 0px;
		}
	`,
});
