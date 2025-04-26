<script lang="ts">
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { superForm } from 'sveltekit-superforms';
	import Turnstile from '$lib/Turnstile.svelte';
	import { schema } from './schema';

	export let data;

	let turnstile: Turnstile;

	const { form, errors, constraints, message, enhance } = superForm(
		data.form,
		{
			validators: zodClient(schema),
			onUpdated() {
				turnstile.reset();
			},
		},
	);
</script>

<section>
	<form method="POST" use:enhance>
		<label for="name">Name</label>
		<input
			type="text"
			name="name"
			aria-invalid={$errors.name ? 'true' : undefined}
			bind:value={$form.name}
			{...$constraints.name} />

		{#if $errors.name}
			<span class="invalid">{$errors.name}</span>
		{/if}

		<Turnstile sitekey="3x00000000000000000000FF" bind:this={turnstile} />

		{#if $errors['cf-turnstile-response']}
			<span class="invalid">{$errors['cf-turnstile-response']}</span>
		{/if}

		<div class="row">
			<button formaction="?/pass">Pass</button>
			<button formaction="?/fail">Fail</button>
		</div>
	</form>
</section>

<section>
	{#if $message}
		<h3>{$message}</h3>
	{/if}
</section>
