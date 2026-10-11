/**
 * Runs `fetch` now and then every `ms` while the tab is visible. A hidden tab makes no requests;
 * on its return, a refresh that came due while away runs straight away. Returns a stop function.
 */
export function refreshWhileVisible(fetch: () => void, ms: number): () => void {
	let timer: ReturnType<typeof setInterval> | null = null;
	let last = 0;

	const run = () => {
		last = Date.now();
		fetch();
	};
	const start = () => {
		if (Date.now() - last >= ms) {
			run();
		}
		timer = setInterval(run, ms);
	};
	const stop = () => {
		if (timer) {
			clearInterval(timer);
			timer = null;
		}
	};
	const onVisibility = () => {
		stop();
		if (document.visibilityState === "visible") {
			start();
		}
	};

	if (document.visibilityState === "visible") {
		start();
	} else {
		// Still shows a first value when mounted in a background tab.
		run();
	}
	document.addEventListener("visibilitychange", onVisibility);
	return () => {
		stop();
		document.removeEventListener("visibilitychange", onVisibility);
	};
}
