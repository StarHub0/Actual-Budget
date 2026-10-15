<script lang="ts">
	import type { LucideIcon } from "@lucide/svelte";

	let { icon: Icon }: { icon: LucideIcon } = $props();
</script>

<Icon size={15} strokeWidth={1.5} />
