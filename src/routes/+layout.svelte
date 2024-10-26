<script lang="ts">
	import 'ghostsui';
	import type { Snippet } from 'svelte';

	interface Props {
		children: Snippet;
	}

	const { children }: Props = $props();
</script>

<main>
	{@render children()}
</main>

<style>
	main {
		padding: 32px;
	}
</style>
