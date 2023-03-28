<script context="module" lang="ts">
    // Thanks to @Le0Developer for his typedefs which these are based on
    // https://github.com/Le0Developer/react-turnstile/blob/01cc403b043955f9698fd9d498667fc181e4128b/src/index.tsx#L136

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
        'timeout-callback'?: () => void;
        theme?: TurnstileTheme;
        tabindex?: number;
        size?: TurnstileSize;
        'response-field'?: boolean;
        'response-field-name'?: string;
        'retry-interval'?: number;
        retry?: TurnstileRetry;
    }

    export type TurnstileRetry = 'auto' | 'never';
    export type TurnstileSize = 'normal' | 'compact';
    export type TurnstileTheme = 'light' | 'dark' | 'auto';
</script>

<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    import type { Action } from 'svelte/action';
    import { onMount } from 'svelte';

    const dispatch = createEventDispatcher<{
        'turnstile-callback': { token: string };
        'turnstile-error': {};
        'turnstile-expired': {};
        'turnstile-timeout': {};
    }>();

    let loaded = false;
    let mounted = false;

    let widgetId: string;

    export let siteKey: string;

    export let formsField: string = 'cf-turnstile-response';
    export let action: string | undefined = undefined;
    export let cData: string | undefined = undefined;
    export let retryInterval: number | undefined = 8000;
    export let retry: TurnstileRetry = 'auto';
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
    }

    function timeout() {
        dispatch('turnstile-timeout', {});
    }

    function callback(token: string) {
        dispatch('turnstile-callback', { token });
    }
    
    export function reset() {
		return window.turnstile.reset(widgetId);
	}

    const turnstile: Action = (node) => {
        const id = window.turnstile.render(node, {
            'timeout-callback': timeout,
            'expired-callback': expired,
            'error-callback': error,
            callback,

            sitekey: siteKey,

            'response-field-name': formsField,
            'retry-interval': retryInterval,
            'response-field': forms,
            tabindex: tabIndex,
            action,
            retry,
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
