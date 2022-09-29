<script lang="ts">
    import { Turnstile, type TurnstileTheme } from '$lib';

    let siteKey = '1x00000000000000000000AA';
    let theme: TurnstileTheme = 'auto';
</script>

<section class="row">
    <label>
        Demo Key type

        <select bind:value={siteKey}>
            <option value="1x00000000000000000000AA">Always Pass</option>
            <option value="2x00000000000000000000AB">Always Block</option>
            <option value="3x00000000000000000000FF">
                Force interactive challenge
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
</section>

<section>
    <Turnstile {siteKey} {theme} />
</section>

<style lang="scss">
    label {
        display: flex;
        flex-direction: column;
        gap: 8px;
    }
</style>
