import { defineSetting } from "@features/types";

// The colour inherits, so it's set only where ui.css redeclares --abt-ink-5, not resolved on every
// element. No !important: scrollers that hide their bar keep it hidden.
const CSS = `
	:root,
	.sidebar,
	.abt-popover {
		scrollbar-color: var(--abt-ink-5) transparent;
	}

	* {
		scrollbar-width: thin;
	}
`;

export const themedScrollbars = defineSetting({
	type: "checkbox",
	label: "Themed Scrollbars",
	description: "Thin scrollbars tinted to match the theme.",
	group: "General",
	icon: "sliders",
	context: {
		key: "themed-scrollbars",
		defaultValue: true,
	},
	css: () => CSS,
});
