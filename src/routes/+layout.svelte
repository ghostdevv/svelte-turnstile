<script lang="ts">
	import 'ghostsui';

	const { children } = $props();
</script>

<main>
	{@render children()}
</main>

<style>
	main {
		padding: 32px;
	}
</style>
