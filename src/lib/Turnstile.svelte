<script context="module" lang="ts">
    // Credit for the type defs go to @Le0Developer
    // https://github.com/Le0Developer/react-turnstile/blob/420eddf1e0bde2ad593dd78bd99b8f134ce8a754/src/index.tsx#L139

    declare global {
        interface Window {
            turnstile: {
                render: (
                    element: string | HTMLElement,
                    options: TurnstileOptions,
                ) => string;
                reset: (widgetId: string) => void;
                getResponse: (widgetId: string) => string | undefined;
                remove: (widgetId: string) => void;
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
        theme?: TurnstileTheme;
        tabindex?: number;
        size?: TurnstileSize;
        'response-field'?: boolean;
        'response-field-name'?: string;
    }

    export type TurnstileSize = 'normal' | 'compact';
    export type TurnstileTheme = 'light' | 'dark' | 'auto';
</script>

<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    import type { Action } from 'svelte/action';
    import { onMount } from 'svelte';

    const dispatch = createEventDispatcher<{
        'turnstile-expired': {};
        'turnstile-callback': { token: string };
        'turnstile-error': {};
    }>();

    let loaded = false;
    let mounted = false;

    let widgetId: string;

    export let siteKey: string;

    export let formsField: string = 'cf-turnstile-response';
    export let action: string | undefined = undefined;
    export let cData: string | undefined = undefined;
    export let theme: TurnstileTheme = 'auto';
    export let size: TurnstileSize = 'normal';
    export let forms = true;
    export let tabIndex = 0;

    onMount(() => {
        mounted = true;

        return () => {
            mounted = false;
            loaded = false;
        };
    });

    function loadCallback() {
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

    const turnstile: Action = (node) => {
        const id = window.turnstile.render(node, {
            'expired-callback': expired,
            'error-callback': error,
            callback,

            sitekey: siteKey,

            'response-field-name': formsField,
            'response-field': forms,
            tabindex: tabIndex,
            action,
            theme,
            cData,
            size,
        });

        widgetId = id;

        return {
            destroy: () => {
                window.turnstile.remove(id);
            },
        };
    };
</script>

<svelte:head>
    {#if mounted}
        <script
            src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
            on:load={loadCallback}
            async></script>
    {/if}
</svelte:head>

{#if loaded && mounted}
    {#key $$props}
        <div use:turnstile />
    {/key}
{/if}
