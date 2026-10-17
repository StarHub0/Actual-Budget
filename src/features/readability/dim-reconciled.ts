import { defineSetting } from "@features/types";
import { watchDom } from "@lib/utilities/dom-watcher";
import DimReconciledPreview from "./previews/DimReconciled.svelte";
import { CLEARED_CELL, ROW, byTestId } from "@lib/actual-dom";

// Marked in JS: as `row:has(<lock>)`, every test id Actual rewrote anywhere restyled the page.
const RECONCILED_ATTR = "data-abt-reconciled";
const LOCK = 'svg[viewBox="0 0 20 20"]';
const DIMMED_CELLS = [
	"date",
	"account",
	"payee",
	"notes",
	"category",
	"payment",
	"deposit",
	"debit",
	"credit",
	"select",
	"balance",
	"cleared",
]
	.map((id) => `[${RECONCILED_ATTR}] ${byTestId(id)}`)
	.join(",\n\t\t\t");

function markRows() {
	for (const cleared of document.querySelectorAll(`${ROW} ${CLEARED_CELL}`)) {
		cleared.closest(ROW)?.toggleAttribute(RECONCILED_ATTR, !!cleared.querySelector(LOCK));
	}
}

export const dimReconciled = defineSetting({
	type: "checkbox",
	label: "Dim Reconciled Transactions",
	description: "Fade reconciled rows in the transaction table.",
	group: "Transactions",
	icon: "eyeOff",
	preview: DimReconciledPreview,
	context: {
		key: "dim-reconciled",
		defaultValue: true,
	},
	css: () => `
		${DIMMED_CELLS} {
			opacity: 0.45;
		}
	`,
	init: () => {
		const unwatch = watchDom(markRows);
		return () => {
			unwatch();
			for (const row of document.querySelectorAll(`[${RECONCILED_ATTR}]`)) {
				row.removeAttribute(RECONCILED_ATTR);
			}
		};
	},
});
