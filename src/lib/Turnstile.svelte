<script context="module" lang="ts">
    declare global {
        interface Window {
            onloadTurnstileCallback: () => void;
            turnstile: {
                render: (
                    element: string | HTMLElement,
                    options: TurnstileOptions,
                ) => string;
                reset: (widgetId: string) => void;
                getResponse: (widgetId: string) => string | undefined;
            };
        }
    }

    interface TurnstileOptions {
        sitekey: string;
        action?: string;
        cData?: string;
        callback?: (token: string) => void;
        'error-callback'?: () => void;
        'expired-callback'?: () => void;
        theme?: 'light' | 'dark' | 'auto';
        tabindex?: number;
    }
</script>

<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    import { onMount } from 'svelte';

    const dispatch = createEventDispatcher();

    let loaded = false;
    let mounted = false;
    let node: HTMLElement;

    let widgetId: string;

    export let siteKey: string;

    export let theme: TurnstileOptions['theme'] = 'auto';
    export let action: string | undefined = undefined;
    export let cData: string | undefined = undefined;
    export let tabIndex = 0;

    onMount(() => {
        mounted = true;

        return () => {
            mounted = false;
            loaded = false;
        };
    });

    function loadCallback() {
        console.log('Turnstile loaded');
        loaded = true;
    }

    function error() {
        dispatch('turnstile-error', {});
    }

    function expired() {
        dispatch('turnstile-expired', {});

        if (widgetId) {
            window.turnstile.reset(widgetId);
        }
    }

    function callback(token: string) {
        dispatch('turnstile-callback', { token });
    }

    $: if (loaded && node) {
        console.log('Rendering Turnstile');

        widgetId = window.turnstile.render(node, {
            'expired-callback': expired,
            'error-callback': error,
            callback,

            sitekey: siteKey,

            tabindex: tabIndex,
            action,
            theme,
            cData,
        });
    }
</script>

<svelte:head>
    {#if mounted}
        <script
            src="https://challenges.cloudflare.com/turnstile/v0/api.js"
            on:load={loadCallback}
            async></script>
    {/if}
</svelte:head>

<div bind:this={node} />
