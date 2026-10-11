<script lang="ts">
	import { ChevronRight } from "@lucide/svelte";
	import { cubicOut } from "svelte/easing";
	import { fade, fly } from "svelte/transition";
	import { isActive, type NavLink } from "./nav";

	const {
		links,
		current,
		onpick,
		onclose,
	}: {
		links: NavLink[];
		current: string;
		onpick: (e: MouseEvent, path: string) => void;
		onclose: () => void;
	} = $props();

	const CLOSE_DRAG = 80;
	const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

	let dragStart: number | null = null;
	let dragY = $state(0);

	function onPointerDown(e: PointerEvent) {
		dragStart = e.clientY;
		(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
	}

	function onPointerMove(e: PointerEvent) {
		if (dragStart !== null) {
			dragY = Math.max(0, e.clientY - dragStart);
		}
	}

	function onPointerUp() {
		if (dragStart === null) {
			return;
		}
		dragStart = null;
		if (dragY > CLOSE_DRAG) {
			onclose();
		}
		dragY = 0;
	}

	function onKeydown(e: KeyboardEvent) {
		if (e.key === "Escape") {
			onclose();
		}
	}
</script>

<svelte:document onkeydown={onKeydown} />

<button
	type="button"
	class="backdrop"
	aria-label="Close"
	tabindex="-1"
	onclick={onclose}
	transition:fade={{ duration: reducedMotion ? 0 : 150 }}
></button>

<div
	class="sheet"
	class:is-dragging={dragY > 0}
	role="dialog"
	aria-modal="true"
	aria-label="More pages"
	style:transform={dragY ? `translateY(${dragY}px)` : undefined}
	transition:fly={{ y: 320, duration: reducedMotion ? 0 : 240, easing: cubicOut }}
>
	<button
		type="button"
		class="sheet__grab"
		aria-label="Close"
		onclick={onclose}
		onpointerdown={onPointerDown}
		onpointermove={onPointerMove}
		onpointerup={onPointerUp}
		onpointercancel={onPointerUp}
	>
		<span></span>
	</button>
	<ul class="sheet__list">
		{#each links as link (link.path)}
			<li>
				<a
					href={link.path}
					class:is-active={isActive(link.path, current)}
					aria-current={isActive(link.path, current) ? "page" : undefined}
					onclick={(e) => onpick(e, link.path)}
				>
					<span class="sheet__icon"><link.icon size={18} strokeWidth={1.75} /></span>
					<span class="sheet__label">{link.label}</span>
					<ChevronRight size={16} class="sheet__chevron" />
				</a>
			</li>
		{/each}
	</ul>
</div>

<style>
	.backdrop {
		position: fixed;
		inset: 0;
		z-index: 101;
		padding: 0;
		border: 0;
		background: rgb(0 0 0 / 0.4); /* raw: a scrim, the same in every theme */
		-webkit-tap-highlight-color: transparent;
	}

	.sheet {
		position: fixed;
		inset: auto 0 0;
		z-index: 102;
		padding: 0 var(--abt-space-5) calc(var(--abt-space-5) + env(safe-area-inset-bottom));
		background: var(--color-mobileNavBackground);
		border-top-left-radius: var(--abt-radius-lg);
		border-top-right-radius: var(--abt-radius-lg);
		box-shadow: 0 -8px 32px rgb(0 0 0 / 0.25); /* raw: a shadow, not a tint */
		transition: transform 0.2s ease;
	}

	.sheet.is-dragging {
		transition: none;
	}

	.sheet__grab {
		display: grid;
		place-items: center;
		width: 100%;
		height: 28px;
		padding: 0;
		border: 0;
		background: none;
		touch-action: none;
		-webkit-tap-highlight-color: transparent;
	}

	.sheet__grab span {
		width: 36px;
		height: 5px;
		border-radius: var(--abt-radius-pill);
		background: var(--abt-ink-4);
	}

	.sheet__list {
		margin: 0;
		padding: 0;
		list-style: none;
		overflow: hidden;
		border-radius: var(--abt-radius-lg);
		background: var(--abt-ink-1);
	}

	.sheet__list li + li a::before {
		content: "";
		position: absolute;
		inset: 0 0 auto 52px;
		border-top: 1px solid var(--abt-ink-2);
	}

	.sheet__list a {
		position: relative;
		display: flex;
		align-items: center;
		gap: var(--abt-space-4);
		min-height: 48px;
		padding: 0 var(--abt-space-4);
		color: var(--color-mobileNavItem);
		font-size: var(--abt-text-xl);
		text-decoration: none;
		-webkit-tap-highlight-color: transparent;
	}

	.sheet__list a:active {
		background: var(--abt-ink-2);
	}

	.sheet__icon {
		display: grid;
		place-items: center;
		width: 28px;
		height: 28px;
		flex-shrink: 0;
		border-radius: var(--abt-radius-sm);
		background: var(--abt-ink-2);
	}

	.sheet__list a.is-active {
		color: var(--abt-accent);
	}

	.sheet__list a.is-active .sheet__icon {
		background: var(--abt-accent-2);
	}

	.sheet__label {
		flex: 1;
	}

	.sheet__list :global(.sheet__chevron) {
		color: var(--abt-subtle);
	}
</style>
