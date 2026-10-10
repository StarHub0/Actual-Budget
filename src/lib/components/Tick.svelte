<script lang="ts">
	import { Check, Minus } from "lucide-svelte";

	const {
		checked,
		mixed = false,
		onCheckedChange,
		disabled = false,
		id,
	}: {
		checked: boolean;
		/** Some but not all of what it controls is on; drawn as a dash. */
		mixed?: boolean;
		onCheckedChange: (checked: boolean) => void;
		disabled?: boolean;
		id?: string;
	} = $props();
</script>

<span class="check" class:is-on={checked || mixed}>
	<input
		type="checkbox"
		class="check__input"
		{id}
		{checked}
		{disabled}
		indeterminate={mixed}
		onchange={(e) => onCheckedChange(e.currentTarget.checked)}
	/>
	<span class="check__box" aria-hidden="true">
		{#if mixed}
			<Minus size={10} strokeWidth={3} />
		{:else if checked}
			<Check size={10} strokeWidth={3} />
		{/if}
	</span>
</span>

<style>
	/* The Switch's colours in a square, for lists where many items toggle at once. */
	.check {
		position: relative;
		display: inline-flex;
		flex-shrink: 0;
		width: 14px;
		height: 14px;
	}

	.check__input {
		position: absolute;
		inset: 0;
		margin: 0;
		opacity: 0;
		cursor: pointer;
	}

	.check__input:disabled {
		cursor: not-allowed;
	}

	.check__box {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100%;
		height: 100%;
		box-sizing: border-box;
		border: 1.5px solid var(--abt-ink-5);
		border-radius: min(var(--abt-radius-sm), 3px);
		color: white;
		pointer-events: none;
		transition:
			background-color 0.15s,
			border-color 0.15s;
	}

	.check:hover .check__box {
		border-color: var(--abt-subtle);
	}

	.check.is-on .check__box {
		border-color: var(--abt-accent);
		background: var(--abt-accent);
	}

	.check__input:disabled ~ .check__box {
		opacity: 0.4;
	}

	.check__input:focus-visible ~ .check__box {
		outline: 2px solid var(--color-formInputBorderSelected);
		outline-offset: 2px;
	}
</style>
