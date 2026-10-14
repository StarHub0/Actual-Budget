import { defineSetting } from "@features/types";
import HighlightUncategorizedPreview from "./previews/HighlightUncategorized.svelte";
import { watchDom } from "@lib/utilities/dom-watcher";

const CSS = `
	[data-testid="row"].abt-uncategorized {
		background: color-mix(in srgb, var(--color-warningText) 12%, transparent) !important;
	}

	[data-testid="row"].abt-uncategorized > div {
		border-color: transparent !important;
	}
`;

function markRows() {
	// From the category cells, so the budget table's rows (which have none) aren't visited.
	for (const catCell of document.querySelectorAll('[data-testid="row"] [data-testid="category"]')) {
		const row = catCell.closest('[data-testid="row"]');
		const text = catCell.textContent?.trim() || "";
		row?.classList.toggle("abt-uncategorized", text === "Categorize" || text === "");
	}
}

function cleanup() {
	for (const el of document.querySelectorAll(".abt-uncategorized")) {
		el.classList.remove("abt-uncategorized");
	}
}

export const highlightUncategorized = defineSetting({
	type: "checkbox",
	label: "Highlight Uncategorized Transactions",
	description: "Flag transactions that are missing a category.",
	group: "Transactions",
	icon: "star",
	preview: HighlightUncategorizedPreview,
	context: {
		key: "highlight-uncategorized",
		defaultValue: true,
	},
	css: () => CSS,
	init: () => {
		const unwatch = watchDom(markRows);

		return () => {
			unwatch();
			cleanup();
		};
	},
});
