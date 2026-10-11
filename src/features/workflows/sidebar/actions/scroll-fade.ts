// Fades whichever edge(s) of a scrollable container have more content
// hidden past them, rather than a static bottom-only fade.

const FADE = 34; // px — matches the sidebar's original static fade size

const MASK = {
	none: "none",
	top: `linear-gradient(black 0%, black calc(100% - ${FADE}px), transparent 100%)`,
	bottom: `linear-gradient(transparent 0px, black ${FADE}px, black 100%)`,
	middle: `linear-gradient(transparent 0px, black ${FADE}px, black calc(100% - ${FADE}px), transparent 100%)`,
} as const;

function update(node: HTMLElement, lastState: { value: keyof typeof MASK | null }) {
	const maxScroll = node.scrollHeight - node.clientHeight;
	const state =
		maxScroll <= 1
			? "none"
			: node.scrollTop <= 0
				? "top"
				: node.scrollTop >= maxScroll - 1
					? "bottom"
					: "middle";
	// The ResizeObserver below fires often (live data reflows constantly);
	// skip the write unless the fade state actually changed, or every
	// no-op firing forces a repaint on this masked layer.
	if (state === lastState.value) {
		return;
	}
	lastState.value = state;
	node.style.setProperty("mask-image", MASK[state]);
	node.style.setProperty("-webkit-mask-image", MASK[state]);
	node.classList.toggle("is-scrollable", state !== "none");
}

export function scrollFade(node: HTMLElement) {
	const lastState: { value: keyof typeof MASK | null } = { value: null };
	const onScroll = () => update(node, lastState);
	node.addEventListener("scroll", onScroll, { passive: true });

	// Content can grow/shrink (accounts added, groups expanded/collapsed)
	// without a scroll event ever firing — a ResizeObserver on the node
	// itself catches that too.
	const ro = new ResizeObserver(() => update(node, lastState));
	ro.observe(node);
	update(node, lastState);

	return {
		destroy() {
			node.removeEventListener("scroll", onScroll);
			ro.disconnect();
		},
	};
}
