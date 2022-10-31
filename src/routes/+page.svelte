<script lang="ts">
    import { Turnstile, type TurnstileSize, type TurnstileTheme } from '$lib';
    import type { ActionData } from './$types';
    import { enhance } from '$app/forms';

    export let form: ActionData;

    let secretKey = '1x0000000000000000000000000000000AA';
    let siteKey = '1x00000000000000000000AA';
    let theme: TurnstileTheme = 'auto';
    let size: TurnstileSize = 'normal';
</script>

<section class="row">
    <label>
        Demo Site Key type

        <select bind:value={siteKey}>
            <option value="1x00000000000000000000AA">Always Pass</option>
            <option value="2x00000000000000000000AB">Always Block</option>
            <option value="3x00000000000000000000FF">
                Force interactive challenge
            </option>
        </select>
    </label>

    <label>
        Demo Secret Key type

        <select bind:value={secretKey}>
            <option value="1x0000000000000000000000000000000AA">
                Always Pass
            </option>

            <option value="2x0000000000000000000000000000000AA">
                Always Block
            </option>

            <option value="3x0000000000000000000000000000000AA">
                Token already spent error
            </option>
        </select>
    </label>

    <label>
        Theme

        <select bind:value={theme}>
            <option value="auto">Auto</option>
            <option value="dark">Dark</option>
            <option value="light">Light</option>
        </select>
    </label>

    <label>
        Size

        <select bind:value={size}>
            <option value="normal">Normal</option>
            <option value="invisible">Invisible</option>
            <option value="compact">Compact</option>
        </select>
    </label>
</section>

<section>
    <form method="POST" use:enhance>
        <Turnstile {size} {siteKey} {theme} />
        <input type="hidden" name="secret" bind:value={secretKey} />
        <button>Validate</button>
    </form>

    <p style="margin-top: 8px;">
        {#if form}
            {form.error ? `Error: ${form.error}` : 'Success'}
        {:else}
            Not submitted form
        {/if}
    </p>
</section>

<style lang="scss">
    label {
        display: flex;
        flex-direction: column;
        gap: 8px;
    }
</style>
